import { KeyRound, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";

interface ActivationCodesStatsProps {
  totalCodes: number;
  unusedCodes: number;
  usedCodes: number;
  expiredOrDisabledCodes: number;
}

export function ActivationCodesStats({
  totalCodes,
  unusedCodes,
  usedCodes,
  expiredOrDisabledCodes,
}: ActivationCodesStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng số mã */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng số mã
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <KeyRound className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalCodes}
          </span>
          <span className="text-xs text-slate-400">mã đã tạo</span>
        </div>
      </div>

      {/* 2. Còn dùng được */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Còn dùng được
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {unusedCodes}
          </span>
          <span className="text-xs text-emerald-600 font-medium">
            chưa kích hoạt
          </span>
        </div>
      </div>

      {/* 3. Đã sử dụng */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Đã sử dụng
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
            <UserCheck className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {usedCodes}
          </span>
          <span className="text-xs text-indigo-600 font-medium">
            đã cấp khóa học
          </span>
        </div>
      </div>

      {/* 4. Hết hạn / Vô hiệu hóa */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Hết hạn / Vô hiệu
          </span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <AlertCircle className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {expiredOrDisabledCodes}
          </span>
          <span className="text-xs text-amber-600 font-medium">
            ngừng kích hoạt
          </span>
        </div>
      </div>
    </div>
  );
}
