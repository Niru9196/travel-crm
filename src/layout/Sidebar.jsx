import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid, TrendingUp, Settings2, BookMarked, CheckSquare,
  FileText, Landmark, Users, BarChart3, Settings, ChevronRight,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", icon: LayoutGrid, to: "/" },
  { label: "Sales", icon: TrendingUp, expandable: true },
  { label: "Operations", icon: Settings2 },
  { label: "Bookings", icon: BookMarked },
  { label: "Approvals", icon: CheckSquare, expandable: true },
  { label: "Content", icon: FileText },
  { label: "Finance", icon: Landmark, expandable: true, to: "/finance/bookings" },
  { label: "Directory", icon: Users, expandable: true },
  { label: "Reports", icon: BarChart3 },
];

function NavItem({ item, collapsed }) {
  const linkContent = (
    <NavLink
      to={item.to || "#"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl text-sm font-medium transition-colors duration-150 shrink-0",
          collapsed
            ? "w-11 h-11 justify-center mx-auto"
            : "w-full px-3 py-2.5",
          isActive && item.to
            ? "bg-violet-50 text-violet-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )
      }
    >
      <item.icon size={collapsed ? 20 : 17} className="shrink-0" strokeWidth={collapsed ? 2 : 1.75} />
      {!collapsed && (
        <>
          <span className="flex-1 whitespace-nowrap">{item.label}</span>
          {item.expandable && <ChevronRight size={14} className="text-gray-300" />}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10} className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

export default function Sidebar() {
  const { open, toggle } = useSidebar();
  const collapsed = !open;

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 transition-all duration-200 ease-in-out overflow-hidden",
          collapsed ? "w-[68px]" : "w-[280px]"
        )}
      >
        {/* Logo */}
        <div className={cn("py-6 transition-all duration-200", collapsed ? "px-3" : "px-6")}>
          {collapsed ? (
            <span className="text-xl font-bold text-violet-600 tracking-tight flex justify-center">C</span>
          ) : (
            <span className="text-2xl font-bold text-violet-600 tracking-tight">ciergo</span>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 flex flex-col overflow-y-auto overflow-x-hidden",
            collapsed ? "px-2 gap-2" : "px-2 gap-0.5"
          )}
        >
          {NAV.map((item) => (
            <NavItem key={item.label} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom section: Settings + Toggle */}
        <div className={cn("flex flex-col pb-4", collapsed ? "px-2 gap-2" : "px-2 gap-1")}>
          {/* Settings */}
          {collapsed ? (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <NavLink
                  to="#"
                  className="flex items-center justify-center w-11 h-11 mx-auto rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                >
                  <Settings size={20} strokeWidth={2} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="font-medium">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              to="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Settings size={17} strokeWidth={1.75} />
              <span className="flex-1">Settings</span>
              <ChevronRight size={14} className="text-gray-300" />
            </NavLink>
          )}

          {/* Collapse / Expand Toggle */}
          {collapsed ? (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={toggle}
                  className="flex items-center justify-center w-11 h-11 mx-auto rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors h-auto p-0"
                >
                  <PanelLeftOpen size={20} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10} className="font-medium">
                Expand sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={toggle}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors w-full h-auto"
            >
              <PanelLeftClose size={17} strokeWidth={1.75} />
              <span className="flex-1 text-left">Collapse</span>
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}