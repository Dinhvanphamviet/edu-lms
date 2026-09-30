"use client";

import { useState } from "react";
import { Boxes, X, Search, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createTeacherCollection } from "../api/teacher-collections.api";
import type { CourseItem } from "@/features/teacher/courses/types";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  availableCourses: CourseItem[];
}

export function CreateCollectionModal({
  isOpen,
  onClose,
  onCreated,
  availableCourses,
}: CreateCollectionModalProps) {
  const [title, setTitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bộ sưu tập");
      return;
    }

    try {
      setIsSubmitting(true);
      await createTeacherCollection({
        title: title.trim(),
        short_title: shortTitle.trim() || undefined,
        original_price: Number(originalPrice) || 0,
        sale_price: Number(salePrice) || 0,
        is_active: isActive,
        course_ids: selectedCourseIds,
      });

      toast.success("Tạo bộ sưu tập mới thành công!");
      onCreated();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Tạo bộ sưu tập thất bại";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[var(--surface-strong)]">
              <Boxes className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Tạo bộ sưu tập / Lộ trình mới
              </h2>
              <p className="text-xs text-slate-500">
                Gói các khóa học lại thành một Combo ưu đãi hoàn chỉnh
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto space-y-5 flex-1 pr-4">
            {/* 1. Tên Combo & Tên ngắn */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tên bộ sưu tập / Lộ trình{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Combo Toàn Diện Toán 12"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tên ngắn (Mã Combo)
                </label>
                <Input
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="Ví dụ: BON 12 XPS"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* 2. Giá Combo & Giá gốc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Giá ưu đãi Combo (VNĐ){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="10000"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Ví dụ: 1200000"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                {Number(salePrice) > 0 && (
                  <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-1 block">
                    {Number(salePrice).toLocaleString("vi-VN")} đ
                  </span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Giá niêm yết gốc (VNĐ)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="10000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Ví dụ: 1600000"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
                {Number(originalPrice) > 0 && (
                  <span className="text-[11px] font-medium text-slate-400 mt-1 block">
                    {Number(originalPrice).toLocaleString("vi-VN")} đ
                  </span>
                )}
              </div>
            </div>

            {/* 3. Trạng thái */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Trạng thái mở bán
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="newIsActive"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="accent-[var(--surface-strong)]"
                  />
                  <span>🟢 Đang mở bán ngay</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="newIsActive"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="accent-[var(--surface-strong)]"
                  />
                  <span>🟡 Bản nháp</span>
                </label>
              </div>
            </div>

            {/* 4. Chọn các khóa học đưa vào Combo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Chọn khóa học trong Combo ({selectedCourseIds.length} khóa đã
                  chọn)
                </label>
              </div>

              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Tìm khóa học để thêm..."
                  className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/40 dark:bg-slate-900">
                {availableCourses.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Chưa có khóa học nào trong hệ thống.
                  </div>
                ) : (
                  availableCourses
                    .filter(
                      (c) =>
                        !courseSearch.trim() ||
                        c.title
                          .toLowerCase()
                          .includes(courseSearch.toLowerCase().trim()),
                    )
                    .map((course) => {
                      const isSelected = selectedCourseIds.includes(course.id);
                      return (
                        <div
                          key={course.id}
                          onClick={() => toggleCourse(course.id)}
                          className={cn(
                            "p-2.5 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
                            isSelected && "bg-teal-50/50 dark:bg-teal-950/20",
                          )}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div
                              className={cn(
                                "size-4 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                                isSelected
                                  ? "bg-[var(--surface-strong)] border-[var(--surface-strong)] text-white"
                                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800",
                              )}
                            >
                              {isSelected && (
                                <Check className="size-3 stroke-[3]" />
                              )}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {course.title}
                            </span>
                          </div>

                          {course.category && (
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              {course.category}
                            </Badge>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-white dark:bg-slate-900">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs px-4"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl text-xs font-semibold px-5 shadow-xs"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Đang tạo...</span>
                </span>
              ) : (
                "Tạo bộ sưu tập"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
