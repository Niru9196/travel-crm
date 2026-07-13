import { OWNER_INITIALS_MAP, SERVICE_TYPES } from "@/data/mockData";

const MONTHS = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseMockDate(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.match(/(\d{2})\s(\w{3})\s'(\d{2})/);
  if (!parts) return null;

  return new Date(2000 + parseInt(parts[3], 10), MONTHS[parts[2]], parseInt(parts[1], 10));
}

export function applyBookingFilters(rows, bookingDateFilter, travelDateFilter, ownerFilter, servicesFilter) {
  let result = rows;

  if (bookingDateFilter?.start) {
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

  if (travelDateFilter?.start) {
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

  if (servicesFilter?.selected) {
    const allSelected = servicesFilter.selected.length === SERVICE_TYPES.length;
    if (!allSelected) {
      const allowedDisplayNames = servicesFilter.selected
        .map((key) => SERVICE_TYPES.find((item) => item.key === key)?.label)
        .filter(Boolean);
      result = result.filter((r) => allowedDisplayNames.includes(r.service));
    }
  }

  return result;
}

export function applyColumnFilters(rows, columnFilters, searchQuery) {
  let result = rows;

  if (columnFilters.pax.length > 0) {
    result = result.filter((r) => columnFilters.pax.includes(r.pax));
  }

  if (columnFilters.service.length > 0) {
    result = result.filter((r) => columnFilters.service.includes(r.service));
  }

  if (columnFilters.travelDate.length > 0) {
    result = result.filter((r) => columnFilters.travelDate.includes(r.travelDate));
  }

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
}

export function sortRows(rows, sortConfig) {
  if (!sortConfig.key || !sortConfig.dir) {
    return rows;
  }

  return [...rows].sort((a, b) => {
    let aVal;
    let bVal;

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
}

export function computeBookingSummary(bookings) {
  const approvedBookings = bookings.filter((r) => !r.approvalRequired || r.approval === "approved");

  let give = 0;
  let get = 0;

  approvedBookings.forEach((r) => {
    if (r.isRefund) {
      give += r.customerPending || 0;
      get += r.vendorPending || 0;
    } else {
      give += r.vendorPending || 0;
      get += r.customerPending || 0;
    }
  });

  return {
    netAmount: give - get,
    youGive: give,
    youGet: get,
  };
}
