import React, { useState } from "react";
import { RefreshCw, CalendarDays } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DateFilterDropdown({ initial = "travel", onApply, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleApply() {
    if (startDate || endDate) {
      onApply?.({ start: startDate, end: endDate });
    } else {
      onApply?.(null);
    }
    onClose?.();
  }

  function handleReset() {
    setStartDate("");
    setEndDate("");
    onApply?.(null);
    onClose?.();
  }

  return (
    <div className="absolute z-40 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl p-4">
      <div className="text-xs font-semibold text-gray-700 mb-3">
        {initial === "booking" ? "Booking Date Range" : "Travel Date Range"}
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Start Date</Label>
          <div className="relative">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">End Date</Label>
          <div className="relative">
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-violet-200"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={handleReset}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0 h-auto"
        >
          <RefreshCw size={14} />
        </Button>
        <Button
          onClick={handleApply}
          className="px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 h-auto"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
