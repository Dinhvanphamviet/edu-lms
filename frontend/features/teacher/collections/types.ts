export interface TeacherCollectionCourse {
  id: string;
  title: string;
  slug: string;
  price: number;
  cover_image: string;
  status: string;
}

export interface TeacherCollection {
  id: string;
  title: string;
  short_title: string;
  original_price: number;
  sale_price: number;
  is_active: boolean;
  total_lessons: number;
  total_students: number;
  courses: TeacherCollectionCourse[];
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionPayload {
  title: string;
  short_title?: string;
  original_price?: number;
  sale_price?: number;
  is_active?: boolean;
  course_ids?: string[];
}

export interface UpdateCollectionPayload {
  title: string;
  short_title?: string;
  original_price?: number;
  sale_price?: number;
  is_active?: boolean;
  course_ids?: string[];
}
