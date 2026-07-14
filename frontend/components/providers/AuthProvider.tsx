"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();
  const checked = useRef(false);

  useEffect(() => {
    if (!checked.current) {
      checkAuth();
      checked.current = true;
    }
  }, [checkAuth]);

  return <>{children}</>;
}
