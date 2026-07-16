"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { name: "Khóa học", href: "/teacher/courses", icon: BookOpen },
  { name: "Học sinh", href: "/teacher/students", icon: Users },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] lg:w-[260px] xl:w-[280px] h-screen fixed top-0 left-0 border-r border-[var(--border-default)] bg-[var(--surface-base)] flex flex-col z-40 hidden md:flex transition-all duration-300">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-[var(--border-default)]">
        <Link href="/teacher" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-surface-strong-light to-surface-strong-dark size-8 rounded-xl flex items-center justify-center text-white shadow-sm shadow-surface-strong-light/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4.5"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" /></svg>
          </div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <div>
              <span className="text-slate-800 dark:text-slate-200">Math</span>
              <span className="text-surface-strong-light">Flow</span>
            </div>
            <span className="rounded-md bg-[var(--surface-strong)]/10 px-1.5 py-0.5 text-xs font-bold text-[var(--surface-strong)]">
              Teacher
            </span>
          </h1>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none flex flex-col justify-between">
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--surface-muted)] text-[var(--surface-strong)]"
                    : "text-[var(--text-primary)]/80 hover:bg-[var(--surface-muted)]/50 hover:text-[var(--surface-strong)]"
                )}
              >
                <Icon className={cn("size-5", isActive ? "text-[var(--surface-strong)]" : "text-[var(--text-primary)]/60")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer copyright */}
      <div className="p-4 text-xs text-[var(--text-primary)]/50 border-t border-[var(--border-default)] bg-[var(--surface-muted)]">
        &copy; 2026 MathFlow Teacher.
      </div>
    </aside>
  );
}
