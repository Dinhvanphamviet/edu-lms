"use client";

import {
  Package,
  BookOpen,
  Users,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TeacherCollection } from "../types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80";

interface CollectionCardProps {
  collection: TeacherCollection;
  onEdit?: (col: TeacherCollection) => void;
  onDelete: (col: TeacherCollection) => void;
  onToggleStatus: (col: TeacherCollection) => void;
  isToggling?: boolean;
}

export function CollectionCard({
  collection: col,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggling = false,
}: CollectionCardProps) {
  const firstCover = col.courses?.[0]?.cover_image || FALLBACK_COVER;

  return (
    <div className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-[var(--surface-strong)]/40 transition-all duration-300">
      {/* Image banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={firstCover}
          alt={col.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Course count badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-semibold text-[11px] flex items-center gap-1.5 shadow-xs">
            <Package className="size-3" />
            <span>{col.courses.length} khóa học combo</span>
          </Badge>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "font-semibold text-[11px] border-none shadow-xs",
              col.is_active
                ? "bg-emerald-500 text-white"
                : "bg-slate-700 text-slate-200"
            )}
          >
            {col.is_active ? "Đang mở bán" : "Bản nháp / Đã ẩn"}
          </Badge>
        </div>

        {/* Short title banner at bottom of image */}
        {col.short_title && (
          <div className="absolute bottom-2.5 left-3">
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-[var(--surface-strong)] backdrop-blur-xs shadow-xs">
              {col.short_title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <Link href={`/teacher/collections/${col.id}`} className="block">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-[var(--surface-strong)] transition-colors line-clamp-2">
              {col.title}
            </h3>
          </Link>
        </div>

        {/* Stats & Price */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-slate-400" />
              <span>{col.total_lessons} bài giảng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 text-slate-400" />
              <span>{col.total_students} học viên</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-base font-black text-[var(--surface-strong)]">
                {new Intl.NumberFormat("vi-VN").format(col.sale_price)} đ
              </div>
              {col.original_price > col.sale_price && (
                <div className="text-[11px] text-slate-400 line-through">
                  {new Intl.NumberFormat("vi-VN").format(col.original_price)} đ
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleStatus(col)}
                disabled={isToggling}
                className={cn(
                  "h-8 px-2 rounded-xl text-xs",
                  col.is_active
                    ? "text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                    : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                )}
                title={col.is_active ? "Chuyển về bản nháp" : "Mở bán combo"}
              >
                {isToggling ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : col.is_active ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </Button>

              <Link href={`/teacher/collections/${col.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-xl text-xs border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <Edit3 className="size-3.5 mr-1" />
                  Sửa
                </Button>
              </Link>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(col)}
                className="h-8 px-2 rounded-xl text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Xóa combo"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
