"use client";

import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CourseCategory } from "@/features/course/api/course.api";

interface CourseBasicInfoSectionProps {
  title: string;
  slug?: string;
  categoryId: string;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  categories: CourseCategory[];
  onTitleChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
}

export function CourseBasicInfoSection({
  title,
  slug,
  categoryId,
  status,
  categories,
  onTitleChange,
  onCategoryChange,
  onStatusChange,
}: CourseBasicInfoSectionProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <BookOpen className="size-4 text-[var(--surface-strong)]" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Thông tin cơ bản
        </h2>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
          Tên khóa học *
        </label>
        <Input
          required
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Nhập tên khóa học..."
          className="bg-slate-50 border-slate-200 rounded-xl text-sm"
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Danh mục khóa học
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] cursor-pointer"
          >
            <option value="">-- Không chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Trạng thái hiển thị
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] cursor-pointer"
          >
            <option value="PUBLISHED">🟢 Đang xuất bản</option>
            <option value="DRAFT">🟡 Bản nháp</option>
            <option value="HIDDEN">⚪ Đã ẩn</option>
          </select>
        </div>
      </div>
    </div>
  );
}
