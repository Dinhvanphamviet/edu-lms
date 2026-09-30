"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CourseSettingsHeaderCard } from "./CourseSettingsHeaderCard";
import { CourseBasicInfoSection } from "./CourseBasicInfoSection";
import { CoursePricingSection } from "./CoursePricingSection";
import { CourseTagsSection } from "./CourseTagsSection";
import { CourseCoverSection } from "./CourseCoverSection";
import { CourseDescriptionSection } from "./CourseDescriptionSection";
import {
  getTeacherCourseDetail,
  updateTeacherCourseDetail,
  type TeacherCourseDetail,
} from "../../api/teacher-courses.api";
import { getCategories, type CourseCategory } from "@/features/course/api/course.api";

interface CourseSettingsManagerProps {
  courseId: string;
}

export function CourseSettingsManager({ courseId }: CourseSettingsManagerProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [course, setCourse] = useState<TeacherCourseDetail | null>(null);
  const [categories, setCategories] = useState<CourseCategory[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT" | "HIDDEN">("DRAFT");
  const [price, setPrice] = useState<number | "">("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [courseData, catList] = await Promise.all([
          getTeacherCourseDetail(courseId),
          getCategories().catch(() => []),
        ]);

        setCourse(courseData);
        setCategories(catList);

        setTitle(courseData.title || "");
        setCategoryId(courseData.category_id || "");
        setStatus(courseData.status || "DRAFT");
        setPrice(courseData.price >= 0 ? courseData.price : 0);
        setReleaseDate(courseData.release_date || "");
        setCoverImage(courseData.cover_image || "");
        setTags(courseData.tags || []);
        setDescription(courseData.description || "");
        setHasUnsavedChanges(false);
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.error || "Không thể tải thông tin khóa học.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [courseId]);

  const toggleTag = (tag: string) => {
    setHasUnsavedChanges(true);
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    try {
      setSaving(true);
      setErrorMessage("");

      const updated = await updateTeacherCourseDetail(courseId, {
        title: title.trim(),
        category_id: categoryId || undefined,
        status,
        price: typeof price === "number" ? price : 0,
        release_date: releaseDate || undefined,
        cover_image: coverImage.trim() || undefined,
        tags,
        description: description.trim() || undefined,
      });

      setCourse(updated);
      setHasUnsavedChanges(false);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || "Lưu thay đổi thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="size-8 animate-spin text-[var(--surface-strong)]" />
        <p className="text-xs font-medium">Đang tải thông tin cài đặt khóa học...</p>
      </div>
    );
  }

  if (!course && errorMessage) {
    return (
      <div className="w-full py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Lỗi tải dữ liệu</h2>
        <p className="text-xs text-slate-500">{errorMessage}</p>
        <Button onClick={() => router.push("/teacher/courses")} variant="outline" className="rounded-xl text-xs">
          Quay lại danh sách khóa học
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Top Header Card đồng bộ 100% với CurriculumHeaderCard */}
      <CourseSettingsHeaderCard
        courseId={courseId}
        courseTitle={title || course?.title || "Cài đặt khóa học"}
        courseSlug={course?.slug}
        courseStatus={status}
        hasUnsavedChanges={hasUnsavedChanges}
        saveSuccessNotice={saveSuccessNotice}
        isSaving={saving}
        onChangeCourseStatus={(newStatus) => {
          setStatus(newStatus);
          setHasUnsavedChanges(true);
        }}
        onSave={() => handleSave()}
      />

      {/* Main Form Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2-Column Responsive Layout matching Curriculum style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column (8 cols): Thông tin chung, mô tả, ảnh bìa */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Basic Information */}
            <CourseBasicInfoSection
              title={title}
              categoryId={categoryId}
              status={status}
              categories={categories}
              onTitleChange={(val) => {
                setTitle(val);
                setHasUnsavedChanges(true);
              }}
              onCategoryChange={(val) => {
                setCategoryId(val);
                setHasUnsavedChanges(true);
              }}
              onStatusChange={(val) => {
                setStatus(val);
                setHasUnsavedChanges(true);
              }}
            />

            {/* 2. Detailed Description */}
            <CourseDescriptionSection
              description={description}
              onDescriptionChange={(val) => {
                setDescription(val);
                setHasUnsavedChanges(true);
              }}
            />

            {/* 3. Cover Image (Cloudinary) */}
            <CourseCoverSection
              coverImage={coverImage}
              onCoverImageChange={(val) => {
                setCoverImage(val);
                setHasUnsavedChanges(true);
              }}
            />
          </div>

          {/* Sidebar Column (4 cols): Học phí, thời hạn, thẻ phân loại */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            {/* 4. Pricing & Release Date */}
            <CoursePricingSection
              price={price}
              releaseDate={releaseDate}
              onPriceChange={(val) => {
                setPrice(val);
                setHasUnsavedChanges(true);
              }}
              onReleaseDateChange={(val) => {
                setReleaseDate(val);
                setHasUnsavedChanges(true);
              }}
            />

            {/* 5. Classification Tags */}
            <CourseTagsSection
              tags={tags}
              onToggleTag={toggleTag}
            />

            {/* Quick Actions Card in Sidebar đồng bộ phong cách với nút Header */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Thao tác lưu trữ
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Các thay đổi về học phí, ảnh bìa và thông tin khóa học sẽ được cập nhật ngay lập tức trên hệ thống sau khi lưu.
              </p>
              <Button
                type="submit"
                disabled={saving}
                className={cn(
                  "w-full rounded-xl text-xs font-semibold py-2.5 gap-2 shadow-xs transition-all",
                  hasUnsavedChanges
                    ? "bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white animate-pulse"
                    : saveSuccessNotice
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800"
                )}
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : saveSuccessNotice ? (
                  <>
                    <Check className="size-4" />
                    <span>Đã lưu!</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span>{hasUnsavedChanges ? "Lưu thay đổi *" : "Đã lưu cài đặt"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
