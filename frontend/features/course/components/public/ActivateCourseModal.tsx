"use client";

import React, { useState, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { studentActivateCode, type ActivateCodeResponse } from "@/features/course/api/activation.api";
import { apiErrorMessage } from "@/lib/api-errors";
import Link from "next/link";
import { toast } from "sonner";

interface ActivateCourseModalProps {
  children: React.ReactNode;
}

export function ActivateCourseModal({ children }: ActivateCourseModalProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, user, refreshUser } = useAuth();
  const isStudent = isAuthenticated && user?.role === "STUDENT";
  const inputId = useId();
  const requestPending = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<ActivateCodeResponse | null>(null);

  const resetState = () => {
    setCode("");
    setErrorMessage(null);
    setSuccessResult(null);
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (requestPending.current) return;
    setIsOpen(open);
    if (!open) {
      resetState();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestPending.current || isAuthLoading) return;

    if (!isAuthenticated) {
      setErrorMessage("Bạn cần đăng nhập để kích hoạt khóa học.");
      return;
    }
    if (!isStudent) {
      setErrorMessage("Vui lòng sử dụng tài khoản học sinh để kích hoạt khóa học.");
      return;
    }

    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setErrorMessage("Vui lòng nhập mã kích hoạt.");
      return;
    }

    if (!/^[A-Z0-9]{8}$/.test(trimmedCode)) {
      setErrorMessage("Mã kích hoạt gồm đúng 8 ký tự chữ và số.");
      return;
    }

    requestPending.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await studentActivateCode(trimmedCode);
      setSuccessResult(result);
      toast.success("Kích hoạt khóa học thành công!");
      try {
        await refreshUser();
      } catch {
        toast.warning("Đã kích hoạt thành công. Chưa đồng bộ được thông tin tài khoản; hãy mở Khóa học của tôi để xem.");
      }
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        apiErrorMessage(err, "Chưa xác nhận được kết quả kích hoạt. Hãy kiểm tra kết nối và Khóa học của tôi trước khi thử lại.")
      );
    } finally {
      requestPending.current = false;
      setIsSubmitting(false);
    }
  };

  const handleGoToMyCourses = () => {
    handleOpenChange(false);
    router.push("/my-courses");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={!isSubmitting} className="w-[95vw] max-w-[560px] max-h-[90dvh] overflow-y-auto p-6 sm:p-10 border border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-center items-center text-center">
        {/* Success State */}
        {successResult ? (
          <div className="w-full space-y-6 animate-in fade-in-50 zoom-in-95">
            <div className="size-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Kích hoạt thành công!
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                Mã <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{successResult.code}</span> đã mở quyền học cho các khóa học sau:
              </DialogDescription>
            </div>

            {/* List of unlocked courses */}
            <p className="text-sm font-medium text-[var(--surface-strong)]">
              {successResult.accessExpiresAt ? `Quyền học đến ${new Date(successResult.accessExpiresAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}` : "Quyền học vô thời hạn"}
            </p>
            <div className="w-full max-h-56 overflow-y-auto space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-left">
              {successResult.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-2xs"
                >
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-[var(--surface-strong)] shrink-0 mt-0.5">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {course.title}
                    </h4>
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="size-3" /> Đã cấp quyền học viên
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetState}
                disabled={isSubmitting}
                className="w-full sm:flex-1 h-12 rounded-xl text-xs sm:text-sm font-medium"
              >
                Kích hoạt mã khác
              </Button>
              <Button
                type="button"
                onClick={handleGoToMyCourses}
                disabled={isSubmitting}
                className="w-full sm:flex-1 h-12 rounded-xl bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Vào học ngay</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="w-full flex flex-col items-center">
            <div className="size-14 rounded-2xl bg-teal-50 dark:bg-teal-950 text-[var(--surface-strong)] flex items-center justify-center mb-4">
              <KeyRound className="size-7" />
            </div>

            <DialogTitle className="text-2xl sm:text-[26px] font-bold text-slate-900 dark:text-slate-100 mb-2">
              Kích hoạt khóa học
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Nhập mã kích hoạt được giáo viên cấp để mở quyền tham gia vào các khóa học của bạn.
            </DialogDescription>

            {isAuthLoading && <p role="status" className="mb-4 text-sm text-slate-500">Đang kiểm tra tài khoản...</p>}
            {!isAuthLoading && isAuthenticated && !isStudent && (
              <p role="alert" className="mb-4 text-sm text-amber-700 dark:text-amber-300">
                Chức năng này dành cho tài khoản học sinh. Hãy đăng nhập bằng tài khoản học sinh để nhận quyền học.
              </p>
            )}

            {/* Unauthenticated Alert */}
            {!isAuthLoading && !isAuthenticated && (
              <div className="w-full p-4 mb-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm text-left flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <p className="font-semibold">Bạn cần đăng nhập để kích hoạt mã</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Quyền học sẽ được cấp chính xác cho tài khoản học sinh đang đăng nhập.
                  </p>
                  <Button
                    size="sm"
                    className="h-8 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5"
                    asChild
                  >
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <LogIn className="size-3.5" />
                      <span>Đăng nhập ngay</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div role="alert" id={`${inputId}-error`} className="w-full p-3.5 mb-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm text-left flex items-start gap-2.5 animate-in fade-in-50">
                <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
              <div className="w-full relative flex flex-col items-center">
                <label htmlFor={inputId} className="sr-only">Mã kích hoạt khóa học</label>
                <input
                  id={inputId}
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={8}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? `${inputId}-error` : undefined}
                  placeholder="Ví dụ: A1B2C3D3"
                  value={code}
                  disabled={isSubmitting || isAuthLoading || !isStudent}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\s/g, "").toUpperCase());
                    setErrorMessage(null);
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    setCode(e.clipboardData.getData("text").replace(/\s/g, "").toUpperCase().slice(0, 8));
                    setErrorMessage(null);
                  }}
                  className="w-full h-13 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-[var(--surface-strong)] focus:bg-white dark:focus:bg-slate-900 transition-colors text-center text-lg font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
                />

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="mt-3 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[var(--surface-strong)] transition-colors rounded-lg cursor-help flex items-center gap-1"
                      >
                        <KeyRound className="size-3.5" />
                        <span>Mã kích hoạt là gì?</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={8}
                      className="bg-slate-900 text-white border-none shadow-xl px-4 py-3 rounded-2xl text-xs max-w-[340px] text-center"
                    >
                      <p>
                        Mã kích hoạt là 1 dãy 8 ký tự gồm chữ và số in hoa (Ví dụ: A1B2C3D3). Mỗi mã chỉ có thể kích hoạt thành công 1 lần duy nhất.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button
                type="submit"
                aria-busy={isSubmitting}
                disabled={isSubmitting || isAuthLoading || !isStudent || !code.trim()}
                className="mt-6 h-12 px-8 w-full sm:w-auto bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Đang kích hoạt...</span>
                  </>
                ) : (
                  <>
                    <span>Kích hoạt ngay</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
