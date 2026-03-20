-- Fix broken Unsplash image URLs
UPDATE products SET image = 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cda?w=400&h=400&fit=crop' WHERE name = 'Wireless Bluetooth Earbuds Pro';
UPDATE products SET image = 'https://images.unsplash.com/photo-1563901935883-cb61f6e21970?w=400&h=400&fit=crop' WHERE name = 'Kids Plush Dinosaur Toy';
UPDATE products SET image = 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400&h=400&fit=crop' WHERE name = 'LED Desk Lamp with USB Port';

-- Site Front Advertising table for banner management
CREATE TABLE public.site_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  description text DEFAULT '',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/categories',
  image_url text DEFAULT '',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of active banners" ON public.site_banners FOR SELECT USING (is_active = true);

CREATE TRIGGER update_site_banners_updated_at
  BEFORE UPDATE ON public.site_banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seasonal themes table
CREATE TABLE public.seasonal_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  is_active boolean DEFAULT false,
  decorations jsonb DEFAULT '{}',
  color_overrides jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.seasonal_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read of active themes" ON public.seasonal_themes FOR SELECT USING (true);

CREATE TRIGGER update_seasonal_themes_updated_at
  BEFORE UPDATE ON public.seasonal_themes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed seasonal themes
INSERT INTO public.seasonal_themes (name, slug, description, is_active, decorations) VALUES
('None', 'none', 'No seasonal theme - default look', true, '{"elements": []}'),
('Christmas', 'christmas', 'Christmas holiday decorations with snow, trees, and Santa', false, '{"elements": ["snowflakes", "christmas-tree", "santa", "reindeer", "gifts"], "snowfall": true, "topBanner": "🎄 Merry Christmas! Special Holiday Deals Up to 70% OFF! 🎅", "colors": {"accent": "#c41e3a", "secondary": "#228b22"}}'),
('Black Friday', 'black-friday', 'Black Friday mega sale theme', false, '{"elements": ["lightning", "sale-tags"], "topBanner": "⚡ BLACK FRIDAY MEGA SALE — Up to 80% OFF Everything! ⚡", "colors": {"accent": "#ff6600", "secondary": "#1a1a1a"}}'),
('Spring Season', 'spring-deals', 'Spring season fresh deals', false, '{"elements": ["flowers", "butterflies"], "topBanner": "🌸 Spring Season Hot Deals — Fresh Savings Bloom! 🌷", "colors": {"accent": "#ff69b4", "secondary": "#32cd32"}}'),
('Back to School', 'back-to-school', 'Back to school promotions', false, '{"elements": ["books", "pencils", "backpack"], "topBanner": "📚 Back 2 School Sale — Gear Up & Save Big! ✏️", "colors": {"accent": "#4169e1", "secondary": "#ffa500"}}'),
('Summer Sale', 'summer-sale', 'Hot summer deals', false, '{"elements": ["sun", "waves", "palm-tree"], "topBanner": "☀️ Summer Sale — Sizzling Hot Deals! 🏖️", "colors": {"accent": "#ff4500", "secondary": "#00bfff"}}');

-- Seed default banners
INSERT INTO public.site_banners (section, title, subtitle, description, cta_text, cta_link, image_url, display_order) VALUES
('hero-1', 'Shop the World,', 'Delivered to You', 'From factories worldwide, straight to your door — at unbeatable prices.', 'Start Shopping', '/categories', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop', 1),
('hero-2', 'PREMIUM FASHION', 'UP TO 60% OFF!', 'Discover the latest trends in womens fashion and accessories.', 'SHOP NOW', '/categories?cat=womens-fashion', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop', 2),
('hero-3', 'SMART GADGETS', 'LATEST TECH RELEASES', 'Upgrade your lifestyle with our range of high-performance smartphones and tablets.', 'EXPLORE TECH', '/categories?cat=electronics', 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1920&auto=format&fit=crop', 3),
('hero-4', 'MODERN HOME', 'ELEVATE YOUR SPACE', 'Transform your living environment with our curated home decoration collection.', 'VIEW COLLECTION', '/categories?cat=home-living', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1920&auto=format&fit=crop', 4),
('promo-1', 'New Season', 'Fashion Collection', '', 'Shop Now →', '/categories?cat=womens-fashion', '', 1),
('promo-2', 'Tech Deals', 'Up to 50% Off', '', 'Shop Now →', '/categories?cat=electronics', '', 2),
('pre-order', 'Pre-Order Now & Save Up to 40%', 'LIMITED TIME OFFER', 'Get early access to the latest products at exclusive prices', 'Shop Pre-Orders', '/categories', '', 1);