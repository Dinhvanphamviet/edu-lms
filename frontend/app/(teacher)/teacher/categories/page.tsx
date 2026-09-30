"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FolderTree,
  Plus,
  Search,
  BookOpen,
  Edit3,
  Trash2,
  X,
  Layers,
  Sparkles,
  Tag,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getTeacherCategories,
  createTeacherCategory,
  updateTeacherCategory,
  deleteTeacherCategory,
  TeacherCategory,
} from "@/features/teacher/categories/api/teacher-categories.api";

// Map English types to Vietnamese display names
export function formatCategoryType(type: string | undefined | null): string {
  if (!type) return "";
  const trimmed = type.trim();
  const upper = trimmed.toUpperCase();
  const typeMap: Record<string, string> = {
    GRADE: "Khối lớp",
    GOAL: "Mục tiêu",
    SUBJECT: "Môn học",
    FORMAT: "Định dạng",
    TOPIC: "Chuyên đề",
    EXAM_PREP: "Kỳ thi",
  };
  return typeMap[upper] || trimmed;
}

// Preset suggestions for category types (Vietnamese)
const COMMON_TYPE_SUGGESTIONS = [
  "Khối lớp",
  "Mục tiêu",
  "Chuyên đề",
  "Kỳ thi",
  "Kỹ năng",
  "Bồi dưỡng HSG",
  "Ôn tập hè",
];

export default function TeacherCategoriesPage() {
  const [categories, setCategories] = useState<TeacherCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Create Modal & Form
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createType, setCreateType] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Edit Modal & Form
  const [editTarget, setEditTarget] = useState<TeacherCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<TeacherCategory | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories from API and normalize types to Vietnamese
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeacherCategories();
      const rawList = Array.isArray(data) ? data : [];
      const formatted = rawList.map((cat) => ({
        ...cat,
        type: formatCategoryType(cat.type),
      }));
      setCategories(formatted);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Không thể tải danh sách danh mục";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Distinct types list for filter tabs (normalized to Vietnamese)
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    categories.forEach((c) => {
      const formatted = formatCategoryType(c.type);
      if (formatted) {
        types.add(formatted);
      }
    });
    return Array.from(types).sort();
  }, [categories]);

  // Combined suggestions for datalist dropdown (strictly Vietnamese, no duplicates)
  const allSuggestions = useMemo(() => {
    const set = new Set<string>();
    COMMON_TYPE_SUGGESTIONS.forEach((s) => set.add(s));
    availableTypes.forEach((t) => {
      const formatted = formatCategoryType(t);
      if (formatted) set.add(formatted);
    });
    return Array.from(set);
  }, [availableTypes]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query) ||
        (cat.description && cat.description.toLowerCase().includes(query));

      const currentFormattedType = formatCategoryType(cat.type);
      const matchesType =
        selectedType === "ALL" ||
        currentFormattedType.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [categories, searchQuery, selectedType]);

  // KPI Calculations
  const totalCoursesInCategories = useMemo(() => {
    return categories.reduce((acc, c) => acc + (c.courses_count || 0), 0);
  }, [categories]);

  // Type Badge Color Helper (Avoiding purple per AG Kit rules)
  const getTypeBadgeClass = (type: string) => {
    const lower = (type || "").toLowerCase();
    if (lower.includes("lớp") || lower.includes("grade")) {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900";
    }
    if (lower.includes("tiêu") || lower.includes("goal")) {
      return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900";
    }
    if (
      lower.includes("thi") ||
      lower.includes("exam") ||
      lower.includes("hsg")
    ) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900";
    }
    if (
      lower.includes("đề") ||
      lower.includes("topic") ||
      lower.includes("chuyên")
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900";
    }
    if (lower.includes("năng") || lower.includes("skill")) {
      return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900";
    }
    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  // Open Edit Modal
  const openEditModal = (cat: TeacherCategory) => {
    setEditTarget(cat);
    setEditName(cat.name);
    setEditType(formatCategoryType(cat.type));
    setEditDescription(cat.description || "");
  };

  // Handle Create Submit
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setIsSubmittingCreate(true);
      const normalizedType = formatCategoryType(createType.trim()) || undefined;
      await createTeacherCategory({
        name: createName.trim(),
        type: normalizedType,
        description: createDescription.trim() || undefined,
      });

      toast.success("Đã tạo danh mục mới thành công!");
      setCreateName("");
      setCreateType("");
      setCreateDescription("");
      setIsCreateModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Tạo danh mục thất bại";
      toast.error(msg);
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Handle Edit Submit
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    if (!editName.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setIsSubmittingEdit(true);
      const normalizedType = formatCategoryType(editType.trim()) || undefined;
      await updateTeacherCategory(editTarget.id, {
        name: editName.trim(),
        type: normalizedType,
        description: editDescription.trim() || undefined,
      });

      toast.success("Cập nhật danh mục thành công!");
      setEditTarget(null);
      await fetchCategories();
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Cập nhật danh mục thất bại";
      toast.error(msg);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Handle Delete Submit
  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteTeacherCategory(deleteTarget.id);
      toast.success(`Đã xóa danh mục "${deleteTarget.name}"`);
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Xóa danh mục thất bại";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Quản lý Danh mục khóa học
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Phân loại khóa học theo khối lớp, kỳ thi trọng điểm và chuyên đề
            kiến thức chuyên sâu.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl shadow-xs flex items-center gap-2"
        >
          <Plus className="size-4" />
          <span>Thêm danh mục mới</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số danh mục
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <FolderTree className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {loading ? "..." : categories.length}
            </span>
            <span className="text-xs text-slate-400">danh mục</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Khóa học đã liên kết
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {loading ? "..." : totalCoursesInCategories}
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              lượt phân loại
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Số nhóm phân loại
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Layers className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {loading ? "..." : availableTypes.length}
            </span>
            <span className="text-xs text-slate-400">nhóm độc lập</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên danh mục, slug, mô tả..."
            className="pl-9 bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white"
          />
        </div>

        {/* Dynamic Filter Tabs (Option B: strictly Vietnamese) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedType("ALL")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
              selectedType === "ALL"
                ? "bg-[var(--surface-strong)] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            Tất cả ({categories.length})
          </button>

          {availableTypes.map((type) => {
            const count = categories.filter(
              (c) => formatCategoryType(c.type) === type,
            ).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5",
                  selectedType === type
                    ? "bg-[var(--surface-strong)] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <span>{type}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    selectedType === type
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Tên danh mục</th>
                <th className="py-3.5 px-4">Phân loại</th>
                <th className="py-3.5 px-4">Mô tả</th>
                <th className="py-3.5 px-4">Số khóa học</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[var(--surface-strong)]" />
                      <span className="text-xs">
                        Đang tải danh sách danh mục từ máy chủ...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-rose-500">
                      <AlertCircle className="size-6" />
                      <span className="text-sm font-medium">{error}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={fetchCategories}
                        className="rounded-xl text-xs"
                      >
                        Thử lại
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tag className="size-8 text-slate-300 dark:text-slate-700" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Không tìm thấy danh mục nào phù hợp
                      </p>
                      {searchQuery || selectedType !== "ALL" ? (
                        <p className="text-xs text-slate-400">
                          Thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc &quot;Tất
                          cả&quot;
                        </p>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-2 rounded-xl bg-[var(--surface-strong)] text-white text-xs"
                        >
                          Tạo danh mục đầu tiên
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        /{cat.slug}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {cat.type ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[11px] font-semibold",
                            getTypeBadgeClass(cat.type),
                          )}
                        >
                          {formatCategoryType(cat.type)}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Chưa phân loại
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {cat.description || (
                        <span className="italic text-slate-400">
                          Không có mô tả
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-slate-400" />
                        <span>{cat.courses_count || 0} khóa</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]">
                        Hoạt động
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditModal(cat)}
                          className="size-8 p-0 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Sửa danh mục"
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(cat)}
                          className="size-8 p-0 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm danh mục mới (Option B: Tự do nhập type + tiếng Việt chuẩn) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Thêm danh mục mới
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Ví dụ: Toán 12 - Luyện thi THPT Quốc Gia"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Loại danh mục (Type)
                  </label>
                </div>
                <Input
                  list="type-suggestions"
                  value={createType}
                  onChange={(e) => setCreateType(e.target.value)}
                  placeholder="Ví dụ: Khối lớp, Kỳ thi, Chuyên đề..."
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <datalist id="type-suggestions">
                  {allSuggestions.map((t, idx) => (
                    <option key={idx} value={t} />
                  ))}
                </datalist>

                {/* Quick suggestion chips (Strictly Vietnamese) */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_TYPE_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setCreateType(suggestion)}
                      className={cn(
                        "text-[11px] px-2 py-0.5 rounded-lg border transition-colors",
                        createType === suggestion
                          ? "bg-[var(--surface-strong)] text-white border-transparent"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700",
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Mô tả mục đích và đối tượng học sinh của danh mục..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isSubmittingCreate}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl"
                >
                  {isSubmittingCreate ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </span>
                  ) : (
                    "Lưu danh mục"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa danh mục (Option B: strictly Vietnamese) */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Chỉnh sửa danh mục
              </h2>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ví dụ: Toán 12 - Luyện thi THPT Quốc Gia"
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Loại danh mục (Type)
                  </label>
                </div>
                <Input
                  list="edit-type-suggestions"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  placeholder="Ví dụ: Khối lớp, Chuyên đề..."
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <datalist id="edit-type-suggestions">
                  {allSuggestions.map((t, idx) => (
                    <option key={idx} value={t} />
                  ))}
                </datalist>

                {/* Quick suggestion chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_TYPE_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setEditType(suggestion)}
                      className={cn(
                        "text-[11px] px-2 py-0.5 rounded-lg border transition-colors",
                        editType === suggestion
                          ? "bg-[var(--surface-strong)] text-white border-transparent"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700",
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Mô tả mục đích và đối tượng học sinh của danh mục..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTarget(null)}
                  disabled={isSubmittingEdit}
                  className="rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl"
                >
                  {isSubmittingEdit ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="size-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </span>
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Xóa danh mục
                </h3>
                <p className="text-xs text-slate-500">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Bạn có chắc chắn muốn xóa danh mục{" "}
              <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                &quot;{deleteTarget.name}&quot;
              </strong>
              ?
            </p>

            {deleteTarget.courses_count > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>
                  Danh mục này hiện đang có{" "}
                  <strong>{deleteTarget.courses_count}</strong> khóa học liên
                  kết. Việc xóa sẽ gỡ liên kết này khỏi các khóa học đó.
                </span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl text-xs"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isDeleting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </span>
                ) : (
                  "Xác nhận xóa"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
