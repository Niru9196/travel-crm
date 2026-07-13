import React from "react";
import { MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPE_ICON = { Flight: MoreVertical, UAE: MoreVertical, Transport: MoreVertical };
const TYPE_DOT = { Flight: "bg-emerald-500", UAE: "bg-amber-500", Transport: "bg-sky-500" };

export default function EventCard({ ev, onMenu }) {
  const Icon = TYPE_ICON[ev.type] || MoreVertical;
  return (
    <div
      className="absolute left-1 right-1 bg-white border border-gray-200 rounded-xl shadow-xs px-3 py-2 hover:shadow-md transition-shadow cursor-pointer"
      style={{ top: ev.top, height: 76 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${TYPE_DOT[ev.type] || "bg-gray-400"}`} />
          <span className="text-xs font-semibold text-gray-900 underline">{ev.id}</span>
        </div>
        <Button variant="ghost" onClick={(e) => { e.stopPropagation(); onMenu(ev, e); }} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
          <MoreVertical size={13} />
        </Button>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-violet-600 mb-1">
        <Icon size={12} />
        {ev.type}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-gray-400">
        <Clock size={10} />
        {ev.time}
        <span className="ml-1 text-gray-500 truncate">{ev.label}</span>
      </div>
    </div>
  );
}
