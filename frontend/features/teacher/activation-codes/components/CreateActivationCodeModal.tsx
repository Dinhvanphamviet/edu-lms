"use client";

import { useState, useEffect, useRef } from "react";
import {
  KeyRound,
  X,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActivationCodeItem, CourseOption } from "../types";
import { createTeacherActivationCodes, activationErrorMessage } from "../api/activation-codes.api";
import { toast } from "sonner";

interface CreateActivationCodeModalProps {
  isOpen: boolean;
  courses: CourseOption[];
  onClose: () => void;
  onCreated: (newCodes: ActivationCodeItem[]) => void;
}

export function CreateActivationCodeModal({
  isOpen,
  courses,
  onClose,
  onCreated,
}: CreateActivationCodeModalProps) {
  const [createMode, setCreateMode] = useState<"SINGLE" | "BATCH">("SINGLE");
  // Default to empty array - teacher chooses which courses to apply
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [formBatchQuantity, setFormBatchQuantity] = useState(10);
  const [formHasExpiry, setFormHasExpiry] = useState(false);
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [hasAccessDuration, setHasAccessDuration] = useState(false);
  const [accessDurationValue, setAccessDurationValue] = useState(3);
  const [accessDurationUnit, setAccessDurationUnit] = useState<"DAY" | "MONTH" | "YEAR">("MONTH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestPending = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [generatedResultCodes, setGeneratedResultCodes] = useState<string[]>([]);
  const [copiedItemCode, setCopiedItemCode] = useState<string | null>(null);

  // The parent mounts a fresh form on open; block dismissal while creating codes.
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && !requestPending.current) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter valid selected courses that actually exist in the current courses list
  const validChosenCourses = courses.filter((c) => selectedCourseIds.includes(c.id));
  const selectedCount = validChosenCourses.length;

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
    setErrorMessage(null);
  };

  const handleSelectAllCourses = () => {
    if (selectedCount === courses.length && courses.length > 0) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(courses.map((c) => c.id));
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestPending.current) return;

    if (validChosenCourses.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất một khóa học để gắn với mã kích hoạt.");
      return;
    }

    if (formHasExpiry && !formExpiryDate) {
      setErrorMessage("Vui lòng chọn ngày hết hạn kích hoạt hoặc tích 'Không giới hạn thời gian'.");
      return;
    }

    const qty = createMode === "SINGLE" ? 1 : formBatchQuantity;
    const maximumDuration = { DAY: 36500, MONTH: 1200, YEAR: 100 }[accessDurationUnit];
    if (hasAccessDuration && (!Number.isInteger(accessDurationValue) || accessDurationValue < 1 || accessDurationValue > maximumDuration)) {
      setErrorMessage(`Thời hạn học phải là số nguyên từ 1 đến ${maximumDuration}.`);
      return;
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 100) {
      setErrorMessage("Số lượng mã phải là số nguyên từ 1 đến 100.");
      return;
    }

    const expiryISO = formHasExpiry && formExpiryDate
      ? new Date(`${formExpiryDate}T23:59:59.999+07:00`).toISOString()
      : null;
    if (expiryISO && new Date(expiryISO).getTime() <= Date.now()) {
      setErrorMessage("Hạn kích hoạt phải ở tương lai.");
      return;
    }
    requestPending.current = true;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const createdItems = await createTeacherActivationCodes(
        {
          courseIds: validChosenCourses.map((c) => c.id),
          quantity: qty,
          expiresAt: expiryISO,
          accessDurationValue: hasAccessDuration ? accessDurationValue : null,
          accessDurationUnit: hasAccessDuration ? accessDurationUnit : null,
        }
      );

      onCreated(createdItems);
      setGeneratedResultCodes(createdItems.map((item) => item.code));
      toast.success(
        `Đã tạo thành công ${createdItems.length} mã kích hoạt cho ${validChosenCourses.length} khóa học!`
      );
    } catch (err: unknown) {
      setErrorMessage(activationErrorMessage(err, "Không thể tạo mã. Hãy làm mới danh sách để kiểm tra trước khi thử lại."));
    } finally {
      requestPending.current = false;
      setIsSubmitting(false);
    }
  };

  const handleCopySingle = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedItemCode(code);
    toast.success(`Đã sao chép mã: ${code}`);
    setTimeout(() => setCopiedItemCode(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedResultCodes.join("\n"));
    toast.success(`Đã sao chép toàn bộ ${generatedResultCodes.length} mã kích hoạt!`);
  };

  const handleCloseModal = () => {
    if (requestPending.current) return;
    setSelectedCourseIds([]);
    setGeneratedResultCodes([]);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      onClick={handleCloseModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5 sm:p-6 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <KeyRound className="size-6 text-[var(--surface-strong)]" />
              <span>Tạo mã kích hoạt khóa học</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Mỗi mã dùng 1 lần, mở quyền truy cập cho một hoặc nhiều khóa học cùng lúc.
            </p>
          </div>
          <button
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Result view */}
          {generatedResultCodes.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
                  <span>Đã tạo thành công {generatedResultCodes.length} mã kích hoạt!</span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Mỗi mã được gán với {validChosenCourses.length} khóa học đã chọn. Bạn có thể sao chép để gửi ngay cho học sinh.
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-2">
                {generatedResultCodes.map((codeStr, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700"
                  >
                    <span className="font-bold tracking-widest text-slate-900 dark:text-slate-100 text-sm">
                      {codeStr}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySingle(codeStr)}
                      className="text-xs text-[var(--surface-strong)] hover:underline font-semibold flex items-center gap-1"
                    >
                      {copiedItemCode === codeStr ? (
                        <>
                          <Check className="size-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyAll}
                  className="rounded-xl text-xs gap-1.5"
                >
                  <Copy className="size-3.5" />
                  <span>Sao chép tất cả ({generatedResultCodes.length} mã)</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl text-xs"
                >
                  Hoàn tất
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Course Multi-select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-slate-500" />
                    <span>Khóa học được mở quyền * ({selectedCount} đã chọn)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllCourses}
                    className="text-[11px] text-[var(--surface-strong)] hover:underline font-medium"
                  >
                    {selectedCount === courses.length && courses.length > 0
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả"}
                  </button>
                </div>

                {courses.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                    Không có khóa học nào khả dụng.
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                    {courses.map((course) => {
                      const isChecked = selectedCourseIds.includes(course.id);
                      return (
                        <label
                          key={course.id}
                          className={cn(
                            "flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors",
                            isChecked
                              ? "bg-white dark:bg-slate-800 border-teal-500/50 shadow-2xs text-slate-900 dark:text-slate-100 font-medium"
                              : "bg-transparent border-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-400"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCourse(course.id)}
                            className="mt-0.5 rounded border-slate-300 text-[var(--surface-strong)] focus:ring-[var(--surface-strong)]"
                          />
                          <span className="flex-1 line-clamp-2 leading-relaxed">
                            {course.title}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mode Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Phương thức phát hành mã
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCreateMode("SINGLE")}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center",
                      createMode === "SINGLE"
                        ? "bg-[var(--surface-strong)] text-white border-[var(--surface-strong)] shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    )}
                  >
                    Tạo 1 mã kích hoạt
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateMode("BATCH")}
                    className={cn(
                      "py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center",
                      createMode === "BATCH"
                        ? "bg-[var(--surface-strong)] text-white border-[var(--surface-strong)] shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    )}
                  >
                    Tạo hàng loạt (Lô)
                  </button>
                </div>
              </div>

              {/* Mode Details */}
              {createMode === "SINGLE" ? (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-slate-800 dark:text-slate-200">
                      Định dạng chuẩn hệ thống:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Hệ thống tự động sinh 1 mã gồm 8 ký tự chữ và số in hoa (VD: A1B2C3D3).
                    </span>
                  </div>
                  <Badge variant="outline" className="font-mono bg-white dark:bg-slate-800 text-slate-700 text-xs font-bold">
                    8 KÝ TỰ
                  </Badge>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Số lượng mã cần tạo trong lô (1 - 100)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={formBatchQuantity}
                    onChange={(e) => setFormBatchQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <p className="text-[11px] text-slate-500">
                    Mỗi mã trong lô được cấp cùng danh sách khóa học trên và chỉ sử dụng một lần.
                  </p>
                </div>
              )}

              <div className="space-y-2 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={hasAccessDuration} disabled={isSubmitting} onChange={(e) => setHasAccessDuration(e.target.checked)} />
                  Giới hạn thời hạn học được cấp
                </label>
                {hasAccessDuration && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input aria-label="Số lượng thời hạn học" type="number" min={1} max={{ DAY: 36500, MONTH: 1200, YEAR: 100 }[accessDurationUnit]} step={1} value={accessDurationValue} disabled={isSubmitting} onChange={(e) => setAccessDurationValue(Number(e.target.value))} />
                    <select aria-label="Đơn vị thời hạn học" value={accessDurationUnit} disabled={isSubmitting} onChange={(e) => setAccessDurationUnit(e.target.value as "DAY" | "MONTH" | "YEAR")} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm">
                      <option value="DAY">Ngày</option><option value="MONTH">Tháng</option><option value="YEAR">Năm</option>
                    </select>
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  {hasAccessDuration ? `Cấp ${accessDurationValue} ${{ DAY: "ngày", MONTH: "tháng", YEAR: "năm" }[accessDurationUnit]} học cho tất cả khóa trong mã, tính từ lúc học sinh kích hoạt thành công.` : "Mã cấp quyền học vô thời hạn cho tất cả khóa đã chọn."}
                </p>
              </div>

              {/* Expiry Settings */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Thời hạn kích hoạt
                  </label>
                  <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!formHasExpiry}
                      onChange={(e) => setFormHasExpiry(!e.target.checked)}
                      className="rounded text-[var(--surface-strong)]"
                    />
                    <span>Không giới hạn thời gian</span>
                  </label>
                </div>
                <Input
                  type="date"
                  disabled={!formHasExpiry}
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
                  className={cn(
                    "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl",
                    !formHasExpiry && "opacity-50 cursor-not-allowed"
                  )}
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || courses.length === 0}
                  className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white rounded-xl text-xs flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                  <span>
                    {createMode === "SINGLE" ? "Tạo mã kích hoạt" : `Tạo ${formBatchQuantity} mã`}
                  </span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
