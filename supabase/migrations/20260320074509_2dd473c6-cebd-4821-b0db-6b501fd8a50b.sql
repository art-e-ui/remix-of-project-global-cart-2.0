
CREATE TABLE public.broadcast_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  broadcast_date timestamp with time zone NOT NULL DEFAULT now(),
  label text NOT NULL,
  message text NOT NULL,
  department text NOT NULL DEFAULT 'Administration',
  is_archived boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Broadcast notifications publicly readable"
  ON public.broadcast_notifications FOR SELECT TO public USING (true);

CREATE POLICY "Broadcast notifications insertable"
  ON public.broadcast_notifications FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Broadcast notifications updatable"
  ON public.broadcast_notifications FOR UPDATE TO public USING (true) WITH CHECK (true);
