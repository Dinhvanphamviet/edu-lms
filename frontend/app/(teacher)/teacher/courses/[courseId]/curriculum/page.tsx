import { use } from "react";
import { CurriculumBuilder } from "@/features/teacher/curriculum";

export const metadata = {
  title: "Soạn Giáo trình Khóa học | MathFlow Teacher",
  description: "Xây dựng chương mục và quản lý bài giảng bài tập khóa học.",
};

interface TeacherCurriculumPageProps {
  params: Promise<{ courseId: string }>;
}

export default function TeacherCurriculumPage({ params }: TeacherCurriculumPageProps) {
  const resolvedParams = use(params);
  return <CurriculumBuilder courseId={resolvedParams.courseId} />;
}
