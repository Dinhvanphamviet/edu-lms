export interface Banner {
  id: number;
  image_url: string;
  title: string;
  link_url: string;
}

export interface CountdownConfig {
  id: number;
  title: string;
  target_date: string;
}

export interface Course {
  id: string;
  title: string;
  release_date: string;
  price: number;
  cover_image: string;
  tags: string[];
  slug?: string;
  description?: string;
}

export interface CourseCollection {
  id: string;
  title: string;
  short_title: string;
  original_price: number;
  sale_price: number;
  courses: Course[];
}

export interface HomeData {
  banners: Banner[];
  countdown: CountdownConfig | null;
  collections: CourseCollection[];
}

export interface HomeApiResponse {
  status: string;
  data: HomeData;
}

export async function getHomePageData(): Promise<HomeData> {
  const isServer = typeof window === "undefined";
  const backendUrl = isServer 
    ? process.env.API_URL_SERVER || "http://backend:8080/api/v1"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
  
  // Fetching data from the server-side, adding cache revalidation
  const res = await fetch(`${backendUrl}/public/home`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch home page data");
  }

  const result: HomeApiResponse = await res.json();
  return result.data;
}
