import { CourseGridList } from "@/features/course/components/public/CourseGridList";

export const metadata = {
  title: "Danh sách khóa học | MathFlow",
  description: "Khám phá các khóa học và lộ trình ôn thi toàn diện.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; category?: string }>;
}) {
  const params = await searchParams;
  const activeCollectionId = params.collection || "all";
  const activeCategoryId = params.category || "all";

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <CourseGridList activeCollectionId={activeCollectionId} activeCategoryId={activeCategoryId} />
        </div>
      </div>
    </div>
  );
}
