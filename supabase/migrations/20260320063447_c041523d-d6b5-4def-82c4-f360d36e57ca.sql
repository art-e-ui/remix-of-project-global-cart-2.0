
-- ACH Customers table
CREATE TABLE public.ach_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ACH Financials table
CREATE TABLE public.ach_financials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES public.ach_customers(customer_id) ON DELETE CASCADE,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  last_transaction_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sequence for customer IDs starting at 120551
CREATE SEQUENCE public.ach_customer_id_seq START WITH 120551 INCREMENT BY 1;

-- RLS
ALTER TABLE public.ach_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ach_financials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ACH customers are publicly readable" ON public.ach_customers FOR SELECT TO public USING (true);
CREATE POLICY "ACH financials are publicly readable" ON public.ach_financials FOR SELECT TO public USING (true);
CREATE POLICY "ACH customers insertable" ON public.ach_customers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "ACH financials insertable" ON public.ach_financials FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "ACH customers updatable" ON public.ach_customers FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "ACH financials updatable" ON public.ach_financials FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Seed 8 customers
INSERT INTO public.ach_customers (customer_id, name, email, phone, status, joined_at) VALUES
  ('GCID120551', 'John Smith', 'john@example.com', '+1 (555) 300-0001', 'Active', '2023-01-20'),
  ('GCID120552', 'Maria Garcia', 'maria@example.com', '+1 (555) 300-0002', 'Active', '2023-04-15'),
  ('GCID120553', 'Alex Johnson', 'alex@example.com', '+1 (555) 300-0003', 'Active', '2022-11-08'),
  ('GCID120554', 'Lisa Wong', 'lisa@example.com', '+1 (555) 300-0004', 'Inactive', '2023-09-01'),
  ('GCID120555', 'Robert Brown', 'robert@example.com', '+1 (555) 300-0005', 'Active', '2023-02-14'),
  ('GCID120556', 'Emma Davis', 'emma@example.com', '+1 (555) 300-0006', 'Active', '2024-01-10'),
  ('GCID120557', 'Tom Wilson', 'tom@example.com', '+1 (555) 300-0007', 'Active', '2023-06-22'),
  ('GCID120558', 'Sarah Mitchell', 'sarah.m@example.com', '+1 (555) 300-0008', 'Active', '2024-02-05');

-- Seed financial records
INSERT INTO public.ach_financials (customer_id, balance, total_spent, total_orders) VALUES
  ('GCID120551', 150.00, 2450.00, 12),
  ('GCID120552', 75.50, 1230.50, 8),
  ('GCID120553', 320.00, 5670.00, 23),
  ('GCID120554', 0.00, 890.75, 5),
  ('GCID120555', 200.00, 3450.00, 15),
  ('GCID120556', 45.99, 145.99, 2),
  ('GCID120557', 100.00, 1875.00, 9),
  ('GCID120558', 30.00, 620.00, 4);

-- Update sequence to next value
SELECT setval('public.ach_customer_id_seq', 120558);
