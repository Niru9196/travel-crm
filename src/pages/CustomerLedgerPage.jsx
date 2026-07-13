import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Eye, Pencil, RefreshCw, CalendarDays, ChevronDown,
} from "lucide-react";
import { Toggle, currency } from "@/components/Shared/Shared";
import { Pagination } from "@/components/Shared/ActionMenu";
import DateFilterDropdown from "@/components/Shared/DateFilterDropdown";
import {
  PdfDropdown, PdfViewOverlay, DownloadLedgerModal, ShareLedgerModal, PaymentSideSheet,
} from "@/components/LedgerModals/LedgerModals";
import { CUSTOMERS, entryStyle } from "@/data/mockData";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function AmountCell({ entry, ledgerKind }) {
  const { sign, tone } = entryStyle(entry.type, ledgerKind);
  const toneClass = tone === "emerald" ? "text-emerald-600" : tone === "rose" ? "text-rose-600" : "text-gray-700";
  return (
    <span className={`font-medium ${toneClass}`}>
      {sign} {currency(entry.amount)}
    </span>
  );
}

function ClosingBalanceCell({ value, willReceive }) {
  // Red if to be received from customer, Green if to be paid to customer
  const toneClass = willReceive ? "text-rose-600" : "text-emerald-600";
  return <span className={`font-semibold ${toneClass}`}>{currency(Math.abs(value))}</span>;
}

export default function CustomerLedgerPage() {
  const navigate = useNavigate();
  const { customerId = "CUST-1042" } = useParams();
  const customer = CUSTOMERS[customerId] || CUSTOMERS["CUST-1042"];

  const [ledgerKind] = useState("customer"); // this page instance is always customer-side
  const [pendingOnly, setPendingOnly] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [showPdf, setShowPdf] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [sideSheet, setSideSheet] = useState(null); // "got" | "gave" | null

  const netOutstanding = useMemo(() => {
    const last = customer.entries[customer.entries.length - 1];
    return last ? last.closingBalance : 0;
  }, [customer]);

  // Per spec: You Collect if (INV - CN - (PI+PO)) is positive, You Pay if negative.
  const youCollect = netOutstanding >= 0;

  const rows = useMemo(
    () => (pendingOnly ? customer.entries.filter((e) => e.status === "Pending") : customer.entries),
    [customer, pendingOnly]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, rows.length);
  const pageRows = rows.slice(start - 1, end);

  return (
    <>
      {/* Heading */}
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-lg font-semibold text-gray-900">
          Ledger | {customer.name} | <span className="text-gray-400">{customer.id}</span>
        </h1>
        <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0 h-auto">
          <Eye size={14} />
        </Button>
        <Button variant="ghost" className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 p-0 h-auto">
          <Pencil size={14} />
        </Button>
      </div>

      {/* You Collect/Pay + View PDF */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
            youCollect ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {youCollect ? "You Collect" : "You Pay"}
            <span>{currency(Math.abs(netOutstanding))}</span>
          </div>
          <Button variant="ghost" className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-500 p-0 h-auto">
            <RefreshCw size={14} />
          </Button>
        </div>
        <PdfDropdown
          onView={() => setShowPdf(true)}
          onDownload={() => setShowDownload(true)}
          onShare={() => setShowShare(true)}
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="text-xs font-semibold text-gray-700 mb-2">Booking Date</div>
            <Button
              variant="ghost"
              onClick={() => setOpenFilter(openFilter === "booking" ? null : "booking")}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 w-64 h-auto justify-start"
            >
              <CalendarDays size={13} className="text-gray-300" />
              01 Apr '25 → 31 Mar '26
              <ChevronDown size={12} className="ml-auto text-gray-400" />
            </Button>
            {openFilter === "booking" && (
              <DateFilterDropdown initial="booking" onApply={() => {}} onClose={() => setOpenFilter(null)} />
            )}
          </div>
          <div className="relative">
            <div className="text-xs font-semibold text-gray-700 mb-2">Travel Date</div>
            <Button
              variant="ghost"
              onClick={() => setOpenFilter(openFilter === "travel" ? null : "travel")}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 w-64 h-auto justify-start"
            >
              <CalendarDays size={13} className="text-gray-300" />
              Start Date → End Date
              <ChevronDown size={12} className="ml-auto text-gray-400" />
            </Button>
            {openFilter === "travel" && (
              <DateFilterDropdown initial="travel" onApply={() => {}} onClose={() => setOpenFilter(null)} />
            )}
          </div>
          <div className="flex-1" />
          <Toggle checked={pendingOnly} onChange={setPendingOnly} label="Show bookings with pending invoices" />
        </div>
      </div>

      {/* You Gave / You Got */}
      <div className="flex items-center gap-3 mb-4">
        <Button
          onClick={() => setSideSheet("got")}
          className="px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold border border-emerald-100 hover:bg-emerald-100 h-auto"
        >
          You Got
        </Button>
        <Button
          onClick={() => setSideSheet("gave")}
          className="px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-100 hover:bg-rose-100 h-auto"
        >
          You Gave
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow className="text-left text-gray-400 text-xs uppercase tracking-wide">
                {["ID", "Service", "Booking / Payment Date", "Status / Mode", "Account", "Amount", "Closing Balance", "Actions"].map((c) => (
                  <TableHead key={c} className="px-5 py-3 font-semibold whitespace-nowrap">{c}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((e, i) => (
                <TableRow key={e.id} className={i % 2 === 1 ? "bg-gray-50/60" : ""}>
                  <TableCell className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{e.id}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 whitespace-nowrap">{e.service}</TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 whitespace-nowrap">
                    <div>{e.bookingDate}</div>
                    <div className="text-xs text-gray-400">{e.paymentDate}</div>
                  </TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap">
                    <div className="text-gray-700">{e.status}</div>
                    <div className="text-xs text-gray-400">{e.mode}</div>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-700 whitespace-nowrap">{e.account}</TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap"><AmountCell entry={e} ledgerKind={ledgerKind} /></TableCell>
                  <TableCell className="px-5 py-4 whitespace-nowrap">
                    <ClosingBalanceCell value={e.closingBalance} willReceive={e.closingBalance >= 0} />
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <Button variant="ghost" className="text-xs font-medium text-violet-600 hover:underline p-0 h-auto">View</Button>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">No ledger entries found.</TableCell>
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
          total={rows.length}
          label="entries"
        />
      </div>

      {showPdf && (
        <PdfViewOverlay title={`Ledger | ${customer.name} | ${customer.id}`} onClose={() => setShowPdf(false)}>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xs p-8 space-y-4">
            {customer.entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{e.id} — {e.type}</div>
                  <div className="text-xs text-gray-400">{e.bookingDate}</div>
                </div>
                <AmountCell entry={e} ledgerKind={ledgerKind} />
              </div>
            ))}
          </div>
        </PdfViewOverlay>
      )}
      {showDownload && <DownloadLedgerModal onClose={() => setShowDownload(false)} />}
      {showShare && <ShareLedgerModal onClose={() => setShowShare(false)} />}
      {sideSheet && <PaymentSideSheet kind={sideSheet} onClose={() => setSideSheet(null)} />}
    </>
  );
}
