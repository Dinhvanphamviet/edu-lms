"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TeacherCollection } from "../types";
import type { CourseItem } from "@/features/teacher/courses/types";
import {
  getTeacherCollections,
  updateTeacherCollectionStatus,
} from "../api/teacher-collections.api";
import { getTeacherCourses } from "@/features/teacher/courses/api/teacher-courses.api";
import { CollectionKPIStats } from "./CollectionKPIStats";
import { CollectionCard } from "./CollectionCard";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { DeleteCollectionModal } from "./DeleteCollectionModal";

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

export function TeacherCollectionManager() {
  const router = useRouter();
  const [collections, setCollections] = useState<TeacherCollection[]>([]);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeacherCollection | null>(
    null,
  );
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [colData, courseData] = await Promise.all([
        getTeacherCollections(),
        getTeacherCourses().catch(() => [] as CourseItem[]),
      ]);
      setCollections(Array.isArray(colData) ? colData : []);
      setAvailableCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Không thể tải danh sách bộ sưu tập";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCollections = useMemo(() => {
    return collections.filter((col) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        col.title.toLowerCase().includes(query) ||
        (col.short_title && col.short_title.toLowerCase().includes(query)) ||
        col.courses.some((c) => c.title.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && col.is_active) ||
        (statusFilter === "DRAFT" && !col.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [collections, searchQuery, statusFilter]);

  const totalStudents = useMemo(
    () => collections.reduce((acc, c) => acc + (c.total_students || 0), 0),
    [collections],
  );
  const activeCount = useMemo(
    () => collections.filter((c) => c.is_active).length,
    [collections],
  );
  const draftCount = useMemo(
    () => collections.filter((c) => !c.is_active).length,
    [collections],
  );

  const handleToggleStatus = async (col: TeacherCollection) => {
    try {
      setTogglingId(col.id);
      const newStatus = !col.is_active;
      await updateTeacherCollectionStatus(col.id, newStatus);
      toast.success(
        newStatus
          ? `Đã mở bán combo "${col.short_title || col.title}"`
          : `Đã chuyển combo "${col.short_title || col.title}" về bản nháp`,
      );
      await fetchData();
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Không thể cập nhật trạng thái";
      toast.error(msg);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Quản lý Bộ sưu tập &amp; Lộ trình
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gom các khóa học liên quan thành các gói Combo lộ trình hoàn chỉnh
            cho học sinh đăng ký trọn gói.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl shadow-xs flex items-center gap-2"
        >
          <Plus className="size-4" />
          <span>Tạo bộ sưu tập mới</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <CollectionKPIStats
        totalCollections={collections.length}
        totalStudents={totalStudents}
        activeCollections={activeCount}
        loading={loading}
      />

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bộ sưu tập, tên khóa học..."
            className="pl-9 bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              statusFilter === "ALL"
                ? "bg-[var(--surface-strong)] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            Tất cả ({collections.length})
          </button>
          <button
            onClick={() => setStatusFilter("PUBLISHED")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5",
              statusFilter === "PUBLISHED"
                ? "bg-[var(--surface-strong)] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <span>Đang mở bán</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {activeCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("DRAFT")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5",
              statusFilter === "DRAFT"
                ? "bg-[var(--surface-strong)] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            <span>Bản nháp / Đã ẩn</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {draftCount}
            </span>
          </button>
        </div>
      </div>

      {/* Collections Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="size-8 animate-spin text-[var(--surface-strong)]" />
          <span className="text-sm">
            Đang tải danh sách bộ sưu tập từ máy chủ...
          </span>
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-center flex flex-col items-center gap-3">
          <AlertCircle className="size-8 text-rose-500" />
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            {error}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchData}
            className="rounded-xl text-xs"
          >
            Thử lại
          </Button>
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Boxes className="size-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {searchQuery || statusFilter !== "ALL"
              ? "Không tìm thấy bộ sưu tập phù hợp"
              : "Chưa có bộ sưu tập nào"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {searchQuery || statusFilter !== "ALL"
              ? "Hãy thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc trạng thái."
              : "Tạo các gói combo lộ trình khóa học giúp học sinh dễ dàng đăng ký trọn gói với mức giá ưu đãi."}
          </p>
          {!searchQuery && statusFilter === "ALL" && (
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 bg-[var(--surface-strong)] text-white rounded-xl text-xs"
            >
              <Plus className="size-3.5 mr-1" />
              Tạo bộ sưu tập đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((col) => (
            <CollectionCard
              key={col.id}
              collection={col}
              onEdit={(col) => router.push(`/teacher/collections/${col.id}`)}
              onDelete={setDeleteTarget}
              onToggleStatus={handleToggleStatus}
              isToggling={togglingId === col.id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateCollectionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={fetchData}
        availableCourses={availableCourses}
      />

      <DeleteCollectionModal
        collection={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={fetchData}
      />
    </div>
  );
}
