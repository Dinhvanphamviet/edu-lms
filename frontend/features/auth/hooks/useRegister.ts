import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi, RegisterPayload } from "../api/auth.api";

export interface Province {
  code: number;
  name: string;
}

export function useRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data);
      })
      .catch((err) => console.error("Failed to load provinces:", err));
  }, []);

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      await authApi.register(payload);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Đăng ký thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    provinces,
  };
}
