import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedBrands } from '@/components/home/FeaturedBrands';
import { ProductCategories } from '@/components/home/ProductCategories';
import { DealsOfTheDay } from '@/components/home/DealsOfTheDay';
import { PreOrderBanner } from '@/components/home/PreOrderBanner';
import { BestSelling } from '@/components/home/BestSelling';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategorySection } from '@/components/home/CategorySection';
import { AppDownloadBanner } from '@/components/home/AppDownloadBanner';
import { RecentlyViewed } from '@/components/home/RecentlyViewed';
import { MoreProducts } from '@/components/home/MoreProducts';

const Index = () => {
  return (
    <div className="min-h-[70vh]">
      <HeroBanner />
      <FeaturedBrands />
      <ProductCategories />
      <DealsOfTheDay />
      <PreOrderBanner />
      <BestSelling />
      <FeaturedProducts />
      <CategorySection title="Top Electronics" categorySlug="electronics" />
      <CategorySection title="Trending Fashion" categorySlug="mens-fashion" bgGradient="bg-gradient-to-br from-secondary/5 to-primary/5" />
      <AppDownloadBanner />
      <CategorySection title="Kids & Toys" categorySlug="kids-toys" />
      <CategorySection title="Home & Living" categorySlug="home-living" bgGradient="bg-gradient-to-br from-primary/5 to-accent" />
      <RecentlyViewed />
      <MoreProducts />
    </div>
  );
};

export default Index;
