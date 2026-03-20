import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Headset, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'support_session_id';

interface ChatMessage {
  id: string;
  session_id: string;
  sender: string;
  message: string;
  attachment_product_id: string | null;
  is_read: boolean;
  created_at: string;
}

// Notification sound
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

let flashInterval: ReturnType<typeof setInterval> | null = null;
function startTabFlash() {
  if (flashInterval) return;
  const original = document.title;
  let on = false;
  flashInterval = setInterval(() => {
    document.title = on ? '💬 New Support Reply!' : original;
    on = !on;
  }, 800);
  const stop = () => {
    if (flashInterval) { clearInterval(flashInterval); flashInterval = null; }
    document.title = original;
    window.removeEventListener('focus', stop);
  };
  window.addEventListener('focus', stop);
}

export function useUnreadSupport() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return;

    const fetchCount = async () => {
      const { count: c } = await supabase
        .from('support_messages')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .eq('sender', 'support')
        .eq('is_read', false);
      setCount(c ?? 0);
    };

    fetchCount();
    const channel = supabase
      .channel('unread-support')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, (payload) => {
        if ((payload.new as any).sender === 'support') fetchCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);
  return count;
}

async function getOrCreateSession(): Promise<string> {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    // Verify it still exists
    const { data } = await supabase.from('support_sessions').select('id').eq('id', existing).single();
    if (data) {
      // Mark online
      await supabase.from('support_sessions').update({ is_online: true }).eq('id', existing);
      return existing;
    }
  }
  // Create new session
  const name = 'Customer ' + Math.floor(Math.random() * 9000 + 1000);
  const { data } = await supabase.from('support_sessions').insert({ customer_name: name }).select('id').single();
  const id = data!.id;
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

export default function SupportChatDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Init session
  useEffect(() => {
    if (open) {
      getOrCreateSession().then(setSessionId);
    }
  }, [open]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!sessionId) return;
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data as ChatMessage[]);
  }, [sessionId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime
  useEffect(() => {
    if (!sessionId) return;
    const channel = supabase
      .channel(`customer-chat-${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
        const msg = payload.new as ChatMessage;
        setMessages((prev) => [...prev, msg]);
        if (msg.sender === 'support') {
          playNotificationSound();
          if (document.hidden) startTabFlash();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [sessionId]);

  // Mark support messages as read
  useEffect(() => {
    if (!open || !sessionId || messages.length === 0) return;
    supabase
      .from('support_messages')
      .update({ is_read: true })
      .eq('session_id', sessionId)
      .eq('sender', 'support')
      .eq('is_read', false)
      .then();
  }, [open, sessionId, messages]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Set offline on close
  useEffect(() => {
    if (!open && sessionId) {
      supabase.from('support_sessions').update({ is_online: false }).eq('id', sessionId).then();
    }
  }, [open, sessionId]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;
    const msg = input.trim();
    setInput('');
    await supabase.from('support_messages').insert({
      session_id: sessionId,
      sender: 'customer',
      message: msg,
    });
    // Update last_message_at
    await supabase.from('support_sessions').update({ last_message_at: new Date().toISOString() }).eq('id', sessionId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md h-[75vh] sm:h-[500px] bg-background rounded-t-2xl sm:rounded-2xl border border-border shadow-xl flex flex-col animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Headset className="h-5 w-5 text-primary-foreground" />
            <div>
              <h2 className="font-bold text-sm text-primary-foreground">Customer Support</h2>
              <p className="text-[10px] text-primary-foreground/70">We typically reply within minutes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors">
            <X className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Headset className="h-10 w-10 mx-auto mb-3 opacity-30" />
              Start a conversation with support
            </div>
          ) : (
            messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.sender === 'customer'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}>
                  <p className="leading-relaxed">{m.message}</p>
                  <p className={`text-[9px] mt-1 ${m.sender === 'customer' ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
    </div>
  );
}
