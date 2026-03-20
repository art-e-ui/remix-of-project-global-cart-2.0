
-- Reseller chat sessions
CREATE TABLE public.reseller_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id text NOT NULL,
  reseller_name text NOT NULL DEFAULT 'Reseller',
  reseller_avatar text DEFAULT '',
  is_online boolean DEFAULT true,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.reseller_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reseller chat sessions publicly readable" ON public.reseller_chat_sessions FOR SELECT TO public USING (true);
CREATE POLICY "Reseller chat sessions insertable" ON public.reseller_chat_sessions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Reseller chat sessions updatable" ON public.reseller_chat_sessions FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Reseller chat messages
CREATE TABLE public.reseller_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.reseller_chat_sessions(id) ON DELETE CASCADE,
  sender text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reseller_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reseller chat messages publicly readable" ON public.reseller_chat_messages FOR SELECT TO public USING (true);
CREATE POLICY "Reseller chat messages insertable" ON public.reseller_chat_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Reseller chat messages updatable" ON public.reseller_chat_messages FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.reseller_chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reseller_chat_messages;
