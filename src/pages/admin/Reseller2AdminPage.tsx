import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getResellers } from "@/lib/unified-mock-data";
import { slaStaff, slaAdmins } from "@/lib/sla-mock-data";
import { useDbSlaStaff, useDbSlaAdmins, dbStaffToLegacy, dbAdminToLegacy } from "@/hooks/use-db-sla";
import { Send, Volume2, VolumeX, Users, Circle, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface ChatSession {
  id: string;
  reseller_id: string;
  reseller_name: string;
  reseller_avatar: string;
  is_online: boolean;
  last_message_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

export default function Reseller2AdminPage() {
  const resellers = getResellers();
  const { data: dbStaffRows } = useDbSlaStaff();
  const { data: dbAdminRows } = useDbSlaAdmins();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatResellerId, setChatResellerId] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Map staff/admin data
  const staffList = useMemo(() => {
    if (dbStaffRows) return dbStaffRows.map(dbStaffToLegacy);
    return slaStaff;
  }, [dbStaffRows]);

  const adminList = useMemo(() => {
    if (dbAdminRows) return dbAdminRows.map(dbAdminToLegacy);
    return slaAdmins;
  }, [dbAdminRows]);

  const staffMap = useMemo(() => {
    const m = new Map<string, { staffName: string; adminName: string }>();
    staffList.forEach((s) => {
      const admin = adminList.find((a) => a.accountId === s.createdByAdminId);
      m.set(s.referralId, {
        staffName: s.name,
        adminName: admin?.name ?? "Unknown",
      });
    });
    return m;
  }, [staffList, adminList]);

  // Open chat for a reseller
  const openChat = useCallback(async (resellerId: string, resellerName: string) => {
    setChatResellerId(resellerId);
    setChatOpen(true);

    // Find or create session
    const { data: existing } = await supabase
      .from("reseller_chat_sessions")
      .select("*")
      .eq("reseller_id", resellerId)
      .limit(1);

    let sessionId: string;
    if (existing && existing.length > 0) {
      sessionId = existing[0].id;
    } else {
      const { data: created } = await supabase
        .from("reseller_chat_sessions")
        .insert({ reseller_id: resellerId, reseller_name: resellerName })
        .select()
        .single();
      sessionId = created!.id;
    }

    setChatSessionId(sessionId);

    // Fetch messages
    const { data: msgs } = await supabase
      .from("reseller_chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });
    if (msgs) setMessages(msgs as ChatMessage[]);
  }, []);

  // Realtime for messages
  useEffect(() => {
    const channel = supabase
      .channel("reseller-admin-chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reseller_chat_messages" }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        if (newMsg.sender === "reseller" && soundEnabled) playNotificationSound();
        if (newMsg.session_id === chatSessionId) {
          setMessages((prev) => [...prev, newMsg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [chatSessionId, soundEnabled]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionId) return;
    const msg = input.trim();
    setInput("");
    await supabase.from("reseller_chat_messages").insert({
      session_id: chatSessionId,
      sender: "admin",
      message: msg,
    });
    // Update last_message_at
    await supabase.from("reseller_chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", chatSessionId);
  };

  const closeChat = () => {
    setChatOpen(false);
    setChatResellerId(null);
    setChatSessionId(null);
    setMessages([]);
    setInput("");
  };

  const chatResellerObj = resellers.find((r) => r.id === chatResellerId);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Reseller 2 Admin</h1>
          <span className="text-xs text-muted-foreground ml-2">
            {resellers.length} reseller{resellers.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          title={soundEnabled ? "Mute" : "Unmute"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Table */}
        <div className={cn("flex-1 overflow-auto", chatOpen && "hidden lg:block")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reseller ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Referral Code</TableHead>
                <TableHead>Staff Account</TableHead>
                <TableHead>Admin Account</TableHead>
                <TableHead className="text-right">Available Balance</TableHead>
                <TableHead className="text-right">Pending Deposits</TableHead>
                <TableHead className="text-right">Pending Withdrawal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.map((r) => {
                const ref = staffMap.get(r.referralId ?? "");
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => openChat(r.id, `${r.firstName} ${r.lastName}`)}
                        className="text-left group relative"
                      >
                        <span className="font-medium text-foreground hover:text-primary transition-colors underline decoration-dashed underline-offset-4 cursor-pointer">
                          {r.firstName} {r.lastName}
                        </span>
                        <span className="absolute -top-8 left-0 bg-popover text-popover-foreground border border-border text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                          <MessageSquare className="h-3 w-3 inline mr-1" />Chat with {r.firstName}
                        </span>
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.referralId ?? "—"}</TableCell>
                    <TableCell className="text-sm">{ref?.staffName ?? "—"}</TableCell>
                    <TableCell className="text-sm">{ref?.adminName ?? "—"}</TableCell>
                    <TableCell className="text-right font-medium">${r.balance.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">$0.00</TableCell>
                    <TableCell className="text-right text-muted-foreground">$0.00</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Chat panel (slide-in) */}
        {chatOpen && (
          <div className="w-full lg:w-[420px] flex flex-col border-l border-border bg-card flex-shrink-0">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {chatResellerObj?.firstName?.charAt(0) ?? "R"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {chatResellerObj ? `${chatResellerObj.firstName} ${chatResellerObj.lastName}` : "Reseller"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{chatResellerObj?.id}</p>
                </div>
              </div>
              <button onClick={closeChat} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>Start a conversation</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                      m.sender === "admin"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="leading-relaxed">{m.message}</p>
                    <p className={cn("text-[9px] mt-1", m.sender === "admin" ? "text-primary-foreground/60" : "text-muted-foreground/60")}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
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
          </div>
        )}
      </div>
    </div>
  );
}
