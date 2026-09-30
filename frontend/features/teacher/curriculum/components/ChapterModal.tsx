"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChapterModalProps {
  isOpen: boolean;
  editingChapterId: string | null;
  chapterTitleInput: string;
  onChangeTitle: (title: string) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function ChapterModal({
  isOpen,
  editingChapterId,
  chapterTitleInput,
  onChangeTitle,
  onClose,
  onSave,
}: ChapterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {editingChapterId ? "Chỉnh sửa chương" : "Thêm chương mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Tên chương *
            </label>
            <Input
              required
              value={chapterTitleInput}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="Ví dụ: Chương 1: Ứng dụng đạo hàm khảo sát hàm số..."
              className="bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl text-xs"
            >
              {editingChapterId ? "Lưu thay đổi" : "Thêm chương"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
