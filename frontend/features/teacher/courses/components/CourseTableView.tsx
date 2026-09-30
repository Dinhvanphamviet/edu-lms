import Link from "next/link";
import { Edit3, Eye, MoreVertical, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CourseItem } from "../types";

interface CourseTableViewProps {
  courses: CourseItem[];
  onUpdateStatus: (courseId: string, newStatus: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
}

export function CourseTableView({ courses, onUpdateStatus }: CourseTableViewProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Khóa học</th>
              <th className="py-3 px-4">Danh mục</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Số bài</th>
              <th className="py-3 px-4">Học viên</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <td className="py-3.5 px-4 max-w-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="size-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-xs">
                        {course.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Cập nhật {course.updatedAt}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-500">
                  {course.category}
                </td>
                <td className="py-3.5 px-4">
                  <div className="relative inline-flex items-center">
                    <select
                      value={course.status}
                      onChange={(e) =>
                        onUpdateStatus(course.id, e.target.value as any)
                      }
                      className={cn(
                        "text-[11px] font-semibold rounded-lg px-2.5 py-1 border cursor-pointer appearance-none pr-5.5 focus:outline-none transition-colors",
                        course.status === "PUBLISHED" &&
                          "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70",
                        course.status === "DRAFT" &&
                          "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70",
                        course.status === "HIDDEN" &&
                          "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70"
                      )}
                    >
                      <option value="PUBLISHED">Đang xuất bản</option>
                      <option value="DRAFT">Bản nháp</option>
                      <option value="HIDDEN">Đã ẩn</option>
                    </select>
                    <ChevronDown className="size-3 text-slate-400 absolute right-1.5 pointer-events-none" />
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {course.lessonsCount} bài
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {course.studentsCount} học viên
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-slate-600 hover:text-[var(--surface-strong)]"
                      title="Soạn giáo trình"
                    >
                      <Link href={`/teacher/courses/${course.id}/curriculum`}>
                        <Edit3 className="size-3.5 mr-1" />
                        <span>Giáo trình</span>
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-slate-400 hover:text-slate-600"
                      title="Cài đặt thông tin"
                    >
                      <Link href={`/teacher/courses/${course.id}/settings`}>
                        <Settings className="size-3.5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-slate-400 hover:text-slate-600"
                      title="Xem trang học sinh"
                    >
                      <Link href={`/courses/${course.slug}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0 text-slate-400 hover:text-slate-600"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
