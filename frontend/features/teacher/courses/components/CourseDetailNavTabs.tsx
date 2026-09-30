"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BookOpen, Settings, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseDetailNavTabsProps {
  courseId: string;
  courseTitle?: string;
  courseSlug?: string;
  courseStatus?: "PUBLISHED" | "DRAFT" | "HIDDEN";
}

export function CourseDetailNavTabs({
  courseId,
  courseTitle,
  courseSlug,
  courseStatus,
}: CourseDetailNavTabsProps) {
  const pathname = usePathname();

  const isCurriculum = pathname.includes(`/curriculum`);
  const isSettings = pathname.includes(`/settings`);

  const statusBadgeConfig = {
    PUBLISHED: { label: "Đang xuất bản", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    DRAFT: { label: "Bản nháp", className: "bg-amber-50 text-amber-700 border-amber-200" },
    HIDDEN: { label: "Đã ẩn", className: "bg-slate-100 text-slate-600 border-slate-200" },
  };

  const statusInfo = courseStatus ? statusBadgeConfig[courseStatus] : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs p-4 mb-6">
      {/* Top row: Title + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-xl text-slate-500 hover:text-slate-800 shrink-0"
            title="Quay lại danh sách khóa học"
          >
            <Link href="/teacher/courses">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {courseTitle || "Quản trị khóa học"}
              </h1>
              {statusInfo && (
                <Badge variant="outline" className={cn("text-[11px] font-semibold px-2 py-0.5", statusInfo.className)}>
                  {statusInfo.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {courseSlug && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 rounded-xl text-xs gap-1.5 self-start sm:self-auto border-slate-200"
          >
            <Link href={`/courses/${courseSlug}`} target="_blank">
              <Eye className="size-3.5" />
              <span>Xem trang học sinh</span>
              <ExternalLink className="size-3 text-slate-400" />
            </Link>
          </Button>
        )}
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 pt-3">
        <Link
          href={`/teacher/courses/${courseId}/curriculum`}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all",
            isCurriculum
              ? "bg-[var(--surface-strong)] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          )}
        >
          <BookOpen className="size-3.5" />
          <span>Soạn giáo trình</span>
        </Link>

        <Link
          href={`/teacher/courses/${courseId}/settings`}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all",
            isSettings
              ? "bg-[var(--surface-strong)] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          )}
        >
          <Settings className="size-3.5" />
          <span>Cài đặt & Thông tin</span>
        </Link>
      </div>
    </div>
  );
}
