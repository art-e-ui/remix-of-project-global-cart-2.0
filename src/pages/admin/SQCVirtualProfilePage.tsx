import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/lib/products-context";
import {
  Send, ChevronDown, ChevronUp, MoreHorizontal, UserCheck,
  Circle, Volume2, VolumeX, Search, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VirtualProfile {
  id: string;
  name: string;
  email: string;
  shipping_address: string;
  region: string;
  status: string;
}

interface ResellerSession {
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
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

let flashInterval: ReturnType<typeof setInterval> | null = null;
function startTabFlash() {
  if (flashInterval) return;
  const original = document.title;
  let on = false;
  flashInterval = setInterval(() => {
    document.title = on ? "🔍 SQC Message!" : original;
    on = !on;
  }, 800);
  const stopFlash = () => {
    if (flashInterval) { clearInterval(flashInterval); flashInterval = null; }
    document.title = original;
    window.removeEventListener("focus", stopFlash);
  };
  window.addEventListener("focus", stopFlash);
}

export default function SQCVirtualProfilePage() {
  const [profiles, setProfiles] = useState<VirtualProfile[]>([]);
  const [tableOpen, setTableOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<VirtualProfile | null>(null);
  const [editProfile, setEditProfile] = useState<VirtualProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Chat state
  const [resellerSessions, setResellerSessions] = useState<ResellerSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { products } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch profiles
  const fetchProfiles = useCallback(async () => {
    const { data } = await supabase
      .from("virtual_customer_profiles")
      .select("*")
      .order("name", { ascending: true });
    if (data) setProfiles(data as VirtualProfile[]);
  }, []);

  // Fetch reseller sessions
  const fetchResellerSessions = useCallback(async () => {
    const { data } = await supabase
      .from("reseller_chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false });
    if (data) setResellerSessions(data as ResellerSession[]);
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!activeSessionId) return;
    const { data } = await supabase
      .from("reseller_chat_messages")
      .select("*")
      .eq("session_id", activeSessionId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as ChatMessage[]);
  }, [activeSessionId]);

  useEffect(() => { fetchProfiles(); fetchResellerSessions(); }, [fetchProfiles, fetchResellerSessions]);
  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("sqc-chat")
      .on("postgres_changes", { event: "*", schema: "public", table: "reseller_chat_sessions" }, () => {
        fetchResellerSessions();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reseller_chat_messages" }, (payload) => {
        const newMsg = payload.new as ChatMessage;
        if (newMsg.sender === "reseller") {
          if (soundEnabled) playNotificationSound();
          if (document.hidden) startTabFlash();
        }
        if (newMsg.session_id === activeSessionId) {
          setMessages((prev) => [...prev, newMsg]);
        }
        fetchResellerSessions();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeSessionId, soundEnabled, fetchResellerSessions]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  // Select profile → set busy, fold table
  const handleSelectProfile = async (profile: VirtualProfile) => {
    await supabase
      .from("virtual_customer_profiles")
      .update({ status: "Busy" })
      .eq("id", profile.id);
    setSelectedProfile({ ...profile, status: "Busy" });
    setTableOpen(false);
    fetchProfiles();
  };

  // Deselect profile → set available
  const handleDeselectProfile = async () => {
    if (selectedProfile) {
      await supabase
        .from("virtual_customer_profiles")
        .update({ status: "Available" })
        .eq("id", selectedProfile.id);
    }
    setSelectedProfile(null);
    setActiveSessionId(null);
    setMessages([]);
    setTableOpen(true);
    fetchProfiles();
  };

  // Delete profile
  const handleDeleteProfile = async (id: string) => {
    await supabase.from("virtual_customer_profiles").delete().eq("id", id);
    fetchProfiles();
  };

  // Edit profile
  const handleEditSave = async () => {
    if (!editProfile) return;
    await supabase
      .from("virtual_customer_profiles")
      .update({
        name: editProfile.name,
        email: editProfile.email,
        shipping_address: editProfile.shipping_address,
        region: editProfile.region,
      })
      .eq("id", editProfile.id);
    setEditDialogOpen(false);
    setEditProfile(null);
    fetchProfiles();
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSessionId || !selectedProfile) return;
    const msg = input.trim();
    setInput("");
    await supabase.from("reseller_chat_messages").insert({
      session_id: activeSessionId,
      sender: "admin",
      message: `[${selectedProfile.name}]: ${msg}`,
    });
  };

  const attachProduct = async (productId: string, productName: string) => {
    if (!activeSessionId || !selectedProfile) return;
    await supabase.from("reseller_chat_messages").insert({
      session_id: activeSessionId,
      sender: "admin",
      message: `[${selectedProfile.name}]: 📦 Product: ${productName}`,
    });
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSession = resellerSessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">
            Virtual Profile for Standard Quality Control
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {selectedProfile && (
            <div className="flex items-center gap-2 mr-3">
              <Badge variant="secondary" className="text-xs">
                Active: {selectedProfile.name}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleDeselectProfile} className="text-xs h-7">
                Release
              </Button>
            </div>
          )}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Foldable Table */}
      <div className="border-b border-border">
        <button
          onClick={() => setTableOpen(!tableOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <span className="text-sm font-semibold text-foreground flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Virtual Customer Profiles ({profiles.length})
          </span>
          {tableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {tableOpen && (
          <div className="max-h-[45vh] overflow-auto">
            <div className="px-4 py-2">
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Shipping Address</TableHead>
                  <TableHead className="hidden md:table-cell">Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium text-sm">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                      {p.shipping_address}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px]">{p.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.status === "Available" ? "default" : "secondary"}
                        className={cn(
                          "text-[10px]",
                          p.status === "Available"
                            ? "bg-green-500/10 text-green-600 border-green-500/30"
                            : "bg-orange-500/10 text-orange-600 border-orange-500/30"
                        )}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded hover:bg-accent transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleSelectProfile(p)}
                            disabled={p.status === "Busy"}
                          >
                            Select
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => { setEditProfile({ ...p }); setEditDialogOpen(true); }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProfile(p.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Chat Interface (visible when profile selected) */}
      {selectedProfile ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Reseller sessions */}
          <div className="w-60 border-r border-border overflow-y-auto flex-shrink-0 bg-card">
            <div className="p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2 tracking-wider">
                Reseller Sessions
              </p>
            </div>
            {resellerSessions.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No reseller sessions
              </div>
            ) : (
              resellerSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                    activeSessionId === s.id && "bg-primary/10 border-r-2 border-primary"
                  )}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                      {s.reseller_name.charAt(0).toUpperCase()}
                    </div>
                    {s.is_online && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.reseller_name}</p>
                    <p className="text-[10px] text-muted-foreground">ID: {s.reseller_id}</p>
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
                  <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a reseller to start SQC chat as <span className="font-semibold text-foreground">{selectedProfile.name}</span></p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {activeSession?.reseller_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{activeSession?.reseller_name}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Circle className="h-2 w-2 fill-green-500 text-green-500" /> Online
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    Chatting as: {selectedProfile.name}
                  </Badge>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                          m.sender === "admin"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        <p className="leading-relaxed">{m.message}</p>
                        <p
                          className={cn(
                            "text-[9px] mt-1",
                            m.sender === "admin" ? "text-primary-foreground/60" : "text-muted-foreground/60"
                          )}
                        >
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
                      placeholder={`Message as ${selectedProfile.name}...`}
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
            <div className="w-52 border-l border-border overflow-y-auto flex-shrink-0 bg-card hidden lg:block">
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
      ) : (
        !tableOpen && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a virtual profile from the table above to begin SQC</p>
            </div>
          </div>
        )
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Virtual Profile</DialogTitle>
          </DialogHeader>
          {editProfile && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editProfile.email}
                  onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Shipping Address</Label>
                <Input
                  value={editProfile.shipping_address}
                  onChange={(e) => setEditProfile({ ...editProfile, shipping_address: e.target.value })}
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={editProfile.region}
                  onChange={(e) => setEditProfile({ ...editProfile, region: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
