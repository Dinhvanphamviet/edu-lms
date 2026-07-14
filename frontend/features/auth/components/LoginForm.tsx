"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const { login, loading } = useLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Đăng nhập</h2>
        <p className="text-sm text-[var(--text-primary)]/70">
          Chào mừng trở lại. Vui lòng nhập thông tin để tiếp tục.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-[var(--text-primary)]">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)]"
          />
        </div>
        
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[var(--text-primary)]">Mật khẩu</Label>
            <Link href="/forgot-password" className="text-sm font-medium text-[var(--surface-strong)] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)]"
          />
        </div>

        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--surface-strong)] text-[var(--text-inverse)] hover:bg-[var(--surface-strong)]/90 mt-2 py-5 rounded-md text-base transition-transform active:scale-[0.98]"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>

      <div className="text-center text-sm text-[var(--text-primary)]/70">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-[var(--surface-strong)] hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
