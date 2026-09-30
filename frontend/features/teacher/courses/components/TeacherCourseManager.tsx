"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, LayoutGrid, List, BookOpen, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CourseItem } from "../types";
import { CourseKPIStats } from "./CourseKPIStats";
import { CourseGridCard } from "./CourseGridCard";
import { CourseTableView } from "./CourseTableView";
import { CreateCourseModal } from "./CreateCourseModal";
import {
  getTeacherCourses,
  createTeacherCourse,
  updateTeacherCourseStatus,
} from "../api/teacher-courses.api";

export function TeacherCourseManager() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeacherCourses();
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch teacher courses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleUpdateCourseStatus = async (
    courseId: string,
    newStatus: "PUBLISHED" | "DRAFT" | "HIDDEN"
  ) => {
    // Optimistic update
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, status: newStatus } : c))
    );
    try {
      await updateTeacherCourseStatus(courseId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchCourses(); // Rollback
    }
  };

  const handleCreateCourse = async (payload: import("../api/teacher-courses.api").CreateCoursePayload) => {
    try {
      await createTeacherCourse(payload);
      fetchCourses();
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      selectedStatus === "ALL" || course.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;
  const totalStudents = courses.reduce((acc, c) => acc + c.studentsCount, 0);
  const totalLessons = courses.reduce((acc, c) => acc + c.lessonsCount, 0);

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Khóa học của tôi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quản lý nội dung giảng dạy, soạn giáo trình và theo dõi tiến độ các khóa học phụ trách.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-700 text-xs gap-1.5 shadow-2xs"
          >
            <Link href="/teacher/activation-codes">
              <KeyRound className="size-4 text-[var(--surface-strong)]" />
              <span>Mã kích hoạt</span>
            </Link>
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white shadow-sm flex items-center gap-2 rounded-xl text-xs"
          >
            <Plus className="size-4" />
            <span>Tạo khóa học mới</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <CourseKPIStats
        totalCourses={courses.length}
        publishedCount={publishedCount}
        totalStudents={totalStudents}
        totalLessons={totalLessons}
      />

      {/* Search & Filter Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Tìm theo tên khóa học, phân loại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white"
          />
        </div>

        {/* Status filter tabs & View mode toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { label: "Tất cả", value: "ALL" },
              { label: "Đang xuất bản", value: "PUBLISHED" },
              { label: "Bản nháp", value: "DRAFT" },
              { label: "Đã ẩn", value: "HIDDEN" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                  selectedStatus === tab.value
                    ? "bg-[var(--surface-strong)] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="border-l border-slate-200 dark:border-slate-800 pl-2 ml-1 flex items-center gap-1 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === "grid"
                  ? "bg-slate-100 dark:bg-slate-800 text-[var(--surface-strong)]"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Dạng lưới"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === "list"
                  ? "bg-slate-100 dark:bg-slate-800 text-[var(--surface-strong)]"
                  : "text-slate-400 hover:text-slate-600"
              )}
              title="Dạng bảng"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Display */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center">
          <Loader2 className="size-8 text-[var(--surface-strong)] animate-spin" />
          <p className="text-sm text-slate-500 mt-3">Đang tải khóa học...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60">
          <BookOpen className="size-12 mx-auto text-slate-300 stroke-1" />
          <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">
            Không tìm thấy khóa học nào
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseGridCard
              key={course.id}
              course={course}
              onUpdateStatus={handleUpdateCourseStatus}
            />
          ))}
        </div>
      ) : (
        <CourseTableView
          courses={filteredCourses}
          onUpdateStatus={handleUpdateCourseStatus}
        />
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />
    </div>
  );
}
