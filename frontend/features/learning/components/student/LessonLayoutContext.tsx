"use client";

import React, { createContext, useContext, useState } from "react";

export type LayoutMode = 
  | "fullscreen"
  | "top-bottom"
  | "split"
  | "sidebar-left"
  | "sidebar-right";

interface LessonLayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

const LessonLayoutContext = createContext<LessonLayoutContextType | undefined>(undefined);

export function LessonLayoutProvider({ children }: { children: React.ReactNode }) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("sidebar-right");

  const handleSetLayoutMode = (mode: LayoutMode) => {
    setLayoutMode(mode);

    try {
      if (mode === "fullscreen") {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.warn(`Error attempting to enable fullscreen: ${err.message}`);
          });
        }
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch((err) => {
            console.warn(`Error attempting to exit fullscreen: ${err.message}`);
          });
        }
      }
    } catch (e) {
      console.warn("Fullscreen API not supported or blocked.");
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // If native fullscreen exits, and we are in fullscreen mode, revert.
        setLayoutMode((prev) => (prev === "fullscreen" ? "sidebar-right" : prev));
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <LessonLayoutContext.Provider value={{ layoutMode, setLayoutMode: handleSetLayoutMode }}>
      {children}
    </LessonLayoutContext.Provider>
  );
}

export function useLessonLayout() {
  const context = useContext(LessonLayoutContext);
  if (!context) {
    throw new Error("useLessonLayout must be used within a LessonLayoutProvider");
  }
  return context;
}
