import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChapterItem, LessonItem, LessonType } from "../types";
import { CurriculumLessonRow } from "./CurriculumLessonRow";

interface CurriculumChapterCardProps {
  chapter: ChapterItem;
  index: number;
  draggedChapterIndex: number | null;
  dragOverChapterIndex: number | null;
  draggedLesson: { chapterId: string; lessonId: string } | null;
  dragOverLesson: { chapterId: string; lessonId: string } | null;
  getTypeInfo: (type: LessonType) => { icon: React.ReactNode; label: string; badgeClass: string };
  onChapterDragStart: (e: React.DragEvent, index: number) => void;
  onChapterDragOver: (e: React.DragEvent, index: number) => void;
  onChapterDragLeave: () => void;
  onChapterDrop: (e: React.DragEvent, index: number) => void;
  onLessonDragStart: (e: React.DragEvent, chapterId: string, lessonId: string) => void;
  onLessonDragOver: (e: React.DragEvent, chapterId: string, lessonId: string) => void;
  onLessonDragLeave: () => void;
  onLessonDrop: (e: React.DragEvent, chapterId: string, targetLessonId: string) => void;
  onToggleExpand: (chapterId: string) => void;
  onEditChapter: (chapter: ChapterItem) => void;
  onDeleteChapter: (chapterId: string) => void;
  onOpenAddLesson: (chapterId: string) => void;
  onEditLesson: (chapterId: string, lesson: LessonItem) => void;
  onDeleteLesson: (chapterId: string, lessonId: string) => void;
  onQuickChangeLessonStatus: (chapterId: string, lessonId: string, status: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
}

export function CurriculumChapterCard({
  chapter,
  index,
  draggedChapterIndex,
  dragOverChapterIndex,
  draggedLesson,
  dragOverLesson,
  getTypeInfo,
  onChapterDragStart,
  onChapterDragOver,
  onChapterDragLeave,
  onChapterDrop,
  onLessonDragStart,
  onLessonDragOver,
  onLessonDragLeave,
  onLessonDrop,
  onToggleExpand,
  onEditChapter,
  onDeleteChapter,
  onOpenAddLesson,
  onEditLesson,
  onDeleteLesson,
  onQuickChangeLessonStatus,
}: CurriculumChapterCardProps) {
  const isDraggingThisChapter = draggedChapterIndex === index;
  const isDragOverThisChapter = dragOverChapterIndex === index;

  return (
    <div
      draggable
      onDragStart={(e) => onChapterDragStart(e, index)}
      onDragOver={(e) => onChapterDragOver(e, index)}
      onDragLeave={onChapterDragLeave}
      onDrop={(e) => onChapterDrop(e, index)}
      className={cn(
        "rounded-2xl border bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all duration-200",
        isDraggingThisChapter
          ? "opacity-40 border-dashed border-[var(--surface-strong)] bg-slate-50 scale-[0.99]"
          : "border-slate-200/80 dark:border-slate-800",
        isDragOverThisChapter && !isDraggingThisChapter
          ? "border-2 border-[var(--surface-strong)] shadow-md"
          : ""
      )}
    >
      {/* Chapter Top Bar */}
      <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Chapter Drag Handle */}
          <div
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-[var(--surface-strong)] p-1 rounded transition-colors"
            title="Kéo thả để đổi thứ tự chương"
          >
            <GripVertical className="size-4.5" />
          </div>

          {/* Toggle Expand */}
          <button
            type="button"
            onClick={() => onToggleExpand(chapter.id)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            {chapter.isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>

          {/* Chapter Title & Stats */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                {chapter.title}
              </span>
              <Badge
                variant="secondary"
                className="text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700"
              >
                {chapter.lessons.length} bài
              </Badge>
            </div>
          </div>
        </div>

        {/* Chapter Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Add Lesson */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenAddLesson(chapter.id)}
            className="h-8 px-2 text-xs font-semibold text-[var(--surface-strong)] hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-xl"
          >
            <Plus className="size-3.5 mr-1" />
            <span>Thêm bài</span>
          </Button>

          {/* Edit Chapter */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEditChapter(chapter)}
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 rounded-xl"
            title="Đổi tên chương"
          >
            <Edit3 className="size-3.5" />
          </Button>

          {/* Delete Chapter */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDeleteChapter(chapter.id)}
            className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
            title="Xóa chương"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Chapter Lessons List */}
      {chapter.isExpanded && (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
          {chapter.lessons.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/20">
              <FileText className="size-8 mx-auto text-slate-300 stroke-1" />
              <p className="text-xs text-slate-400 mt-2">
                Chưa có bài học nào trong chương này
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenAddLesson(chapter.id)}
                className="mt-3 text-xs rounded-xl"
              >
                <Plus className="size-3 mr-1" />
                <span>Thêm bài đầu tiên</span>
              </Button>
            </div>
          ) : (
            chapter.lessons.map((lesson) => {
              const typeInfo = getTypeInfo(lesson.type);
              const isDragging =
                draggedLesson?.chapterId === chapter.id &&
                draggedLesson?.lessonId === lesson.id;
              const isDragOver =
                dragOverLesson?.chapterId === chapter.id &&
                dragOverLesson?.lessonId === lesson.id;

              return (
                <CurriculumLessonRow
                  key={lesson.id}
                  chapterId={chapter.id}
                  lesson={lesson}
                  typeInfo={typeInfo}
                  isDragging={isDragging}
                  isDragOver={isDragOver}
                  onDragStart={(e) => onLessonDragStart(e, chapter.id, lesson.id)}
                  onDragOver={(e) => onLessonDragOver(e, chapter.id, lesson.id)}
                  onDragLeave={onLessonDragLeave}
                  onDrop={(e) => onLessonDrop(e, chapter.id, lesson.id)}
                  onQuickChangeStatus={onQuickChangeLessonStatus}
                  onEditLesson={onEditLesson}
                  onDeleteLesson={onDeleteLesson}
                />
              );
            })
          )}

          {/* Add Lesson Button at Bottom of Chapter */}
          <div className="p-2 bg-slate-50/40 dark:bg-slate-800/20 text-center">
            <button
              type="button"
              onClick={() => onOpenAddLesson(chapter.id)}
              className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-[var(--surface-strong)] hover:text-[var(--surface-strong)] rounded-xl text-xs font-semibold text-slate-500 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="size-3.5" />
              <span>Thêm bài học mới vào chương này</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
