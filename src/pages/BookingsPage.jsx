import React, { useState, useMemo } from "react";
import {
  Calculator, ArrowUpRight, ArrowDownLeft, CalendarDays, ChevronDown,
  RefreshCw, FileText, ClipboardList, Wallet, Check, X, Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { StatusPill, OwnerAvatars, ServiceCell, currency, Toggle } from "../components/Shared";
import OwnerMultiSelect from "../components/OwnerMultiSelect";
import ServicesFilter from "../components/ServicesFilter";
import DateFilterDropdown from "../components/DateFilterDropdown";
import ColumnHeader from "../components/DataTable/ColumnHeader";
import StatusToggle from "../components/DataTable/StatusToggle";
import {
  ActionMenu, MoreActionsMenu, BulkActionsMenu, PendingAmountPopup, Pagination,
  MORE_ACTIONS_APPROVED, MORE_ACTIONS_PENDING, MORE_ACTIONS_REJECTED, MORE_ACTIONS_DELETED,
} from "../components/ActionMenu";
import { RAW_BOOKINGS, DELETED_BOOKINGS, OWNER_INITIALS_MAP, SERVICE_TYPES } from "../data/mockData";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

// Helper: parse date strings like "05 Mar '26" into Date objects
function parseMockDate(dateStr) {
  if (!dateStr) return null;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const parts = dateStr.match(/(\d{2})\s(\w{3})\s'(\d{2})/);
  if (!parts) return null;
  return new Date(2000 + parseInt(parts[3]), months[parts[2]], parseInt(parts[1]));
}

// Map SERVICE_TYPES keys to display names used in mock data
const SERVICE_KEY_TO_DISPLAY = {};
SERVICE_TYPES.forEach((s) => { SERVICE_KEY_TO_DISPLAY[s.key] = s.label; });

function Pill({ icon: Icon, label, value, tone }) {
  const toneClass = tone === "green" ? "text-emerald-600" : tone === "red" ? "text-rose-600" : "text-gray-900";
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Icon size={15} className="text-gray-400" />
      <span>{label}</span>
      <span className={`font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

export default function BookingsPage() {
  const navigate = useNavigate();

  // Tab state
  const [tab, setTab] = useState("bookings");
  const [waitingFilter, setWaitingFilter] = useState("All");
  const [showIncomplete, setShowIncomplete] = useState(false);

  // Pagination state - defaults per requirement: 10, 20, 50, 100
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // Filter panel state
  const [openFilter, setOpenFilter] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState(null);
  const [bookingDateFilter, setBookingDateFilter] = useState(null);
  const [travelDateFilter, setTravelDateFilter] = useState(null);
  const [servicesFilter, setServicesFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Column header sort/filter state
  const [sortConfig, setSortConfig] = useState({ key: null, dir: null });
  const [columnFilters, setColumnFilters] = useState({
    pax: [],
    service: [],
    travelDate: [],
  });

  // Status toggle state (booking vs payment)
  const [statusView, setStatusView] = useState("payment");

  // Selection mode
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);

  // Source rows based on tab — properly filtered per requirement
  const rows = useMemo(() => {
    if (tab === "deleted") return DELETED_BOOKINGS;
    if (tab === "waiting") return RAW_BOOKINGS.filter((r) => r.approvalRequired);
    // "bookings" tab: show approved (if approval required) + no-approval-required bookings
    return RAW_BOOKINGS.filter((r) => !r.approvalRequired || r.approval === "approved");
  }, [tab]);

  // Apply waiting sub-filter (All/Pending/Approved/Rejected)
  const filteredByWaiting = useMemo(() => {
    if (tab !== "waiting") return rows;
    if (waitingFilter === "All") return rows;
    return rows.filter((r) => r.approval === waitingFilter.toLowerCase());
  }, [rows, tab, waitingFilter]);

  // Apply top-level filters: date, owner, services
  const filteredByTopFilters = useMemo(() => {
    let result = filteredByWaiting;

    // Booking Date filter
    if (bookingDateFilter && bookingDateFilter.start) {
      const startDate = new Date(bookingDateFilter.start);
      const endDate = bookingDateFilter.end ? new Date(bookingDateFilter.end) : null;
      result = result.filter((r) => {
        const d = parseMockDate(r.bookingDate);
        if (!d) return true;
        if (d < startDate) return false;
        if (endDate && d > endDate) return false;
        return true;
      });
    }

    // Travel Date filter
    if (travelDateFilter && travelDateFilter.start) {
      const startDate = new Date(travelDateFilter.start);
      const endDate = travelDateFilter.end ? new Date(travelDateFilter.end) : null;
      result = result.filter((r) => {
        const d = parseMockDate(r.travelDate);
        if (!d) return true;
        if (d < startDate) return false;
        if (endDate && d > endDate) return false;
        return true;
      });
    }

    // Owner filter
    if (ownerFilter) {
      const selectedNames = ownerFilter.owners || [...(ownerFilter.primary || []), ...(ownerFilter.secondary || [])];
      if (selectedNames.length > 0) {
        const selectedInitials = selectedNames.map((name) => OWNER_INITIALS_MAP[name]).filter(Boolean);
        if (selectedInitials.length > 0) {
          result = result.filter((r) =>
            r.owners.some((ownerInitial) => selectedInitials.includes(ownerInitial))
          );
        }
      }
    }

    // Services filter
    if (servicesFilter && servicesFilter.selected) {
      const allSelected = servicesFilter.selected.length === SERVICE_TYPES.length;
      if (!allSelected) {
        const allowedDisplayNames = servicesFilter.selected.map((key) => SERVICE_KEY_TO_DISPLAY[key]).filter(Boolean);
        result = result.filter((r) => allowedDisplayNames.includes(r.service));
      }
    }

    return result;
  }, [filteredByWaiting, bookingDateFilter, travelDateFilter, ownerFilter, servicesFilter]);

  // Apply column filters
  const filteredByColumns = useMemo(() => {
    let result = filteredByTopFilters;

    // Lead Pax filter
    if (columnFilters.pax.length > 0) {
      result = result.filter((r) => columnFilters.pax.includes(r.pax));
    }

    // Service filter
    if (columnFilters.service.length > 0) {
      result = result.filter((r) => columnFilters.service.includes(r.service));
    }

    // Travel Date filter
    if (columnFilters.travelDate.length > 0) {
      result = result.filter((r) => columnFilters.travelDate.includes(r.travelDate));
    }

    // Search query (ID, Lead Pax, Amount)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.pax.toLowerCase().includes(q) ||
          String(r.amount).includes(q)
      );
    }

    return result;
  }, [filteredByTopFilters, columnFilters, searchQuery]);

  // Apply sorting
  const sortedRows = useMemo(() => {
    if (!sortConfig.key || !sortConfig.dir) return filteredByColumns;

    const sorted = [...filteredByColumns];
    sorted.sort((a, b) => {
      let aVal, bVal;

      if (sortConfig.key === "travelDate") {
        aVal = new Date(a.travelDate.replace(/'/g, "20"));
        bVal = new Date(b.travelDate.replace(/'/g, "20"));
      } else if (sortConfig.key === "amount") {
        aVal = a.amount;
        bVal = b.amount;
      } else {
        return 0;
      }

      if (aVal < bVal) return sortConfig.dir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.dir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredByColumns, sortConfig]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, sortedRows.length);
  const pageRows = sortedRows.slice(start - 1, end);

  // Summary values — computed from approved/no-approval-required bookings per requirement
  const { netAmount, youGive, youGet } = useMemo(() => {
    // Only approved and no-approval-required bookings count towards summary
    const approvedBookings = RAW_BOOKINGS.filter(
      (r) => !r.approvalRequired || r.approval === "approved"
    );

    let give = 0;
    let get = 0;

    approvedBookings.forEach((r) => {
      if (r.isRefund) {
        // Refund: You Give customer money back (customerPending), You Get from vendor (vendorPending)
        give += r.customerPending || 0;
        get += r.vendorPending || 0;
      } else {
        // Normal: You Give to vendor (vendorPending), You Get from customer (customerPending)
        give += r.vendorPending || 0;
        get += r.customerPending || 0;
      }
    });

    return { netAmount: give - get, youGive: give, youGet: get };
  }, []);

  // Net pill tone: green if You Get > You Give, red otherwise
  const netTone = youGet > youGive ? "green" : "red";

  // Unique values for column filter options
  const uniquePax = useMemo(() => [...new Set(rows.map((r) => r.pax))].sort(), [rows]);
  const uniqueServices = useMemo(() => [...new Set(rows.map((r) => r.service))].sort(), [rows]);
  const uniqueTravelDates = useMemo(() => [...new Set(rows.map((r) => r.travelDate))].sort(), [rows]);

  function switchTab(next) {
    setTab(next);
    setPage(1);
    setSelectMode(false);
    setSelected([]);
    setSortConfig({ key: null, dir: null });
    setColumnFilters({ pax: [], service: [], travelDate: [] });
  }

  function toggleSelectRow(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function selectAllOnPage() {
    setSelected(pageRows.map((r) => r.id));
  }
  function deselectAll() {
    setSelected([]);
  }

  function resetAllFilters() {
    setOwnerFilter(null);
    setBookingDateFilter(null);
    setTravelDateFilter(null);
    setServicesFilter(null);
    setSearchQuery("");
    setColumnFilters({ pax: [], service: [], travelDate: [] });
    setSortConfig({ key: null, dir: null });
    setPage(1);
  }

  // Determine status to display per row
  function getDisplayStatus(row) {
    if (statusView === "payment") {
      // Per requirement: Pending/Rejected approval → payment is always "Pending"
      if (tab === "waiting" && (row.approval === "pending" || row.approval === "rejected")) {
        return "Pending";
      }
      if (tab === "deleted") {
        return "Pending";
      }
      return row.paymentStatus || row.status;
    }
    return row.bookingStatus || row.status;
  }

  // Determine which columns to show
  const showVoucherTasks = tab !== "deleted" && !(tab === "waiting" && waitingFilter === "Rejected");

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <Topbar crumbs={["Finance", "Bookings"]} />

      {/* Top pills + actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <Pill icon={Calculator} label="Net" value={currency(Math.abs(netAmount))} tone={netTone} />
          <PendingAmountPopup customer={netAmount} vendor={netAmount}>
            <Pill icon={ArrowUpRight} label="You Give" value={currency(youGive)} tone="red" />
          </PendingAmountPopup>
          <Pill icon={ArrowDownLeft} label="You Get" value={currency(youGet)} tone="green" />
        </div>
        <div className="flex items-center gap-3">
          {selectMode ? (
            <>
              <Button variant="ghost" onClick={() => { setSelectMode(false); setSelected([]); }} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 h-auto">
                Cancel
              </Button>
              <Button variant="ghost" onClick={selected.length === pageRows.length ? deselectAll : selectAllOnPage} className="px-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700 h-auto">
                {selected.length === pageRows.length ? "Deselect all" : "Select all"}
              </Button>
              <BulkActionsMenu />
            </>
          ) : (
            <MoreActionsMenu onSelect={(action) => { if (action === "select") setSelectMode(true); }} />
          )}
          <Button variant="ghost" onClick={() => navigate("/finance/bookings/calendar")} className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 p-0 h-auto">
            <CalendarDays size={16} className="text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Filters */}
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

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex items-center gap-6">
            {[
              { key: "bookings", label: "Bookings" },
              { key: "deleted", label: "Deleted" },
              { key: "waiting", label: "Waiting for Approval" },
            ].map((t) => (
              <Button
                key={t.key}
                variant="ghost"
                onClick={() => switchTab(t.key)}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors rounded-none h-auto p-0",
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
                    {["All", "Pending", "Approved", "Rejected"].map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 pb-3">
            <Toggle checked={showIncomplete} onChange={setShowIncomplete} label="Show Incomplete Bookings" />
            <span className="text-xs font-semibold bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full">
              Total {sortedRows.length}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="text-left">
                {selectMode && <TableHead className="px-5 py-3 w-10"></TableHead>}
                <TableHead className="px-5 py-3">
                  <span className="text-xs uppercase tracking-wide font-semibold text-gray-400">Booking ID</span>
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
                  <span className="text-xs uppercase tracking-wide font-semibold text-gray-400">Owner</span>
                </TableHead>
                {showVoucherTasks && (
                  <>
                    <TableHead className="px-5 py-3">
                      <span className="text-xs uppercase tracking-wide font-semibold text-gray-400">Voucher</span>
                    </TableHead>
                    <TableHead className="px-5 py-3">
                      <span className="text-xs uppercase tracking-wide font-semibold text-gray-400">Tasks</span>
                    </TableHead>
                  </>
                )}
                <TableHead className="px-5 py-3">
                  <span className="text-xs uppercase tracking-wide font-semibold text-gray-400">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((r, i) => {
                const isSelected = selected.includes(r.id);
                // Approval indicator for waiting tab
                const approvalBorder = tab === "waiting"
                  ? r.approval === "approved" ? "border-l-4 border-l-emerald-400"
                  : r.approval === "rejected" ? "border-l-4 border-l-rose-400"
                  : r.approval === "pending" ? "border-l-4 border-l-amber-400"
                  : ""
                  : "";

                return (
                  <TableRow
                    key={r.id}
                    className={cn(
                      i % 2 === 1 ? "bg-gray-50/60" : "",
                      isSelected && "bg-violet-50/60",
                      approvalBorder
                    )}
                  >
                    {selectMode && (
                      <TableCell className="px-5 py-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectRow(r.id)}
                          className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 border-gray-300 w-[18px] h-[18px] rounded"
                        />
                      </TableCell>
                    )}
                    <TableCell className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{r.id}</TableCell>
                    <TableCell className="px-5 py-4 text-gray-700 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        onClick={() => navigate("/finance/ledger/CUST-1042")}
                        className="hover:text-violet-600 hover:underline text-left p-0 h-auto"
                      >
                        {r.pax}
                      </Button>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-700 whitespace-nowrap">{r.travelDate}</TableCell>
                    <TableCell className="px-5 py-4"><ServiceCell service={r.service} sub={r.sub} /></TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusPill status={getDisplayStatus(r)} />
                    </TableCell>
                    <TableCell className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{currency(r.amount)}</TableCell>
                    <TableCell className="px-5 py-4"><OwnerAvatars owners={r.owners} /></TableCell>

                    {showVoucherTasks && (
                      <>
                        <TableCell className="px-5 py-4">
                          {r.voucher ? (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-violet-600 hover:bg-gray-50 p-0">
                                <FileText size={14} />
                              </Button>
                              <ChevronDown size={14} className="text-gray-400" />
                            </div>
                          ) : (
                            <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 p-0">+</Button>
                          )}
                        </TableCell>
                        <TableCell className="px-5 py-4">
                          {r.tasks > 0 ? (
                            <div className="relative w-8 h-8 flex items-center justify-center">
                              <ClipboardList size={16} className="text-amber-500" />
                              <span className="absolute -top-1 -right-1 text-[9px] font-bold text-violet-600">{r.tasks}</span>
                            </div>
                          ) : (
                            <span className="text-gray-300">--</span>
                          )}
                        </TableCell>
                      </>
                    )}

                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {/* Approve/Reject buttons for pending approval */}
                        {tab === "waiting" && r.approval === "pending" && (
                          <>
                            <Button variant="ghost" className="w-8 h-8 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 p-0">
                              <Check size={14} />
                            </Button>
                            <Button variant="ghost" className="w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 p-0">
                              <X size={14} />
                            </Button>
                          </>
                        )}
                        {/* Payment record button for approved bookings (not deleted, not rejected) */}
                        {tab !== "deleted" && !(tab === "waiting" && r.approval === "rejected") && !(tab === "waiting" && r.approval === "pending") && (
                          <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0">
                            <Wallet size={14} />
                          </Button>
                        )}
                        {/* More actions menu */}
                        <ActionMenu
                          items={
                            tab === "deleted"
                              ? MORE_ACTIONS_DELETED
                              : tab === "waiting"
                              ? r.approval === "rejected"
                                ? MORE_ACTIONS_REJECTED
                                : r.approval === "pending"
                                ? MORE_ACTIONS_PENDING
                                : MORE_ACTIONS_APPROVED
                              : MORE_ACTIONS_APPROVED
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={99} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
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
    </div>
  );
}
