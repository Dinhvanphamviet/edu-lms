"use client";

import { X, UploadCloud, Film, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LessonType } from "../types";

interface LessonModalProps {
  isOpen: boolean;
  editingLessonId: string | null;
  courseId: string;
  lessonTitleInput: string;
  lessonTypeInput: LessonType;
  lessonDurationInput: number;
  lessonIsFreePreview: boolean;
  lessonStatusInput: "PUBLISHED" | "DRAFT" | "HIDDEN";
  videoFileName: string;
  videoFileSize: string;
  videoObjectKey: string;
  onChangeTitle: (val: string) => void;
  onChangeType: (val: LessonType) => void;
  onChangeDuration: (val: number) => void;
  onChangeIsFreePreview: (val: boolean) => void;
  onChangeStatus: (val: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
  onChangeVideoObjectKey: (val: string) => void;
  onSelectVideoFile: (file: File) => void;
  onResetVideo: () => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function LessonModal({
  isOpen,
  editingLessonId,
  courseId,
  lessonTitleInput,
  lessonTypeInput,
  lessonDurationInput,
  lessonIsFreePreview,
  lessonStatusInput,
  videoFileName,
  videoFileSize,
  videoObjectKey,
  onChangeTitle,
  onChangeType,
  onChangeDuration,
  onChangeIsFreePreview,
  onChangeStatus,
  onChangeVideoObjectKey,
  onSelectVideoFile,
  onResetVideo,
  onClose,
  onSave,
}: LessonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {editingLessonId ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Tên bài học *
            </label>
            <Input
              required
              value={lessonTitleInput}
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder="Ví dụ: Kỹ thuật xét dấu đạo hàm hàm hợp f'(u(x))..."
              className="bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Định dạng bài học *
              </label>
              <div className="relative">
                <select
                  value={lessonTypeInput}
                  onChange={(e) => onChangeType(e.target.value as LessonType)}
                  className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] appearance-none cursor-pointer"
                >
                  <option value="VIDEO">Video bài giảng</option>
                  <option value="PDF">Tài liệu PDF / Đề in</option>
                  <option value="QUIZ">Trắc nghiệm / Bài tập</option>
                  <option value="LIVE">Buổi Livestream</option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                {lessonTypeInput === "VIDEO" || lessonTypeInput === "LIVE"
                  ? "Thời lượng (phút)"
                  : lessonTypeInput === "QUIZ"
                  ? "Số lượng câu hỏi"
                  : "Số trang tài liệu"}
              </label>
              <Input
                type="number"
                min={1}
                value={lessonDurationInput}
                onChange={(e) => onChangeDuration(Number(e.target.value))}
                className="bg-slate-50 border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Cloudflare R2 Video Upload Box */}
          {lessonTypeInput === "VIDEO" && (
            <div className="space-y-2.5 p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <UploadCloud className="size-4 text-[var(--surface-strong)]" />
                  <span>Video bài giảng (Lưu trữ Cloudflare R2)</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Bucket: edu-lms-videos
                </span>
              </div>

              {videoFileName ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[var(--surface-strong)] flex items-center justify-center shrink-0">
                      <Film className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {videoFileName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{videoFileSize || "240 MB"}</span>
                        <span>•</span>
                        <span className="font-mono text-teal-600 dark:text-teal-400 truncate max-w-[180px]">
                          {videoObjectKey || `courses/${courseId}/${videoFileName}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onResetVideo}
                    className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  >
                    Đổi video
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 hover:border-[var(--surface-strong)] rounded-lg bg-white dark:bg-slate-900 cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onSelectVideoFile(file);
                      }
                    }}
                  />
                  <UploadCloud className="size-7 text-slate-400 group-hover:text-[var(--surface-strong)] mb-1.5 transition-colors" />
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Bấm để chọn file video (.mp4) tải lên Cloudflare R2
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tự động sinh R2 Object Key & tạo URL xem an toàn
                  </div>
                </label>
              )}

              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  R2 Object Key (theo định dạng: courses/{courseId}/tên-file.mp4)
                </label>
                <Input
                  value={videoObjectKey}
                  onChange={(e) => onChangeVideoObjectKey(e.target.value)}
                  placeholder={`courses/${courseId}/bai-giang.mp4`}
                  className="bg-white dark:bg-slate-900 border-slate-200 rounded-lg text-xs font-mono h-8"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Trạng thái phát hành
              </label>
              <div className="relative">
                <select
                  value={lessonStatusInput}
                  onChange={(e) =>
                    onChangeStatus(
                      e.target.value as "PUBLISHED" | "DRAFT" | "HIDDEN"
                    )
                  }
                  className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] appearance-none cursor-pointer"
                >
                  <option value="PUBLISHED">Đang xuất bản</option>
                  <option value="DRAFT">Bản nháp</option>
                  <option value="HIDDEN">Đã ẩn</option>
                </select>
                <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={lessonIsFreePreview}
                  onChange={(e) => onChangeIsFreePreview(e.target.checked)}
                  className="rounded border-slate-300 text-[var(--surface-strong)] focus:ring-[var(--surface-strong)]"
                />
                <span>Cho phép học sinh học thử</span>
              </label>
            </div>
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
              {editingLessonId ? "Cập nhật bài học" : "Thêm bài học"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
