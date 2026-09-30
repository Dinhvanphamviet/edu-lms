"use client";

import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { deleteTeacherCollection } from "../api/teacher-collections.api";
import type { TeacherCollection } from "../types";

interface DeleteCollectionModalProps {
  collection: TeacherCollection | null;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteCollectionModal({
  collection,
  onClose,
  onDeleted,
}: DeleteCollectionModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!collection) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTeacherCollection(collection.id);
      toast.success(`Đã xóa bộ sưu tập "${collection.title}"`);
      onDeleted();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Xóa bộ sưu tập thất bại";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50">
            <Trash2 className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Xóa bộ sưu tập
            </h3>
            <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          Bạn có chắc chắn muốn xóa bộ sưu tập{" "}
          <strong className="text-slate-900 dark:text-slate-100 font-semibold">
            &quot;{collection.title}&quot;
          </strong>
          ?
        </p>

        {collection.total_students > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>
              Bộ sưu tập này đang có <strong>{collection.total_students}</strong> học viên đang theo học.
            </span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl text-xs"
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isDeleting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Đang xóa...</span>
              </span>
            ) : (
              "Xác nhận xóa"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
