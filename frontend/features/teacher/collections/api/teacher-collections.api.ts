import type {
  TeacherCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from "../types";

export * from "../types";

export async function getTeacherCollections(): Promise<TeacherCollection[]> {
  const { default: api } = await import("@/lib/api");
  const res = await api.get("/teacher/collections");
  return res.data.data;
}

export async function getTeacherCollectionById(id: string): Promise<TeacherCollection> {
  const { default: api } = await import("@/lib/api");
  const res = await api.get(`/teacher/collections/${id}`);
  return res.data.data;
}

export async function createTeacherCollection(
  data: CreateCollectionPayload
): Promise<TeacherCollection> {
  const { default: api } = await import("@/lib/api");
  const res = await api.post("/teacher/collections", data);
  return res.data.data;
}

export async function updateTeacherCollection(
  id: string,
  data: UpdateCollectionPayload
): Promise<TeacherCollection> {
  const { default: api } = await import("@/lib/api");
  const res = await api.put(`/teacher/collections/${id}`, data);
  return res.data.data;
}

export async function updateTeacherCollectionStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const { default: api } = await import("@/lib/api");
  await api.patch(`/teacher/collections/${id}/status`, { is_active: isActive });
}

export async function deleteTeacherCollection(id: string): Promise<void> {
  const { default: api } = await import("@/lib/api");
  await api.delete(`/teacher/collections/${id}`);
}
