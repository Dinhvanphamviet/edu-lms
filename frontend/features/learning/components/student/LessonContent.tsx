"use client";

import { Download, Clock } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useLessonLayout } from "./LessonLayoutContext";
import { cn } from "@/lib/utils";

export function LessonContent() {
  const { layoutMode } = useLessonLayout();
  const isFullscreen = layoutMode === "fullscreen";

  return (
    <div className={cn(
      "flex flex-col bg-white overflow-hidden",
      isFullscreen ? "fixed inset-0 z-[40]" : "rounded-xl shadow-sm border border-[var(--border-default)]"
    )}>
        {/* Header Title & Views */}
        {!isFullscreen && (
          <div className="flex flex-wrap gap-3 justify-between items-start md:items-center p-6 pb-4">
          <h1 className="text-lg md:text-xl font-bold text-[var(--surface-strong)] leading-tight">
            Theme 1. Các quy tắc tính đạo hàm
          </h1>
          <div className="flex items-center gap-1.5 text-xs font-medium text-surface-strong bg-surface-strong/10 px-2.5 py-1 rounded-full flex-shrink-0">
            <Clock className="size-3.5" />
            Còn 20/21 lượt xem
          </div>
        </div>
        )}

        {/* Video Player */}
        <div className={cn("w-full bg-black flex-shrink-0 flex items-center justify-center", isFullscreen ? "h-screen" : "aspect-[16/9]")}>
          <video 
            className={cn("w-full h-full", isFullscreen ? "object-contain" : "object-cover")}
            controls 
            poster="https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=1200&auto=format&fit=crop"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ xem video.
          </video>
        </div>

        {/* Đề thi & Tài liệu */}
        {!isFullscreen && (
        <div className="flex flex-col gap-6 p-6">
          {/* Đề thi */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg text-[var(--surface-strong)]">Đề thi [BTTL - BTVN]</h3>
            <div className="flex flex-col gap-2">
              <Link href="#" className="flex items-center gap-2 text-surface-strong hover:underline font-medium p-3 bg-white rounded-lg border border-[var(--border-default)] shadow-sm">
                <Clock className="size-5" />
                Nền tảng Theme 1 - STEP 1 - BON 12
              </Link>
            </div>
          </div>

          {/* Tài liệu */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg text-[var(--surface-strong)]">Tài liệu đi kèm buổi học</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--border-default)] shadow-sm group hover:border-surface-strong/50 transition-colors">
                <span className="text-surface-strong font-medium group-hover:underline">[Tài liệu bản ghi chép] BON2026-Nền tảng-Theme 1.pdf</span>
                <Download className="size-5 text-[var(--text-primary)]/40 group-hover:text-surface-strong transition-colors" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--border-default)] shadow-sm group hover:border-surface-strong/50 transition-colors">
                <span className="text-surface-strong font-medium group-hover:underline">[Handout chi tiết] BON2026-Nền tảng-Theme 1.pdf</span>
                <Download className="size-5 text-[var(--text-primary)]/40 group-hover:text-surface-strong transition-colors" />
              </a>
              <a href="#" className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--border-default)] shadow-sm group hover:border-surface-strong/50 transition-colors">
                <span className="text-surface-strong font-medium group-hover:underline">[Tài liệu buổi học] BON2027-Nền tảng-Theme 1.pdf</span>
                <Download className="size-5 text-[var(--text-primary)]/40 group-hover:text-surface-strong transition-colors" />
              </a>
            </div>
          </div>
        </div>
        )}

    </div>
  );
}
