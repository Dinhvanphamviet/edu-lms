"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { CartSkeleton } from "./CartSkeleton";
import { CartBreadcrumb } from "./CartBreadcrumb";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemRow } from "./CartItemRow";
import { CartSelectAllBar } from "./CartSelectAllBar";
import { CartSummary } from "./CartSummary";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function CartContent() {
  const { items, removeItem } = useCart();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("selected");
  const initializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize selection only once on mount:
  // When accessing /cart directly, no course is selected by default.
  // If redirected with ?selected={id}, only that specific course is selected.
  useEffect(() => {
    if (mounted && items.length > 0 && !initializedRef.current) {
      initializedRef.current = true;
      if (selectedParam && items.some((i) => i.id === selectedParam)) {
        setSelectedIds(new Set([selectedParam]));
      } else {
        setSelectedIds(new Set());
      }
    }
  }, [mounted, items, selectedParam]);

  // Clean up selectedIds when items change
  useEffect(() => {
    setSelectedIds((prev) => {
      const itemIds = new Set(items.map((i) => i.id));
      const cleaned = new Set([...prev].filter((id) => itemIds.has(id)));
      if (cleaned.size !== prev.size) return cleaned;
      return prev;
    });
  }, [items]);

  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.has(i.id)),
    [items, selectedIds]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  );

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    toast.success("Đã xóa khỏi giỏ hàng");
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khóa học");
      return;
    }
    toast.success(`Đang chuyển đến thanh toán ${selectedItems.length} khóa học`);
  };

  if (!mounted) {
    return <CartSkeleton />;
  }

  return (
    <div className="bg-[#f0fbfb] min-h-[calc(100vh-64px)]">
      <CartBreadcrumb />

      <div className="w-full px-6 lg:px-10 xl:px-16 py-8">
        {/* Title Block */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] px-6 py-5 mb-8">
          <h1 className="text-lg md:text-xl font-bold text-[var(--surface-strong)] leading-tight">
            Giỏ hàng của bạn
            {items.length > 0 && (
              <span className="text-[var(--text-primary)]/50 font-normal text-base ml-2">
                ({items.length} khóa học)
              </span>
            )}
          </h1>
        </div>

        {items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 relative">
            {/* Cột trái — Danh sách giỏ hàng */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <CartSelectAllBar
                allSelected={allSelected}
                totalItems={items.length}
                onToggleAll={toggleAll}
              />

              <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] divide-y divide-[var(--border-default)]">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onToggle={toggleItem}
                    onRemove={handleRemove}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </div>

            {/* Cột phải — Tóm tắt đơn hàng (sticky) */}
            <div className="lg:col-span-3">
              <CartSummary
                selectedCount={selectedItems.length}
                totalPrice={totalPrice}
                formatPrice={formatPrice}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
