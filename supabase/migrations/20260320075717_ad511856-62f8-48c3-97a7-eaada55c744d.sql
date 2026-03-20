-- Support chat sessions
CREATE TABLE public.support_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL DEFAULT 'Guest',
  customer_avatar text DEFAULT '',
  is_online boolean DEFAULT true,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support sessions publicly readable" ON public.support_sessions FOR SELECT TO public USING (true);
CREATE POLICY "Support sessions insertable" ON public.support_sessions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Support sessions updatable" ON public.support_sessions FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Support chat messages
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.support_sessions(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('customer', 'support')),
  message text NOT NULL,
  attachment_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support messages publicly readable" ON public.support_messages FOR SELECT TO public USING (true);
CREATE POLICY "Support messages insertable" ON public.support_messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Support messages updatable" ON public.support_messages FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;