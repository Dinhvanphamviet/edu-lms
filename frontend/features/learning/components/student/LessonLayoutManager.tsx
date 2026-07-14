"use client";

import React from "react";
import { useLessonLayout } from "./LessonLayoutContext";
import { ViewModeToolbar } from "./ViewModeToolbar";

interface LessonLayoutManagerProps {
  content: React.ReactNode;
  sidebar: React.ReactNode;
}

export function LessonLayoutManager({ content, sidebar }: LessonLayoutManagerProps) {
  const { layoutMode } = useLessonLayout();

  const floatingToolbar = layoutMode !== "fullscreen" ? (
    <div className="hidden 2xl:flex fixed left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-1 bg-white rounded-r-xl shadow-[4px_0_12px_rgba(0,0,0,0.08)] border border-[var(--border-default)] border-l-0 p-1.5 py-2 z-50">
      <ViewModeToolbar orientation="vertical" />
    </div>
  ) : null;

  if (layoutMode === "fullscreen") {
    return (
      <div className="flex flex-col gap-8 w-full">
        {floatingToolbar}
        {content}
        {/* In fullscreen, sidebar drops below and is centered */}
        <div className="w-full lg:w-1/2 mx-auto">
          {sidebar}
        </div>
      </div>
    );
  }

  if (layoutMode === "top-bottom") {
    return (
      <div className="flex flex-col gap-8 w-full">
        {floatingToolbar}
        {content}
        <div className="w-full">
          {sidebar}
        </div>
      </div>
    );
  }

  if (layoutMode === "split") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative items-start">
        {floatingToolbar}
        <div className="flex flex-col gap-6">
          {content}
        </div>
        <div>
          {sidebar}
        </div>
      </div>
    );
  }

  if (layoutMode === "sidebar-left") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 relative items-start flex-col-reverse lg:flex-row">
        {floatingToolbar}
        <div className="lg:col-span-3 order-last lg:order-first mt-8 lg:mt-0">
          {sidebar}
        </div>
        <div className="lg:col-span-7 flex flex-col gap-6">
          {content}
        </div>
      </div>
    );
  }

  // Default: sidebar-right
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 relative items-start">
      {floatingToolbar}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {content}
      </div>
      <div className="lg:col-span-3">
        {sidebar}
      </div>
    </div>
  );
}
