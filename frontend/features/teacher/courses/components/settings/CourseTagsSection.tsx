"use client";

import { Tag } from "lucide-react";

interface CourseTagsSectionProps {
  tags: string[];
  availableTags?: string[];
  onToggleTag: (tag: string) => void;
}

const DEFAULT_AVAILABLE_TAGS = ["Video", "Livestream", "Tài liệu"];

export function CourseTagsSection({
  tags,
  availableTags = DEFAULT_AVAILABLE_TAGS,
  onToggleTag,
}: CourseTagsSectionProps) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Tag className="size-4 text-[var(--surface-strong)]" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Thẻ phân loại (Tags)</h2>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {availableTags.map((tag) => {
          const active = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all border ${
                active
                  ? "bg-[var(--surface-strong)] text-white border-[var(--surface-strong)] shadow-xs"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              {active ? `✓ ${tag}` : `+ ${tag}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
