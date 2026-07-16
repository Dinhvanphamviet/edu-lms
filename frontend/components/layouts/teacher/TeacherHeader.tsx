import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TeacherHeader() {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-surface-muted px-6">
      <Button variant="outline" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="w-full flex-1">
        {/* Placeholder cho Breadcrumbs hoặc Search bar */}
      </div>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8 rounded-full">
        <Bell className="h-4 w-4 text-text-primary" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <Button variant="secondary" size="icon" className="rounded-full">
        <User className="h-5 w-5" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </header>
  );
}
