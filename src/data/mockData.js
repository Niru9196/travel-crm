// ---------------------------------------------------------------------------
// Mock data — mirrors the fields called out in the ciergo Finance > Bookings spec
// ---------------------------------------------------------------------------

export const OWNER_COLORS = {
  AS: { text: "text-rose-600", ring: "ring-rose-200", bg: "bg-rose-50" },
  AK: { text: "text-violet-600", ring: "ring-violet-200", bg: "bg-violet-50" },
  SR: { text: "text-violet-600", ring: "ring-violet-200", bg: "bg-violet-50" },
  VG: { text: "text-sky-600", ring: "ring-sky-200", bg: "bg-sky-50" },
};

export const ALL_OWNERS = [
  "Harshit Roy", "Harsh Sharma", "Harshita Roy",
  "Ajay Kumar", "Ajay Thakur", "Ajay Sharma",
  "Anjali Mehta", "Rohan Singh", "Sofia Patel", "Arun Patel",
  "Vikram Choudhury", "Samantha Lee", "James Patel", "Elena Gonzalez", "Isabelle Rodriguez",
];

// Maps full owner names to the initials used in booking `owners` arrays
export const OWNER_INITIALS_MAP = {
  "Harshit Roy": "AS",
  "Harsh Sharma": "AK",
  "Harshita Roy": "SR",
  "Ajay Kumar": "VG",
  "Ajay Thakur": "AS",
  "Ajay Sharma": "AK",
  "Anjali Mehta": "SR",
  "Rohan Singh": "VG",
  "Sofia Patel": "AS",
  "Arun Patel": "AK",
  "Vikram Choudhury": "SR",
  "Samantha Lee": "VG",
  "James Patel": "AS",
  "Elena Gonzalez": "AK",
  "Isabelle Rodriguez": "SR",
};

export const SERVICE_TYPES = [
  { key: "flight", label: "Flight" },
  { key: "accomodation", label: "Accomodation" },
  { key: "transport_land_1", label: "Transportation (Land)" },
  { key: "transport_land_2", label: "Transportation (Land)" },
  { key: "ticket", label: "Ticket (Attraction)" },
  { key: "activity", label: "Activity" },
  { key: "visa", label: "Visa" },
  { key: "insurance", label: "Travel Insurance" },
  { key: "others", label: "Others" },
];

export const RAW_BOOKINGS = [
  // approvalRequired: true, approved — shows in both Bookings and Waiting tabs
  { id: "OS-ABC12", pax: "Anand Mishra", travelDate: "05 Mar '26", bookingDate: "01 Mar '26", service: "Flight", sub: null, bookingStatus: "Confirmed", paymentStatus: "Paid", status: "Paid", amount: 24580, owners: ["AS", "AK", "SR", "VG"], voucher: true, tasks: 1, approval: "approved", approvalRequired: true, vendorPending: 12000, customerPending: 5000, isRefund: false },
  { id: "OS-ABC13", pax: "Sumit Jha", travelDate: "05 Mar '26", bookingDate: "01 Mar '26", service: "Accomodation", sub: null, bookingStatus: "Confirmed", paymentStatus: "Partially Paid", status: "Partially Paid", amount: 24580, owners: ["AS", "AK", "SR", "VG"], voucher: true, tasks: 1, approval: "approved", approvalRequired: true, vendorPending: 10000, customerPending: 8500, isRefund: false },
  // approvalRequired: true, pending — shows only in Waiting tab
  { id: "LI-ABC12", pax: "Anand Mishra", travelDate: "05 Mar '26", bookingDate: "01 Mar '26", service: "UAE", sub: "Explore UAE", bookingStatus: "Pending", paymentStatus: "Pending", status: "Pending", amount: 24580, owners: ["AS", "AK", "SR", "VG"], voucher: true, tasks: 1, approval: "pending", approvalRequired: true, vendorPending: 15000, customerPending: 9580, isRefund: false },
  // approvalRequired: false — always shows in Bookings tab (no approval needed)
  { id: "OS-ABC14", pax: "Zaheer", travelDate: "05 Mar '26", bookingDate: "02 Mar '26", service: "Transportation", sub: null, bookingStatus: "Confirmed", paymentStatus: "Pending", status: "Pending", amount: 24580, owners: ["AS", "AK", "SR", "VG"], voucher: true, tasks: 1, approval: null, approvalRequired: false, vendorPending: 18000, customerPending: 6580, isRefund: false },
  // approvalRequired: true, pending
  { id: "OS-ABC15", pax: "Gaurav Kapoor", travelDate: "05 Mar '26", bookingDate: "02 Mar '26", service: "Flight", sub: null, bookingStatus: "Pending", paymentStatus: "Pending", status: "Pending", amount: 24580, owners: ["AS", "AK", "SR", "VG"], voucher: false, tasks: 0, approval: "pending", approvalRequired: true, vendorPending: 20000, customerPending: 4580, isRefund: false },
  // approvalRequired: true, pending
  { id: "OS-ABC16", pax: "Shirish Pandey", travelDate: "05 Mar '26", bookingDate: "03 Mar '26", service: "Flight", sub: null, bookingStatus: "Pending", paymentStatus: "Pending", status: "Pending", amount: 24580, owners: ["AS", "AK", "SR", "VG"], voucher: true, tasks: 1, approval: "pending", approvalRequired: true, vendorPending: 16000, customerPending: 8580, isRefund: false },
  // approvalRequired: false — always shows in Bookings tab
  { id: "OS-ABC17", pax: "Nisha Rao", travelDate: "06 Mar '26", bookingDate: "03 Mar '26", service: "Accomodation", sub: null, bookingStatus: "Confirmed", paymentStatus: "Paid", status: "Paid", amount: 18200, owners: ["AS", "VG"], voucher: true, tasks: 0, approval: null, approvalRequired: false, vendorPending: 9000, customerPending: 0, isRefund: false },
  // approvalRequired: true, pending
  { id: "OS-ABC18", pax: "Rohit Verma", travelDate: "06 Mar '26", bookingDate: "04 Mar '26", service: "Flight", sub: null, bookingStatus: "Pending", paymentStatus: "Pending", status: "Pending", amount: 31200, owners: ["AK", "SR"], voucher: false, tasks: 2, approval: "pending", approvalRequired: true, vendorPending: 25000, customerPending: 6200, isRefund: false },
  // approvalRequired: true, approved
  { id: "OS-ABC19", pax: "Priya Sharma", travelDate: "07 Mar '26", bookingDate: "04 Mar '26", service: "Flight", sub: null, bookingStatus: "Confirmed", paymentStatus: "Paid", status: "Paid", amount: 15600, owners: ["AS", "AK"], voucher: true, tasks: 0, approval: "approved", approvalRequired: true, vendorPending: 0, customerPending: 0, isRefund: false },
  // approvalRequired: false — always shows in Bookings tab
  { id: "OS-ABC20", pax: "Vikram Singh", travelDate: "07 Mar '26", bookingDate: "05 Mar '26", service: "Accomodation", sub: null, bookingStatus: "Confirmed", paymentStatus: "Partially Paid", status: "Partially Paid", amount: 42000, owners: ["SR", "VG"], voucher: true, tasks: 1, approval: null, approvalRequired: false, vendorPending: 20000, customerPending: 15000, isRefund: false },
  // approvalRequired: true, approved — isRefund: true (refund booking)
  { id: "LI-ABC13", pax: "Meera Patel", travelDate: "08 Mar '26", bookingDate: "05 Mar '26", service: "UAE", sub: "Desert Safari", bookingStatus: "Confirmed", paymentStatus: "Paid", status: "Paid", amount: 8900, owners: ["AS"], voucher: true, tasks: 0, approval: "approved", approvalRequired: true, vendorPending: 3500, customerPending: 5400, isRefund: true },
  // approvalRequired: true, rejected
  { id: "OS-ABC21", pax: "Rajesh Kumar", travelDate: "08 Mar '26", bookingDate: "06 Mar '26", service: "Transportation", sub: null, bookingStatus: "Pending", paymentStatus: "Pending", status: "Pending", amount: 5200, owners: ["AK", "VG"], voucher: false, tasks: 1, approval: "rejected", approvalRequired: true, vendorPending: 3000, customerPending: 2200, isRefund: false },
  // approvalRequired: false — always shows in Bookings tab, isRefund: true
  { id: "OS-ABC24", pax: "Deepak Gupta", travelDate: "09 Mar '26", bookingDate: "06 Mar '26", service: "Flight", sub: null, bookingStatus: "Confirmed", paymentStatus: "Pending", status: "Pending", amount: 12500, owners: ["AS", "SR"], voucher: true, tasks: 0, approval: null, approvalRequired: false, vendorPending: 4000, customerPending: 8500, isRefund: true },
];

export const DELETED_BOOKINGS = [
  { id: "OS-ABC22", pax: "Ravi Sharma", travelDate: "05 Mar '26", bookingDate: "01 Mar '26", service: "Flight", sub: null, bookingStatus: "Deleted", paymentStatus: "Pending", status: "Paid", amount: 24580, owners: ["AS", "AK", "SR", "VG"], approvalRequired: false, vendorPending: 0, customerPending: 0, isRefund: false },
  { id: "OS-ABC23", pax: "Arjun Verma", travelDate: "05 Mar '26", bookingDate: "01 Mar '26", service: "Accomodation", sub: null, bookingStatus: "Deleted", paymentStatus: "Pending", status: "Partially Paid", amount: 24580, owners: ["AS", "AK", "SR", "VG"], approvalRequired: true, vendorPending: 0, customerPending: 0, isRefund: false },
  { id: "LI-ABC32", pax: "Karan Singh", travelDate: "05 Mar '26", bookingDate: "02 Mar '26", service: "UAE", sub: "Explore UAE", bookingStatus: "Deleted", paymentStatus: "Pending", status: "Pending", amount: 24580, owners: ["AS", "AK", "SR", "VG"], approvalRequired: true, vendorPending: 0, customerPending: 0, isRefund: false },
  { id: "OS-ABC34", pax: "Irfan Khan", travelDate: "05 Mar '26", bookingDate: "02 Mar '26", service: "Flight", sub: null, bookingStatus: "Deleted", paymentStatus: "Pending", status: "Pending", amount: 24580, owners: ["AS", "AK", "SR", "VG"], approvalRequired: false, vendorPending: 0, customerPending: 0, isRefund: false },
  { id: "OS-ABC45", pax: "Vikram Mehta", travelDate: "05 Mar '26", bookingDate: "03 Mar '26", service: "Flight", sub: null, bookingStatus: "Deleted", paymentStatus: "Pending", status: "Paid", amount: 24580, owners: ["AS", "AK", "SR", "VG"], approvalRequired: false, vendorPending: 0, customerPending: 0, isRefund: true },
];

export const STATUS_STYLES = {
  Paid: "bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]",
  "Partially Paid": "bg-[#FEF9C3] text-[#854D0E] border border-[#FEF9C3]",
  Pending: "bg-[#FEF9C3] text-[#854D0E] border border-[#FEF9C3]",
};

export const CALENDAR_DAYS = [
  {
    date: "Wed, 05 Mar", os: 2, limitless: 0,
    events: [
      { id: "OS-ABC12", type: "Flight", label: "DEL → DXB", time: "09:00", top: 0 },
      { id: "OS-ABC12b", type: "Flight", label: "DEL → DXB", time: "16:00", top: 7 },
    ],
  },
  {
    date: "Thu, 06 Mar", os: 1, limitless: 1,
    events: [
      { id: "OS-ABC12", type: "Flight", label: "DEL → DXB", time: "09:00", top: 0 },
      { id: "LI-ABC12", type: "UAE", label: "Explore UAE", time: "11:00", top: 2 },
      { id: "OS-ABC16", type: "Transport", label: "Hotel Transfer", time: "12:30", top: 3 },
    ],
  },
  {
    date: "Fri, 07 Mar", os: 2, limitless: 0,
    events: [
      { id: "OS-ABC12", type: "Flight", label: "DEL → DXB", time: "10:00", top: 1 },
      { id: "OS-ABC16", type: "Transport", label: "Hotel Transfer", time: "14:30", top: 5 },
    ],
  },
  {
    date: "Sat, 08 Mar", os: 2, limitless: 0,
    events: [
      { id: "OS-ABC12", type: "Flight", label: "DEL → DXB", time: "11:00", top: 2 },
    ],
  },
  {
    date: "Sun, 09 Mar", os: 0, limitless: 0, events: [],
  },
];

export const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

// ---------------------------------------------------------------------------
// Ledger data
// ---------------------------------------------------------------------------

export const CUSTOMERS = {
  "CUST-1042": {
    id: "CUST-1042",
    name: "Anand Mishra",
    entries: [
      { id: "INV-2201", type: "Booking Created", doc: "INV", service: "Flight", bookingDate: "05 Mar '26", paymentDate: "05 Mar '26", status: "Pending", mode: "-", account: "-", amount: 24580, closingBalance: 24580 },
      { id: "PI-3301", type: "Money Received", doc: "PI", service: "Flight", bookingDate: "06 Mar '26", paymentDate: "06 Mar '26", status: "Paid", mode: "UPI", account: "HDFC - 4021", amount: 15000, closingBalance: 9580 },
      { id: "INV-2202", type: "Booking Created", doc: "INV", service: "Accomodation", bookingDate: "07 Mar '26", paymentDate: "07 Mar '26", status: "Pending", mode: "-", account: "-", amount: 18200, closingBalance: 27780 },
      { id: "CN-1103", type: "Booking Cancelled", doc: "CN", service: "Accomodation", bookingDate: "08 Mar '26", paymentDate: "08 Mar '26", status: "Refunded", mode: "-", account: "-", amount: 5000, closingBalance: 22780 },
      { id: "PI-3302", type: "Money Received", doc: "PI", service: "Accomodation", bookingDate: "09 Mar '26", paymentDate: "09 Mar '26", status: "Paid", mode: "Bank Transfer", account: "ICICI - 7742", amount: 22780, closingBalance: 0 },
      { id: "INV-2203", type: "Booking Created", doc: "INV", service: "Transportation", bookingDate: "10 Mar '26", paymentDate: "10 Mar '26", status: "Pending", mode: "-", account: "-", amount: 12400, closingBalance: 12400 },
    ],
  },
};

// Sign + colour convention per the spec, distinct for customer vs vendor ledgers.
export const LEDGER_RULES = {
  customer: {
    "Booking Created": { sign: "-", tone: "rose" },
    "Money Received": { sign: "+", tone: "emerald" },
    "Booking Cancelled": { sign: "+", tone: "emerald" },
    "Money Paid": { sign: "-", tone: "rose" },
  },
  vendor: {
    "Booking Created": { sign: "+", tone: "emerald" },
    "Money Received": { sign: "+", tone: "emerald" },
    "Booking Cancelled": { sign: "-", tone: "rose" },
    "Money Paid": { sign: "-", tone: "rose" },
  },
};

export function entryStyle(type, ledgerKind = "customer") {
  return LEDGER_RULES[ledgerKind][type] || { sign: "", tone: "gray" };
}

