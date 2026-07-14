"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Banner } from "../../api/home.api";

interface HeroSliderProps {
  banners: Banner[];
}

export function HeroSlider({ banners }: HeroSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  return (
    <section className="w-full relative">
      <Carousel 
        opts={{ loop: true }} 
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Link href={banner.link_url} className="block w-full bg-[var(--surface-muted)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border-default)] hover:opacity-95 transition-opacity">
                <div className="relative w-full aspect-[2/1] md:aspect-[21/10] xl:aspect-[2.5/1]">
                  <Image 
                    src={banner.image_url} 
                    alt={banner.title} 
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
