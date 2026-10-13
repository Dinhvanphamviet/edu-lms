import api from "@/lib/api";
import { requireActivationDurationSupport } from "@/lib/activation-capabilities";

export interface ActivateCodeResponse {
  success: boolean;
  message: string;
  courses: { id: string; title: string }[];
  code: string;
  activatedAt: string;
  accessExpiresAt: string | null;
}

export async function studentActivateCode(code: string): Promise<ActivateCodeResponse> {
  await requireActivationDurationSupport();
  const { data } = await api.post<{ data: ActivateCodeResponse }>(
    "/student/activation-codes/activate",
    { code: code.trim().toUpperCase() },
  );
  if (!data.data?.success || !Array.isArray(data.data.courses) || data.data.courses.length === 0) {
    throw new Error("Chưa xác nhận được kết quả kích hoạt. Hãy kiểm tra Khóa học của tôi trước khi thử lại.");
  }
  return data.data;
}
