import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "@/layout/Topbar";
import { RAW_BOOKINGS, DELETED_BOOKINGS } from "@/data/mockData";
import { currency } from "@/components/Shared/Shared";
import BookingSummary from "@/components/BookingsPage/BookingSummary";
import BookingFilters from "@/components/BookingsPage/BookingFilters";
import BookingTable from "@/components/BookingsPage/BookingTable";
import { applyBookingFilters, applyColumnFilters, sortRows, computeBookingSummary } from "@/utils/booking-page-utils";

export default function BookingsPage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("bookings");
  const [waitingFilter, setWaitingFilter] = useState("All");
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(null);
  const [ownerFilter, setOwnerFilter] = useState(null);
  const [bookingDateFilter, setBookingDateFilter] = useState(null);
  const [travelDateFilter, setTravelDateFilter] = useState(null);
  const [servicesFilter, setServicesFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, dir: null });
  const [columnFilters, setColumnFilters] = useState({ pax: [], service: [], travelDate: [] });
  const [statusView, setStatusView] = useState("payment");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([]);

  const rows = useMemo(() => {
    if (tab === "deleted") return DELETED_BOOKINGS;
    if (tab === "waiting") return RAW_BOOKINGS.filter((r) => r.approvalRequired);
    return RAW_BOOKINGS.filter((r) => !r.approvalRequired || r.approval === "approved");
  }, [tab]);

  const filteredByWaiting = useMemo(() => {
    if (tab !== "waiting") return rows;
    if (waitingFilter === "All") return rows;
    return rows.filter((r) => r.approval === waitingFilter.toLowerCase());
  }, [rows, tab, waitingFilter]);

  const filteredByTopFilters = useMemo(
    () => applyBookingFilters(filteredByWaiting, bookingDateFilter, travelDateFilter, ownerFilter, servicesFilter),
    [filteredByWaiting, bookingDateFilter, travelDateFilter, ownerFilter, servicesFilter]
  );

  const filteredByColumns = useMemo(
    () => applyColumnFilters(filteredByTopFilters, columnFilters, searchQuery),
    [filteredByTopFilters, columnFilters, searchQuery]
  );

  const sortedRows = useMemo(() => sortRows(filteredByColumns, sortConfig), [filteredByColumns, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, sortedRows.length);
  const pageRows = sortedRows.slice(start - 1, end);

  const { netAmount, youGive, youGet } = useMemo(() => computeBookingSummary(RAW_BOOKINGS), []);

  const netTone = youGet > youGive ? "green" : "red";

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

  function getDisplayStatus(row) {
    if (statusView === "payment") {
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

  const showVoucherTasks = tab !== "deleted" && !(tab === "waiting" && waitingFilter === "Rejected");

  return (
    <div className="mx-auto px-6 py-6">
      <Topbar crumbs={["Finance", "Bookings"]} />

      <BookingSummary
        navigate={navigate}
        selectMode={selectMode}
        pageRows={pageRows}
        selected={selected}
        setSelectMode={setSelectMode}
        deselectAll={deselectAll}
        selectAllOnPage={selectAllOnPage}
        netAmount={currency(Math.abs(netAmount))}
        youGive={currency(youGive)}
        youGet={currency(youGet)}
        netTone={netTone}
      />

      <BookingFilters
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        bookingDateFilter={bookingDateFilter}
        travelDateFilter={travelDateFilter}
        ownerFilter={ownerFilter}
        servicesFilter={servicesFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resetAllFilters={resetAllFilters}
        setPage={setPage}
      />

      <BookingTable
        tab={tab}
        waitingFilter={waitingFilter}
        setWaitingFilter={setWaitingFilter}
        switchTab={switchTab}
        showIncomplete={showIncomplete}
        setShowIncomplete={setShowIncomplete}
        sortedRows={sortedRows}
        pageRows={pageRows}
        selectMode={selectMode}
        selected={selected}
        toggleSelectRow={toggleSelectRow}
        getDisplayStatus={getDisplayStatus}
        showVoucherTasks={showVoucherTasks}
        currency={currency}
        navigate={navigate}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        page={page}
        setPage={setPage}
        start={start}
        end={end}
        uniquePax={uniquePax}
        uniqueTravelDates={uniqueTravelDates}
        uniqueServices={uniqueServices}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        statusView={statusView}
        setStatusView={setStatusView}
      />
    </div>
  );
}
