"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export function PublicLayoutWrapper({ 
  children,
  collections = [],
  categories = []
}: { 
  children: React.ReactNode;
  collections?: any[];
  categories?: any[];
}) {
  const pathname = usePathname();
  
  // Các trang full-width không có sidebar
  const isFullWidthPage = (pathname.startsWith("/courses/") && pathname.length > "/courses/".length) || pathname.startsWith("/cart");

  return (
    <div className="flex min-h-screen w-full bg-cyan-50">
      {!isFullWidthPage && <Sidebar collections={collections} categories={categories} />}
      <div 
        className={`flex-1 flex flex-col min-h-screen relative transition-all duration-300 ${
          !isFullWidthPage ? "md:ml-[280px] lg:ml-[320px] xl:ml-[360px] 2xl:ml-[400px]" : "w-full"
        }`}
      >
        <Header />
        <main className={`flex-1 overflow-x-hidden ${!isFullWidthPage ? 'p-6 md:p-8' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
