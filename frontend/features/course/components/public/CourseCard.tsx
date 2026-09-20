"use client";

import React, { useState } from "react";
import { Video, Radio, List, Globe, LayoutList, Layers, FileText, Loader2, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RegisterModal } from "./RegisterModal";
import { getCourseBySlug } from "../../api/course.api";

export interface CourseData {
  id: string;
  title: string;
  release_date: string;
  price: number;
  cover_image: string;
  tags?: string[];
  slug?: string;
  description?: string;
  stats?: {
    lessons: number;
    exams: number;
    documents: number;
  };
}

export interface EnrolledInfo {
  completedLessons: number;
  totalLessons: number;
}

export function CourseCard({ course, enrolledInfo }: { course: CourseData; enrolledInfo?: EnrolledInfo }) {
  // Format price to VND
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(course.price) + ' VNĐ';
  const courseUrl = `/courses/${course.slug}`;

  let formattedDate = course.release_date;
  try {
    if (course.release_date) {
      formattedDate = format(new Date(course.release_date), "dd/MM/yyyy");
    }
  } catch (error) {
    console.error("Invalid date format", course.release_date);
  }

  const [detailCourse, setDetailCourse] = useState<CourseData | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    if (open && !detailCourse && course.slug && !enrolledInfo) {
      setLoadingDetails(true);
      try {
        const data = await getCourseBySlug(course.slug);
        setDetailCourse(data);
      } catch (error) {
        console.error("Failed to load course details", error);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border-default)] hover:shadow-md transition-shadow flex flex-col h-full group relative">
      <Link href={courseUrl} className="absolute inset-0 z-0" aria-label={`Xem chi tiết khóa học ${course.title}`} />

      {/* Cover Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 rounded-t-2xl pointer-events-none">
        <img
          src={course.cover_image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Overlay - Only for public view, not enrolled */}
        {!enrolledInfo && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 px-4 pointer-events-none">
            <Dialog onOpenChange={handleOpenChange}>
              <DialogTrigger className="flex-1 py-2 px-1 text-center border-2 border-white text-white font-medium text-[13px] md:text-sm rounded-lg hover:bg-white/20 transition-colors whitespace-nowrap pointer-events-auto">
                Xem nhanh
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[800px] sm:max-w-[800px] md:max-w-[800px] p-0 overflow-hidden border-none rounded-2xl bg-white">
                <div className="flex flex-col p-6 md:p-8">
                  {/* Top Section: Small Image + Title/Stats */}
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-[240px] shrink-0 rounded-xl overflow-hidden shadow-sm aspect-[4/3] bg-slate-100">
                      <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Title and Stats */}
                    <div className="flex flex-col flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-[var(--surface-strong)] leading-tight mb-2">
                        {course.title}
                      </h2>
                      <div className="text-surface-strong font-bold text-xl mb-4">
                        {formattedPrice}
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[var(--text-primary)]">
                          <LayoutList className="w-5 h-5 text-surface-strong" />
                          <span className="text-[14px]">
                            <strong className="font-bold">{(detailCourse ?? course).stats?.lessons ?? 0}</strong> Bài giảng chất lượng cao
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-primary)]">
                          <Layers className="w-5 h-5 text-surface-strong" />
                          <span className="text-[14px]">
                            <strong className="font-bold">{(detailCourse ?? course).stats?.exams ?? 0}</strong> Bài thi & Luyện tập
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-primary)]">
                          <FileText className="w-5 h-5 text-surface-strong" />
                          <span className="text-[14px]">
                            <strong className="font-bold">{(detailCourse ?? course).stats?.documents ?? 0}</strong> Tài liệu & PDF đi kèm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Description */}
                  <div className="border-t border-dashed border-gray-300 pt-5 mb-6">
                    <h3 className="font-bold text-surface-strong mb-2 text-lg">Mô tả khoá học</h3>
                    {loadingDetails ? (
                      <div className="flex items-center gap-2 text-sm text-[var(--text-primary)]/60">
                        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải thông tin...
                      </div>
                    ) : detailCourse?.description ? (
                      <div
                        className="text-[14px] text-[var(--text-primary)]/80 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: detailCourse.description }}
                      />
                    ) : (
                      <p className="text-[14px] text-[var(--text-primary)]/80 leading-relaxed">
                        Chưa có mô tả chi tiết cho khóa học này.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-auto">
                    <Button variant="outline" className="flex-1 h-12 rounded-full border-surface-accent text-surface-accent hover:bg-surface-accent/5 font-bold text-sm" asChild>
                      <Link href={courseUrl}>
                        Xem chi tiết
                      </Link>
                    </Button>
                    <Button
                      className="flex-1 h-12 rounded-full bg-surface-accent hover:bg-surface-accent-hover text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                      onClick={() => {
                        const { addItem } = useCart.getState();
                        const added = addItem({
                          id: course.id,
                          title: course.title,
                          slug: course.slug || course.id,
                          price: course.price,
                          cover_image: course.cover_image,
                        });
                        if (added) toast.success("Đã thêm vào giỏ hàng");
                        else toast.info("Khóa học đã có trong giỏ hàng");
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <button
              className="flex-1 py-2 px-1 bg-amber-500 border-2 border-transparent text-white font-medium text-[13px] md:text-sm rounded-lg hover:bg-amber-500/90 transition-colors shadow-sm whitespace-nowrap pointer-events-auto flex items-center justify-center gap-1.5"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const { addItem } = useCart.getState();
                const added = addItem({
                  id: course.id,
                  title: course.title,
                  slug: course.slug || course.id,
                  price: course.price,
                  cover_image: course.cover_image,
                });
                if (added) toast.success("Đã thêm vào giỏ hàng");
                else toast.info("Khóa học đã có trong giỏ hàng");
              }}
            >
              <ShoppingCart className="size-3.5" />
              Thêm giỏ hàng
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 bg-white relative z-10 pointer-events-none justify-between">
        <div>
          <h3 className="font-bold text-sm text-[var(--text-primary)] line-clamp-2 leading-snug mb-3">
            {course.title}
          </h3>

          {enrolledInfo && (
            <div className="text-[13px] font-medium text-[var(--text-primary)]/70 mb-2">
              Đã hoàn thành {enrolledInfo.completedLessons}/{enrolledInfo.totalLessons} bài
            </div>
          )}

          {!enrolledInfo && (
            <div className="mb-2">
              <span className="inline-block text-[13px] text-[var(--surface-strong)] font-medium bg-[var(--surface-strong)]/10 px-2 py-1 rounded">
                Phát hành: {formattedDate}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between">
            {enrolledInfo ? (
              <span className="inline-block text-[11px] text-[var(--surface-strong)] font-semibold bg-teal-50 px-2.5 py-1 rounded-md">
                Phát hành: {formattedDate}
              </span>
            ) : <div />}

            <div className="flex justify-end gap-1.5">
              {course.tags?.includes("Video") && (
                <span className="inline-flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-1 bg-[var(--surface-strong)] text-white rounded-md uppercase">
                  <Video className="w-3 h-3" /> Video
                </span>
              )}
              {course.tags?.includes("Livestream") && (
                <span className="inline-flex items-center justify-center gap-1 text-[10px] font-bold px-2 py-1 bg-pink-500 text-white rounded-md uppercase">
                  <Radio className="w-3 h-3" /> Livestream
                </span>
              )}
            </div>
          </div>

          {enrolledInfo ? (
            <div className="w-full flex items-center gap-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex-1">
                <div 
                  className="h-full bg-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (enrolledInfo.completedLessons / Math.max(1, enrolledInfo.totalLessons)) * 100)}%` }}
                />
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-orange-400 shrink-0">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
          ) : (
            <div className="border-t border-dashed border-gray-200 pt-3 text-right">
              <span className="text-lg font-bold text-blue-500">
                {formattedPrice}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
