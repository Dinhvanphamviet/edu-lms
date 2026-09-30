export type LessonType = "VIDEO" | "PDF" | "TEXT" | "QUIZ" | "LIVE";

export interface LessonItem {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes?: number;
  questionCount?: number;
  pageCount?: number;
  isFreePreview: boolean;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  sortOrder: number;
  videoObjectKey?: string;
  videoFileName?: string;
  videoFileSize?: string;
}

export interface ChapterItem {
  id: string;
  title: string;
  sortOrder: number;
  isExpanded: boolean;
  lessons: LessonItem[];
}
