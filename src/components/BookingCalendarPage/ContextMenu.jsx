import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft as GotIcon, ArrowUpRight as GaveIcon, RefreshCcw, Clock, Pencil, Trash2 } from "lucide-react";

const MENU_ITEMS = [
  { label: "You Got", icon: GotIcon, tone: "text-emerald-600" },
  { label: "You Gave", icon: GaveIcon, tone: "text-rose-600" },
  { label: "Reschedule", icon: RefreshCcw, tone: "text-gray-700" },
  { label: "Change Status", icon: Clock, tone: "text-gray-700" },
  { label: "Edit", icon: Pencil, tone: "text-gray-700" },
  { label: "Delete", icon: Trash2, tone: "text-rose-600" },
];

export default function ContextMenu({ pos, onClose }) {
  if (!pos) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className="fixed z-40 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1"
        style={{ top: pos.y, left: pos.x }}
      >
        {MENU_ITEMS.map((item, index) => (
          <Button
            key={item.label}
            variant="ghost"
            onClick={onClose}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-50 text-left justify-start rounded-none ${item.tone} ${index === 3 ? "border-t border-gray-100" : ""}`}
          >
            <item.icon size={14} />
            {item.label}
          </Button>
        ))}
      </div>
    </>
  );
}
