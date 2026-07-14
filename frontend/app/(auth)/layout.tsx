import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Column: Visual/Brand (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[var(--surface-strong)] text-[var(--text-inverse)] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background glow/pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <Link href="/" className="relative z-10 flex items-center gap-2 font-medium text-lg hover:opacity-80 transition-opacity">
          <ArrowLeft className="size-5" />
          Quay lại trang chủ
        </Link>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-sans font-bold leading-[1.1] tracking-tight mb-6">
            Nền tảng Học Toán<br />chuyên sâu & toàn diện.
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
            Lộ trình học tập cá nhân hóa, bài giảng chất lượng cao và hệ thống đánh giá năng lực liên tục giúp bạn chinh phục mọi kỳ thi.
          </p>
        </div>
        
        <div className="relative z-10 text-sm text-[var(--text-secondary)] font-medium">
          © {new Date().getFullYear()} MathFlow.
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-12 relative bg-[var(--surface-base)]">
        {/* Mobile back button */}
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] lg:hidden">
          <ArrowLeft className="size-4" />
          Trang chủ
        </Link>
        
        <div className="w-full max-w-sm flex flex-col gap-6">
          {children}
        </div>
      </div>
    </div>
  );
}
