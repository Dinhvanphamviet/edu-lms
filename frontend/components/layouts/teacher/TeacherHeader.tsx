"use client";

import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeacherSidebar } from "./TeacherSidebarContext";

export function TeacherHeader() {
  const { toggleMobile } = useTeacherSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-14 lg:h-[60px] items-center gap-4 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6">
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={toggleMobile}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      <div className="w-full flex-1">
        {/* Placeholder cho Breadcrumbs hoặc Search bar */}
      </div>

      <Button variant="outline" size="icon" className="ml-auto h-8 w-8 rounded-full">
        <Bell className="h-4 w-4 text-text-primary" />
        <span className="sr-only">Toggle notifications</span>
      </Button>

      <Button variant="secondary" size="icon" className="rounded-full">
        <User className="h-5 w-5" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </header>
  );
}
