import api from "@/lib/api";

// Verify before mutations: an older backend silently ignores the duration fields.
export async function requireActivationDurationSupport(): Promise<void> {
  const { data } = await api.get<{ activationAccessDuration?: boolean }>("/ping");
  if (data.activationAccessDuration !== true) {
    throw new Error("Backend đang chạy phiên bản chưa hỗ trợ thời hạn học. Hãy khởi động lại backend trước khi tạo hoặc kích hoạt mã.");
  }
}
