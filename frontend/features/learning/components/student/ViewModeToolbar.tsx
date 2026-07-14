"use client";

import { Maximize, PanelTop, Columns, PanelLeft, PanelRight, ArrowLeftRight } from "lucide-react";
import { useLessonLayout, LayoutMode } from "./LessonLayoutContext";
import { cn } from "@/lib/utils";

interface ViewModeToolbarProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function ViewModeToolbar({ orientation = "horizontal", className }: ViewModeToolbarProps) {
  const { layoutMode, setLayoutMode } = useLessonLayout();
  const isVertical = orientation === "vertical";

  const renderButton = (
    mode: LayoutMode,
    icon: React.ReactNode,
    title: string
  ) => {
    const isActive = layoutMode === mode;
    return (
      <button
        onClick={() => setLayoutMode(mode)}
        className={cn(
          "p-1.5 transition-colors",
          isVertical ? "rounded-md" : "rounded",
          isActive
            ? "text-surface-strong border border-surface-strong/30 bg-cyan-50"
            : "text-[var(--text-primary)]/50 hover:bg-[var(--surface-muted)] hover:text-[var(--surface-strong)] border border-transparent"
        )}
        title={title}
      >
        {icon}
      </button>
    );
  };

  const handleSwap = () => {
    if (layoutMode === "sidebar-right") {
      setLayoutMode("sidebar-left");
    } else {
      setLayoutMode("sidebar-right");
    }
  };

  return (
    <div className={cn("flex", isVertical ? "flex-col items-center gap-1" : "items-center gap-1", className)}>
      {renderButton("fullscreen", <Maximize className="size-4" />, "Toàn màn hình")}
      {renderButton("top-bottom", <PanelTop className="size-4" />, "Video trên, nội dung dưới")}
      {renderButton("split", <Columns className="size-4" />, "Chia đôi")}
      {renderButton("sidebar-left", <PanelLeft className="size-4" />, "Sidebar trái")}
      {renderButton("sidebar-right", <PanelRight className="size-4" />, "Sidebar phải")}
      
      <div className={cn("bg-[var(--border-default)]", isVertical ? "h-[1px] w-5 my-0.5" : "w-[1px] h-4 mx-1")} />
      
      <button
        onClick={handleSwap}
        className={cn(
          "p-1.5 transition-colors text-[var(--text-primary)]/50 hover:bg-[var(--surface-muted)] hover:text-[var(--surface-strong)] border border-transparent",
          isVertical ? "rounded-md" : "rounded"
        )}
        title="Đảo ngược Layout"
      >
        <ArrowLeftRight className="size-4" />
      </button>
    </div>
  );
}
