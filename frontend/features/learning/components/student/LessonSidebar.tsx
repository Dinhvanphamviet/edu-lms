"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, FileText, Edit3 } from "lucide-react";
import { ViewModeToolbar } from "./ViewModeToolbar";
import { MOCK_COURSE_CURRICULUM, MOCK_COURSES } from "@/constants/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function LessonSidebar() {
  const params = useParams();
  const activeLessonId = params?.lessonId as string;
  const courseSlug = params?.slug as string;

  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* 2. Danh sách bài học (Curriculum) */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] p-4 flex flex-col gap-4">
        {/* View Modes */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-default)]">
          <span className="text-sm font-medium text-[var(--surface-strong)] whitespace-nowrap mr-2">Chế độ xem:</span>
          <ViewModeToolbar orientation="horizontal" />
        </div>

        {/* Search */}
        <div className="relative flex items-center w-full h-10 rounded-lg bg-[var(--surface-muted)] overflow-hidden border border-transparent focus-within:border-[var(--surface-strong)] transition-colors px-3">
          <Search className="size-4 text-[var(--text-primary)]/40 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm Đề thi - Bài học tại đây"
            className="w-full h-full bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40 font-sans"
          />
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible defaultValue="chap-1" className="w-full flex flex-col gap-2">
          {MOCK_COURSE_CURRICULUM.map((chapter) => (
            <AccordionItem key={chapter.id} value={chapter.id} className="border border-[var(--border-default)] rounded-xl bg-white overflow-hidden px-0">
              <AccordionTrigger className="px-4 py-3 hover:bg-[var(--surface-muted)] transition-colors hover:no-underline group">
                <div className="flex flex-col items-start gap-0.5 text-left pr-2">
                  <span className="font-bold text-base text-[var(--text-primary)] group-hover:text-surface-strong transition-colors">{chapter.title}</span>
                  <span className="text-[13px] font-medium text-[var(--text-primary)]/60">{chapter.stats}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-0">
                <div className="flex flex-col">
                  {chapter.themes.map((theme, idx) => {
                    const isActive = theme.id === activeLessonId;
                    return (
                      <Link href={`/courses/${courseSlug}/bai-giang/${theme.id}`} key={theme.id} className={cn(
                        "flex items-start px-4 py-3 border-t border-[var(--border-default)] transition-colors cursor-pointer group relative !no-underline hover:!no-underline",
                        isActive ? "bg-cyan-50" : "bg-white hover:bg-slate-50"
                      )}>
                        {/* Timeline Segment */}
                        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-surface-strong z-0" />
                        
                        <div className="relative w-6 flex-shrink-0 flex justify-center mt-0.5 z-10">
                          <div className={cn(
                            "size-6 rounded-full flex items-center justify-center text-xs font-bold z-10",
                            isActive ? "bg-surface-strong text-white" : "bg-surface-strong text-white"
                          )}>
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 ml-3 flex-1 z-10 relative">
                          <span className={cn("font-medium text-sm transition-colors !no-underline", isActive ? "text-surface-strong font-bold" : "text-[var(--text-primary)] group-hover:text-surface-strong")}>
                            {theme.title}
                          </span>
                          <span className="text-xs font-medium text-[var(--text-primary)]/50 !no-underline mt-0.5">
                            {theme.stats}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 3. Tiện ích */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] p-4 flex flex-col gap-4">
        <h3 className="font-bold text-[var(--surface-strong)]">Tiện ích</h3>
        <div className="flex flex-col gap-3 text-sm text-[var(--text-primary)]/80">
          <button className="flex items-center gap-3 hover:text-surface-strong transition-colors">
            <FileText className="size-5" />
            Tài liệu: <span className="font-bold text-surface-strong">{MOCK_COURSES[0].stats?.documents || 186}</span>
          </button>
          <button className="flex items-center gap-3 hover:text-surface-strong transition-colors">
            <Edit3 className="size-5" />
            Ghi chú: <span className="font-bold text-surface-strong">0</span>
          </button>
        </div>
      </div>
      
    </div>
  );
}


