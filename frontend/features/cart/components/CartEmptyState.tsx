import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartEmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[var(--border-default)] flex flex-col items-center justify-center py-20">
      <div className="size-24 rounded-3xl bg-[var(--surface-muted)] flex items-center justify-center mb-6">
        <ShoppingBag className="size-12 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        Giỏ hàng trống
      </h2>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Hãy khám phá các khóa học chất lượng và thêm vào giỏ hàng để bắt đầu học tập!
      </p>
      <Button
        className="h-11 rounded-xl bg-[var(--surface-strong)] hover:bg-[var(--surface-strong)]/90 text-white px-8"
        asChild
      >
        <Link href="/courses">Khám phá khóa học</Link>
      </Button>
    </div>
  );
}
