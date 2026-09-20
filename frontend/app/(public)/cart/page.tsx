import { Suspense } from "react";
import { CartContent } from "@/features/cart/components/CartContent";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";

export const metadata = {
  title: "Giỏ hàng | MathFlow",
  description: "Giỏ hàng các khóa học trực tuyến tại MathFlow",
};

export default function CartPage() {
  return (
    <Suspense fallback={<CartSkeleton />}>
      <CartContent />
    </Suspense>
  );
}
