import { Header } from "@/components/layout/header";

export default function MyCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-cyan-50">
      <div className="flex-1 flex flex-col min-h-screen relative w-full">
        <Header />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
