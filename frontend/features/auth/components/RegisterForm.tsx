"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EyeIcon, EyeOffIcon, ChevronsUpDown, Check } from "lucide-react";
import { toast } from "sonner";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const { register, loading, provinces } = useRegister();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openCityPopup, setOpenCityPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCityChange = (val: string) => {
    setFormData({ ...formData, city: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    register({
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      phone: formData.phone,
      city: formData.city,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-2 text-center md:text-left mb-2">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Đăng ký</h2>
        <p className="text-sm text-[var(--text-primary)]/70">
          Tạo tài khoản để bắt đầu lộ trình học tập của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        
        {/* Họ tên */}
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="text-[var(--text-primary)]">Họ và tên</Label>
          <Input 
            id="fullName" 
            type="text" 
            placeholder="Nhập họ và tên của bạn" 
            value={formData.fullName}
            onChange={handleChange}
            required 
            className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)]"
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-[var(--text-primary)]">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="email@gmail.com" 
            value={formData.email}
            onChange={handleChange}
            required 
            className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)]"
          />
        </div>

        {/* Số điện thoại */}
        <div className="grid gap-2">
          <Label htmlFor="phone" className="text-[var(--text-primary)]">Số điện thoại</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="Nhập số điện thoại" 
            value={formData.phone}
            onChange={handleChange}
            required 
            className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)]"
          />
        </div>

        {/* Tỉnh / Thành phố */}
        <div className="grid gap-2">
          <Label htmlFor="city" className="text-[var(--text-primary)]">Tỉnh / Thành phố</Label>
          <Popover open={openCityPopup} onOpenChange={setOpenCityPopup}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCityPopup}
                className="w-full h-12 justify-between border-[var(--border-default)] bg-[var(--surface-muted)] focus:ring-[var(--surface-strong)] text-base font-normal hover:bg-[var(--surface-muted)]"
              >
                {formData.city ? formData.city : <span className="text-muted-foreground">Chọn tỉnh / thành phố</span>}
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm tỉnh thành..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy.</CommandEmpty>
                  <CommandGroup>
                    {provinces.length > 0 ? (
                      provinces.map((prov) => (
                        <CommandItem
                          key={prov.code}
                          value={prov.name}
                          onSelect={(currentValue) => {
                            const selected = provinces.find(
                              (p) => p.name.toLowerCase() === currentValue.toLowerCase()
                            );
                            handleCityChange(selected ? selected.name : "");
                            setOpenCityPopup(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              formData.city === prov.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {prov.name}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem disabled value="loading">Đang tải...</CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mật khẩu */}
        <div className="grid gap-2 relative">
          <Label htmlFor="password" className="text-[var(--text-primary)]">Mật khẩu</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={handleChange}
              required 
              minLength={6}
              className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)] pr-10"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
            </button>
          </div>
        </div>

        {/* Nhập lại mật khẩu */}
        <div className="grid gap-2 relative">
          <Label htmlFor="confirmPassword" className="text-[var(--text-primary)]">Nhập lại mật khẩu</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
              className="rounded-md border-[var(--border-default)] bg-[var(--surface-muted)] focus-visible:ring-[var(--surface-strong)] pr-10"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
            </button>
          </div>
        </div>

        {/* Nút Submit */}
        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--surface-strong)] text-[var(--text-inverse)] hover:bg-[var(--surface-strong)]/90 mt-4 py-6 rounded-md text-base transition-transform active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
        </Button>
      </form>

      <div className="text-center text-sm text-[var(--text-primary)]/70 mt-2">
        Bạn đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-[var(--surface-strong)] hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
