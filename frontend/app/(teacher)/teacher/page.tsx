"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function TeacherDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Tổng quan Giảng dạy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chào mừng trở lại, {user?.full_name || "Thầy Giáo Viên"}. Dưới đây là tóm tắt hoạt động và chỉ số học tập hôm nay.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Khóa học phụ trách
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <BookOpen className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">6</span>
            <span className="text-xs text-slate-400">khóa học</span>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="size-3.5" />
            <span>3 khóa đang xuất bản</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số học viên
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-muted)] text-[var(--surface-strong)]">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">1,940</span>
            <span className="text-xs text-slate-400">học viên</span>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="size-3.5" />
            <span>+128 học viên tuần này</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bài tập cần chấm
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Clock className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">12</span>
            <span className="text-xs text-amber-600 font-medium">chờ xử lý</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Hạn chấm gần nhất: Hôm nay
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đánh giá trung bình
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Sparkles className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">4.9</span>
            <span className="text-xs text-slate-400">/ 5.0 ★</span>
          </div>
          <div className="mt-3 text-xs text-purple-600 font-medium">
            Từ 340 lượt đánh giá
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Khóa học nổi bật gần đây
            </h2>
            <Link
              href="/teacher/courses"
              className="text-xs font-semibold text-[var(--surface-strong)] hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Toán 12 - Chinh Phục Cực Trị & Hàm Số Nâng Cao (Mục tiêu 9+)",
                category: "Lớp 12",
                students: 428,
                lessons: 36,
                progress: 82,
              },
              {
                title: "Phương Pháp Tọa Độ Không Gian Oxyz Thực Chiến 2026",
                category: "Lớp 12",
                students: 312,
                lessons: 28,
                progress: 68,
              },
              {
                title: "Luyện Thi Đánh Giá Năng Lực ĐHQG - Chuyên Đề Toán Logic",
                category: "Luyện thi ĐGNL",
                students: 520,
                lessons: 42,
                progress: 90,
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-[var(--surface-strong)]/40 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] py-0 border-slate-200">
                      {course.category}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {course.students} học viên • {course.lessons} bài học
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {course.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs h-8 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  >
                    <Link href="/teacher/courses">Chi tiết</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Students (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Học sinh mới ghi danh
          </h2>

          <div className="space-y-3.5">
            {[
              {
                name: "Nguyễn Hoàng Nam",
                course: "Toán 12 - Cực Trị",
                time: "10 phút trước",
                avatar: "H",
                color: "bg-blue-600",
              },
              {
                name: "Trần Thùy Linh",
                course: "Luyện Thi ĐGNL",
                time: "1 giờ trước",
                avatar: "L",
                color: "bg-pink-600",
              },
              {
                name: "Lê Quốc Bảo",
                course: "Hình học Oxyz",
                time: "3 giờ trước",
                avatar: "B",
                color: "bg-emerald-600",
              },
              {
                name: "Phạm Minh Đức",
                course: "Toán 12 - Cực Trị",
                time: "5 giờ trước",
                avatar: "Đ",
                color: "bg-amber-600",
              },
            ].map((std, i) => (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`size-8 rounded-full ${std.color} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                  >
                    {std.avatar}
                  </div>
                  <div className="overflow-hidden text-left">
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {std.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {std.course}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {std.time}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              asChild
              variant="ghost"
              className="w-full text-xs text-[var(--surface-strong)] hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Link href="/teacher/students" className="flex items-center justify-center gap-1">
                <span>Xem tất cả học sinh</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
