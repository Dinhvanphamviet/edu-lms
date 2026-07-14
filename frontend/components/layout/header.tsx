"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_MENUS } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { cn } from "@/lib/utils";
import { HeaderAuthControls } from "./HeaderAuthControls";

export function Header() {
  const pathname = usePathname();

  const isCourseDetailPage = pathname.startsWith("/courses/") && pathname.length > "/courses/".length;

  return (
    <header className="h-20 border-b border-[var(--border-default)] bg-cyan-50 sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Logo for Course Detail Page */}
      {isCourseDetailPage && (
        <Link href="/" className="flex items-center gap-2.5 group mr-4 lg:mr-8">
          <div className="bg-gradient-to-br from-surface-strong-light to-surface-strong-dark size-8 rounded-xl flex items-center justify-center text-white shadow-sm shadow-surface-strong-light/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4.5"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/></svg>
          </div>
          <h1 className="text-xl font-black tracking-tight hidden sm:block">
            <span className="text-slate-800 dark:text-slate-200">Math</span>
            <span className="text-surface-strong-light">Flow</span>
          </h1>
        </Link>
      )}

      {/* Left: Search Bar */}
      <div className="w-full max-w-[140px] sm:max-w-[200px] lg:max-w-[280px] relative">
        <div className="relative flex items-center w-full h-8 md:h-10 rounded-full bg-[var(--surface-muted)] overflow-hidden border border-transparent focus-within:border-[var(--surface-strong)] transition-colors px-2 md:px-4">
          <Search className="size-3.5 md:size-4 text-[var(--text-primary)]/50 mr-1 md:mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full h-full bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/40 font-sans"
          />
        </div>
      </div>

      {/* Center: Navigation */}
      <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
        {HEADER_MENUS.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.id}
              href={item.url}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                isActive
                  ? "text-[var(--surface-strong)]"
                  : "text-[var(--text-primary)]/80 hover:text-[var(--surface-strong)] hover:bg-[var(--surface-muted)]"
              )}
            >
              <item.icon className={cn("size-4", isActive ? "text-[var(--surface-strong)]" : "text-[var(--text-primary)]/60")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 md:gap-3">
        <ThemeToggle />
        <HeaderAuthControls />
      </div>
    </header>
  );
}
