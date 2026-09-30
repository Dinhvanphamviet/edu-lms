"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function TeacherGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/teacher");
      return;
    }

    if (user && user.role !== "TEACHER" && user.role !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập khu vực giảng viên");
      router.replace("/");
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-base)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--surface-strong)]" />
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== "TEACHER" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-base)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--surface-strong)]" />
      </div>
    );
  }

  return <>{children}</>;
}
