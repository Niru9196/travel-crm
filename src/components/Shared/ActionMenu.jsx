import React from "react";
import {
  MoreHorizontal, Pencil, Trash2, Link2, Copy, RotateCcw,
  Download, ArrowUpToLine, ChevronDown, MousePointerClick, Upload,
  ChevronLeft, ChevronRight, SendHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { currency } from "@/components/Shared/Shared";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Action items per approval state
export const MORE_ACTIONS_APPROVED = [
  { label: "Edit", icon: Pencil },
  { label: "Delete", icon: Trash2, danger: true },
  { label: "Link", icon: Link2 },
  { label: "Duplicate", icon: Copy },
];
export const MORE_ACTIONS_PENDING = [
  { label: "Edit", icon: Pencil },
  { label: "Delete", icon: Trash2, danger: true },
  { label: "Link", icon: Link2 },
  { label: "Duplicate", icon: Copy },
];
export const MORE_ACTIONS_REJECTED = [
  { label: "Send for Approval again", icon: SendHorizontal },
  { label: "Delete", icon: Trash2, danger: true },
  { label: "Duplicate", icon: Copy },
];
export const MORE_ACTIONS_DELETED = [
  { label: "Restore", icon: RotateCcw },
  { label: "Duplicate", icon: Copy },
];

export function ActionMenu({ items }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-500 focus:outline-hidden p-0">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {items.map((it, i) => (
          <DropdownMenuItem
            key={it.label}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              it.danger && "text-rose-600 focus:text-rose-600"
            )}
          >
            <it.icon size={14} />
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// "More Actions" top-bar dropdown: Select / Upload
export function MoreActionsMenu({ onSelect }) {
  const items = [
    { label: "Select", icon: MousePointerClick, action: "select" },
    { label: "Upload", icon: Upload, action: "upload" },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:outline-hidden h-auto">
          More Actions
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {items.map((it) => (
          <DropdownMenuItem
            key={it.label}
            onClick={() => onSelect?.(it.action)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <it.icon size={14} />
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Bulk actions dropdown while rows are selected
export function BulkActionsMenu() {
  const items = [
    { label: "Download", icon: Download },
    { label: "Merge", icon: ArrowUpToLine },
    { label: "Delete", icon: Trash2, danger: true },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-500 focus:outline-hidden p-0 h-auto">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {items.map((it) => (
          <DropdownMenuItem
            key={it.label}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              it.danger && "text-rose-600 focus:text-rose-600"
            )}
          >
            <it.icon size={14} />
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PendingAmountPopup({ customer, vendor, children }) {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2F2E2E] text-white rounded-2xl shadow-lg px-4 py-3 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <div className="text-[10px] uppercase tracking-wide text-gray-300 underline mb-2">Pending Amount</div>
        <div className="text-xs flex justify-between mb-1">
          <span className="text-gray-300">Customer :</span>
          <span className="font-semibold">{currency(customer)}</span>
        </div>
        <div className="text-xs flex justify-between">
          <span className="text-gray-300">Vendor :</span>
          <span className="font-semibold">{currency(vendor)}</span>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ page, setPage, totalPages, rowsPerPage, setRowsPerPage, start, end, total, label = "bookings" }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
      {/* Left: Rows per page */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        Rows per page:
        <Select value={String(rowsPerPage)} onValueChange={(val) => { setRowsPerPage(Number(val)); setPage(1); }}>
          <SelectTrigger className="border border-gray-200 rounded-lg px-2 py-1 h-auto text-gray-700 focus:outline-hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Center: Showing X-Y of Z */}
      <div className="text-xs text-gray-500">
        Showing {total === 0 ? 0 : start}-{end} of {total} {label}
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50 rounded p-0 h-auto"
        >
          <ChevronLeft size={14} />
        </Button>
        {generatePageNumbers(page, totalPages).map((n, i) => (
          n === "..." ? (
            <span key={`dots-${i}`} className="text-gray-300 text-xs px-1">...</span>
          ) : (
            <Button
              key={n}
              variant="ghost"
              onClick={() => setPage(n)}
              className={cn(
                "w-7 h-7 rounded-lg text-xs font-medium p-0 h-auto",
                page === n ? "bg-gray-900 text-white hover:bg-gray-900" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {n}
            </Button>
          )
        ))}
        <Button
          variant="ghost"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="w-7 h-7 flex items-center justify-center text-gray-400 disabled:opacity-30 hover:bg-gray-50 rounded p-0 h-auto"
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}

// Smart page number generation
function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("...", total);
  } else if (current >= total - 3) {
    pages.push(1, "...");
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  return pages;
}
