export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
}

export interface CourseStats {
  lessons: number;
  exams: number;
  documents: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  release_date: string;
  price: number;
  cover_image: string;
  tags?: string[];
  stats?: CourseStats;
  description?: string;
}

export async function getCategories(): Promise<CourseCategory[]> {
  const isServer = typeof window === "undefined";
  const backendUrl = isServer 
    ? process.env.API_URL_SERVER || "http://backend:8080/api/v1"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  
  const res = await fetch(`${backendUrl}/public/categories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await res.json();
  return result.data;
}

export async function getCourses(categorySlug?: string): Promise<Course[]> {
  const isServer = typeof window === "undefined";
  const backendUrl = isServer 
    ? process.env.API_URL_SERVER || "http://backend:8080/api/v1"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  
  const url = new URL(`${backendUrl}/public/courses`);
  if (categorySlug && categorySlug !== "all") {
    url.searchParams.append("category", categorySlug);
  }

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await res.json();
  return result.data;
}

export async function getCourseBySlug(slug: string): Promise<Course> {
  const isServer = typeof window === "undefined";
  const backendUrl = isServer 
    ? process.env.API_URL_SERVER || "http://backend:8080/api/v1"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  
  const res = await fetch(`${backendUrl}/public/courses/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }

	const result = await res.json();
	return result.data;
}

export interface CurriculumTheme {
	id: string;
	title: string;
	stats: string;
}

export interface CurriculumChapter {
	id: string;
	title: string;
	stats: string;
	themes: CurriculumTheme[];
}

export async function getCourseCurriculum(slug: string): Promise<CurriculumChapter[]> {
	const isServer = typeof window === "undefined";
	const backendUrl = isServer 
		? process.env.API_URL_SERVER || "http://backend:8080/api/v1"
		: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
	
	const res = await fetch(`${backendUrl}/public/courses/${slug}/curriculum`, {
		next: { revalidate: 60 },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch course curriculum");
	}

	const result = await res.json();
	return result.data;
}

export interface CourseWithProgress extends Course {
  progress: {
    completed_lessons: number;
    total_lessons: number;
  };
}

export async function getMyCourses(): Promise<CourseWithProgress[]> {
  const isServer = typeof window === "undefined";
  
  if (isServer) {
    // For server components, we might need a different approach or pass headers
    throw new Error("getMyCourses should be called from client-side with useAuth or api interceptor");
  }

  // Import api here to avoid circular dependencies or server-side issues
  const { default: api } = await import("@/lib/api");
  
  const res = await api.get("/student/my-courses");
  return res.data.data;
}

export async function markLessonCompleted(lessonId: string): Promise<boolean> {
  const isServer = typeof window === "undefined";
  
  if (isServer) {
    throw new Error("markLessonCompleted should be called from client-side with useAuth or api interceptor");
  }

  const { default: api } = await import("@/lib/api");
  
  const res = await api.post(`/student/lessons/${lessonId}/complete`);
  return res.data.data;
}
