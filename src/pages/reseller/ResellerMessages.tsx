import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Headset, Users, Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin" | "customer";
  senderName?: string;
  timestamp: Date;
}

function ChatPanel({ storageKey, placeholder, senderLabel }: { storageKey: string; placeholder: string; senderLabel: string }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [];
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setMessages(JSON.parse(e.newValue).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      text: input.trim(),
      sender: "user",
      senderName: "You",
      timestamp: new Date(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">{placeholder}</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              m.sender === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
            }`}>
              {m.sender !== "user" && (
                <p className="text-[10px] font-semibold mb-0.5 opacity-70">{m.senderName || senderLabel}</p>
              )}
              <p>{m.text}</p>
              <p className="text-[10px] opacity-60 mt-1 text-right">
                {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message…"
          className="flex-1 rounded-full bg-muted px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          className="rounded-full bg-primary text-primary-foreground p-2.5 disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ResellerMessages() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-2rem)]">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold text-foreground">Messages</h1>
      </div>
      <Tabs defaultValue="support" className="flex flex-col flex-1 min-h-0">
        <TabsList className="mx-4 mb-2 grid grid-cols-2">
          <TabsTrigger value="support" className="gap-1.5 text-xs">
            <Headset className="h-3.5 w-3.5" /> Support
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> Customers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="support" className="flex-1 min-h-0 mt-0">
          <ChatPanel
            storageKey="reseller_support_chat"
            placeholder="Chat with admin support here. Your messages will be answered by our team."
            senderLabel="Support"
          />
        </TabsContent>
        <TabsContent value="customers" className="flex-1 min-h-0 mt-0">
          <ChatPanel
            storageKey="reseller_customer_chat"
            placeholder="Customer inquiries about your orders and products will appear here."
            senderLabel="Customer"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
