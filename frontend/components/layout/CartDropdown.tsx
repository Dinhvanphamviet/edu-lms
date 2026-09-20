"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export function CartDropdown() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const currentCount = items.length;
    if (currentCount > prevCount) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevCount(currentCount);
  }, [items.length, mounted, prevCount]);

  if (!mounted) {
    return <div className="size-10 rounded-full bg-muted animate-pulse" />;
  }

  const itemCount = items.length;

  return (
    <Link
      href="/cart"
      className="relative size-10 rounded-full flex items-center justify-center hover:bg-[var(--surface-muted)] transition-colors"
      aria-label="Giỏ hàng"
    >
      <ShoppingCart className="size-5 text-[var(--text-primary)]/70" />
      {itemCount > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 size-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-cyan-50",
            bounce && "animate-bounce"
          )}
        >
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
