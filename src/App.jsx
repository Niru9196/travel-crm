import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/hooks/useSidebar";
import Sidebar from "@/layout/Sidebar";
import Topbar from "@/layout/Topbar";
import BookingsPage from "@/pages/BookingsPage";
import BookingCalendarPage from "@/pages/BookingCalendarPage";
import CustomerLedgerPage from "@/pages/CustomerLedgerPage";

export default function App() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/finance/bookings" replace />} />
            <Route
              path="/finance/bookings"
              element={<Topbar crumbs={["Finance", "Bookings"]}><BookingsPage /></Topbar>}
            />
            <Route
              path="/finance/bookings/calendar"
              element={<Topbar crumbs={["Finance", "Bookings", "Booking Calendar"]}><BookingCalendarPage /></Topbar>}
            />
            <Route
              path="/finance/ledger/:customerId"
              element={<Topbar crumbs={["Finance", "Bookings", "Ledger"]}><CustomerLedgerPage /></Topbar>}
            />
            <Route path="*" element={<Navigate to="/finance/bookings" replace />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
}
