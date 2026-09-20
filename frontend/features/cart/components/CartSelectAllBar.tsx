"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface CartSelectAllBarProps {
  allSelected: boolean;
  totalItems: number;
  onToggleAll: () => void;
}

export function CartSelectAllBar({
  allSelected,
  totalItems,
  onToggleAll,
}: CartSelectAllBarProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 bg-white rounded-xl shadow-sm border border-[var(--border-default)]">
      <div className="flex items-center gap-3">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={onToggleAll}
          className="size-5 rounded-md border-2 data-[state=checked]:bg-[var(--surface-strong)] data-[state=checked]:border-[var(--surface-strong)]"
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium cursor-pointer select-none text-[var(--text-primary)]"
        >
          Chọn tất cả ({totalItems})
        </label>
      </div>
    </div>
  );
}
