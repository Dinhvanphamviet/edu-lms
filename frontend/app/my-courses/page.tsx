"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";
import { CourseCard } from "@/features/course/components/public/CourseCard";
import { getMyCourses, CourseWithProgress } from "@/features/course/api/course.api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        // Fetch real data from the protected my-courses API
        const myCourses = await getMyCourses();
        setCourses(myCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || loading) {
    return (
      <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--surface-strong)] mb-4" />
        <p className="text-[var(--text-primary)]/60 font-medium">Đang tải khóa học của bạn...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--surface-strong)]">
          Khóa học của tôi
        </h1>
        <p className="text-[var(--text-primary)]/70 font-medium text-sm md:text-base">
          Bạn đang có <strong className="text-[var(--surface-strong)] font-bold">{courses.length}</strong> khóa học đã kích hoạt
        </p>
      </div>

      {/* Grid Section */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => {
            return (
              <CourseCard 
                key={course.id} 
                course={course} 
                enrolledInfo={{
                  completedLessons: course.progress?.completed_lessons || 0,
                  totalLessons: course.progress?.total_lessons || course.stats?.lessons || 1
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white py-16 px-6 text-center rounded-2xl border border-[var(--border-default)] shadow-sm">
          <div className="w-16 h-16 bg-[var(--surface-muted)] text-[var(--text-primary)]/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-[var(--surface-strong)] mb-2">Chưa có khóa học nào</h3>
          <p className="text-[var(--text-primary)]/60 max-w-sm mx-auto mb-6 text-sm">
            Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học để bắt đầu hành trình học tập.
          </p>
          <Link 
            href="/courses" 
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-[var(--surface-strong)] text-white font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Khám phá khóa học
          </Link>
        </div>
      )}
    </div>
  );
}
