import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import { getHomePageData } from "@/features/home/api/home.api";
import { getCategories } from "@/features/course/api/course.api";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let collections: any[] = [];
  let categories: any[] = [];
  try {
    const homeData = await getHomePageData();
    if (homeData && homeData.collections) {
      collections = homeData.collections;
    }
    categories = await getCategories();
  } catch (err) {
    console.error("Layout fetch error:", err);
  }

  return (
    <PublicLayoutWrapper collections={collections} categories={categories}>
      {children}
    </PublicLayoutWrapper>
  );
}
