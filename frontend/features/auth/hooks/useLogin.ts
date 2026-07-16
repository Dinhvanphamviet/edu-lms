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
      let redirectUrl = "/";
      switch (user.role) {
        case "ADMIN":
          redirectUrl = "/admin";
          break;
        case "TEACHER":
          redirectUrl = "/teacher";
          break;
        case "ASSISTANT":
          redirectUrl = "/assistant";
          break;
        case "STUDENT":
          redirectUrl = "/student"; // or keep "/" if student dashboard is public
          break;
      }
      router.push(redirectUrl);
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
