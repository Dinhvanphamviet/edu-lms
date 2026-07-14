import Link from "next/link";
import { getCourseBySlug, getCourseCurriculum } from "@/features/course/api/course.api";
import { CourseDetailContent } from "@/features/course/components/public/CourseDetailContent";
import { CourseDetailSidebar } from "@/features/course/components/public/CourseDetailSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const resolvedParams = await params;
  
  const course = await getCourseBySlug(resolvedParams.slug);
  const curriculum = await getCourseCurriculum(resolvedParams.slug);

  return (
    <div className="bg-[#f0fbfb]">
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
                <BreadcrumbPage className="text-[#008ca5] font-medium">
                  {course.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 lg:px-10 xl:px-16 py-8">
        
        {/* Title Block spanning full width */}
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] px-6 py-5 mb-8">
          <h1 className="text-lg md:text-xl font-bold text-[var(--surface-strong)] leading-tight">
            {course.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 relative">
          
          {/* Cột trái (Nội dung) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <CourseDetailContent description={course.description} courseSlug={resolvedParams.slug} curriculum={curriculum} />
          </div>

          {/* Cột phải (Sidebar cố định) */}
          <div className="lg:col-span-3">
            <CourseDetailSidebar course={course} />
          </div>

        </div>
      </div>
    </div>
  );
}
