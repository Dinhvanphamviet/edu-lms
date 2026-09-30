"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  ChevronDown,
  Image as ImageIcon,
  Calendar,
  Tag,
  DollarSign,
  Clock,
  FileText,
  UploadCloud,
  Loader2,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getCategories,
  type CourseCategory,
} from "@/features/course/api/course.api";
import { uploadImageToCloudinary } from "../api/cloudinary.api";
import type { CreateCoursePayload } from "../api/teacher-courses.api";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCourse: (payload: CreateCoursePayload) => void;
}

const AVAILABLE_TAGS = ["Video", "Livestream", "Tài liệu"];

export function CreateCourseModal({
  isOpen,
  onClose,
  onCreateCourse,
}: CreateCourseModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT" | "HIDDEN">(
    "PUBLISHED",
  );
  const [price, setPrice] = useState<number | "">("");
  const [releaseDate, setReleaseDate] = useState(today);
  const [coverImage, setCoverImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Video"]);
  const [description, setDescription] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);

  const [categories, setCategories] = useState<CourseCategory[]>([]);

  useEffect(() => {
    if (isOpen) {
      getCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Dung lượng ảnh không được vượt quá 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");
      const result = await uploadImageToCloudinary(file);
      setCoverImage(result.url);
    } catch (err: any) {
      setUploadError(
        err?.message ||
          "Tải ảnh lên Cloudinary thất bại. Hãy kiểm tra Upload Preset.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateCourse({
      title: title.trim(),
      category_id: selectedCategoryId || undefined,
      status,
      price: typeof price === "number" ? price : 0,
      release_date: releaseDate || today,
      cover_image: coverImage.trim() || undefined,
      tags: selectedTags,
      description: description.trim() || undefined,
    });

    // Reset Form
    setTitle("");
    setSelectedCategoryId("");
    setStatus("PUBLISHED");
    setPrice("");
    setReleaseDate(today);
    setCoverImage("");
    setSelectedTags(["Video"]);
    setDescription("");
    setUploadError("");
    setShowManualUrl(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Fixed Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-[var(--surface-strong)]">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Tạo khóa học mới
              </h2>
              <p className="text-xs text-slate-500">
                Nhập đầy đủ thông tin để học sinh có thể xem và đăng ký
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

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto space-y-5 flex-1 pr-4">
            {/* 1. Tên khóa học */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Tên khóa học *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: STEP 1 2027 | Nền tảng Toán 12..."
                className="bg-slate-50 border-slate-200 rounded-xl text-sm"
              />
            </div>

            {/* 2. Danh mục & Trạng thái hiển thị */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Danh mục khóa học
                </label>
                <div className="relative">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] appearance-none cursor-pointer"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Trạng thái hiển thị
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] appearance-none cursor-pointer"
                  >
                    <option value="PUBLISHED">🟢 Đang xuất bản</option>
                    <option value="DRAFT">🟡 Bản nháp</option>
                    <option value="HIDDEN">⚪ Đã ẩn</option>
                  </select>
                  <ChevronDown className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 3. Học phí & Thời hạn & Ngày phát hành */}
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                  <DollarSign className="size-3.5 text-slate-400" />
                  <span>Học phí (VNĐ)</span>
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="10000"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="Ví dụ: 1200000 (0 = Miễn phí)"
                    className="bg-white dark:bg-slate-900 border-slate-200 rounded-xl text-sm pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    VNĐ
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 mt-1 block">
                  {typeof price === "number" && price > 0
                    ? `${price.toLocaleString("vi-VN")} đ`
                    : "Khóa học miễn phí (0 đ)"}
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                  <Calendar className="size-3.5 text-slate-400" />
                  <span>Ngày phát hành / Khai giảng</span>
                </label>
                <Input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-slate-200 rounded-xl text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Thời hạn học được quản lý theo kỳ kích hoạt/thanh toán của học
                  viên
                </span>
              </div>
            </div>

            {/* 4. Thẻ phân loại (Tags) */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <Tag className="size-3.5 text-slate-400" />
                <span>Thẻ phân loại (Tags)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                        active
                          ? "bg-[var(--surface-strong)] text-white border-[var(--surface-strong)]"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {active ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Ảnh bìa khóa học - Upload Cloudinary trực tiếp */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <ImageIcon className="size-3.5 text-slate-400" />
                  <span>Ảnh bìa khóa học</span>
                </label>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {coverImage ? (
                /* Đã có ảnh bìa */
                <div className="space-y-2">
                  <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 group shadow-xs">
                    <img
                      src={coverImage}
                      alt="Ảnh bìa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-xs rounded-lg bg-white/90 text-slate-800 gap-1"
                      >
                        <RefreshCw className="size-3" />
                        <span>Đổi ảnh</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={isUploading}
                        onClick={() => setCoverImage("")}
                        className="h-7 text-xs rounded-lg gap-1"
                      >
                        <Trash2 className="size-3" />
                        <span>Xóa</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chưa có ảnh: Khung bấm tải ảnh lên Cloudinary */
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isUploading
                      ? "border-[var(--surface-strong)] bg-teal-50/30 cursor-wait"
                      : "border-slate-200 hover:border-[var(--surface-strong)] bg-slate-50/50 hover:bg-white"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Loader2 className="size-6 text-[var(--surface-strong)] animate-spin" />
                      <p className="text-xs font-semibold text-slate-700">
                        Đang tải ảnh lên Cloudinary...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="size-10 rounded-xl bg-teal-50 text-[var(--surface-strong)] flex items-center justify-center mb-2">
                        <UploadCloud className="size-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        Bấm để chọn file ảnh tải lên Cloudinary
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP (Tối đa 10MB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {uploadError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] flex items-center gap-2">
                  <AlertCircle className="size-3.5 shrink-0 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 6. Mô tả */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <FileText className="size-3.5 text-slate-400" />
                <span>Mô tả khóa học</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập tóm tắt nội dung, mục tiêu khóa học..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--surface-strong)] resize-none"
              />
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-white dark:bg-slate-900">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs px-4"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isUploading}
              className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl text-xs font-semibold px-5 shadow-xs"
            >
              Tạo khóa học ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
