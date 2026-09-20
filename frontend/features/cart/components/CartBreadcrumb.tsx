import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function CartBreadcrumb() {
  return (
    <div className="bg-[#f0fbfb]-highlight border-b border-[#008ca5]/10">
      <div className="w-full px-6 lg:px-10 xl:px-16 py-2.5">
        <Breadcrumb>
          <BreadcrumbList className="text-[var(--text-primary)]/60">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="hover:text-[#008ca5] transition-colors">
                  Trang chủ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#008ca5] font-medium">
                Giỏ hàng
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
