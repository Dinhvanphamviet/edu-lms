import { BookOpen, CheckCircle2, Users, Video } from "lucide-react";

interface CourseKPIStatsProps {
  totalCourses: number;
  publishedCount: number;
  totalStudents: number;
  totalLessons: number;
}

export function CourseKPIStats({
  totalCourses,
  publishedCount,
  totalStudents,
  totalLessons,
}: CourseKPIStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng khóa học
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <BookOpen className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalCourses}
          </span>
          <span className="text-xs text-slate-400">khóa</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Đang xuất bản
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {publishedCount}
          </span>
          <span className="text-xs text-emerald-600 font-medium">Hoạt động</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng học sinh
          </span>
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[var(--surface-strong)]">
            <Users className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalStudents.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">học viên</span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng bài giảng
          </span>
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
            <Video className="size-5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            {totalLessons}
          </span>
          <span className="text-xs text-slate-400">bài học</span>
        </div>
      </div>
    </div>
  );
}
