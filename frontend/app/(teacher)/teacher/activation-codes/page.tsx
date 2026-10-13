import { ActivationCodesManager } from "@/features/teacher/activation-codes";

export const metadata = {
  title: "Quản lý Mã kích hoạt | MathFlow Teacher",
  description: "Cấp phát và quản lý mã kích hoạt khóa học cho học sinh.",
};

export default function TeacherActivationCodesPage() {
  return <ActivationCodesManager />;
}
