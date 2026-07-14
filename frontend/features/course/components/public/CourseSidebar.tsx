import Link from "next/link";
import { MOCK_COURSE_CATEGORIES } from "@/constants/mock-data";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  activeCategoryId?: string;
}

export function CourseSidebar({ activeCategoryId = "all" }: CourseSidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0 mb-8 md:mb-0">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24 border border-[var(--border-default)]">
        {/* Header */}
        <div className="bg-cyan-50 text-surface-strong-light p-4 flex items-center gap-2 border-b border-cyan-200">
          <LayoutGrid className="size-5" />
          <h3 className="font-bold text-lg">Danh mục khoá học</h3>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col py-2">
          <Link
            href="/courses"
            className={cn(
              "px-5 py-3.5 text-sm font-medium transition-colors hover:bg-slate-50",
              activeCategoryId === "all" || !activeCategoryId
                ? "bg-cyan-50 text-surface-strong-light font-bold border-l-4 border-surface-strong-light"
                : "text-[var(--text-secondary)] border-l-4 border-transparent"
            )}
          >
            Tất cả khoá học
          </Link>
          
          {MOCK_COURSE_CATEGORIES.map((category) => {
            const isActive = activeCategoryId === category.slug;
            return (
              <Link
                key={category.id}
                href={`/courses?category=${category.slug}`}
                className={cn(
                  "px-5 py-3.5 text-sm font-medium transition-colors hover:bg-slate-50",
                  isActive
                    ? "bg-cyan-50 text-surface-strong-light font-bold border-l-4 border-surface-strong-light"
                    : "text-[var(--text-secondary)] border-l-4 border-transparent"
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
