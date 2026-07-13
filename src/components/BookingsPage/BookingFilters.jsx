import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, CalendarDays, Search, RefreshCw, X, ChevronRight } from "lucide-react";
import DateFilterDropdown from "@/components/Shared/DateFilterDropdown";
import OwnerMultiSelect from "@/components/OwnerMultiSelect/OwnerMultiSelect";
import ServicesFilter from "@/components/ServicesFilter/ServicesFilter";
import { cn } from "@/lib/utils";

export default function BookingFilters({
  openFilter,
  setOpenFilter,
  bookingDateFilter,
  setBookingDateFilter,
  travelDateFilter,
  setTravelDateFilter,
  ownerFilter,
  setOwnerFilter,
  servicesFilter,
  setServicesFilter,
  searchQuery,
  setSearchQuery,
  resetAllFilters,
  setPage,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative space-y-2 lg:flex-1">
          <div className="text-xs font-semibold text-gray-600">Booking Date</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "bookingDate" ? null : "bookingDate")}
            className={cn(
              "w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm text-left shadow-sm transition duration-150",
              bookingDateFilter ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            )}
          >
            <span>{bookingDateFilter?.start || "Start Date"}</span>
            <ChevronRight size={14} className="text-gray-300 rotate-90" />
            <span>{bookingDateFilter?.end || "End Date"}</span>
            <CalendarDays size={16} className="ml-auto text-gray-400" />
          </Button>
          {openFilter === "bookingDate" && (
            <DateFilterDropdown
              initial="booking"
              onApply={setBookingDateFilter}
              onClose={() => setOpenFilter(null)}
            />
          )}
        </div>

        <div className="relative space-y-2 lg:flex-1">
          <div className="text-xs font-semibold text-gray-600">Travel Date</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "travelDate" ? null : "travelDate")}
            className={cn(
              "w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm text-left shadow-sm transition duration-150",
              travelDateFilter ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            )}
          >
            <span>{travelDateFilter?.start || "Start Date"}</span>
            <ChevronRight size={14} className="text-gray-300 rotate-90" />
            <span>{travelDateFilter?.end || "End Date"}</span>
            <CalendarDays size={16} className="ml-auto text-gray-400" />
          </Button>
          {openFilter === "travelDate" && (
            <DateFilterDropdown
              initial="travel"
              onApply={setTravelDateFilter}
              onClose={() => setOpenFilter(null)}
            />
          )}
        </div>

        <div className="relative space-y-2 lg:flex-1">
          <div className="text-xs font-semibold text-gray-600">Booking Owner</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "owner" ? null : "owner")}
            className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm transition duration-150 hover:border-gray-300"
          >
            <span>
              {ownerFilter?.owners?.length || ownerFilter?.primary?.length
                ? `${(ownerFilter.owners || ownerFilter.primary).length} owner(s) selected`
                : "Search / Select Owners"}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </Button>
          {openFilter === "owner" && (
            <OwnerMultiSelect onApply={setOwnerFilter} onClose={() => setOpenFilter(null)} />
          )}
        </div>

        <div className="relative space-y-2 lg:flex-1">
          <div className="text-xs font-semibold text-gray-600">Booking Type</div>
          <Button
            variant="ghost"
            onClick={() => setOpenFilter(openFilter === "services" ? null : "services")}
            className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm transition duration-150 hover:border-gray-300"
          >
            <span>All Bookings</span>
            <ChevronDown size={16} className="text-gray-400" />
          </Button>
          {openFilter === "services" && (
            <ServicesFilter onApply={setServicesFilter} onClose={() => setOpenFilter(null)} />
          )}
        </div>

        <div className="flex min-w-0 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-3">
            <Search size={16} className="text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search by ID / Lead Pax / Amount"
               className="h-auto min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-gray-700 placeholder:text-gray-400 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchQuery && (
              <Button variant="ghost" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 p-0 h-auto">
                <X size={16} />
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={resetAllFilters}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50"
          title="Reset all filters"
        >
          <RefreshCw size={16} />
        </Button>
      </div>
    </div>
  );
}