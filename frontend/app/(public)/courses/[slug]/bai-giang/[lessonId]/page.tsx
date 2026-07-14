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

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string, lessonId: string }> }) {
  const resolvedParams = await params;

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
                  <Link href={`/courses/${resolvedParams.slug}`} className="hover:text-[#008ca5] transition-colors">STEP 1 2027 | Nền tảng Toán 12</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#008ca5] font-medium">
                  Theme 1. Các quy tắc tính đạo hàm
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="w-full px-6 lg:px-10 xl:px-16 py-8 relative">
        <LessonLayoutManager 
          content={<LessonContent />} 
          sidebar={<LessonSidebar />} 
        />
      </div>
    </div>
    </LessonLayoutProvider>
  );
}
