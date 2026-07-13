export const BOOKING_TAB_OPTIONS = [
  { key: "bookings", label: "Bookings" },
  { key: "deleted", label: "Deleted" },
  { key: "waiting", label: "Waiting for Approval" },
];

export const WAITING_FILTER_OPTIONS = ["All", "Pending", "Approved", "Rejected"];

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_BOOKING_COLUMN_FILTERS = {
  pax: [],
  service: [],
  travelDate: [],
};

export const DEFAULT_SORT_CONFIG = { key: null, dir: null };
