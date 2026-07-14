import { Button } from "@/components/ui/button";

import { CollectionSection } from "@/features/course/components/public/CollectionSection";
import { HeroSlider } from "@/features/home/components/public/HeroSlider";
import { CountdownTimer } from "@/features/home/components/public/CountdownTimer";
import { getHomePageData } from "@/features/home/api/home.api";

export default async function HomePage() {
  const homeData = await getHomePageData();

  return (
    <div className="w-full flex flex-col gap-12 pb-12 -mt-2 md:-mt-4">
      {/* Hero Banner Slider */}
      <HeroSlider banners={homeData.banners} />

      {/* Countdown Timer Block */}
      <CountdownTimer config={homeData.countdown} />

      {/* Danh sách các Collection Khóa học */}
      <div className="flex flex-col gap-10 mt-6">
        {homeData.collections.map((collection) => (
          <CollectionSection key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
