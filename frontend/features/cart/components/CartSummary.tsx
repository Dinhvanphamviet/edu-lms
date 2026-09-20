"use client";

import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  selectedCount: number;
  totalPrice: number;
  formatPrice: (price: number) => string;
  onCheckout: () => void;
}

export function CartSummary({
  selectedCount,
  totalPrice,
  formatPrice,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] p-6 sticky top-24">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-5">
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Khóa học đã chọn</span>
          <span className="font-medium">{selectedCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between mb-6">
        <span className="text-base font-semibold">Tổng cộng</span>
        <span className="text-xl font-bold text-[var(--surface-strong)]">
          {formatPrice(totalPrice)}
        </span>
      </div>

      <Button
        onClick={onCheckout}
        disabled={selectedCount === 0}
        className="w-full h-12 rounded-xl bg-[var(--surface-strong)] hover:bg-[var(--surface-strong)]/90 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="size-5 mr-2" />
        Thanh toán
      </Button>

      {selectedCount > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-green-700 leading-relaxed">
              Bạn sẽ được truy cập ngay sau khi thanh toán thành công
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
