import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ActivateCourseModalProps {
  children: React.ReactNode;
}

export function ActivateCourseModal({ children }: ActivateCourseModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] sm:max-w-[600px] md:max-w-[600px] p-8 md:px-16 md:py-12 border-none rounded-3xl bg-white flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl md:text-[28px] font-bold text-[var(--surface-strong)] mb-10 whitespace-nowrap">
          Kích hoạt khoá học
        </h2>

        <div className="w-full relative flex flex-col items-center">
          <input
            type="text"
            placeholder="Nhập mã kích hoạt"
            className="w-full h-12 px-5 rounded-xl border-2 border-[var(--border-default)] bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-base"
          />

          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="mt-4 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl cursor-help">
                  <span className="text-blue-500 text-[15px] font-medium">
                    Mã kích hoạt là gì?
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={10}
                className="bg-white text-gray-800 border border-gray-200 shadow-md px-4 py-3 rounded-2xl text-[15px] max-w-[400px] text-center"
              >
                <p>Mã kích hoạt là 1 dãy 8 ký tự, bao gồm chữ và số. Ví dụ: A1B2C3D3</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button className="mt-8 h-12 px-8 bg-[var(--surface-strong)] hover:bg-[var(--surface-strong)]/90 text-white rounded-xl font-semibold text-base">
          Kích hoạt <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
