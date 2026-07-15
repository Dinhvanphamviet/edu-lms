import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Link2 } from "lucide-react";

interface RegisterModalProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RegisterModal({ children, open, onOpenChange }: RegisterModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="w-[95vw] max-w-[800px] sm:max-w-[800px] md:max-w-[800px] md:min-h-[520px] p-8 md:p-10 border-none rounded-2xl bg-white flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-surface-strong mb-6">
          Hướng dẫn đăng kí khóa học
        </h2>

        <Button variant="outline" className="mb-10 rounded-lg border-surface-strong text-surface-strong hover:bg-surface-strong/5 h-12 px-6 font-medium text-sm">
          <Link2 className="w-5 h-5 mr-2" /> Kích hoạt khoá học
        </Button>

        <div className="flex flex-col gap-6 text-left w-full max-w-[500px]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-surface-strong shrink-0 mt-0.5 fill-surface-strong text-white" />
            <span className="text-[16px] text-gray-800 leading-relaxed">
              Em vui lòng nhắn tin cho fan page của cô để được tư vấn chi tiết trước khi đăng kí:
            </span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-surface-strong shrink-0 fill-surface-strong text-white" />
            <span className="text-[16px] text-gray-800">
              <strong className="font-bold">Fanpage:</strong> <a href="https://fb.com/NgocHuyenLBMath/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">https://fb.com/NgocHuyenLBMath/</a>
            </span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-surface-strong shrink-0 fill-surface-strong text-white" />
            <span className="text-[16px] text-gray-800">
              <strong className="font-bold">Messenger:</strong> <a href="https://m.me/NgocHuyenLBMath" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">https://m.me/NgocHuyenLBMath</a>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
