
-- SLA Admins table (Role: Admin, Account Type: Administrator)
CREATE TABLE public.sla_admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  avatar TEXT DEFAULT '',
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  last_login TEXT DEFAULT 'Never',
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- SLA Staff table (Role: User, Account Type: Staff)
CREATE TABLE public.sla_staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id TEXT NOT NULL UNIQUE,
  referral_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  last_active TEXT DEFAULT 'Never',
  created_by_admin_id TEXT NOT NULL REFERENCES public.sla_admins(account_id),
  department TEXT DEFAULT 'Unassigned',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System Settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_id TEXT NOT NULL UNIQUE,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('General', 'Security', 'Notifications', 'Maintenance')),
  updated_at_display TEXT,
  updated_by TEXT DEFAULT 'System',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sla_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (admin portal will add auth-based write policies later)
CREATE POLICY "SLA admins are publicly readable" ON public.sla_admins FOR SELECT USING (true);
CREATE POLICY "SLA staff are publicly readable" ON public.sla_staff FOR SELECT USING (true);
CREATE POLICY "System settings are publicly readable" ON public.system_settings FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_sla_staff_admin ON public.sla_staff(created_by_admin_id);
CREATE INDEX idx_system_settings_category ON public.system_settings(category);

-- Timestamp triggers
CREATE TRIGGER update_sla_admins_updated_at
  BEFORE UPDATE ON public.sla_admins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sla_staff_updated_at
  BEFORE UPDATE ON public.sla_staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
