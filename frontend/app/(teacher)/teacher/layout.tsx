import { TeacherSidebar } from "@/components/layouts/teacher/TeacherSidebar";
import { TeacherHeader } from "@/components/layouts/teacher/TeacherHeader";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--surface-base)]">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative transition-all duration-300 md:ml-[240px] lg:ml-[260px] xl:ml-[280px]">
        <TeacherHeader />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
