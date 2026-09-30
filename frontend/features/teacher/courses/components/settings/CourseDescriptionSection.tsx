"use client";

import { FileText } from "lucide-react";

interface CourseDescriptionSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function CourseDescriptionSection({
  description,
  onDescriptionChange,
}: CourseDescriptionSectionProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <FileText className="size-4 text-[var(--surface-strong)]" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Mô tả khóa học</h2>
      </div>

      <textarea
        rows={5}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Nhập giới thiệu chi tiết về nội dung khóa học, đối tượng học sinh, mục tiêu đạt được..."
        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] resize-none"
      />
    </div>
  );
}
