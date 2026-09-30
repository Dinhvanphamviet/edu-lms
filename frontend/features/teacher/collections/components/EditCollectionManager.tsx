"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Save,
  Loader2,
  Search,
  Check,
  AlertCircle,
  Package,
  BookOpen,
  DollarSign,
  Eye,
  EyeOff,
  Users,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getTeacherCollectionById,
  updateTeacherCollection,
} from "../api/teacher-collections.api";
import { getTeacherCourses } from "@/features/teacher/courses/api/teacher-courses.api";
import type { TeacherCollection } from "../types";
import type { CourseItem } from "@/features/teacher/courses/types";

interface EditCollectionManagerProps {
  collectionId: string;
}

export function EditCollectionManager({
  collectionId,
}: EditCollectionManagerProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [collection, setCollection] = useState<TeacherCollection | null>(null);
  const [availableCourses, setAvailableCourses] = useState<CourseItem[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // Filter & Search
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilterTab, setCourseFilterTab] = useState<"ALL" | "SELECTED">(
    "ALL",
  );

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [colData, courseData] = await Promise.all([
          getTeacherCollectionById(collectionId),
          getTeacherCourses().catch(() => []),
        ]);

        if (!isMounted) return;

        setCollection(colData);
        setTitle(colData.title || "");
        setShortTitle(colData.short_title || "");
        setOriginalPrice(
          colData.original_price ? String(colData.original_price) : "",
        );
        setSalePrice(colData.sale_price ? String(colData.sale_price) : "");
        setIsActive(colData.is_active);
        setSelectedCourseIds(
          Array.isArray(colData.courses)
            ? colData.courses.map((c) => c.id)
            : [],
        );

        setAvailableCourses(Array.isArray(courseData) ? courseData : []);
      } catch (err: any) {
        if (!isMounted) return;
        const msg =
          err.response?.data?.error ||
          err.message ||
          "Không thể tải thông tin bộ sưu tập";
        setError(msg);
        toast.error(msg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [collectionId]);

  const toggleCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredCourses = useMemo(() => {
    return availableCourses.filter((course) => {
      const matchSearch =
        course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        (course.category &&
          course.category.toLowerCase().includes(courseSearch.toLowerCase()));
      if (courseFilterTab === "SELECTED") {
        return matchSearch && selectedCourseIds.includes(course.id);
      }
      return matchSearch;
    });
  }, [availableCourses, courseSearch, courseFilterTab, selectedCourseIds]);

  const discountPercent = useMemo(() => {
    const orig = Number(originalPrice);
    const sale = Number(salePrice);
    if (orig > 0 && sale > 0 && sale < orig) {
      return Math.round(((orig - sale) / orig) * 100);
    }
    return 0;
  }, [originalPrice, salePrice]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bộ sưu tập / lộ trình");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateTeacherCollection(collectionId, {
        title: title.trim(),
        short_title: shortTitle.trim() || undefined,
        original_price: Number(originalPrice) || 0,
        sale_price: Number(salePrice) || 0,
        is_active: isActive,
        course_ids: selectedCourseIds,
      });

      setCollection(updated);
      toast.success("Cập nhật bộ sưu tập thành công!");
      router.push("/teacher/collections");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Cập nhật bộ sưu tập thất bại";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="size-8 animate-spin text-[var(--surface-strong)]" />
        <span className="text-sm">Đang tải thông tin bộ sưu tập...</span>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-center flex flex-col items-center gap-3">
          <AlertCircle className="size-10 text-rose-500" />
          <p className="text-base font-semibold text-rose-700 dark:text-rose-300">
            {error || "Không tìm thấy thông tin bộ sưu tập"}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => router.push("/teacher/collections")}
              className="rounded-xl text-xs"
            >
              <ArrowLeft className="size-3.5 mr-1" />
              Quay lại danh sách
            </Button>
            <Button
              size="sm"
              onClick={() => window.location.reload()}
              className="rounded-xl text-xs bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white"
            >
              Tải lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Top Header Card matching CourseSettingsHeaderCard standard */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back button & Title & Status Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            title="Quay lại danh sách bộ sưu tập"
          >
            <Link href="/teacher/collections">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block" />

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {title || collection.title || "Chỉnh sửa Bộ sưu tập"}
              </h1>

              {/* Interactive Status Selector */}
              <div className="relative inline-flex items-center">
                <select
                  value={isActive ? "ACTIVE" : "DRAFT"}
                  onChange={(e) => setIsActive(e.target.value === "ACTIVE")}
                  className={cn(
                    "text-[11px] font-semibold rounded-lg px-2.5 py-1 border cursor-pointer appearance-none pr-6 focus:outline-none transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                  )}
                >
                  <option value="ACTIVE">Đang mở bán</option>
                  <option value="DRAFT">Bản nháp</option>
                </select>
                <div className="absolute right-2 pointer-events-none text-slate-400">
                  <ChevronDown className="size-3" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Cài đặt thông tin combo</span>
              <span>•</span>
              <span>Cấu hình học phí và danh sách khóa học</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 rounded-xl text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Link href="/teacher/collections">
              Hủy
            </Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={saving}
            className="h-9 rounded-xl text-xs font-semibold shadow-xs bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white transition-all flex items-center gap-1.5 px-3.5"
          >
            {saving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Form Content */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full"
      >
        {/* Left Column: General Info + Course Selection (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="size-4 text-[var(--surface-strong)]" />
              Thông tin chung
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tên bộ sưu tập / Lộ trình{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: LỘ TRÌNH LUYỆN THI 2027 DÀNH CHO 2009"
                  className="rounded-xl h-11 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tên ngắn (Mã Combo hiển thị trên thẻ)
                </label>
                <Input
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="Ví dụ: BON 12 XPS 2027"
                  className="rounded-xl h-10 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Courses in Combo */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="size-4 text-[var(--surface-strong)]" />
                  Khóa học trong Combo
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn các khóa học đơn lẻ để đưa vào gói combo trọn gói này
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 font-semibold text-xs border-[var(--surface-strong)]/30 text-[var(--surface-strong)] bg-teal-50 dark:bg-teal-950/30"
                >
                  <CheckCircle2 className="size-3.5 mr-1" />
                  Đã chọn: {selectedCourseIds.length} khóa
                </Badge>
              </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCourseFilterTab("ALL")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-colors",
                    courseFilterTab === "ALL"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
                  )}
                >
                  Tất cả ({availableCourses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCourseFilterTab("SELECTED")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-colors",
                    courseFilterTab === "SELECTED"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
                  )}
                >
                  Đã chọn ({selectedCourseIds.length})
                </button>
              </div>

              <div className="relative flex-1">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm khóa học theo tên hoặc khối lớp..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="pl-9 h-9 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Course List */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[420px] overflow-y-auto">
              {filteredCourses.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  {courseSearch
                    ? "Không tìm thấy khóa học nào phù hợp với từ khóa"
                    : courseFilterTab === "SELECTED"
                      ? "Chưa có khóa học nào được chọn cho combo này"
                      : "Chưa có dữ liệu khóa học"}
                </div>
              ) : (
                filteredCourses.map((course) => {
                  const isChecked = selectedCourseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={cn(
                        "p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs select-none",
                        isChecked
                          ? "bg-teal-50/50 dark:bg-teal-950/20"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "size-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                            isChecked
                              ? "bg-[var(--surface-strong)] border-[var(--surface-strong)] text-white"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800",
                          )}
                        >
                          {isChecked && (
                            <Check className="size-3.5 stroke-[3]" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={cn(
                              "font-medium line-clamp-1",
                              isChecked
                                ? "text-slate-900 dark:text-white font-semibold"
                                : "text-slate-700 dark:text-slate-300",
                            )}
                          >
                            {course.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            {course.lessonsCount ? (
                              <span>{course.lessonsCount} bài học</span>
                            ) : null}
                            {course.studentsCount ? (
                              <span>• {course.studentsCount} học viên</span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {course.category && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {course.category}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Status, & Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          {/* Card: Sales Status */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="size-4 text-[var(--surface-strong)]" />
              Trạng thái mở bán
            </h2>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={cn(
                  "p-3 rounded-xl border text-left flex items-start gap-3 transition-colors",
                  isActive
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 size-4 rounded-full border flex items-center justify-center shrink-0",
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 dark:border-slate-600",
                  )}
                >
                  {isActive && (
                    <div className="size-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Đang mở bán
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Học sinh có thể xem và đặt mua combo lộ trình này.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={cn(
                  "p-3 rounded-xl border text-left flex items-start gap-3 transition-colors",
                  !isActive
                    ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40",
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 size-4 rounded-full border flex items-center justify-center shrink-0",
                    !isActive
                      ? "border-amber-600 bg-amber-600 text-white"
                      : "border-slate-300 dark:border-slate-600",
                  )}
                >
                  {!isActive && (
                    <div className="size-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Bản nháp / Chưa mở bán
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Tạm ẩn khỏi trang học viên, chỉ giáo viên nhìn thấy.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Card: Pricing Setup */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="size-4 text-[var(--surface-strong)]" />
              Thiết lập Giá Combo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Giá ưu đãi Combo (VNĐ){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="1500000"
                  className="rounded-xl h-10 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 font-medium"
                />
                <p className="text-[11px] font-semibold text-[var(--surface-strong)] mt-1">
                  {salePrice && Number(salePrice) > 0
                    ? `${Number(salePrice).toLocaleString("vi-VN")} đ`
                    : "0 đ"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Giá niêm yết gốc (VNĐ)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="2000000"
                  className="rounded-xl h-10 text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {originalPrice && Number(originalPrice) > 0
                    ? `${Number(originalPrice).toLocaleString("vi-VN")} đ`
                    : "0 đ"}
                </p>
              </div>

              {discountPercent > 0 && (
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/50 flex items-center justify-between text-xs">
                  <span className="text-teal-800 dark:text-teal-200 font-medium">
                    Mức ưu đãi combo:
                  </span>
                  <Badge className="bg-teal-600 text-white font-bold">
                    Tiết kiệm {discountPercent}%
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Card: Stats Summary */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="size-4 text-[var(--surface-strong)]" />
              Thông số &amp; Thống kê
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Học sinh đã đăng ký:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {collection.total_students || 0} học sinh
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Số khóa học trong combo:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {selectedCourseIds.length} khóa
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Ngày tạo:</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {collection.created_at
                    ? new Date(collection.created_at).toLocaleDateString(
                        "vi-VN",
                      )
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
