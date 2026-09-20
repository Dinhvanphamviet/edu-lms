"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/hooks/useCart";

interface CartItemRowProps {
  item: CartItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  formatPrice: (price: number) => string;
}

export function CartItemRow({
  item,
  isSelected,
  onToggle,
  onRemove,
  formatPrice,
}: CartItemRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl transition-all border",
        isSelected
          ? "bg-[var(--surface-strong)]/5 border-[var(--surface-strong)]/20"
          : "bg-white border-transparent hover:border-gray-100"
      )}
    >
      <Checkbox
        id={`cart-item-${item.id}`}
        checked={isSelected}
        onCheckedChange={() => onToggle(item.id)}
        className="size-5 rounded-md border-2 data-[state=checked]:bg-[var(--surface-strong)] data-[state=checked]:border-[var(--surface-strong)]"
      />

      <Link
        href={`/courses/${item.slug}`}
        className="relative size-20 md:size-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted group"
      >
        <Image
          src={item.cover_image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="96px"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/courses/${item.slug}`}
          className="text-sm md:text-base font-semibold leading-tight line-clamp-2 hover:text-[var(--surface-strong)] transition-colors"
        >
          {item.title}
        </Link>
        <p className="text-base md:text-lg font-bold text-[var(--surface-strong)] mt-2">
          {item.price > 0 ? formatPrice(item.price) : "Miễn phí"}
        </p>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="size-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
        aria-label={`Xóa ${item.title}`}
      >
        <Trash2 className="size-4.5" />
      </button>
    </div>
  );
}
