"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { CourseCard } from "./CourseCard";
import { type CourseCollection, type Course } from "@/features/home/api/home.api";

interface CollectionSectionProps {
  collection: CourseCollection;
}

export function CollectionSection({ collection }: CollectionSectionProps) {
  const router = useRouter();
  const formattedOriginalPrice = new Intl.NumberFormat('vi-VN').format(collection.original_price) + ' VNĐ';
  const formattedSalePrice = new Intl.NumberFormat('vi-VN').format(collection.sale_price) + ' VNĐ';

  const handleBuyNow = () => {
    const { addItem } = useCart.getState();
    const coverImage =
      collection.courses?.[0]?.cover_image ||
      "https://res.cloudinary.com/dfbsdiq9p/image/upload/v1783848428/ChatGPT_Image_Jul_12_2026_04_26_58_PM_p8tus2.png";
    const courseCount = collection.courses?.length || 0;
    const comboTitle = `[Combo] ${collection.short_title || collection.title}${
      courseCount > 0 ? ` (${courseCount} khóa học)` : ""
    }`;

    const added = addItem({
      id: `collection-${collection.id}`,
      title: comboTitle,
      slug: collection.courses?.[0]?.slug || "courses",
      price: collection.sale_price,
      cover_image: coverImage,
    });

    if (added) {
      toast.success(`Đã thêm combo ${collection.short_title || collection.title} vào giỏ hàng`);
    } else {
      toast.info(`Combo ${collection.short_title || collection.title} đã có trong giỏ hàng`);
    }
    router.push(`/cart?selected=collection-${collection.id}`);
  };

  return (
    <section id={collection.id} className="w-full flex flex-col gap-8 scroll-mt-20">
      {/* Collection Header */}
      <div className="flex flex-col items-center text-center gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 uppercase drop-shadow-sm tracking-wide">
          {collection.title}
        </h2>

        {/* Buy Button Container */}
        <button
          onClick={handleBuyNow}
          className="relative flex items-center bg-[var(--surface-strong)] rounded-full p-1 shadow-md hover:bg-[var(--surface-strong)]/90 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          title={`Mua ngay trọn gói ${collection.short_title || collection.title}`}
        >
          {/* Left Pill (Short Title) */}
          <div className="bg-white rounded-full px-5 py-2 shadow-sm border border-[var(--surface-strong)]/10 z-10">
            <span className="text-[var(--surface-strong)] text-base md:text-lg font-extrabold tracking-tight">
              {collection.short_title}
            </span>
          </div>

          {/* Right Section (MUA NGAY & Prices) */}
          <div className="flex items-center pl-4 pr-5 gap-4">
            <div className="flex flex-col text-white font-bold text-[11px] md:text-xs leading-[1.1] text-right">
              <span>MUA</span>
              <span>NGAY</span>
            </div>

            {/* Dashed Separator */}
            <div className="w-px h-6 border-l border-dashed border-white/50"></div>

            <div className="flex flex-col text-white text-left leading-tight justify-center">
              {collection.original_price > collection.sale_price && (
                <span className="text-[10px] md:text-[11px] font-medium opacity-90 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
              <span className="font-extrabold text-sm md:text-base">
                {formattedSalePrice}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collection.courses?.map((course: Course) => (
          <CourseCard key={course.id} course={course as any} />
        ))}
      </div>
    </section>
  );
}
