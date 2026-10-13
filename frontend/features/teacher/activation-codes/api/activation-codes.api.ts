import api from "@/lib/api";
import { requireActivationDurationSupport } from "@/lib/activation-capabilities";
import type { ActivationCodeItem, CreateActivationCodesPayload } from "../types";
export { apiErrorMessage as activationErrorMessage } from "@/lib/api-errors";

export async function getTeacherActivationCodes(): Promise<ActivationCodeItem[]> {
  const { data } = await api.get<{ data: ActivationCodeItem[] }>("/teacher/activation-codes");
  if (!Array.isArray(data.data)) throw new Error("Dữ liệu mã kích hoạt không hợp lệ.");
  return data.data;
}

export async function createTeacherActivationCodes(payload: CreateActivationCodesPayload): Promise<ActivationCodeItem[]> {
  await requireActivationDurationSupport();
  const { data } = await api.post<{ data: ActivationCodeItem[] }>("/teacher/activation-codes", payload);
  if (!Array.isArray(data.data) || data.data.length !== payload.quantity) {
    throw new Error("Kết quả tạo mã không hợp lệ. Hãy làm mới danh sách để kiểm tra trước khi tạo lại.");
  }
  if (data.data.some((item) => item.accessDurationValue !== payload.accessDurationValue || item.accessDurationUnit !== payload.accessDurationUnit)) {
    throw new Error("Backend không lưu đúng thời hạn học đã chọn. Không gửi các mã vừa tạo cho học sinh; hãy làm mới danh sách và kiểm tra backend.");
  }
  return data.data;
}

export async function toggleActivationCodeStatus(id: string): Promise<ActivationCodeItem> {
  const { data } = await api.patch<{ data: ActivationCodeItem }>(`/teacher/activation-codes/${id}/toggle`);
  if (!data.data?.id) throw new Error("Kết quả cập nhật mã không hợp lệ.");
  return data.data;
}

export async function deleteActivationCode(id: string): Promise<void> {
  await api.delete(`/teacher/activation-codes/${id}`);
}

