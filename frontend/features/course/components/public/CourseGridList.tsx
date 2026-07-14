import { CourseCard } from "./CourseCard";
import { getCourses } from "../../api/course.api";
import { getHomePageData } from "@/features/home/api/home.api";

interface CourseGridListProps {
  activeCollectionId?: string;
  activeCategoryId?: string;
}

export async function CourseGridList({ activeCollectionId = "all", activeCategoryId = "all" }: CourseGridListProps) {
  let displayCourses: any[] = [];

  if (activeCollectionId !== "all") {
    // Fetch home data to get collections
    try {
      const homeData = await getHomePageData();
      const collection = homeData.collections.find((c) => c.id === activeCollectionId);
      if (collection) {
        displayCourses = collection.courses;
      }
    } catch (e) {
      console.error("Failed to fetch collection courses", e);
    }
  } else {
    // Fetch all courses or by category
    try {
      displayCourses = await getCourses(activeCategoryId);
    } catch (e) {
      console.error("Failed to fetch courses", e);
    }
  }

  return (
    <div className="flex-1">
      {displayCourses && displayCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayCourses.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-[var(--border-default)] shadow-sm">
          <p className="text-gray-600 font-medium text-lg">Không có khoá học nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );
}
