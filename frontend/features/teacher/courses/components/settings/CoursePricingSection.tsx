"use client";

import { DollarSign, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CoursePricingSectionProps {
  price: number | "";
  releaseDate: string;
  onPriceChange: (value: number | "") => void;
  onReleaseDateChange: (value: string) => void;
}

export function CoursePricingSection({
  price,
  releaseDate,
  onPriceChange,
  onReleaseDateChange,
}: CoursePricingSectionProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <DollarSign className="size-4 text-[var(--surface-strong)]" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Học phí & Phát hành
        </h2>
      </div>

      <div className="space-y-4">
        {/* 1. Học phí full-width */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Học phí (VNĐ)
          </label>
          <div className="relative">
            <Input
              type="number"
              min="0"
              step="10000"
              value={price}
              onChange={(e) =>
                onPriceChange(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="1200000"
              className="bg-slate-50 border-slate-200 rounded-xl text-sm font-medium pr-14"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
              VNĐ
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 text-[11px]">
            <span className="font-semibold text-teal-600 dark:text-teal-400">
              {typeof price === "number" && price > 0
                ? `${price.toLocaleString("vi-VN")} đ`
                : "Khóa học miễn phí (0 đ)"}
            </span>
            <span className="text-slate-400">Bước nhảy: 10.000đ</span>
          </div>
        </div>

        {/* 2. Ngày phát hành */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Calendar className="size-3.5 text-slate-400" />
            <span>Ngày phát hành / Khai giảng</span>
          </label>
          <Input
            type="date"
            value={releaseDate}
            onChange={(e) => onReleaseDateChange(e.target.value)}
            className="bg-slate-50 border-slate-200 rounded-xl text-sm"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Thời hạn truy cập học tập được tính theo thời điểm kích hoạt/thanh toán của học viên
          </span>
        </div>
      </div>
    </div>
  );
}
