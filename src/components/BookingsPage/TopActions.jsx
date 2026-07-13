import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import MoreActionsMenu from "@/components/Shared/ActionMenu";

export default function TopActions({ navigate, selectMode, pageRows, selected, setSelectMode, setSelected, deselectAll, selectAllOnPage }) {
  return (
    <div className="flex items-center gap-3">
      {selectMode ? (
        <>
          <Button variant="ghost" onClick={() => { setSelectMode(false); setSelected([]); }} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 h-auto">
            Cancel
          </Button>
          <Button variant="ghost" onClick={selected.length === pageRows.length ? deselectAll : selectAllOnPage} className="px-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700 h-auto">
            {selected.length === pageRows.length ? "Deselect all" : "Select all"}
          </Button>
          <MoreActionsMenu />
        </>
      ) : (
        <MoreActionsMenu onSelect={(action) => { if (action === "select") setSelectMode(true); }} />
      )}
      <Button variant="ghost" onClick={() => navigate("/finance/bookings/calendar")} className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 p-0 h-auto">
        <CalendarDays size={16} className="text-gray-500" />
      </Button>
    </div>
  );
}
