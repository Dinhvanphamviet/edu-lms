"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SIDEBAR_MENUS, SOCIAL_LINKS, FOOTER_MENUS } from "@/constants/navigation";
import { useEffect, useState } from "react";
import { getHomePageData, CourseCollection } from "@/features/home/api/home.api";
import { getCategories, CourseCategory } from "@/features/course/api/course.api";
import { ActivateCourseModal } from "@/features/course/components/public/ActivateCourseModal";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Phone, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Icon Renderer for Custom Social Links
const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "phone": return <Phone className="size-5" />;
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7.5v4H10V22h4v-8.5z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M21.582 6.186a2.506 2.506 0 0 0-1.76-1.766C18.265 4 12 4 12 4s-6.264 0-7.822.42a2.506 2.506 0 0 0-1.76 1.766C2 7.76 2 12 2 12s0 4.24.418 5.814a2.506 2.506 0 0 0 1.76 1.766C5.736 20 12 20 12 20s6.265 0 7.822-.42a2.506 2.506 0 0 0 1.76-1.766C22 16.24 22 12 22 12s0-4.24-.418-5.814zM9.88 15.13V8.87L15.35 12l-5.47 3.13z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-14c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" />
        </svg>
      );
    default: return <X className="size-5" />;
  }
};

export function Sidebar({ 
  collections = [], 
  categories = [] 
}: { 
  collections?: CourseCollection[], 
  categories?: CourseCategory[] 
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="w-[280px] lg:w-[320px] xl:w-[360px] 2xl:w-[400px] h-screen fixed top-0 left-0 border-r border-[var(--border-default)] bg-[var(--surface-base)] flex flex-col z-40 hidden md:flex transition-all duration-300">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-transparent">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-gradient-to-br from-surface-strong-light to-surface-strong-dark size-8 rounded-xl flex items-center justify-center text-white shadow-sm shadow-surface-strong-light/20 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4.5"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" /></svg>
          </div>
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-slate-800 dark:text-slate-200">Math</span>
            <span className="text-surface-strong-light">Flow</span>
          </h1>
        </Link>
      </div>

      {/* Navigation or Course Categories */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
        {pathname === "/" ? (
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-surface-strong-light text-white text-sm font-bold shadow-sm mb-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              Trang chủ
            </button>


            {collections.map((collection) => {
              return (
                <a
                  key={collection.id}
                  href={`#${collection.id}`}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-muted)]",
                    "text-[var(--text-primary)]/80"
                  )}
                >
                  {collection.short_title || collection.title}
                </a>
              );
            })}
          </nav>
        ) : pathname.startsWith("/courses") ? (
          <nav className="flex flex-col gap-1">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-surface-strong-light text-white text-sm font-bold shadow-sm mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              Danh mục khoá học
            </div>

            <Link
              href="/courses"
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-muted)]",
                (searchParams.get("category") === "all" || !searchParams.get("category"))
                  ? "bg-cyan-50 text-surface-strong-light font-bold"
                  : "text-[var(--text-primary)]/80"
              )}
            >
              Tất cả khoá học
            </Link>

            {categories.map((category) => {
              const isActive = searchParams.get("category") === category.slug;
              return (
                <Link
                  key={category.id}
                  href={`/courses?category=${category.slug}`}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-muted)]",
                    isActive
                      ? "bg-cyan-50 text-surface-strong-light font-bold"
                      : "text-[var(--text-primary)]/80"
                  )}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="flex flex-col gap-1">
            {SIDEBAR_MENUS.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--surface-muted)] text-[var(--surface-strong)]"
                      : "text-[var(--text-primary)]/80 hover:bg-[var(--surface-muted)]/50 hover:text-[var(--surface-strong)]"
                  )}
                >
                  <item.icon className={cn("size-5", isActive ? "text-[var(--surface-strong)]" : "text-[var(--text-primary)]/60")} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Action Button */}
        <div className="mt-8 mb-6">
          <ActivateCourseModal>
            <Button className="w-full bg-surface-accent-soft hover:bg-surface-accent/90 text-white rounded-full py-5 text-sm font-semibold shadow-md">
              Kích hoạt khóa học
            </Button>
          </ActivateCourseModal>
        </div>

        {/* Profile Card */}
        <div className="group relative overflow-hidden bg-[var(--surface-base)] border border-[var(--border-default)] rounded-2xl p-4 mb-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--border-default)]">
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--surface-strong)]/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-opacity group-hover:opacity-100 opacity-60" />
          
          <div className="relative flex items-center gap-3.5 mb-4">
            <div className="size-12 rounded-full bg-[var(--surface-muted)] border border-[var(--border-default)] shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
              <span className="text-[var(--surface-strong)] font-bold text-sm tracking-tight">ĐV</span>
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[var(--text-primary)] truncate tracking-tight">Đinh Việt</h4>
                <BadgeCheck className="size-4 text-[var(--surface-strong)] flex-shrink-0" />
              </div>
              <span className="text-[11px] text-[var(--text-primary)]/60 font-medium truncate mt-0.5">Giảng viên Chuyên môn</span>
            </div>
          </div>

          <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center justify-center px-2 py-1 bg-[var(--surface-muted)] text-[var(--text-primary)]/80 text-[10px] font-semibold rounded-md border border-[var(--border-default)]/60 uppercase tracking-wider">
                SOICT
              </span>
              <span className="inline-flex items-center justify-center px-2 py-1 bg-[var(--surface-muted)] text-[var(--text-primary)]/80 text-[10px] font-semibold rounded-md border border-[var(--border-default)]/60 uppercase tracking-wider">
                HUST
              </span>
            </div>
            
            <Button asChild size="sm" className="h-7 px-4 text-[11px] font-bold bg-[var(--surface-strong)] hover:bg-[var(--surface-strong)]/90 text-white rounded-full transition-colors shadow-sm flex-shrink-0 w-full xl:w-auto">
              <a href="https://www.facebook.com/tolavietdayahihihi" target="_blank" rel="noopener noreferrer">
                Theo dõi
              </a>
            </Button>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-between items-center mb-8 px-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="size-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{
                backgroundColor:
                  link.iconType === 'facebook' ? '#1877f2' :
                    link.iconType === 'youtube' ? '#ff0000' :
                      link.iconType === 'tiktok' ? '#000000' :
                        link.iconType === 'phone' ? '#e11d48' : '#000000'
              }}
            >
              <SocialIcon type={link.iconType} />
            </a>
          ))}
        </div>

        {/* Footer Accordions */}
        <Accordion type="single" collapsible className="w-full">
          {FOOTER_MENUS.map((menu) => (
            <AccordionItem key={menu.id} value={`item-${menu.id}`} className="border-b-[var(--border-default)]">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3 text-[var(--text-primary)]">
                {menu.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="flex flex-col gap-2 pb-2 pl-2">
                  {menu.items.map((item) => (
                    <li key={item.id}>
                      <Link href={item.url} className="text-xs text-[var(--text-primary)]/70 hover:text-[var(--surface-strong)] no-underline">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Footer copyright */}
      <div className="p-4 text-xs text-[var(--text-primary)]/50 border-t border-[var(--border-default)] bg-[var(--surface-muted)]">
        &copy; 2026 MathFlow.
      </div>
    </aside>
  );
}
