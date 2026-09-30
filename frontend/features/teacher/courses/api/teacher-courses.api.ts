import type { CourseItem } from "../types";

export async function getTeacherCourses(): Promise<CourseItem[]> {
  const { default: api } = await import("@/lib/api");
  const res = await api.get("/teacher/courses");
  return res.data.data;
}

export interface CreateCoursePayload {
  title: string;
  category_id?: string;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  description?: string;
  price?: number;
  cover_image?: string;
  release_date?: string;
  tags?: string[];
}

export async function createTeacherCourse(data: CreateCoursePayload): Promise<CourseItem> {
  const { default: api } = await import("@/lib/api");
  const res = await api.post("/teacher/courses", data);
  return res.data.data;
}

export async function updateTeacherCourseStatus(
  courseId: string,
  status: "PUBLISHED" | "DRAFT" | "HIDDEN"
): Promise<void> {
  const { default: api } = await import("@/lib/api");
  await api.patch(`/teacher/courses/${courseId}/status`, { status });
}

export interface TeacherCourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: "PUBLISHED" | "DRAFT" | "HIDDEN";
  cover_image: string;
  release_date: string;
  tags: string[];
  category_id: string;
  category_name: string;
  updated_at: string;
}

export type UpdateCoursePayload = CreateCoursePayload;

export async function getTeacherCourseDetail(courseId: string): Promise<TeacherCourseDetail> {
  const { default: api } = await import("@/lib/api");
  const res = await api.get(`/teacher/courses/${courseId}`);
  return res.data.data;
}

export async function updateTeacherCourseDetail(
  courseId: string,
  data: UpdateCoursePayload
): Promise<TeacherCourseDetail> {
  const { default: api } = await import("@/lib/api");
  const res = await api.put(`/teacher/courses/${courseId}`, data);
  return res.data.data;
}

