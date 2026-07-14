"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, PlayCircle, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CurriculumChapter } from "@/features/course/api/course.api";

interface CourseDetailContentProps {
  description?: string;
  courseSlug: string;
  curriculum: CurriculumChapter[];
}

export function CourseDetailContent({ description, courseSlug, curriculum }: CourseDetailContentProps) {
  const [activeTab, setActiveTab] = useState("content");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    curriculum.length > 0 ? [curriculum[0].id] : []
  );

  const lowerQuery = searchQuery.trim().toLowerCase();

  const filteredCurriculum = curriculum.map(chapter => {
    const chapterMatch = chapter.title.toLowerCase().includes(lowerQuery);
    const filteredThemes = chapterMatch 
      ? chapter.themes 
      : chapter.themes.filter(theme => theme.title.toLowerCase().includes(lowerQuery));

    return {
      ...chapter,
      themes: filteredThemes
    };
  }).filter(chapter => chapter.themes.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Khối chính (Tabs + Content) */}
      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] overflow-hidden">
        {/* Tabs Header */}
        <div className="flex items-center border-b border-[var(--border-default)] bg-slate-50">
          <button
            onClick={() => setActiveTab("content")}
            className={cn(
              "px-6 py-4 text-base font-bold transition-colors relative",
              activeTab === "content"
                ? "text-surface-strong"
                : "text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]"
            )}
          >
            Nội dung
            {activeTab === "content" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-surface-strong" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("discussion")}
            className={cn(
              "px-6 py-4 text-base font-bold transition-colors relative",
              activeTab === "discussion"
                ? "text-surface-strong"
                : "text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]"
            )}
          >
            Bình luận
            {activeTab === "discussion" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-surface-strong" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("rating")}
            className={cn(
              "px-6 py-4 text-base font-bold transition-colors relative",
              activeTab === "rating"
                ? "text-surface-strong"
                : "text-[var(--text-primary)]/70 hover:text-[var(--text-primary)]"
            )}
          >
            Đánh giá
            {activeTab === "rating" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-surface-strong" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "content" && (
            <div className="flex flex-col gap-8">
              {/* Giới thiệu khóa học */}
              <div className="text-[var(--text-primary)]/80 leading-relaxed text-base prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2">
                {description ? (
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  <p className="text-surface-accent font-medium">(Đang cập nhật)</p>
                )}
              </div>

              {/* Danh sách bài học */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-[var(--surface-strong)]">Danh sách bài học</h2>

                {/* Search */}
                <div className="relative w-full">
                  <div className="relative flex items-center w-full h-12 rounded-full bg-[var(--surface-muted)] overflow-hidden border border-transparent focus-within:border-[var(--surface-strong)] transition-colors px-4">
                    <Search className="size-5 text-[var(--text-primary)]/40 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchQuery(val);
                        if (val.trim()) {
                          const lowerVal = val.trim().toLowerCase();
                          const matchedIds = curriculum
                            .filter(ch => 
                               ch.title.toLowerCase().includes(lowerVal) || 
                               ch.themes.some(t => t.title.toLowerCase().includes(lowerVal))
                            )
                            .map(ch => ch.id);
                          setExpandedChapters(matchedIds);
                        }
                      }}
                      placeholder="Tìm kiếm Đề thi - Bài học tại đây"
                      className="w-full h-full bg-transparent border-none outline-none text-base text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40 font-sans"
                    />
                  </div>
                </div>

                {/* Accordion Curriculum */}
                {filteredCurriculum.length === 0 ? (
                  <div className="py-8 text-center text-[var(--text-primary)]/60 text-sm font-medium border border-dashed border-[var(--border-default)] rounded-xl">
                    Không tìm thấy bài học nào phù hợp với "{searchQuery}"
                  </div>
                ) : (
                  <Accordion 
                    type="multiple" 
                    value={expandedChapters}
                    onValueChange={setExpandedChapters}
                    className="w-full flex flex-col gap-3 mt-2"
                  >
                    {filteredCurriculum.map((chapter) => (
                      <AccordionItem key={chapter.id} value={chapter.id} className="border border-[var(--border-default)] rounded-xl shadow-sm bg-white overflow-hidden px-0">
                        <AccordionTrigger className="px-5 py-4 hover:bg-[var(--surface-muted)] transition-colors hover:no-underline group">
                          <div className="flex flex-col items-start gap-1 text-left">
                            <span className="font-bold text-base text-[var(--text-primary)] group-hover:text-surface-strong transition-colors">{chapter.title}</span>
                            <span className="text-[13px] font-medium text-[var(--text-primary)]/60">{chapter.stats}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-0">
                          <div className="flex flex-col">
                            {chapter.themes.map((theme, idx) => (
                              <Link key={theme.id} href={`/courses/${courseSlug}/bai-giang/${theme.id}`} className="flex items-start px-5 py-4 border-t border-[var(--border-default)] hover:bg-slate-50 transition-colors cursor-pointer group relative !no-underline hover:!no-underline">
                                {/* Timeline Segment */}
                                <div className="absolute left-[33px] top-0 bottom-0 w-[2px] bg-surface-strong z-0" />
  
                                <div className="relative w-7 flex-shrink-0 flex justify-center mt-0.5 z-10">
                                  <div className="size-7 rounded-full bg-surface-strong text-white flex items-center justify-center text-sm font-bold z-10">
                                    {idx + 1}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1 ml-4 z-10 relative">
                                  <span className="font-medium text-sm text-[var(--text-primary)] group-hover:text-surface-strong transition-colors !no-underline">
                                    {theme.title}
                                  </span>
                                  <span className="text-xs font-medium text-[var(--text-primary)]/50 !no-underline mt-0.5">
                                    {theme.stats}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>
          )}

          {activeTab === "discussion" && (
            <div className="py-12 flex flex-col items-center justify-center text-[var(--text-primary)]/50">
              <span className="text-lg font-medium">Chưa có bình luận nào.</span>
            </div>
          )}

          {activeTab === "rating" && (
            <div className="py-12 flex flex-col items-center justify-center text-[var(--text-primary)]/50">
              <span className="text-lg font-medium">Chưa có đánh giá nào.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
