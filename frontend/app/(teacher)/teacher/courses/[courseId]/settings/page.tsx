import { use } from "react";
import { CourseSettingsManager } from "@/features/teacher/courses";

export const metadata = {
  title: "Cài đặt Khóa học | MathFlow Teacher",
  description: "Quản lý thông tin cơ bản, học phí, ảnh bìa và cấu hình khóa học.",
};

interface CourseSettingsPageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseSettingsPage({ params }: CourseSettingsPageProps) {
  const resolvedParams = use(params);
  return <CourseSettingsManager courseId={resolvedParams.courseId} />;
}
