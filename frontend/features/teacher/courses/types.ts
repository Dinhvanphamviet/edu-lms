export interface CourseItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  coverImage: string;
  studentsCount: number;
  lessonsCount: number;
  durationHours: number;
  rating: number;
  updatedAt: string;
}
