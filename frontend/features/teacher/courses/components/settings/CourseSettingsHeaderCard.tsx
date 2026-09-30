import Link from "next/link";
import { ArrowLeft, ChevronDown, Eye, Save, Check, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseSettingsHeaderCardProps {
  courseId: string;
  courseTitle: string;
  courseSlug?: string;
  courseStatus: "PUBLISHED" | "DRAFT" | "HIDDEN";
  hasUnsavedChanges: boolean;
  saveSuccessNotice: boolean;
  isSaving?: boolean;
  onChangeCourseStatus: (status: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
  onSave: () => void;
}

export function CourseSettingsHeaderCard({
  courseId,
  courseTitle,
  courseSlug,
  courseStatus,
  hasUnsavedChanges,
  saveSuccessNotice,
  isSaving = false,
  onChangeCourseStatus,
  onSave,
}: CourseSettingsHeaderCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Back button & Title & Status Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          title="Quay lại danh sách khóa học"
        >
          <Link href="/teacher/courses">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block" />

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {courseTitle || "Cài đặt khóa học"}
            </h1>

            {/* Interactive Course Status Selector */}
            <div className="relative inline-flex items-center">
              <select
                value={courseStatus}
                onChange={(e) =>
                  onChangeCourseStatus(
                    e.target.value as "PUBLISHED" | "DRAFT" | "HIDDEN"
                  )
                }
                className={cn(
                  "text-[11px] font-semibold rounded-lg px-2.5 py-1 border cursor-pointer appearance-none pr-6 focus:outline-none transition-colors",
                  courseStatus === "PUBLISHED" &&
                    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70",
                  courseStatus === "DRAFT" &&
                    "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70",
                  courseStatus === "HIDDEN" &&
                    "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70"
                )}
              >
                <option value="PUBLISHED">🟢 Đang xuất bản</option>
                <option value="DRAFT">🟡 Bản nháp</option>
                <option value="HIDDEN">⚪ Đã ẩn</option>
              </select>
              <ChevronDown className="size-3 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span>Cài đặt & thông tin khóa học</span>
            <span>•</span>
            <span>Cấu hình học phí, ảnh bìa và mô tả chi tiết</span>
          </p>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50"
        >
          <Link href={`/teacher/courses/${courseId}/curriculum`}>
            <BookOpen className="size-3.5 mr-1.5 text-slate-500" />
            <span>Soạn giáo trình</span>
          </Link>
        </Button>

        {courseSlug && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          >
            <Link href={`/courses/${courseSlug}`} target="_blank">
              <Eye className="size-3.5 mr-1.5" />
              <span>Xem trước</span>
            </Link>
          </Button>
        )}

        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "h-9 rounded-xl text-xs font-semibold shadow-xs transition-all",
            hasUnsavedChanges
              ? "bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white animate-pulse"
              : saveSuccessNotice
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 mr-1.5 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : saveSuccessNotice ? (
            <>
              <Check className="size-3.5 mr-1.5" />
              <span>Đã lưu!</span>
            </>
          ) : (
            <>
              <Save className="size-3.5 mr-1.5" />
              <span>{hasUnsavedChanges ? "Lưu thay đổi *" : "Đã lưu cài đặt"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
