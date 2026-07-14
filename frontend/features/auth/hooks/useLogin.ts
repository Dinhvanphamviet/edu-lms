import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi, LoginPayload } from "../api/auth.api";
import { useAuth } from "@/hooks/useAuth";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const { user, access_token } = await authApi.login(payload);
      setAuth(user, access_token);
      toast.success("Đăng nhập thành công!");
      router.push("/"); // Or navigate to dashboard
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
  };
}
