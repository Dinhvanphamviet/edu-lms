"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { KeyRound, Plus, Search, RefreshCw, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ActivationCodeItem, CourseOption, ActivationCodeStatus } from "../types";
import {
  getTeacherActivationCodes,
  toggleActivationCodeStatus,
  deleteActivationCode,
  activationErrorMessage,
} from "../api/activation-codes.api";
import { getTeacherCourses } from "@/features/teacher/courses/api/teacher-courses.api";
import { ActivationCodesStats } from "./ActivationCodesStats";
import { ActivationCodesTable } from "./ActivationCodesTable";
import { CreateActivationCodeModal } from "./CreateActivationCodeModal";

export function ActivationCodesManager() {
  const [codes, setCodes] = useState<ActivationCodeItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    "ALL" | ActivationCodeStatus
  >("ALL");

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<ActivationCodeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pendingRequests = useRef(new Set<string>());
  const [pendingCodeIds, setPendingCodeIds] = useState<string[]>([]);

  // Fetch initial data
  const loadData = useCallback(async () => {
    try {
      const [fetchedCourses, fetchedCodes] = await Promise.all([
        getTeacherCourses(), getTeacherActivationCodes(),
      ]);
      setCourses(fetchedCourses.map((c) => ({ id: c.id, title: c.title })));
      setCodes(fetchedCodes);
    } catch (err: unknown) {
      setCourses([]);
      setCodes([]);
      setError(activationErrorMessage(err, "Không thể tải danh sách mã kích hoạt."));
      toast.error("Lỗi khi tải dữ liệu mã kích hoạt.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReload = () => {
    setIsLoading(true);
    setError(null);
    void loadData();
  };

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (!cancelled) return loadData();
    });
    return () => { cancelled = true; };
  }, [loadData]);

  useEffect(() => {
    const refreshCodes = () => { void loadData(); };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshCodes();
    };
    window.addEventListener("focus", refreshCodes);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("focus", refreshCodes);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadData]);

  // Copy code handler using sonner toast
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    toast.success(`Đã sao chép mã: ${code}`);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  // Toggle enable/disable with sonner toast
  const handleToggleStatus = async (id: string) => {
    if (pendingRequests.current.has(id)) return;
    pendingRequests.current.add(id);
    setPendingCodeIds([...pendingRequests.current]);
    try {
      const updated = await toggleActivationCodeStatus(id);
      setCodes((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (updated.status === "DISABLED") {
        toast.info("Đã vô hiệu hóa mã kích hoạt.");
      } else {
        toast.success("Đã kích hoạt lại mã thành công.");
      }
    } catch (err: unknown) {
      toast.error(activationErrorMessage(err, "Không thể thay đổi trạng thái mã"));
    } finally {
      pendingRequests.current.delete(id);
      setPendingCodeIds([...pendingRequests.current]);
    }
  };

  // Delete code using confirmation modal
  const handleDeleteCode = (id: string) => {
    const target = codes.find((c) => c.id === id);
    if (target) {
      setCodeToDelete(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!codeToDelete || isDeleting) return;
    const id = codeToDelete.id;
    if (pendingRequests.current.has(id)) return;

    pendingRequests.current.add(id);
    setPendingCodeIds([...pendingRequests.current]);
    setIsDeleting(true);

    try {
      await deleteActivationCode(id);
      setCodes((prev) => prev.filter((item) => item.id !== id));
      toast.success(`Đã xóa mã kích hoạt ${codeToDelete.code} thành công!`);
      setCodeToDelete(null);
    } catch (err: unknown) {
      toast.error(activationErrorMessage(err, "Không thể xóa mã kích hoạt."));
    } finally {
      pendingRequests.current.delete(id);
      setPendingCodeIds([...pendingRequests.current]);
      setIsDeleting(false);
    }
  };

  // Close delete modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && codeToDelete && !isDeleting) {
        setCodeToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [codeToDelete, isDeleting]);

  // Append new codes after creation
  const handleCreatedCodes = (newItems: ActivationCodeItem[]) => {
    setCodes((prev) => [...newItems, ...prev]);
  };

  // Filter & Search Logic
  const filteredCodes = codes.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      item.code.toLowerCase().includes(q) ||
      (item.courses && item.courses.some((c) => c.title.toLowerCase().includes(q))) ||
      (item.usedBy?.name && item.usedBy.name.toLowerCase().includes(q)) ||
      (item.usedBy?.email && item.usedBy.email.toLowerCase().includes(q));

    const matchCourse =
      selectedCourseFilter === "ALL" ||
      (item.courses && item.courses.some((c) => c.id === selectedCourseFilter));

    const matchStatus =
      selectedStatusFilter === "ALL" || item.displayStatus === selectedStatusFilter;

    return matchSearch && matchCourse && matchStatus;
  });

  // KPI Calculations
  const totalCodesCount = codes.length;
  const unusedCodesCount = codes.filter((c) => c.displayStatus === "UNUSED").length;
  const usedCodesCount = codes.filter((c) => c.displayStatus === "USED").length;
  const expiredOrDisabledCodesCount = codes.filter(
    (c) => c.displayStatus === "EXPIRED" || c.displayStatus === "DISABLED"
  ).length;

  return (
    <div className="space-y-8 w-full max-w-full min-w-0 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <KeyRound className="size-7 text-[var(--surface-strong)]" />
            <span>Quản lý Mã kích hoạt</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tạo và quản lý mã kích hoạt cho một hoặc nhiều khóa học. Mỗi mã chỉ sử dụng một lần duy nhất.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReload}
            disabled={isLoading}
            className="rounded-xl border-slate-200 dark:border-slate-700 text-xs h-10 gap-1.5"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            <span>Làm mới</span>
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isLoading || Boolean(error) || courses.length === 0}
            className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white shadow-sm flex items-center gap-2 rounded-xl h-10 text-xs sm:text-sm font-semibold"
          >
            <Plus className="size-4" />
            <span>Tạo mã kích hoạt</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <ActivationCodesStats
        totalCodes={totalCodesCount}
        unusedCodes={unusedCodesCount}
        usedCodes={usedCodesCount}
        expiredOrDisabledCodes={expiredOrDisabledCodesCount}
      />

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        <div className="relative flex-1 w-full xl:max-w-md">
          <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Tìm theo mã, tên khóa hoặc người sử dụng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto flex-wrap justify-between xl:justify-end">
          {/* Course Filter */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none max-w-[200px] truncate"
          >
            <option value="ALL">Tất cả khóa học</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* 4 Status Tabs Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full">
            {([
              { label: "Tất cả", value: "ALL" },
              { label: "Chưa sử dụng", value: "UNUSED" },
              { label: "Đã sử dụng", value: "USED" },
              { label: "Hết hạn", value: "EXPIRED" },
              { label: "Đã vô hiệu", value: "DISABLED" },
            ] as const).map((tab) => (
              <button key={tab.value} onClick={() => setSelectedStatusFilter(tab.value)}
                className={cn("px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                  selectedStatusFilter === tab.value
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200")}
              >{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="py-20 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 text-[var(--surface-strong)] animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Đang tải danh sách mã kích hoạt...</p>
        </div>
      ) : error ? (
        <div className="py-16 rounded-2xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-3">
          <AlertCircle className="size-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReload}
            className="rounded-xl border-rose-200 text-xs"
          >
            Thử lại
          </Button>
        </div>
      ) : (
        /* Codes Table */
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden w-full max-w-full min-w-0">
          <ActivationCodesTable
            codes={filteredCodes}
            pendingCodeIds={pendingCodeIds}
            copiedCodeId={copiedCodeId}
            onCopyCode={handleCopyCode}
            onToggleStatus={handleToggleStatus}
            onDeleteCode={handleDeleteCode}
          />
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && <CreateActivationCodeModal
        isOpen={isCreateModalOpen}
        courses={courses}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreatedCodes}
      />}

      {/* Modal Xác nhận xóa mã kích hoạt */}
      {codeToDelete && (
        <div
          onClick={() => !isDeleting && setCodeToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 cursor-default animate-in zoom-in-95"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Xác nhận xóa mã
                </h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
              Bạn có chắc chắn muốn xóa mã{" "}
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {codeToDelete.code}
              </span>
              {" "}không?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setCodeToDelete(null)}
                className="rounded-xl text-xs h-9 px-4"
              >
                Hủy
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs h-9 px-4 flex items-center gap-1.5 shadow-sm"
              >
                {isDeleting && <Loader2 className="size-3.5 animate-spin" />}
                <span>{isDeleting ? "Đang xóa..." : "Xác nhận xóa"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
