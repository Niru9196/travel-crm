import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid, TrendingUp, Settings2, BookMarked, CheckSquare,
  FileText, Landmark, Users, BarChart3, Settings, ChevronRight,
  ChevronLeft, PanelLeftClose, PanelLeftOpen,
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
          "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
          collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5",
          isActive && item.to
            ? "bg-violet-50 text-violet-600"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        )
      }
    >
      <item.icon size={17} className="shrink-0" />
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
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {linkContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
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
          collapsed ? "w-[60px]" : "w-[220px]"
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
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV.map((item) => (
            <NavItem key={item.label} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom section: Settings + Toggle */}
        <div className="px-2 pb-4 space-y-1">
          {/* Settings */}
          {collapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to="#"
                  className="flex items-center justify-center px-2.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <Settings size={17} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Settings
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              to="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <Settings size={17} />
              <span className="flex-1">Settings</span>
              <ChevronRight size={14} className="text-gray-300" />
            </NavLink>
          )}

          {/* Collapse Toggle Button */}
          <Button
            variant="ghost"
            onClick={toggle}
            className={cn(
              "flex items-center rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors w-full h-auto",
              collapsed ? "justify-center px-2.5 py-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <>
                <PanelLeftClose size={17} />
                <span className="flex-1 text-left">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
