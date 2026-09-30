"use client";

import { Boxes, Users, CheckCircle2 } from "lucide-react";

interface CollectionKPIStatsProps {
  totalCollections: number;
  totalStudents: number;
  activeCollections: number;
  loading?: boolean;
}

export function CollectionKPIStats({
  totalCollections,
  totalStudents,
  activeCollections,
  loading = false,
}: CollectionKPIStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng số bộ sưu tập
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Boxes className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {loading ? "..." : totalCollections}
          </span>
          <span className="text-xs text-slate-400">bộ sưu tập</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Học viên học theo Combo
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Users className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {loading ? "..." : totalStudents.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-600 font-medium">học viên</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Đang mở bán
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {loading ? "..." : activeCollectionsCountDisplay(activeCollections)}
          </span>
          <span className="text-xs text-slate-400">bộ sưu tập</span>
        </div>
      </div>
    </div>
  );
}

function activeCollectionsCountDisplay(count: number) {
  return count;
}
