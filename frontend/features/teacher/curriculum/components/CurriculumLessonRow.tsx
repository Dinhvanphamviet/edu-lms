import { GripVertical, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LessonItem, LessonType } from "../types";

interface CurriculumLessonRowProps {
  chapterId: string;
  lesson: LessonItem;
  typeInfo: { icon: React.ReactNode; label: string; badgeClass: string };
  isDragging: boolean;
  isDragOver: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onQuickChangeStatus: (chapterId: string, lessonId: string, status: "PUBLISHED" | "DRAFT" | "HIDDEN") => void;
  onEditLesson: (chapterId: string, lesson: LessonItem) => void;
  onDeleteLesson: (chapterId: string, lessonId: string) => void;
}

export function CurriculumLessonRow({
  chapterId,
  lesson,
  typeInfo,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onQuickChangeStatus,
  onEditLesson,
  onDeleteLesson,
}: CurriculumLessonRowProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "flex items-center justify-between p-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-all group select-none",
        isDragging && "opacity-40 bg-teal-50/50 scale-[0.99] border-dashed border-teal-300",
        isDragOver && "border-t-2 border-t-[var(--surface-strong)] bg-teal-50/20"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Drag Handle */}
        <div
          className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 hover:text-[var(--surface-strong)] p-1 -ml-1 rounded transition-colors"
          title="Kéo để sắp xếp vị trí bài học"
        >
          <GripVertical className="size-4" />
        </div>

        {/* Lesson Type Icon */}
        <div
          className={cn(
            "size-8 rounded-xl flex items-center justify-center shrink-0 border",
            typeInfo.badgeClass
          )}
        >
          {typeInfo.icon}
        </div>

        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
              {lesson.title}
            </span>
            {lesson.isFreePreview && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0 h-4">
                Học thử
              </Badge>
            )}
            {lesson.type === "VIDEO" && lesson.videoObjectKey && (
              <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] px-1.5 py-0 h-4 font-mono">
                R2 Storage
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>{typeInfo.label}</span>
            {lesson.durationMinutes && (
              <span>• {lesson.durationMinutes} phút</span>
            )}
            {lesson.videoObjectKey && (
              <span className="font-mono text-slate-400 truncate max-w-[200px]" title={lesson.videoObjectKey}>
                • {lesson.videoObjectKey}
              </span>
            )}
            {lesson.questionCount && (
              <span>• {lesson.questionCount} câu trắc nghiệm</span>
            )}
            {lesson.pageCount && (
              <span>• {lesson.pageCount} trang</span>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick status selector */}
        <select
          value={lesson.status || "PUBLISHED"}
          onChange={(e) =>
            onQuickChangeStatus(
              chapterId,
              lesson.id,
              e.target.value as "PUBLISHED" | "DRAFT" | "HIDDEN"
            )
          }
          className={`text-[11px] font-medium h-7 px-2 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
            lesson.status === "PUBLISHED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : lesson.status === "DRAFT"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
          title="Thay đổi nhanh trạng thái bài học"
        >
          <option value="PUBLISHED">🟢 Xuất bản</option>
          <option value="DRAFT">🟡 Bản nháp</option>
          <option value="HIDDEN">⚪ Đã ẩn</option>
        </select>

        {/* Edit Lesson */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEditLesson(chapterId, lesson)}
          className="h-7 w-7 p-0 text-slate-500 hover:text-slate-700 rounded-lg"
          title="Chỉnh sửa bài học"
        >
          <Edit3 className="size-3.5" />
        </Button>

        {/* Delete Lesson */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDeleteLesson(chapterId, lesson.id)}
          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
          title="Xóa bài học"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
