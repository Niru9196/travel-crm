import React from "react";
import { Home, ChevronRight, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Topbar({ crumbs = [], children }) {
  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Home size={16} className="text-gray-400" />
              {crumbs.map((c, i) => (
                <React.Fragment key={`${c}-${i}`}>
                  <ChevronRight size={13} className="text-gray-300" />
                  <span className={i === crumbs.length - 1 ? "text-violet-600 font-medium" : ""}>{c}</span>
                </React.Fragment>
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search or type command..."
                className="w-full pl-11 pr-16 py-2.5 text-sm border border-gray-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
              <kbd className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘ K</kbd>
            </div>

            <div className="flex items-center gap-4 justify-end">
              <Button variant="ghost" className="relative w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center p-0">
                <Bell size={16} className="text-gray-500" />
                <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </Button>
              <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2">
                <div className="w-9 h-9 rounded-full bg-violet-600 text-white grid place-items-center text-sm font-semibold">Y</div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">Yash Manocha</div>
                  <div className="text-xs text-gray-400">Sales Lead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {children}
      </div>
    </>
  );
}
