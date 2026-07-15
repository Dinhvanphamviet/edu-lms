import { LessonContent } from "@/features/learning/components/student/LessonContent";
import { LessonSidebar } from "@/features/learning/components/student/LessonSidebar";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LessonLayoutProvider } from "@/features/learning/components/student/LessonLayoutContext";
import { LessonLayoutManager } from "@/features/learning/components/student/LessonLayoutManager";

async function getLessonData(lessonId: string) {
  try {
    const apiUrl = process.env.API_URL_SERVER || 'http://127.0.0.1:8080/api/v1';
    const res = await fetch(`${apiUrl}/public/lessons/${lessonId}`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch lesson data: res.ok is false, status =", res.status);
      return null;
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch lesson data:", error);
    return null;
  }
}

async function getCurriculumData(slug: string) {
  try {
    const apiUrl = process.env.API_URL_SERVER || 'http://127.0.0.1:8080/api/v1';
    const res = await fetch(`${apiUrl}/public/courses/${slug}/curriculum`, { 
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch curriculum data:", error);
    return null;
  }
}

async function getCourseData(slug: string) {
  try {
    const apiUrl = process.env.API_URL_SERVER || 'http://127.0.0.1:8080/api/v1';
    const res = await fetch(`${apiUrl}/public/courses/${slug}`, { 
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return null;
  }
}

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string, lessonId: string }> }) {
  const resolvedParams = await params;
  
  const [lessonData, curriculumData, courseData] = await Promise.all([
    getLessonData(resolvedParams.lessonId),
    getCurriculumData(resolvedParams.slug),
    getCourseData(resolvedParams.slug)
  ]);
  
  const courseTitle = lessonData?.chapter?.course?.title || "Khóa học";
  const lessonTitle = lessonData?.title || "Bài giảng";

  return (
    <LessonLayoutProvider>
      <div className="bg-[#f0fbfb] min-h-screen">
        {/* Breadcrumbs Banner */}
      <div className="bg-[#f0fbfb]-highlight border-b border-[#008ca5]/10">
        <div className="w-full px-6 lg:px-10 xl:px-16 py-2.5">
          <Breadcrumb>
            <BreadcrumbList className="text-[var(--text-primary)]/60">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="hover:text-[#008ca5] transition-colors">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/courses" className="hover:text-[#008ca5] transition-colors">Danh mục khóa học</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/courses/${resolvedParams.slug}`} className="hover:text-[#008ca5] transition-colors">{courseTitle}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#008ca5] font-medium">
                  {lessonTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="w-full px-6 lg:px-10 xl:px-16 py-8 relative">
        <LessonLayoutManager 
          content={<LessonContent lessonData={lessonData} />} 
          sidebar={<LessonSidebar courseSlug={resolvedParams.slug} initialCurriculum={curriculumData || []} courseStats={courseData?.stats} />} 
        />
      </div>
    </div>
    </LessonLayoutProvider>
  );
}
