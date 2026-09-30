"use client";

import { TeacherSidebar } from "@/components/layouts/teacher/TeacherSidebar";
import { TeacherHeader } from "@/components/layouts/teacher/TeacherHeader";
import { TeacherGuard } from "@/components/layouts/teacher/TeacherGuard";
import {
  TeacherSidebarProvider,
  useTeacherSidebar,
} from "@/components/layouts/teacher/TeacherSidebarContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function TeacherLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useTeacherSidebar();

  return (
    <div className="flex min-h-screen w-full bg-[var(--surface-base)]">
      <TeacherSidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen relative transition-all duration-300 ease-in-out",
          isCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        )}
      >
        <TeacherHeader />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8 bg-slate-50/60 dark:bg-slate-950/40">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeacherGuard>
      <TeacherSidebarProvider>
        <TooltipProvider delayDuration={150}>
          <TeacherLayoutContent>{children}</TeacherLayoutContent>
        </TooltipProvider>
      </TeacherSidebarProvider>
    </TeacherGuard>
  );
}
