"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { LayoutList, Layers, Star, FileText } from "lucide-react";
import { RegisterModal } from "./RegisterModal";
import { ActivateCourseModal } from "./ActivateCourseModal";

interface CourseDetailSidebarProps {
  course: {
    title: string;
    price: number;
    originalPrice?: number;
    cover_image: string;
    stats?: {
      lessons: number;
      exams: number;
      documents: number;
    }
  }
}

export function CourseDetailSidebar({ course }: CourseDetailSidebarProps) {
  return (
    <div className="sticky top-[100px] flex flex-col gap-4">
      {/* Khối chứa thông tin giá và nút */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] overflow-hidden">
        {/* Course Thumbnail */}
        <div className="w-full aspect-[16/9] relative bg-[var(--surface-muted)]">
          <img
            src={course.cover_image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Price */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-surface-accent">
                {formatCurrency(course.price)}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-lg text-[var(--text-primary)]/50 line-through font-medium">
                  {formatCurrency(course.originalPrice)}
                </span>
              )}
            </div>
            {course.originalPrice && course.originalPrice > course.price && (
              <span className="text-sm font-semibold text-surface-strong bg-surface-strong/10 w-fit px-2 py-1 rounded-md mt-1">
                Giảm {Math.round((1 - course.price / course.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Call to action */}
          <div className="flex flex-col gap-3">
            <RegisterModal>
              <Button className="w-full h-12 bg-surface-strong hover:bg-cyan-700 text-white rounded-full font-bold text-base shadow-md uppercase">
                Đăng kí khóa học
              </Button>
            </RegisterModal>
            <ActivateCourseModal>
              <Button variant="outline" className="w-full h-12 border-surface-strong text-surface-strong hover:bg-surface-strong/5 rounded-full font-bold text-base">
                Kích hoạt khóa học
              </Button>
            </ActivateCourseModal>
          </div>

          <hr className="border-[var(--border-default)]" />

          {/* Quyền lợi khóa học */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base text-[var(--surface-strong)]">Khóa học bao gồm:</h3>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-primary)]/80">
              <li className="flex items-center gap-3">
                <LayoutList className="size-5 text-surface-strong" />
                <span><strong className="text-[var(--text-primary)]">{course.stats?.lessons ?? 0}</strong> Bài giảng chất lượng cao</span>
              </li>
              <li className="flex items-center gap-3">
                <Layers className="size-5 text-surface-strong" />
                <span><strong className="text-[var(--text-primary)]">{course.stats?.exams ?? 0}</strong> Bài thi & Luyện tập</span>
              </li>
              <li className="flex items-center gap-3">
                <FileText className="size-5 text-surface-strong" />
                <span><strong className="text-[var(--text-primary)]">{course.stats?.documents ?? 0}</strong> Tài liệu & PDF đi kèm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
