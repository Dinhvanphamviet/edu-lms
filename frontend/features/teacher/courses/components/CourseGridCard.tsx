import Link from "next/link";
import { Star, FileText, Users, ChevronDown, Edit3, Eye, MoreVertical, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CourseItem } from "../types";

interface CourseGridCardProps {
  course: CourseItem;
  onUpdateStatus: (courseId: string, newStatus: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
}

export function CourseGridCard({ course, onUpdateStatus }: CourseGridCardProps) {
  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Cover Image & Status Badge */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={course.coverImage || "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=600&auto=format&fit=crop"}
          alt={course.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=600&auto=format&fit=crop";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-black/60 backdrop-blur-xs text-white border-white/20 text-xs font-semibold">
            {course.category}
          </Badge>
        </div>

        {/* Status Dropdown */}
        <div className="absolute top-3 right-3">
          <div className="relative inline-flex items-center">
            <select
              value={course.status}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                onUpdateStatus(course.id, e.target.value as any)
              }
              className={cn(
                "text-[11px] font-semibold rounded-lg px-2 py-0.5 border backdrop-blur-xs cursor-pointer appearance-none pr-5 focus:outline-none transition-colors",
                course.status === "PUBLISHED" &&
                  "bg-emerald-500 text-white hover:bg-emerald-600",
                course.status === "DRAFT" &&
                  "bg-amber-500 text-white hover:bg-amber-600",
                course.status === "HIDDEN" &&
                  "bg-slate-700/90 text-white border-slate-600"
              )}
            >
              <option value="PUBLISHED" className="text-slate-900 bg-white">
                Đang xuất bản
              </option>
              <option value="DRAFT" className="text-slate-900 bg-white">
                Bản nháp
              </option>
              <option value="HIDDEN" className="text-slate-900 bg-white">
                Đã ẩn
              </option>
            </select>
            <ChevronDown className="size-3 text-white/90 absolute right-1.5 pointer-events-none" />
          </div>
        </div>

        {course.rating > 0 && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star className="size-3.5 fill-amber-400" />
            <span className="text-white">{course.rating}</span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-[var(--surface-strong)] transition-colors">
            {course.title}
          </h3>

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <FileText className="size-3.5 text-[var(--surface-strong)]" />
              <span>{course.lessonsCount} bài học</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 text-[var(--surface-strong)]" />
              <span>{course.studentsCount} học viên</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <Button
            asChild
            size="sm"
            className="flex-1 rounded-xl text-xs font-semibold bg-[var(--surface-strong)] hover:bg-[var(--surface-strong)] text-white shadow-xs border-0"
          >
            <Link href={`/teacher/courses/${course.id}/curriculum`}>
              <Edit3 className="size-3.5 mr-1.5" />
              <span>Soạn giáo trình</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-500 hover:text-slate-800 rounded-xl"
            title="Cài đặt thông tin khóa học"
          >
            <Link href={`/teacher/courses/${course.id}/settings`}>
              <Settings className="size-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-500 hover:text-slate-800 rounded-xl"
            title="Xem trang học sinh"
          >
            <Link href={`/courses/${course.slug}`}>
              <Eye className="size-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-slate-500 hover:text-slate-800 rounded-xl"
            title="Tùy chọn khác"
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
