"use client";

import { useState, useRef } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImageToCloudinary } from "../../api/cloudinary.api";

interface CourseCoverSectionProps {
  coverImage: string;
  onCoverImageChange: (value: string) => void;
}

export function CourseCoverSection({
  coverImage,
  onCoverImageChange,
}: CourseCoverSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Dung lượng ảnh không được vượt quá 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");

      const result = await uploadImageToCloudinary(file);
      onCoverImageChange(result.url);
    } catch (err: any) {
      setUploadError(
        err?.message ||
          "Tải ảnh lên Cloudinary thất bại. Hãy kiểm tra Upload Preset.",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-4 text-[var(--surface-strong)]" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Ảnh bìa khóa học
          </h2>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Zone / Preview Area */}
      {coverImage ? (
        <div className="space-y-3">
          <div className="relative aspect-video w-full max-w-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 group shadow-xs">
            <img
              src={coverImage}
              alt="Ảnh bìa khóa học"
              className="w-full h-full object-cover"
            />

            {/* Overlay Action Buttons on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 backdrop-blur-xs">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 rounded-xl text-xs gap-1.5 bg-white/90 hover:bg-white text-slate-800 shadow-xs"
              >
                {isUploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="size-3.5" />
                )}
                <span>Đổi ảnh khác</span>
              </Button>

              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={isUploading}
                onClick={() => onCoverImageChange("")}
                className="h-8 rounded-xl text-xs gap-1.5 shadow-xs"
              >
                <Trash2 className="size-3.5" />
                <span>Xóa ảnh</span>
              </Button>
            </div>

            <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-400" />
              <span>Đã lưu ảnh bìa</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: Kéo thả / Chọn ảnh */
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isUploading
              ? "border-[var(--surface-strong)] bg-teal-50/30 dark:bg-teal-950/20 cursor-wait"
              : "border-slate-200 hover:border-[var(--surface-strong)] bg-slate-50/60 dark:bg-slate-800/30 hover:bg-white"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <Loader2 className="size-8 text-[var(--surface-strong)] animate-spin" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Đang tải ảnh lên Cloudinary...
              </p>
              <p className="text-[11px] text-slate-400">
                Ảnh đang được tối ưu hóa và đẩy lên CDN Cloudinary
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center group">
              <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-[var(--surface-strong)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <UploadCloud className="size-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Bấm vào đây để tải ảnh bìa lên Cloudinary
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Hỗ trợ định dạng PNG, JPG, WEBP (Tối đa 10MB, khuyến nghị tỷ lệ
                16:9)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span className="font-medium">{uploadError}</span>
          </div>
          <div className="text-[11px] text-rose-600 pl-6">
            Gợi ý: Cần tạo <b>Unsigned Upload Preset</b> trên Cloudinary
            Dashboard (Settings &gt; Upload &gt; Upload presets &gt; Add upload
            preset &gt; Chuyển sang <i>Unsigned</i>).
          </div>
        </div>
      )}

    </div>
  );
}
