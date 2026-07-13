import React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Status column header with toggle to swap between Booking Status and Payment Status
 */
export default function StatusToggle({ statusView, onToggle }) {
  const isPayment = statusView === "payment";

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "text-xs uppercase tracking-wide font-semibold whitespace-nowrap transition-colors",
          !isPayment ? "text-violet-600" : "text-gray-400"
        )}
      >
        Booking
      </span>
      <Switch
        checked={isPayment}
        onCheckedChange={(checked) => onToggle(checked ? "payment" : "booking")}
        className="scale-90"
      />
      <span
        className={cn(
          "text-xs uppercase tracking-wide font-semibold whitespace-nowrap transition-colors",
          isPayment ? "text-violet-600" : "text-gray-400"
        )}
      >
        Payment
      </span>
    </div>
  );
}
