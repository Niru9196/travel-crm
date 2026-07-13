import React from "react";
import { Home, ChevronRight, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Topbar({ crumbs }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Home size={15} />
        {crumbs.map((c, i) => (
          <React.Fragment key={c}>
            <ChevronRight size={13} />
            <span className={i === crumbs.length - 1 ? "text-violet-600 font-medium" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex-1 max-w-md mx-8 relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search or type command..."
          className="w-full pl-9 pr-14 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-violet-200"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘ K</kbd>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center p-0 h-auto">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">Yash Manocha</div>
            <div className="text-xs text-gray-400">Sales Lead</div>
          </div>
        </div>
      </div>
    </div>
  );
}
