import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import ColumnHeader from "@/components/DataTable/ColumnHeader";
import StatusToggle from "@/components/DataTable/StatusToggle";
import { Toggle } from "@/components/Shared/Shared";
import { Pagination } from "@/components/Shared/ActionMenu";
import { cn } from "@/lib/utils";
import BookingRow from "./BookingRow";
import { BOOKING_TAB_OPTIONS, WAITING_FILTER_OPTIONS } from "@/constants/bookings";

export default function BookingTable({
  tab,
  waitingFilter,
  setWaitingFilter,
  switchTab,
  showIncomplete,
  setShowIncomplete,
  sortedRows,
  pageRows,
  selectMode,
  selected,
  toggleSelectRow,
  getDisplayStatus,
  showVoucherTasks,
  currency,
  navigate,
  totalPages,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  start,
  end,
  uniquePax,
  uniqueTravelDates,
  uniqueServices,
  columnFilters,
  setColumnFilters,
  sortConfig,
  setSortConfig,
  statusView,
  setStatusView,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="flex flex-col gap-4 px-6 pt-5 pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          {BOOKING_TAB_OPTIONS.map((t) => (
            <Button
              key={t.key}
              variant="ghost"
              size="sm"
              onClick={() => switchTab(t.key)}
              className={cn(
                "pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors rounded-none h-auto px-0",
                tab === t.key
                  ? "text-violet-600 border-violet-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              )}
            >
              {t.label}
            </Button>
          ))}
          {tab === "waiting" && (
            <div className="relative -mt-1">
              <Select value={waitingFilter} onValueChange={(val) => { setWaitingFilter(val); setPage(1); }}>
                <SelectTrigger className="text-xs border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 h-auto text-gray-600 bg-white focus:outline-hidden">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WAITING_FILTER_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pb-3">
          <Toggle checked={showIncomplete} onChange={setShowIncomplete} label="Show Incomplete Bookings" />
          <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">
            Total {sortedRows.length}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      <div className="overflow-x-auto pb-4">
        <Table className="w-full min-w-full text-sm border-separate border-spacing-y-3 -mt-3">
          <TableHeader className="bg-dark-grey h-14">
            <TableRow className="text-left text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
              {selectMode && <TableHead className="px-5 py-3 w-10" />}
              <TableHead className="px-5 py-3">
                <span className="text-sm uppercase tracking-wide font-medium text-grey-light">Booking ID</span>
              </TableHead>
              <TableHead className="px-5 py-3">
                <ColumnHeader
                  label="Lead Pax"
                  type="filter"
                  filterOptions={uniquePax}
                  activeFilters={columnFilters.pax}
                  onFilter={(vals) => { setColumnFilters((f) => ({ ...f, pax: vals })); setPage(1); }}
                />
              </TableHead>
              <TableHead className="px-5 py-3">
                <ColumnHeader
                  label="Travel Date"
                  type="both"
                  sortDir={sortConfig.key === "travelDate" ? sortConfig.dir : null}
                  onSort={(dir) => setSortConfig(dir ? { key: "travelDate", dir } : { key: null, dir: null })}
                  filterOptions={uniqueTravelDates}
                  activeFilters={columnFilters.travelDate}
                  onFilter={(vals) => { setColumnFilters((f) => ({ ...f, travelDate: vals })); setPage(1); }}
                />
              </TableHead>
              <TableHead className="px-5 py-3">
                <ColumnHeader
                  label="Service"
                  type="filter"
                  filterOptions={uniqueServices}
                  activeFilters={columnFilters.service}
                  onFilter={(vals) => { setColumnFilters((f) => ({ ...f, service: vals })); setPage(1); }}
                />
              </TableHead>
              <TableHead className="px-5 py-3">
                <StatusToggle statusView={statusView} onToggle={setStatusView} />
              </TableHead>
              <TableHead className="px-5 py-3">
                <ColumnHeader
                  label="Amount"
                  type="sort"
                  sortDir={sortConfig.key === "amount" ? sortConfig.dir : null}
                  onSort={(dir) => setSortConfig(dir ? { key: "amount", dir } : { key: null, dir: null })}
                />
              </TableHead>
              <TableHead className="px-5 py-3">
                <span className="text-sm uppercase tracking-wide font-medium text-grey-light">Owner</span>
              </TableHead>
              {showVoucherTasks && (
                <>
                  <TableHead className="px-5 py-3">
                    <span className="text-sm uppercase tracking-wide font-medium text-grey-light">Voucher</span>
                  </TableHead>
                  <TableHead className="px-5 py-3">
                    <span className="text-sm uppercase tracking-wide font-medium text-grey-light">Tasks</span>
                  </TableHead>
                </>
              )}
              <TableHead className="px-5 py-3">
                <span className="text-sm uppercase tracking-wide font-medium text-grey-light">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-transparent">
            {pageRows.map((r, i) => (
              <BookingRow
                key={r.id}
                r={r}
                i={i}
                isSelected={selected.includes(r.id)}
                selectMode={selectMode}
                toggleSelectRow={toggleSelectRow}
                getDisplayStatus={getDisplayStatus}
                showVoucherTasks={showVoucherTasks}
                currency={currency}
                navigate={navigate}
                tab={tab}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        start={start}
        end={end}
        total={sortedRows.length}
      />
    </div>
  );
}