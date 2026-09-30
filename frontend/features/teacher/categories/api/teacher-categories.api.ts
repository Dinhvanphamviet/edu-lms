export interface TeacherCategory {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  courses_count: number;
}

export interface CreateCategoryPayload {
  name: string;
  type?: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name: string;
  type?: string;
  description?: string;
}

export async function getTeacherCategories(): Promise<TeacherCategory[]> {
  const { default: api } = await import("@/lib/api");
  const res = await api.get("/teacher/categories");
  return res.data.data;
}

export async function createTeacherCategory(data: CreateCategoryPayload): Promise<TeacherCategory> {
  const { default: api } = await import("@/lib/api");
  const res = await api.post("/teacher/categories", data);
  return res.data.data;
}

export async function updateTeacherCategory(
  id: string,
  data: UpdateCategoryPayload
): Promise<TeacherCategory> {
  const { default: api } = await import("@/lib/api");
  const res = await api.put(`/teacher/categories/${id}`, data);
  return res.data.data;
}

export async function deleteTeacherCategory(id: string): Promise<void> {
  const { default: api } = await import("@/lib/api");
  await api.delete(`/teacher/categories/${id}`);
}
