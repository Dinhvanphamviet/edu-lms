import { use } from "react";
import { EditCollectionManager } from "@/features/teacher/collections";

export const metadata = {
  title: "Chỉnh sửa Bộ sưu tập | MathFlow Teacher",
  description: "Cập nhật thông tin combo, học phí và danh sách khóa học trong bộ sưu tập.",
};

interface EditCollectionPageProps {
  params: Promise<{ collectionId: string }>;
}

export default function EditCollectionPage({ params }: EditCollectionPageProps) {
  const resolvedParams = use(params);
  return <EditCollectionManager collectionId={resolvedParams.collectionId} />;
}
