
-- Add write policies to sla_admins
CREATE POLICY "SLA admins insertable" ON public.sla_admins FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "SLA admins updatable" ON public.sla_admins FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "SLA admins deletable" ON public.sla_admins FOR DELETE TO public USING (true);

-- Add write policies to sla_staff
CREATE POLICY "SLA staff insertable" ON public.sla_staff FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "SLA staff updatable" ON public.sla_staff FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "SLA staff deletable" ON public.sla_staff FOR DELETE TO public USING (true);

-- Add write policies to products
CREATE POLICY "Products insertable" ON public.products FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Products updatable" ON public.products FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Products deletable" ON public.products FOR DELETE TO public USING (true);

-- Add write policies to categories
CREATE POLICY "Categories insertable" ON public.categories FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Categories updatable" ON public.categories FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Categories deletable" ON public.categories FOR DELETE TO public USING (true);

-- Add write policies to site_banners
CREATE POLICY "Site banners insertable" ON public.site_banners FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Site banners updatable" ON public.site_banners FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Site banners deletable" ON public.site_banners FOR DELETE TO public USING (true);

-- Add write policies to seasonal_themes
CREATE POLICY "Seasonal themes insertable" ON public.seasonal_themes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Seasonal themes updatable" ON public.seasonal_themes FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Seasonal themes deletable" ON public.seasonal_themes FOR DELETE TO public USING (true);

-- Add write policies to system_settings
CREATE POLICY "System settings insertable" ON public.system_settings FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "System settings updatable" ON public.system_settings FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "System settings deletable" ON public.system_settings FOR DELETE TO public USING (true);
