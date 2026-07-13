import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, CalendarDays, Search, RefreshCw, X } from "lucide-react";
import DateFilterDropdown from "@/components/Shared/DateFilterDropdown";
import OwnerMultiSelect from "@/components/OwnerMultiSelect/OwnerMultiSelect";
import ServicesFilter from "@/components/ServicesFilter/ServicesFilter";
import { cn } from "@/lib/utils";

export default function BookingFilters({
  openFilter,
  setOpenFilter,
  bookingDateFilter,
  travelDateFilter,
  ownerFilter,
  servicesFilter,
  searchQuery,
  setSearchQuery,
  resetAllFilters,
  setPage,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 relative">
      <div className="grid grid-cols-4 gap-6">
        <div className="relative">
          <div className="text-xs font-semibold text-gray-700 mb-2">Booking Date</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "bookingDate" ? null : "bookingDate")}
            className={cn(
              "w-full flex items-center gap-2 border rounded-lg px-3 py-2 text-sm h-auto justify-start",
              bookingDateFilter ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-400"
            )}
          >
            <span>{bookingDateFilter?.start || "Start Date"}</span>
            <ChevronDown size={12} className="rotate-[-90deg]" />
            <span>{bookingDateFilter?.end || "End Date"}</span>
            <CalendarDays size={14} className="ml-auto text-gray-300" />
          </Button>
          {openFilter === "bookingDate" && (
            <DateFilterDropdown
              initial="booking"
              onApply={setBookingDateFilter}
              onClose={() => setOpenFilter(null)}
            />
          )}
        </div>

        <div className="relative">
          <div className="text-xs font-semibold text-gray-700 mb-2">Travel Date</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "travelDate" ? null : "travelDate")}
            className={cn(
              "w-full flex items-center gap-2 border rounded-lg px-3 py-2 text-sm h-auto justify-start",
              travelDateFilter ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-400"
            )}
          >
            <span>{travelDateFilter?.start || "Start Date"}</span>
            <ChevronDown size={12} className="rotate-[-90deg]" />
            <span>{travelDateFilter?.end || "End Date"}</span>
            <CalendarDays size={14} className="ml-auto text-gray-300" />
          </Button>
          {openFilter === "travelDate" && (
            <DateFilterDropdown
              initial="travel"
              onApply={setTravelDateFilter}
              onClose={() => setOpenFilter(null)}
            />
          )}
        </div>

        <div className="relative">
          <div className="text-xs font-semibold text-gray-700 mb-2">Booking Owner</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "owner" ? null : "owner")}
            className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 h-auto"
          >
            {ownerFilter?.owners?.length || ownerFilter?.primary?.length
              ? `${(ownerFilter.owners || ownerFilter.primary).length} Owner(s) selected`
              : "Search / Select Owners"}
            <ChevronDown size={14} />
          </Button>
          {openFilter === "owner" && (
            <OwnerMultiSelect onApply={setOwnerFilter} onClose={() => setOpenFilter(null)} />
          )}
        </div>

        <div className="relative">
          <div className="text-xs font-semibold text-gray-700 mb-2">Booking Type</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "services" ? null : "services")}
            className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 h-auto"
          >
            All Bookings <ChevronDown size={14} className="text-gray-400" />
          </Button>
          {openFilter === "services" && (
            <ServicesFilter onApply={setServicesFilter} onClose={() => setOpenFilter(null)} />
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <Search size={14} className="text-gray-400" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search by ID / Lead Pax / Amount"
            className="flex-1 outline-hidden bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
          />
          {searchQuery && (
            <Button variant="ghost" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
              <X size={14} />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={resetAllFilters}
          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0 h-auto"
          title="Reset all filters"
        >
          <RefreshCw size={14} />
        </Button>
      </div>
    </div>
  );
}
