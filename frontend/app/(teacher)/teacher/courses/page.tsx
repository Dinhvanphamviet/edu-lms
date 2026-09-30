import { TeacherCourseManager } from "@/features/teacher/courses";

export const metadata = {
  title: "Khóa học của tôi | MathFlow Teacher",
  description: "Quản lý nội dung giảng dạy, soạn giáo trình và theo dõi tiến độ các khóa học phụ trách.",
};

export default function TeacherCoursesPage() {
  return <TeacherCourseManager />;
}
