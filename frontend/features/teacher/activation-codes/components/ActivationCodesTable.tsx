"use client";

import { Copy, Check, Power, Trash2, Calendar, KeyRound, BookOpen, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ActivationCodeItem, ActivationCodeStatus } from "../types";

interface ActivationCodesTableProps {
  codes: ActivationCodeItem[];
  pendingCodeIds: string[];
  copiedCodeId: string | null;
  onCopyCode: (code: string, id: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteCode: (id: string) => void;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Không giới hạn";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function renderStatusBadge(status: ActivationCodeStatus) {
  const styles = {
    UNUSED: ["Chưa sử dụng", "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"],
    USED: ["Đã sử dụng", "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"],
    EXPIRED: ["Hết hạn", "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"],
    DISABLED: ["Đã vô hiệu hóa", "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"],
  }[status];
  return <Badge className={cn(styles[1], "text-[11px] font-semibold")}>{styles[0]}</Badge>;
}
export function ActivationCodesTable({ codes, pendingCodeIds, copiedCodeId, onCopyCode, onToggleStatus, onDeleteCode }: ActivationCodesTableProps) {
  if (codes.length === 0) return (
    <div className="py-16 text-center">
      <KeyRound className="size-12 mx-auto text-slate-300 stroke-1" />
      <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">Không tìm thấy mã kích hoạt nào</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Thử thay đổi bộ lọc hoặc bấm nút “Tạo mã kích hoạt” để cấp mã mới cho học sinh.</p>
    </div>
  );
  return (
    <TooltipProvider delayDuration={150}>
      <div className="w-full max-w-full overflow-x-auto">
        <table className="w-full min-w-[960px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Mã kích hoạt</th><th className="py-3 px-4">Khóa học được mở</th><th className="py-3 px-4">Trạng thái</th><th className="py-3 px-4">Người kích hoạt</th><th className="py-3 px-4">Thời điểm kích hoạt</th><th className="py-3 px-4">Hạn kích hoạt</th><th className="py-3 px-4">Thời hạn học</th><th className="py-3 px-4">Ngày tạo</th><th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {codes.map((item) => {
              const isUsed = item.displayStatus === "USED";
              const canToggle = item.displayStatus === "UNUSED" || item.displayStatus === "DISABLED";
              return (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-4 whitespace-nowrap"><div className="flex items-center gap-2">
                    <code className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 tracking-wider select-all border border-slate-200/60 dark:border-slate-700">{item.code}</code>
                    <button type="button" onClick={() => onCopyCode(item.code, item.id)} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Sao chép mã">{copiedCodeId === item.id ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}</button>
                  </div></td>
                  <td className="py-3.5 px-4 min-w-[220px] max-w-[280px]">
                    {item.courses?.length > 0 ? (
                      <div className="space-y-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 cursor-pointer group/title">
                              <BookOpen className="size-3.5 text-[var(--surface-strong)] shrink-0 mt-0.5" />
                              <span className="line-clamp-2 leading-snug group-hover/title:text-[var(--surface-strong)] transition-colors">
                                {item.courses[0].title}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl">
                            <p className="font-medium leading-relaxed">{item.courses[0].title}</p>
                          </TooltipContent>
                        </Tooltip>

                        {item.courses.length > 1 && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md cursor-pointer hover:underline">
                                +{item.courses.length - 1} khóa học khác
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="flex flex-col items-start gap-1.5 min-w-[220px] max-w-sm bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl">
                              <div className="font-bold text-[11px] text-slate-400 border-b border-slate-700/80 pb-1.5 w-full text-left">
                                Danh sách {item.courses.length} khóa học:
                              </div>
                              <div className="flex flex-col gap-1.5 w-full text-left">
                                {item.courses.map((c) => (
                                  <div key={c.id} className="text-slate-200 text-xs leading-relaxed flex items-start gap-1.5">
                                    <span className="text-teal-400 font-bold shrink-0">•</span>
                                    <span className="break-words">{c.title}</span>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Chưa gán khóa học</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{renderStatusBadge(item.displayStatus)}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">{item.usedBy ? <div className="flex items-center gap-2"><div className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600"><User className="size-3.5" /></div><div><div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.usedBy.name}</div>{item.usedBy.email && <div className="text-[11px] text-slate-400 font-mono">{item.usedBy.email}</div>}</div></div> : <span className="text-slate-400 text-xs">—</span>}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">{item.usedAt ? <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-slate-400" /><span>{formatDateTime(item.usedAt)}</span></span> : <span className="text-slate-400">—</span>}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">{item.expiresAt ? <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-slate-400" /><span>{formatDate(item.expiresAt)}</span></span> : <span className="text-slate-400 italic">Không giới hạn</span>}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">{item.accessDurationValue && item.accessDurationUnit ? `${item.accessDurationValue} ${{ DAY: "ngày", MONTH: "tháng", YEAR: "năm" }[item.accessDurationUnit]}` : "Vô thời hạn"}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">{formatDate(item.createdAt)}</td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap"><div className="flex items-center justify-end gap-1">
                    <Tooltip><TooltipTrigger asChild><span><Button type="button" variant="ghost" size="sm" disabled={!canToggle || pendingCodeIds.includes(item.id)} onClick={() => onToggleStatus(item.id)} className={cn("h-8 w-8 p-0 rounded-lg transition-colors", canToggle ? item.displayStatus === "DISABLED" ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950" : "text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950" : "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50")}><Power className="size-3.5" /></Button></span></TooltipTrigger><TooltipContent side="top">{canToggle ? item.displayStatus === "DISABLED" ? "Mở lại mã kích hoạt" : "Vô hiệu hóa mã" : isUsed ? "Không thể thay đổi trạng thái mã đã sử dụng" : "Mã đã quá hạn kích hoạt"}</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><span><Button type="button" variant="ghost" size="sm" disabled={isUsed || pendingCodeIds.includes(item.id)} onClick={() => onDeleteCode(item.id)} className={cn("h-8 w-8 p-0 rounded-lg", isUsed ? "text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-50" : "text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950")}><Trash2 className="size-3.5" /></Button></span></TooltipTrigger><TooltipContent side="top">{isUsed ? "Không thể xóa mã đã sử dụng (giữ lại để tra cứu lịch sử)" : "Xóa mã"}</TooltipContent></Tooltip>
                  </div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}
