"use client";

import { useState } from "react";
import { Video, FileText, HelpCircle, Radio, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChapterItem, LessonItem, LessonType } from "../types";
import { CurriculumHeaderCard } from "./CurriculumHeaderCard";
import { CurriculumChapterCard } from "./CurriculumChapterCard";
import { ChapterModal } from "./ChapterModal";
import { LessonModal } from "./LessonModal";

const initialChaptersData: ChapterItem[] = [
  {
    id: "ch-01",
    title: "Chương 1: Ứng dụng đạo hàm khảo sát tính đơn điệu & cực trị hàm số",
    sortOrder: 1,
    isExpanded: true,
    lessons: [
      {
        id: "les-101",
        title: "Lý thuyết & Kỹ thuật xét dấu đạo hàm hàm hợp f'(u(x))",
        type: "VIDEO",
        durationMinutes: 45,
        isFreePreview: true,
        status: "PUBLISHED",
        sortOrder: 1,
      },
      {
        id: "les-102",
        title: "Bài tập rèn luyện: 50 câu cực trị hàm chứa dấu giá trị tuyệt đối",
        type: "PDF",
        pageCount: 16,
        isFreePreview: true,
        status: "PUBLISHED",
        sortOrder: 2,
      },
      {
        id: "les-103",
        title: "Đề kiểm tra nhanh: Đơn điệu hàm số vận dụng cao (Mục tiêu 9+)",
        type: "QUIZ",
        questionCount: 25,
        isFreePreview: false,
        status: "PUBLISHED",
        sortOrder: 3,
      },
      {
        id: "les-104",
        title: "Kỹ thuật giải nhanh cực trị bậc 3 bằng bấm máy tính Casio 580FX",
        type: "VIDEO",
        durationMinutes: 38,
        isFreePreview: false,
        status: "PUBLISHED",
        sortOrder: 4,
      },
    ],
  },
  {
    id: "ch-02",
    title: "Chương 2: Giá trị lớn nhất - nhỏ nhất và tiệm cận đồ thị hàm số",
    sortOrder: 2,
    isExpanded: true,
    lessons: [
      {
        id: "les-201",
        title: "Phương pháp dồn biến & bất đẳng thức tìm Min-Max hàm 2 biến",
        type: "VIDEO",
        durationMinutes: 52,
        isFreePreview: false,
        status: "PUBLISHED",
        sortOrder: 1,
      },
      {
        id: "les-202",
        title: "Tuyển tập 30 bài toán Min-Max thực tế tối ưu hóa",
        type: "PDF",
        pageCount: 22,
        isFreePreview: false,
        status: "PUBLISHED",
        sortOrder: 2,
      },
      {
        id: "les-203",
        title: "Tiệm cận đứng, ngang của đồ thị hàm phân thức chứa căn và tham số m",
        type: "VIDEO",
        durationMinutes: 40,
        isFreePreview: false,
        status: "DRAFT",
        sortOrder: 3,
      },
      {
        id: "les-204",
        title: "Đề thi thử định kỳ chương 2: Tiệm cận & Min-Max",
        type: "QUIZ",
        questionCount: 20,
        isFreePreview: false,
        status: "DRAFT",
        sortOrder: 4,
      },
    ],
  },
];

interface CurriculumBuilderProps {
  courseId: string;
}

export function CurriculumBuilder({ courseId }: CurriculumBuilderProps) {
  const [courseTitle] = useState(
    "Toán 12 - Chinh Phục Cực Trị & Hàm Số Nâng Cao (Mục tiêu 9+)"
  );
  const [courseSlug] = useState("toan-12-chinh-phuc-cuc-tri-ham-so");
  const [courseStatus, setCourseStatus] = useState<
    "PUBLISHED" | "DRAFT" | "HIDDEN"
  >("PUBLISHED");

  const [chapters, setChapters] = useState<ChapterItem[]>(initialChaptersData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Drag and Drop States
  const [draggedChapterIndex, setDraggedChapterIndex] = useState<number | null>(null);
  const [dragOverChapterIndex, setDragOverChapterIndex] = useState<number | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ chapterId: string; lessonId: string } | null>(null);
  const [dragOverLesson, setDragOverLesson] = useState<{ chapterId: string; lessonId: string } | null>(null);

  // Chapter Modal State
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterTitleInput, setChapterTitleInput] = useState("");

  // Lesson Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [targetChapterId, setTargetChapterId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonTitleInput, setLessonTitleInput] = useState("");
  const [lessonTypeInput, setLessonTypeInput] = useState<LessonType>("VIDEO");
  const [lessonDurationInput, setLessonDurationInput] = useState<number>(30);
  const [lessonIsFreePreview, setLessonIsFreePreview] = useState(false);
  const [lessonStatusInput, setLessonStatusInput] = useState<
    "PUBLISHED" | "DRAFT" | "HIDDEN"
  >("PUBLISHED");
  const [videoFileName, setVideoFileName] = useState("");
  const [videoFileSize, setVideoFileSize] = useState("");
  const [videoObjectKey, setVideoObjectKey] = useState("");

  // Drag and drop handlers for Chapters
  const handleChapterDragStart = (e: React.DragEvent, index: number) => {
    setDraggedChapterIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleChapterDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedChapterIndex !== null && draggedChapterIndex !== index) {
      setDragOverChapterIndex(index);
    }
  };

  const handleChapterDragLeave = () => {
    setDragOverChapterIndex(null);
  };

  const handleChapterDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedChapterIndex === null || draggedChapterIndex === targetIndex) {
      setDraggedChapterIndex(null);
      setDragOverChapterIndex(null);
      return;
    }
    const updated = [...chapters];
    const [movedItem] = updated.splice(draggedChapterIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    const reordered = updated.map((chap, idx) => ({
      ...chap,
      sortOrder: idx + 1,
    }));
    setChapters(reordered);
    setDraggedChapterIndex(null);
    setDragOverChapterIndex(null);
    setHasUnsavedChanges(true);
  };

  // Drag and drop handlers for Lessons
  const handleLessonDragStart = (e: React.DragEvent, chapterId: string, lessonId: string) => {
    e.stopPropagation();
    setDraggedLesson({ chapterId, lessonId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleLessonDragOver = (e: React.DragEvent, chapterId: string, lessonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (
      draggedLesson &&
      (draggedLesson.chapterId !== chapterId || draggedLesson.lessonId !== lessonId)
    ) {
      setDragOverLesson({ chapterId, lessonId });
    }
  };

  const handleLessonDragLeave = () => {
    setDragOverLesson(null);
  };

  const handleLessonDrop = (e: React.DragEvent, targetChapterId: string, targetLessonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedLesson) {
      setDraggedLesson(null);
      setDragOverLesson(null);
      return;
    }
    const { chapterId: sourceChapterId, lessonId: sourceLessonId } = draggedLesson;
    if (sourceChapterId === targetChapterId && sourceLessonId === targetLessonId) {
      setDraggedLesson(null);
      setDragOverLesson(null);
      return;
    }
    setChapters((prev) => {
      let movedLesson: LessonItem | undefined;
      const stripped = prev.map((ch) => {
        if (ch.id === sourceChapterId) {
          const filtered = ch.lessons.filter((l) => {
            if (l.id === sourceLessonId) {
              movedLesson = l;
              return false;
            }
            return true;
          });
          return { ...ch, lessons: filtered };
        }
        return ch;
      });
      if (!movedLesson) return prev;
      return stripped.map((ch) => {
        if (ch.id === targetChapterId) {
          const targetIndex = ch.lessons.findIndex((l) => l.id === targetLessonId);
          const newLessons = [...ch.lessons];
          if (targetIndex >= 0) {
            newLessons.splice(targetIndex, 0, movedLesson!);
          } else {
            newLessons.push(movedLesson!);
          }
          return {
            ...ch,
            lessons: newLessons.map((l, i) => ({ ...l, sortOrder: i + 1 })),
          };
        }
        return ch;
      });
    });
    setDraggedLesson(null);
    setDragOverLesson(null);
    setHasUnsavedChanges(true);
  };

  const toggleChapterExpand = (chapterId: string) => {
    setChapters((prev) =>
      prev.map((c) =>
        c.id === chapterId ? { ...c, isExpanded: !c.isExpanded } : c
      )
    );
  };

  const openChapterModal = (chapter?: ChapterItem) => {
    if (chapter) {
      setEditingChapterId(chapter.id);
      setChapterTitleInput(chapter.title);
    } else {
      setEditingChapterId(null);
      setChapterTitleInput("");
    }
    setIsChapterModalOpen(true);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterTitleInput.trim()) return;
    if (editingChapterId) {
      setChapters((prev) =>
        prev.map((c) =>
          c.id === editingChapterId
            ? { ...c, title: chapterTitleInput.trim() }
            : c
        )
      );
    } else {
      const newChap: ChapterItem = {
        id: `ch-${Date.now()}`,
        title: chapterTitleInput.trim(),
        sortOrder: chapters.length + 1,
        isExpanded: true,
        lessons: [],
      };
      setChapters((prev) => [...prev, newChap]);
    }
    setIsChapterModalOpen(false);
    setHasUnsavedChanges(true);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chương này cùng tất cả bài học bên trong?")) {
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
      setHasUnsavedChanges(true);
    }
  };

  const openLessonModal = (chapterId: string, lesson?: LessonItem) => {
    setTargetChapterId(chapterId);
    if (lesson) {
      setEditingLessonId(lesson.id);
      setLessonTitleInput(lesson.title);
      setLessonTypeInput(lesson.type);
      setLessonDurationInput(lesson.durationMinutes || 30);
      setLessonIsFreePreview(lesson.isFreePreview);
      setLessonStatusInput(lesson.status);
      setVideoFileName(lesson.videoFileName || "");
      setVideoFileSize(lesson.videoFileSize || "");
      setVideoObjectKey(lesson.videoObjectKey || "");
    } else {
      setEditingLessonId(null);
      setLessonTitleInput("");
      setLessonTypeInput("VIDEO");
      setLessonDurationInput(30);
      setLessonIsFreePreview(false);
      setLessonStatusInput("PUBLISHED");
      setVideoFileName("");
      setVideoFileSize("");
      setVideoObjectKey("");
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitleInput.trim() || !targetChapterId) return;

    setChapters((prev) =>
      prev.map((chap) => {
        if (chap.id !== targetChapterId) return chap;

        if (editingLessonId) {
          return {
            ...chap,
            lessons: chap.lessons.map((les) =>
              les.id === editingLessonId
                ? {
                    ...les,
                    title: lessonTitleInput,
                    type: lessonTypeInput,
                    durationMinutes:
                      lessonTypeInput === "VIDEO" || lessonTypeInput === "LIVE"
                        ? lessonDurationInput
                        : undefined,
                    questionCount:
                      lessonTypeInput === "QUIZ" ? lessonDurationInput : undefined,
                    pageCount:
                      lessonTypeInput === "PDF" ? lessonDurationInput : undefined,
                    isFreePreview: lessonIsFreePreview,
                    status: lessonStatusInput,
                    videoObjectKey:
                      lessonTypeInput === "VIDEO" ? videoObjectKey : undefined,
                    videoFileName:
                      lessonTypeInput === "VIDEO" ? videoFileName : undefined,
                    videoFileSize:
                      lessonTypeInput === "VIDEO" ? videoFileSize : undefined,
                  }
                : les
            ),
          };
        } else {
          const newLesson: LessonItem = {
            id: `les-${Date.now()}`,
            title: lessonTitleInput,
            type: lessonTypeInput,
            durationMinutes:
              lessonTypeInput === "VIDEO" || lessonTypeInput === "LIVE"
                ? lessonDurationInput
                : undefined,
            questionCount:
              lessonTypeInput === "QUIZ" ? lessonDurationInput : undefined,
            pageCount:
              lessonTypeInput === "PDF" ? lessonDurationInput : undefined,
            isFreePreview: lessonIsFreePreview,
            status: lessonStatusInput,
            videoObjectKey:
              lessonTypeInput === "VIDEO" ? videoObjectKey : undefined,
            videoFileName:
              lessonTypeInput === "VIDEO" ? videoFileName : undefined,
            videoFileSize:
              lessonTypeInput === "VIDEO" ? videoFileSize : undefined,
            sortOrder: chap.lessons.length + 1,
          };
          return {
            ...chap,
            isExpanded: true,
            lessons: [...chap.lessons, newLesson],
          };
        }
      })
    );

    setIsLessonModalOpen(false);
    setHasUnsavedChanges(true);
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài học này?")) {
      setChapters((prev) =>
        prev.map((chap) =>
          chap.id === chapterId
            ? {
                ...chap,
                lessons: chap.lessons.filter((l) => l.id !== lessonId),
              }
            : chap
        )
      );
      setHasUnsavedChanges(true);
    }
  };

  const handleQuickChangeLessonStatus = (
    chapterId: string,
    lessonId: string,
    newStatus: "PUBLISHED" | "DRAFT" | "HIDDEN"
  ) => {
    setChapters((prev) =>
      prev.map((chap) =>
        chap.id === chapterId
          ? {
              ...chap,
              lessons: chap.lessons.map((l) =>
                l.id === lessonId ? { ...l, status: newStatus } : l
              ),
            }
          : chap
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleSaveCurriculum = () => {
    setHasUnsavedChanges(false);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 3000);
  };

  const getTypeInfo = (type: LessonType) => {
    switch (type) {
      case "VIDEO":
        return {
          icon: <Video className="size-4 text-teal-600 dark:text-teal-400" />,
          label: "Video bài giảng",
          badgeClass: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800",
        };
      case "PDF":
        return {
          icon: <FileText className="size-4 text-blue-600 dark:text-blue-400" />,
          label: "Tài liệu PDF",
          badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
        };
      case "QUIZ":
        return {
          icon: <HelpCircle className="size-4 text-amber-600 dark:text-amber-400" />,
          label: "Trắc nghiệm",
          badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        };
      case "LIVE":
        return {
          icon: <Radio className="size-4 text-rose-600 dark:text-rose-400" />,
          label: "Livestream",
          badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
        };
      default:
        return {
          icon: <FileText className="size-4 text-slate-600" />,
          label: "Bài học",
          badgeClass: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  const totalLessons = chapters.flatMap((c) => c.lessons).length;

  return (
    <div className="space-y-6 pb-16 w-full">
      {/* Top Header Card */}
      <CurriculumHeaderCard
        courseId={courseId}
        courseTitle={courseTitle}
        courseSlug={courseSlug}
        courseStatus={courseStatus}
        chaptersCount={chapters.length}
        lessonsCount={totalLessons}
        hasUnsavedChanges={hasUnsavedChanges}
        saveSuccessNotice={saveSuccessNotice}
        onChangeCourseStatus={(status) => {
          setCourseStatus(status);
          setHasUnsavedChanges(true);
        }}
        onOpenAddChapter={() => openChapterModal()}
        onSaveCurriculum={handleSaveCurriculum}
      />

      {/* Chapters Container */}
      <div className="space-y-4">
        {chapters.length === 0 ? (
          <div className="p-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Giáo trình chưa có chương nào
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Bắt đầu xây dựng khóa học bằng cách thêm các chương và bài giảng vào hệ thống.
            </p>
            <Button
              onClick={() => openChapterModal()}
              className="mt-4 bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl text-xs gap-1.5"
            >
              <Plus className="size-4" />
              <span>Thêm chương đầu tiên</span>
            </Button>
          </div>
        ) : (
          chapters.map((chapter, index) => (
            <CurriculumChapterCard
              key={chapter.id}
              chapter={chapter}
              index={index}
              draggedChapterIndex={draggedChapterIndex}
              dragOverChapterIndex={dragOverChapterIndex}
              draggedLesson={draggedLesson}
              dragOverLesson={dragOverLesson}
              getTypeInfo={getTypeInfo}
              onChapterDragStart={handleChapterDragStart}
              onChapterDragOver={handleChapterDragOver}
              onChapterDragLeave={handleChapterDragLeave}
              onChapterDrop={handleChapterDrop}
              onLessonDragStart={handleLessonDragStart}
              onLessonDragOver={handleLessonDragOver}
              onLessonDragLeave={handleLessonDragLeave}
              onLessonDrop={handleLessonDrop}
              onToggleExpand={toggleChapterExpand}
              onEditChapter={openChapterModal}
              onDeleteChapter={handleDeleteChapter}
              onOpenAddLesson={openLessonModal}
              onEditLesson={openLessonModal}
              onDeleteLesson={handleDeleteLesson}
              onQuickChangeLessonStatus={handleQuickChangeLessonStatus}
            />
          ))
        )}
      </div>

      {/* Chapter Modal */}
      <ChapterModal
        isOpen={isChapterModalOpen}
        editingChapterId={editingChapterId}
        chapterTitleInput={chapterTitleInput}
        onChangeTitle={setChapterTitleInput}
        onClose={() => setIsChapterModalOpen(false)}
        onSave={handleSaveChapter}
      />

      {/* Lesson Modal */}
      <LessonModal
        isOpen={isLessonModalOpen}
        editingLessonId={editingLessonId}
        courseId={courseId}
        lessonTitleInput={lessonTitleInput}
        lessonTypeInput={lessonTypeInput}
        lessonDurationInput={lessonDurationInput}
        lessonIsFreePreview={lessonIsFreePreview}
        lessonStatusInput={lessonStatusInput}
        videoFileName={videoFileName}
        videoFileSize={videoFileSize}
        videoObjectKey={videoObjectKey}
        onChangeTitle={setLessonTitleInput}
        onChangeType={setLessonTypeInput}
        onChangeDuration={setLessonDurationInput}
        onChangeIsFreePreview={setLessonIsFreePreview}
        onChangeStatus={setLessonStatusInput}
        onChangeVideoObjectKey={setVideoObjectKey}
        onSelectVideoFile={(file) => {
          const sizeMB = Math.round((file.size / (1024 * 1024)) * 10) / 10;
          const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
          setVideoFileName(file.name);
          setVideoFileSize(`${sizeMB} MB`);
          setVideoObjectKey(`courses/${courseId}/${cleanName}`);
        }}
        onResetVideo={() => {
          setVideoFileName("");
          setVideoObjectKey("");
          setVideoFileSize("");
        }}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
