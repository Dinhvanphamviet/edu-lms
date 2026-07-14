"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export function HeaderAuthControls() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Đã đăng xuất thành công!");
    router.push("/");
  };
  
  // Prevent hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[180px] h-10 animate-pulse bg-muted rounded-full" />; // placeholder
  }

  if (isAuthenticated && user) {
    const initials = user.full_name
      ? user.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
      : "U";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border border-[var(--border-default)]">
              <AvatarImage src={user.avatar_url} alt={user.full_name} />
              <AvatarFallback className="bg-[var(--surface-strong)] text-white">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.full_name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Hồ sơ cá nhân</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/my-courses">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Khóa học của tôi</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8 md:h-10 text-xs md:text-sm rounded-full border-[var(--surface-strong)] text-[var(--surface-strong)] hover:bg-[var(--surface-strong)] hover:text-white px-3 md:px-6" asChild>
        <Link href="/login">
          Đăng nhập
        </Link>
      </Button>
      <Button size="sm" className="h-8 md:h-10 text-xs md:text-sm rounded-full bg-[var(--surface-strong)] text-white hover:bg-[var(--surface-strong)]/90 px-3 md:px-6" asChild>
        <Link href="/register">
          Đăng ký
        </Link>
      </Button>
    </div>
  );
}
