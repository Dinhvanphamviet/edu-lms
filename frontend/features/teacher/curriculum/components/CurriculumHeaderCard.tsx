import Link from "next/link";
import { ArrowLeft, ChevronDown, Eye, Plus, Save, Check, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CurriculumHeaderCardProps {
  courseId?: string;
  courseTitle: string;
  courseSlug: string;
  courseStatus: "PUBLISHED" | "DRAFT" | "HIDDEN";
  chaptersCount: number;
  lessonsCount: number;
  hasUnsavedChanges: boolean;
  saveSuccessNotice: boolean;
  onChangeCourseStatus: (status: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
  onOpenAddChapter: () => void;
  onSaveCurriculum: () => void;
}

export function CurriculumHeaderCard({
  courseId,
  courseTitle,
  courseSlug,
  courseStatus,
  chaptersCount,
  lessonsCount,
  hasUnsavedChanges,
  saveSuccessNotice,
  onChangeCourseStatus,
  onOpenAddChapter,
  onSaveCurriculum,
}: CurriculumHeaderCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              {courseTitle}
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
            <span>Soạn giáo trình & bài học</span>
            <span>•</span>
            <span>{chaptersCount} chương</span>
            <span>•</span>
            <span>{lessonsCount} bài học</span>
          </p>
        </div>
      </div>

      {/* Global Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        {courseId && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          >
            <Link href={`/teacher/courses/${courseId}/settings`}>
              <Settings className="size-3.5 mr-1.5 text-slate-500" />
              <span>Cài đặt thông tin</span>
            </Link>
          </Button>
        )}

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

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAddChapter}
          className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50"
        >
          <Plus className="size-3.5 mr-1" />
          <span>Thêm chương</span>
        </Button>

        <Button
          size="sm"
          onClick={onSaveCurriculum}
          className={cn(
            "h-9 rounded-xl text-xs font-semibold shadow-xs transition-all",
            hasUnsavedChanges
              ? "bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white animate-pulse"
              : saveSuccessNotice
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800"
          )}
        >
          {saveSuccessNotice ? (
            <>
              <Check className="size-3.5 mr-1.5" />
              <span>Đã lưu!</span>
            </>
          ) : (
            <>
              <Save className="size-3.5 mr-1.5" />
              <span>{hasUnsavedChanges ? "Lưu thay đổi *" : "Đã lưu giáo trình"}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
