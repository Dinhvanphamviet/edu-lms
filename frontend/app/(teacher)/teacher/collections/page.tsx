import { TeacherCollectionManager } from "@/features/teacher/collections";

export const metadata = {
  title: "Bộ sưu tập & Lộ trình | MathFlow Teacher",
  description: "Quản lý bộ sưu tập và lộ trình khóa học combo dành cho giáo viên.",
};

export default function TeacherCollectionsPage() {
  return <TeacherCollectionManager />;
}
