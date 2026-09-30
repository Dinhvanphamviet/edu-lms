"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface TeacherSidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
}

const TeacherSidebarContext = createContext<TeacherSidebarContextType | undefined>(undefined);

export function TeacherSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("teacher_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("teacher_sidebar_collapsed", String(next));
      return next;
    });
  };

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <TeacherSidebarContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobile,
      }}
    >
      {children}
    </TeacherSidebarContext.Provider>
  );
}

export function useTeacherSidebar() {
  const context = useContext(TeacherSidebarContext);
  if (!context) {
    throw new Error("useTeacherSidebar must be used within a TeacherSidebarProvider");
  }
  return context;
}
