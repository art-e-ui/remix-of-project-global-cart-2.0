import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/lib/products-context";
import { Send, Volume2, VolumeX, Headset, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  customer_name: string;
  customer_avatar: string;
  is_online: boolean;
  last_message_at: string;
}

interface Message {
  id: string;
  session_id: string;
  sender: string;
  message: string;
  attachment_product_id: string | null;
  is_read: boolean;
  created_at: string;
}

// Notification sound (short beep using Web Audio API)
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

// Flash browser tab title
let flashInterval: ReturnType<typeof setInterval> | null = null;
function startTabFlash(count: number) {
  if (flashInterval) return;
  const original = document.title;
  let on = false;
  flashInterval = setInterval(() => {
    document.title = on ? `💬 (${count}) New Message!` : original;
    on = !on;
  }, 800);
  const stopFlash = () => {
    if (flashInterval) { clearInterval(flashInterval); flashInterval = null; }
    document.title = original;
    window.removeEventListener("focus", stopFlash);
  };
  window.addEventListener("focus", stopFlash);
}

export default function CustomerServicePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { products } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMsgCount = useRef(0);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    const { data } = await supabase
      .from("support_sessions")
      .select("*")
      .eq("is_online", true)
      .order("last_message_at", { ascending: false });
    if (data) setSessions(data as Session[]);
  }, []);

  // Fetch messages for active session
  const fetchMessages = useCallback(async () => {
    if (!activeSessionId) return;
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("session_id", activeSessionId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, [activeSessionId]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);
  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase
      .channel("admin-support-chat")
      .on("postgres_changes", { event: "*", schema: "public", table: "support_sessions" }, () => {
        fetchSessions();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages" }, (payload) => {
        const newMsg = payload.new as Message;
        // Notify on customer messages
        if (newMsg.sender === "customer") {
          if (soundEnabled) playNotificationSound();
          if (document.hidden) startTabFlash(1);
        }
        if (newMsg.session_id === activeSessionId) {
          setMessages((prev) => [...prev, newMsg]);
        }
        fetchSessions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeSessionId, soundEnabled, fetchSessions]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Mark messages read when viewing
  useEffect(() => {
    if (!activeSessionId || messages.length === 0) return;
    const unread = messages.filter((m) => m.sender === "customer" && !m.is_read);
    if (unread.length > 0) {
      supabase
        .from("support_messages")
        .update({ is_read: true })
        .eq("session_id", activeSessionId)
        .eq("sender", "customer")
        .eq("is_read", false)
        .then();
    }
  }, [activeSessionId, messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeSessionId) return;
    const msg = input.trim();
    setInput("");
    await supabase.from("support_messages").insert({
      session_id: activeSessionId,
      sender: "support",
      message: msg,
    });
  };

  const attachProduct = async (productId: string, productName: string) => {
    if (!activeSessionId) return;
    await supabase.from("support_messages").insert({
      session_id: activeSessionId,
      sender: "support",
      message: `📦 Product: ${productName}`,
      attachment_product_id: productId,
    });
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // Find product info for attached products
  const getProduct = (id: string | null) => {
    if (!id) return null;
    return products.find((p) => p.id === id) ?? null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Headset className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Customer Service</h1>
          <span className="text-xs text-muted-foreground ml-2">
            {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Sessions list */}
        <div className="w-64 border-r border-border overflow-y-auto flex-shrink-0 bg-card">
          <div className="p-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">
              Active Sessions
            </p>
          </div>
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No active customers
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                  activeSessionId === s.id && "bg-primary/10 border-r-2 border-primary"
                )}
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                    {s.customer_name.charAt(0).toUpperCase()}
                  </div>
                  {s.is_online && (
                    <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.customer_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(s.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Center: Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeSessionId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Headset className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a customer session to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {activeSession?.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{activeSession?.customer_name}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" /> Online
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const attached = getProduct(m.attachment_product_id);
                  return (
                    <div key={m.id} className={`flex ${m.sender === "support" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                          m.sender === "support"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        <p className="leading-relaxed">{m.message}</p>
                        {attached && (
                          <div className="mt-2 p-2 rounded-lg bg-background/20 flex items-center gap-2">
                            <img
                              src={attached.image || "/placeholder.svg"}
                              alt={attached.name}
                              className="w-10 h-10 rounded object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{attached.name}</p>
                              <p className="text-[10px] opacity-70">${attached.price}</p>
                            </div>
                          </div>
                        )}
                        <p
                          className={cn(
                            "text-[9px] mt-1",
                            m.sender === "support" ? "text-primary-foreground/60" : "text-muted-foreground/60"
                          )}
                        >
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-border">
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm py-1.5 focus:outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="p-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Product cards */}
        {activeSessionId && (
          <div className="w-56 border-l border-border overflow-y-auto flex-shrink-0 bg-card hidden lg:block">
            <div className="p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">
                Attach Product
              </p>
            </div>
            <div className="px-2 space-y-2 pb-4">
              {products.slice(0, 20).map((p) => (
                <button
                  key={p.id}
                  onClick={() => attachProduct(p.id, p.name)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
                >
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={p.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">${p.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
