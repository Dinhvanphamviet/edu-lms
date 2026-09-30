"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  GraduationCap,
  FolderTree,
  Boxes,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeacherSidebar } from "./TeacherSidebarContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarLinks = [
  { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { name: "Khóa học", href: "/teacher/courses", icon: BookOpen },
  { name: "Mã kích hoạt", href: "/teacher/activation-codes", icon: KeyRound },
  { name: "Danh mục", href: "/teacher/categories", icon: FolderTree },
  { name: "Bộ sưu tập", href: "/teacher/collections", icon: Boxes },
  { name: "Học sinh", href: "/teacher/students", icon: Users },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapse, isMobileOpen, setIsMobileOpen } = useTeacherSidebar();

  // Nhấp vào vùng trống của thanh bên khi đang thu nhỏ -> mở rộng thanh bên
  const handleAsideClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!isCollapsed) return;
    const target = e.target as HTMLElement;
    // Bỏ qua nếu người dùng bấm trúng link, nút bấm hoặc interactive element
    if (target.closest("button, a, input")) {
      return;
    }
    toggleCollapse();
  };

  const renderNavLink = (link: (typeof sidebarLinks)[0]) => {
    const isActive = pathname === link.href;
    const Icon = link.icon;

    const linkContent = (
      <Link
        key={link.name}
        href={link.href}
        onClick={(e) => {
          e.stopPropagation();
          setIsMobileOpen(false);
        }}
        className={cn(
          "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative",
          isCollapsed
            ? "justify-center size-11 mx-auto"
            : "gap-3 px-3.5 py-2.5 mx-2",
          isActive
            ? "bg-[var(--surface-muted)] text-[var(--surface-strong)] font-semibold shadow-2xs"
            : "text-[var(--text-primary)]/70 hover:bg-[var(--surface-muted)]/60 hover:text-[var(--text-primary)]"
        )}
      >
        {/* Active indicator bar khi mở rộng */}
        {isActive && !isCollapsed && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[var(--surface-strong)]" />
        )}

        <Icon
          className={cn(
            "size-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
            isActive ? "text-[var(--surface-strong)]" : "text-[var(--text-primary)]/60"
          )}
        />

        {!isCollapsed && (
          <span className="truncate">{link.name}</span>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={link.name}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className="font-medium">
            {link.name}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity animate-in fade-in-0 duration-200"
        />
      )}

      {/* Sidebar container */}
      <aside
        onClick={handleAsideClick}
        title={isCollapsed ? "Nhấp vào khoảng trống để mở rộng thanh bên" : undefined}
        className={cn(
          "fixed top-0 left-0 h-screen border-r border-[var(--border-default)] bg-[var(--surface-base)] flex flex-col z-50 select-none transition-all duration-300 ease-in-out",
          // Width desktop
          isCollapsed ? "md:w-[72px] md:cursor-pointer" : "md:w-[260px]",
          // Mobile state
          isMobileOpen
            ? "w-[260px] translate-x-0 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Top Header */}
        <div
          className={cn(
            "border-b border-[var(--border-default)] shrink-0 transition-all duration-200",
            isCollapsed
              ? "flex flex-col items-center gap-3 py-3.5 px-2"
              : "h-16 flex items-center justify-between px-4"
          )}
        >
          {isCollapsed ? (
            /* Khi thu nhỏ: Logo ở trên, nút mở rộng ở dưới */
            <>
              <Link
                href="/teacher"
                onClick={(e) => e.stopPropagation()}
                className="group"
              >
                <div className="bg-gradient-to-br from-surface-strong-light to-surface-strong-dark size-9 rounded-xl flex items-center justify-center text-white shadow-sm shadow-surface-strong-light/20 group-hover:scale-105 transition-transform">
                  <GraduationCap className="size-5" />
                </div>
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse();
                    }}
                    className="size-9 flex items-center justify-center rounded-xl text-[var(--text-primary)]/70 hover:text-[var(--surface-strong)] hover:bg-[var(--surface-muted)] transition-all duration-200 active:scale-95"
                  >
                    <PanelLeftOpen className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  Mở rộng thanh bên
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            /* Khi mở rộng: Logo bên trái, nút Đóng thanh bên ở trên bên phải */
            <>
              <Link
                href="/teacher"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2.5 transition-all duration-200 group"
              >
                <div className="bg-gradient-to-br from-surface-strong-light to-surface-strong-dark size-9 rounded-xl flex items-center justify-center text-white shadow-sm shadow-surface-strong-light/20 group-hover:scale-105 transition-transform shrink-0">
                  <GraduationCap className="size-5" />
                </div>

                <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">
                  Math<span className="text-surface-strong-light">Flow</span>
                </span>
              </Link>

              {/* Nút Đóng thanh bên ở trên (Desktop) + Nút X (Mobile) */}
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollapse();
                      }}
                      className="hidden md:flex size-9 items-center justify-center rounded-xl text-[var(--text-primary)]/70 hover:text-[var(--surface-strong)] hover:bg-[var(--surface-muted)] transition-all duration-200 active:scale-95 cursor-pointer"
                    >
                      <PanelLeftClose className="size-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    Đóng thanh bên
                  </TooltipContent>
                </Tooltip>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileOpen(false);
                  }}
                  className="md:hidden size-9 flex items-center justify-center rounded-xl text-[var(--text-primary)]/70 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 scrollbar-none flex flex-col justify-between">
          <nav className="flex flex-col gap-1.5 px-2">
            {sidebarLinks.map(renderNavLink)}
          </nav>
        </div>

        {/* Footer copyright ban đầu */}
        {!isCollapsed && (
          <div className="p-4 text-xs text-[var(--text-primary)]/50 border-t border-[var(--border-default)] bg-[var(--surface-muted)] truncate">
            &copy; 2026 MathFlow Teacher.
          </div>
        )}
      </aside>
    </>
  );
}
