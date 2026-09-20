import React from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutList, Layers, FileText, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { CourseData } from "./CourseCard";

interface QuickViewModalProps {
  course: CourseData;
  children: React.ReactNode;
}

export function QuickViewModal({ course, children }: QuickViewModalProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(course.price) + ' VNĐ';
  const courseUrl = `/courses/${course.slug || "step-1-2027-nen-tang-toan-12"}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[800px] sm:max-w-[800px] md:max-w-[800px] md:min-h-[520px] p-0 overflow-hidden border-none rounded-2xl bg-white flex flex-col justify-between">
        <div className="flex flex-col p-6 md:p-8">
          {/* Top Section: Small Image + Title/Stats */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Thumbnail Image */}
            <div className="w-full sm:w-[240px] shrink-0 rounded-xl overflow-hidden shadow-sm aspect-[4/3] bg-slate-100">
              <img src={course.cover_image} alt={course.title} className="w-full h-full object-cover" />
            </div>

            {/* Title and Stats */}
            <div className="flex flex-col flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-[var(--surface-strong)] leading-tight mb-2">
                {course.title}
              </h2>
              <div className="text-surface-strong font-bold text-xl mb-4">
                {formattedPrice}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <LayoutList className="w-5 h-5 text-surface-strong" />
                  <span className="text-[14px]">
                    <strong className="font-bold">{course.stats?.lessons ?? 0}</strong> Bài giảng chất lượng cao
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <Layers className="w-5 h-5 text-surface-strong" />
                  <span className="text-[14px]">
                    <strong className="font-bold">{course.stats?.exams ?? 0}</strong> Bài thi & Luyện tập
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-primary)]">
                  <FileText className="w-5 h-5 text-surface-strong" />
                  <span className="text-[14px]">
                    <strong className="font-bold">{course.stats?.documents ?? 0}</strong> Tài liệu & PDF đi kèm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Description */}
          <div className="border-t border-dashed border-gray-300 pt-5 mb-6">
            <h3 className="font-bold text-surface-strong mb-2 text-lg">Mô tả khoá học</h3>
            <p className="text-[14px] text-[var(--text-primary)]/80 leading-relaxed">
              Khoá học <strong className="text-surface-accent">{course.title}</strong> cung cấp hệ thống bài giảng bám sát cấu trúc đề thi mới nhất.
              Nội dung giảng dạy chi tiết, dễ hiểu, giúp học sinh <strong className="text-surface-accent">HIỂU RÕ - HIỂU SÂU</strong> kiến thức trọng tâm.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-auto">
            <Button variant="outline" className="flex-1 h-12 rounded-full border-surface-accent text-surface-accent hover:bg-surface-accent/5 font-bold text-sm" asChild>
              <Link href={courseUrl}>
                Xem chi tiết
              </Link>
            </Button>
            <Button
              className="flex-1 h-12 rounded-full bg-surface-accent hover:bg-surface-accent-hover text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
              onClick={() => {
                const { addItem } = useCart.getState();
                const added = addItem({
                  id: course.id,
                  title: course.title,
                  slug: course.slug || course.id,
                  price: course.price,
                  cover_image: course.cover_image,
                });
                if (added) toast.success("Đã thêm vào giỏ hàng");
                else toast.info("Khóa học đã có trong giỏ hàng");
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
