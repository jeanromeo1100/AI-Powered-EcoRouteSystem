import { useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  FileCheck2,
  FilePlus2,
  FileText,
  Filter,
  Landmark,
  MapPin,
  Mail,
  MoreHorizontal,
  Phone,
  Printer,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Truck,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react"

type FinanceProfile = {
  name?: string
  email?: string
  phone?: string
  category?: string
}

type Row = Record<string, string>

type PageDefinition = {
  description: string
  columns: string[]
  rows: Row[]
  actions: string[]
  filters?: string[]
  primaryAction?: string
}

const transactions: Row[] = [
  {
    "Transaction ID": "TXN-10482",
    Customer: "Jean Romeo",
    Invoice: "INV-2026-1048",
    Amount: "RWF 18,000",
    "Payment Method": "MTN Mobile Money",
    Provider: "MTN MoMo",
    Reference: "MP26092810482",
    "Date & Time": "Oct 03, 2026 · 09:42",
    Status: "Successful",
    "Verified By": "Aline N.",
  },
  {
    "Transaction ID": "TXN-10481",
    Customer: "Aline Uwase",
    Invoice: "INV-2026-1049",
    Amount: "RWF 24,000",
    "Payment Method": "Airtel Money",
    Provider: "Airtel Money",
    Reference: "AM26092810481",
    "Date & Time": "Oct 03, 2026 · 09:18",
    Status: "Pending",
    "Verified By": "Awaiting webhook",
  },
  {
    "Transaction ID": "TXN-10480",
    Customer: "Patrick Habimana",
    Invoice: "INV-2026-1050",
    Amount: "RWF 18,000",
    "Payment Method": "Bank",
    Provider: "Bank of Kigali",
    Reference: "BK-883104",
    "Date & Time": "Oct 03, 2026 · 08:54",
    Status: "Under Review",
    "Verified By": "Finance queue",
  },
  {
    "Transaction ID": "TXN-10479",
    Customer: "Kigali Fresh Market",
    Invoice: "INV-2026-1044",
    Amount: "RWF 85,000",
    "Payment Method": "MTN Mobile Money",
    Provider: "MTN MoMo",
    Reference: "MP26092810479",
    "Date & Time": "Oct 02, 2026 · 16:20",
    Status: "Failed",
    "Verified By": "Provider response",
  },
  {
    "Transaction ID": "TXN-10478",
    Customer: "Mutesi Alice",
    Invoice: "INV-2026-1043",
    Amount: "RWF 18,000",
    "Payment Method": "Cash",
    Provider: "Finance desk",
    Reference: "CSH-001284",
    "Date & Time": "Oct 02, 2026 · 14:05",
    Status: "Successful",
    "Verified By": "Claudine U.",
  },
]

const customers: Row[] = [
  {
    "Customer ID": "CUS-2048",
    "Customer Name": "Jean Romeo",
    Phone: "+250 788 123 456",
    Email: "jean.romeo@example.com",
    Address: "KG 218, Nyarugunga, Kicukiro, Kigali",
    Type: "Household · Level 2",
    "Service Plan": "Every Monday · 08:00–11:00",
    "Billing Cycle": "Monthly",
    "Monthly Amount": "RWF 18,000",
    "Current Balance": "RWF 0",
    "Payment Status": "Paid",
    "Last Payment": "Oct 03, 2026",
    "Next Due Date": "Nov 01, 2026",
  },
  {
    "Customer ID": "CUS-2049",
    "Customer Name": "Aline Uwase",
    Phone: "+250 783 415 228",
    Email: "aline@email.rw",
    Address: "Remera · Rukiri I",
    Type: "Household",
    "Service Plan": "Twice weekly",
    "Billing Cycle": "Monthly",
    "Monthly Amount": "RWF 24,000",
    "Current Balance": "RWF 24,000",
    "Payment Status": "Pending",
    "Last Payment": "Sep 02, 2026",
    "Next Due Date": "Oct 01, 2026",
  },
  {
    "Customer ID": "CUS-2050",
    "Customer Name": "Patrick Habimana",
    Phone: "+250 720 335 901",
    Email: "patrick@email.rw",
    Address: "Niboye · Gatare",
    Type: "Household",
    "Service Plan": "Weekly",
    "Billing Cycle": "Monthly",
    "Monthly Amount": "RWF 18,000",
    "Current Balance": "RWF 36,000",
    "Payment Status": "Overdue",
    "Last Payment": "Aug 27, 2026",
    "Next Due Date": "Sep 01, 2026",
  },
  {
    "Customer ID": "CUS-2051",
    "Customer Name": "Kigali Fresh Market",
    Phone: "+250 788 900 125",
    Email: "accounts@kfm.rw",
    Address: "Kimironko",
    Type: "Business",
    "Service Plan": "Daily commercial",
    "Billing Cycle": "Monthly",
    "Monthly Amount": "RWF 85,000",
    "Current Balance": "RWF 85,000",
    "Payment Status": "Due",
    "Last Payment": "Sep 01, 2026",
    "Next Due Date": "Oct 05, 2026",
  },
]

const invoices: Row[] = [
  {
    "Invoice Number": "INV-2026-1051",
    Customer: "Aline Uwase",
    Phone: "+250 783 415 228",
    "Billing Period": "October 2026",
    Service: "Twice-weekly collection",
    Amount: "RWF 20,690",
    Tax: "RWF 3,310",
    Total: "RWF 24,000",
    "Issue Date": "Oct 01, 2026",
    "Due Date": "Oct 08, 2026",
    Status: "Sent",
  },
  {
    "Invoice Number": "INV-2026-1050",
    Customer: "Patrick Habimana",
    Phone: "+250 720 335 901",
    "Billing Period": "October 2026",
    Service: "Weekly household collection",
    Amount: "RWF 15,517",
    Tax: "RWF 2,483",
    Total: "RWF 18,000",
    "Issue Date": "Oct 01, 2026",
    "Due Date": "Oct 08, 2026",
    Status: "Partially Paid",
  },
  {
    "Invoice Number": "INV-2026-1049",
    Customer: "Jean Romeo",
    Phone: "+250 788 123 456",
    "Billing Period": "October 2026",
    Service: "Household Standard · Every Monday",
    Amount: "RWF 15,517",
    Tax: "RWF 2,483",
    Total: "RWF 18,000",
    "Issue Date": "Oct 01, 2026",
    "Due Date": "Oct 08, 2026",
    Status: "Paid",
  },
  {
    "Invoice Number": "INV-2026-1048",
    Customer: "Kigali Fresh Market",
    Phone: "+250 788 900 125",
    "Billing Period": "October 2026",
    Service: "Daily commercial collection",
    Amount: "RWF 73,276",
    Tax: "RWF 11,724",
    Total: "RWF 85,000",
    "Issue Date": "Oct 01, 2026",
    "Due Date": "Oct 05, 2026",
    Status: "Overdue",
  },
  {
    "Invoice Number": "INV-2026-1052",
    Customer: "Mutesi Alice",
    Phone: "+250 788 700 114",
    "Billing Period": "November 2026",
    Service: "Weekly household collection",
    Amount: "RWF 15,517",
    Tax: "RWF 2,483",
    Total: "RWF 18,000",
    "Issue Date": "Oct 03, 2026",
    "Due Date": "Nov 08, 2026",
    Status: "Draft",
  },
]

const outstanding: Row[] = [
  {
    Customer: "Patrick Habimana",
    Invoice: "INV-2026-1018",
    "Total Amount": "RWF 36,000",
    "Amount Paid": "RWF 18,000",
    "Remaining Balance": "RWF 18,000",
    "Due Date": "Sep 01, 2026",
    "Days Overdue": "32 days",
    Status: "Partially Paid",
  },
  {
    Customer: "Kigali Fresh Market",
    Invoice: "INV-2026-1048",
    "Total Amount": "RWF 85,000",
    "Amount Paid": "RWF 0",
    "Remaining Balance": "RWF 85,000",
    "Due Date": "Sep 18, 2026",
    "Days Overdue": "15 days",
    Status: "Overdue",
  },
  {
    Customer: "Aline Uwase",
    Invoice: "INV-2026-1051",
    "Total Amount": "RWF 24,000",
    "Amount Paid": "RWF 0",
    "Remaining Balance": "RWF 24,000",
    "Due Date": "Oct 08, 2026",
    "Days Overdue": "—",
    Status: "Due Soon",
  },
  {
    Customer: "Ubumwe Restaurant",
    Invoice: "INV-2026-1045",
    "Total Amount": "RWF 62,000",
    "Amount Paid": "RWF 0",
    "Remaining Balance": "RWF 62,000",
    "Due Date": "Oct 03, 2026",
    "Days Overdue": "0 days",
    Status: "Due",
  },
]

const mobileMoney: Row[] = [
  {
    "Transaction ID": "MM-702841",
    Provider: "MTN Mobile Money",
    Customer: "Jean Romeo",
    Phone: "+250 788 123 456",
    Amount: "RWF 18,000",
    Reference: "MP26092810482",
    "Request Date": "Oct 03 · 09:41",
    "Completion Date": "Oct 03 · 09:42",
    Status: "Successful",
  },
  {
    "Transaction ID": "MM-702840",
    Provider: "Airtel Money",
    Customer: "Aline Uwase",
    Phone: "+250 783 415 228",
    Amount: "RWF 24,000",
    Reference: "AM26092810481",
    "Request Date": "Oct 03 · 09:18",
    "Completion Date": "Awaiting provider",
    Status: "Pending",
  },
  {
    "Transaction ID": "MM-702839",
    Provider: "MTN Mobile Money",
    Customer: "Kigali Fresh Market",
    Phone: "+250 788 900 125",
    Amount: "RWF 85,000",
    Reference: "MP26092810479",
    "Request Date": "Oct 02 · 16:19",
    "Completion Date": "Oct 02 · 16:20",
    Status: "Failed",
  },
  {
    "Transaction ID": "MM-702838",
    Provider: "Airtel Money",
    Customer: "Mutesi Alice",
    Phone: "+250 733 700 114",
    Amount: "RWF 18,000",
    Reference: "Awaiting request",
    "Request Date": "Oct 02 · 14:10",
    "Completion Date": "—",
    Status: "Initiated",
  },
]

const enforcement: Row[] = [
  {
    Customer: "Patrick Habimana",
    "Outstanding Amount": "RWF 18,000",
    "Days Overdue": "32",
    "Last Payment": "Aug 27, 2026",
    Reminders: "3",
    Status: "Follow-up Required",
    "Last Contact": "Oct 01 · SMS",
    "Next Action": "Call customer · Oct 04",
  },
  {
    Customer: "Kigali Fresh Market",
    "Outstanding Amount": "RWF 85,000",
    "Days Overdue": "15",
    "Last Payment": "Sep 01, 2026",
    Reminders: "2",
    Status: "Payment Promise",
    "Last Contact": "Oct 02 · Call",
    "Next Action": "Review promise · Oct 06",
  },
  {
    Customer: "Ubumwe Restaurant",
    "Outstanding Amount": "RWF 62,000",
    "Days Overdue": "7",
    "Last Payment": "Aug 30, 2026",
    Reminders: "1",
    Status: "Reminder Sent",
    "Last Contact": "Oct 02 · Email",
    "Next Action": "Follow up · Oct 05",
  },
]

const reconciliation: Row[] = [
  {
    "System Transaction ID": "TXN-10482",
    "Provider Transaction ID": "MP26092810482",
    Customer: "Jean Romeo",
    "Expected Amount": "RWF 18,000",
    "Received Amount": "RWF 18,000",
    "Payment Date": "Oct 03, 2026",
    Provider: "MTN MoMo",
    Status: "Matched",
  },
  {
    "System Transaction ID": "TXN-10481",
    "Provider Transaction ID": "AM26092810481",
    Customer: "Aline Uwase",
    "Expected Amount": "RWF 24,000",
    "Received Amount": "Pending",
    "Payment Date": "Oct 03, 2026",
    Provider: "Airtel Money",
    Status: "Pending Verification",
  },
  {
    "System Transaction ID": "TXN-10476",
    "Provider Transaction ID": "MP26092799102",
    Customer: "Ubumwe Restaurant",
    "Expected Amount": "RWF 62,000",
    "Received Amount": "RWF 60,000",
    "Payment Date": "Oct 02, 2026",
    Provider: "MTN MoMo",
    Status: "Amount Mismatch",
  },
  {
    "System Transaction ID": "TXN-10470",
    "Provider Transaction ID": "AM26092681042",
    Customer: "Mutesi Alice",
    "Expected Amount": "RWF 18,000",
    "Received Amount": "RWF 18,000",
    "Payment Date": "Oct 01, 2026",
    Provider: "Airtel Money",
    Status: "Duplicate",
  },
]

const receipts: Row[] = transactions
  .filter((item) => item.Status === "Successful")
  .map((item, index) => ({
    "Receipt Number": `RCT-2026-${8042 - index}`,
    Customer: item.Customer,
    Phone: index ? "+250 788 700 114" : "+250 788 123 456",
    Invoice: item.Invoice,
    Reference: item.Reference,
    Method: item["Payment Method"],
    Provider: item.Provider,
    "Amount Paid": item.Amount,
    "Payment Date": item["Date & Time"],
    Status: item.Status,
    "Issued By": index ? "Claudine Uwase" : "System confirmation",
  }))

const notifications: Row[] = [
  {
    Title: "Payment confirmed",
    Description: "MTN MoMo confirmed RWF 18,000 from Jean Romeo.",
    "Date / Time": "Oct 03 · 09:42",
    Status: "Unread",
    Related: "TXN-10482",
  },
  {
    Title: "Payment pending",
    Description: "Airtel Money request is waiting for provider confirmation.",
    "Date / Time": "Oct 03 · 09:18",
    Status: "Unread",
    Related: "TXN-10481",
  },
  {
    Title: "Reconciliation issue",
    Description: "Received amount differs by RWF 2,000.",
    "Date / Time": "Oct 02 · 17:04",
    Status: "Unread",
    Related: "TXN-10476",
  },
  {
    Title: "Invoice overdue",
    Description: "Kigali Fresh Market invoice is now 15 days overdue.",
    "Date / Time": "Oct 02 · 08:00",
    Status: "Read",
    Related: "INV-2026-1048",
  },
  {
    Title: "Mobile Money failed",
    Description: "Provider declined payment request; invoice remains unpaid.",
    "Date / Time": "Oct 02 · 16:20",
    Status: "Read",
    Related: "MM-702839",
  },
]

const audit: Row[] = [
  {
    "Date / Time": "Oct 03 · 09:45",
    User: "Claudine Uwase",
    Action: "Payment verified",
    Module: "Payments",
    Reference: "TXN-10482",
    Description: "Verified against MTN provider confirmation.",
  },
  {
    "Date / Time": "Oct 03 · 09:30",
    User: "Claudine Uwase",
    Action: "Invoice sent",
    Module: "Invoices",
    Reference: "INV-2026-1051",
    Description: "Sent to customer by email and SMS.",
  },
  {
    "Date / Time": "Oct 02 · 17:12",
    User: "Claudine Uwase",
    Action: "Reconciliation reviewed",
    Module: "Reconciliation",
    Reference: "TXN-10476",
    Description: "Amount mismatch assigned for provider review.",
  },
  {
    "Date / Time": "Oct 02 · 15:08",
    User: "Claudine Uwase",
    Action: "Reminder sent",
    Module: "Billing enforcement",
    Reference: "INV-2026-1048",
    Description: "Payment reminder sent by SMS.",
  },
  {
    "Date / Time": "Oct 02 · 11:20",
    User: "Claudine Uwase",
    Action: "Report generated",
    Module: "Reports",
    Reference: "RPT-00381",
    Description: "September monthly revenue report generated.",
  },
]

const reportRows: Row[] = [
  {
    Report: "Payment report",
    Coverage: "Successful, pending and failed payments by method",
    Period: "October 2026",
    "Last Generated": "Today · 08:30",
    Status: "Ready",
  },
  {
    Report: "Revenue report",
    Coverage: "Daily, weekly, monthly and yearly revenue",
    Period: "2026 YTD",
    "Last Generated": "Oct 02 · 17:20",
    Status: "Ready",
  },
  {
    Report: "Outstanding bills",
    Coverage: "Overdue and partially paid invoices",
    Period: "As of Oct 03",
    "Last Generated": "Today · 07:00",
    Status: "Ready",
  },
  {
    Report: "Mobile Money report",
    Coverage: "MTN and Airtel provider transaction states",
    Period: "October 2026",
    "Last Generated": "Oct 02 · 18:00",
    Status: "Ready",
  },
  {
    Report: "Billing report",
    Coverage: "Paid, unpaid and overdue invoices",
    Period: "Q4 2026",
    "Last Generated": "Oct 01 · 09:00",
    Status: "Ready",
  },
  {
    Report: "Payment collector report",
    Coverage: "Expected, collected and remaining amounts",
    Period: "Week 40",
    "Last Generated": "Sep 30 · 16:40",
    Status: "Ready",
  },
  {
    Report: "Expense report",
    Coverage: "Enabled expense categories and approvals",
    Period: "September 2026",
    "Last Generated": "Sep 30 · 16:40",
    Status: "Disabled",
  },
]

const pageDefinitions: Record<string, PageDefinition> = {
  Customers: {
    description:
      "View billing profiles, balances, plans and payment history. Operational customer fields remain read-only.",
    columns: [
      "Customer ID",
      "Customer Name",
      "Phone",
      "Service Plan",
      "Monthly Amount",
      "Current Balance",
      "Payment Status",
      "Next Due Date",
    ],
    rows: customers,
    actions: [
      "View customer",
      "Billing history",
      "Payments",
      "Invoices",
      "Send reminder",
    ],
    filters: ["All customers", "Paid", "Pending", "Overdue"],
  },
  "Invoices & Billing": {
    description:
      "Create, issue and track invoices through their full billing lifecycle.",
    columns: [
      "Invoice Number",
      "Customer",
      "Billing Period",
      "Service",
      "Total",
      "Issue Date",
      "Due Date",
      "Status",
    ],
    rows: invoices,
    actions: [
      "View",
      "Edit draft",
      "Send",
      "Download",
      "Print",
      "Record payment",
      "Cancel",
    ],
    filters: [
      "All statuses",
      "Draft",
      "Sent",
      "Pending",
      "Partially Paid",
      "Paid",
      "Overdue",
      "Cancelled",
    ],
    primaryAction: "Create invoice",
  },
  Payments: {
    description:
      "Monitor customer payments and record authorized offline payments with supporting references.",
    columns: [
      "Transaction ID",
      "Customer",
      "Invoice",
      "Amount",
      "Payment Method",
      "Provider",
      "Reference",
      "Date & Time",
      "Status",
      "Verified By",
    ],
    rows: transactions,
    actions: [
      "View details",
      "Verify",
      "View receipt",
      "Download receipt",
      "Refund request",
      "View customer",
    ],
    filters: [
      "All statuses",
      "Successful",
      "Pending",
      "Failed",
      "Under Review",
      "Refunded",
    ],
    primaryAction: "Record manual payment",
  },
  "Outstanding Bills": {
    description:
      "Track unpaid balances, due dates and authorized customer follow-up.",
    columns: [
      "Customer",
      "Invoice",
      "Total Amount",
      "Amount Paid",
      "Remaining Balance",
      "Due Date",
      "Days Overdue",
      "Status",
    ],
    rows: outstanding,
    actions: ["View", "Send reminder", "View invoice", "Payment history"],
    filters: ["All", "Due Soon", "Due", "Overdue", "Partially Paid"],
  },
  "Billing Enforcement": {
    description:
      "Coordinate billing follow-up without automatically blocking or suspending customer services.",
    columns: [
      "Customer",
      "Outstanding Amount",
      "Days Overdue",
      "Last Payment",
      "Reminders",
      "Status",
      "Last Contact",
      "Next Action",
    ],
    rows: enforcement,
    actions: [
      "Send SMS reminder",
      "Send notification",
      "Record follow-up",
      "Add note",
      "Payment history",
      "Mark resolved",
    ],
    filters: [
      "All statuses",
      "No Action",
      "Reminder Sent",
      "Follow-up Required",
      "Payment Promise",
      "Escalated",
      "Resolved",
    ],
  },
  "Payment Reconciliation": {
    description:
      "Compare EcoRoute records with provider confirmations and resolve exceptions.",
    columns: [
      "System Transaction ID",
      "Provider Transaction ID",
      "Customer",
      "Expected Amount",
      "Received Amount",
      "Payment Date",
      "Provider",
      "Status",
    ],
    rows: reconciliation,
    actions: ["Match", "Review", "Resolve", "Add note"],
    filters: [
      "All providers",
      "MTN MoMo",
      "Airtel Money",
      "Bank",
      "Matched",
      "Unmatched",
      "Amount Mismatch",
      "Duplicate",
      "Pending Verification",
      "Failed",
    ],
  },
  Receipts: {
    description:
      "View, generate and deliver receipts only for confirmed or authorized payments.",
    columns: [
      "Receipt Number",
      "Customer",
      "Invoice",
      "Reference",
      "Method",
      "Provider",
      "Amount Paid",
      "Payment Date",
      "Status",
      "Issued By",
    ],
    rows: receipts,
    actions: ["View receipt", "Download PDF", "Print", "Send to customer"],
  },
  "Financial Reports": {
    description:
      "Generate finance reports from billing and payment records with date, provider and status filters.",
    columns: ["Report", "Coverage", "Period", "Last Generated", "Status"],
    rows: reportRows,
    actions: ["View", "Generate", "Download PDF", "Export Excel"],
    filters: [
      "All reports",
      "Payments",
      "Revenue",
      "Outstanding",
      "Mobile Money",
      "Billing",
      "Collectors",
      "Expenses",
    ],
  },
  Notifications: {
    description:
      "Review finance events linked directly to transactions, invoices and reconciliation exceptions.",
    columns: ["Title", "Description", "Date / Time", "Status", "Related"],
    rows: notifications,
    actions: ["Open record", "Mark read"],
    filters: [
      "All notifications",
      "Unread",
      "Payments",
      "Invoices",
      "Reconciliation",
    ],
  },
  "Audit / Activity": {
    description:
      "Immutable history of important finance actions. Finance users cannot delete audit records.",
    columns: [
      "Date / Time",
      "User",
      "Action",
      "Module",
      "Reference",
      "Description",
    ],
    rows: audit,
    actions: ["View details"],
    filters: [
      "All activity",
      "Invoices",
      "Payments",
      "Reconciliation",
      "Reports",
    ],
  },
}

const statusStyle = (status: string) => {
  if (
    ["Successful", "Paid", "Matched", "Ready", "Active", "Resolved"].includes(
      status,
    )
  )
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
  if (
    [
      "Pending",
      "Pending Verification",
      "Sent",
      "Due Soon",
      "Initiated",
      "Unread",
      "Under Review",
    ].includes(status)
  )
    return "bg-blue-50 text-blue-700 ring-blue-600/10"
  if (["Failed", "Overdue", "Amount Mismatch", "Escalated"].includes(status))
    return "bg-rose-50 text-rose-700 ring-rose-600/10"
  if (
    [
      "Partially Paid",
      "Payment Promise",
      "Follow-up Required",
      "Duplicate",
      "Due",
    ].includes(status)
  )
    return "bg-amber-50 text-amber-700 ring-amber-600/10"
  return "bg-slate-100 text-slate-600 ring-slate-500/10"
}

function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${statusStyle(value)}`}
    >
      {value}
    </span>
  )
}

function Notice({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-2xl bg-slate-950 p-4 text-sm text-white shadow-2xl">
      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={18} />
      <p className="leading-5">{message}</p>
      <button
        aria-label="Close notification"
        className="ml-2 text-slate-400 hover:text-white"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Finance workspace
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">{title}</h2>
          </div>
          <button
            aria-label="Close"
            className="ml-auto grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function exportRows(name: string, rows: Row[]) {
  const keys = Object.keys(rows[0] ?? {})
  const csv = [keys, ...rows.map((row) => keys.map((key) => row[key] ?? ""))]
    .map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
    )
    .join("\n")
  const link = document.createElement("a")
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  link.download = `ecoroute-${name.toLowerCase().replace(/ /g, "-")}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

function FinanceTable({
  definition,
  page,
  onAction,
}: {
  definition: PageDefinition
  page: string
  onAction: (action: string, row: Row) => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState(definition.filters?.[0] ?? "All")
  const visibleRows = useMemo(
    () =>
      definition.rows.filter((row) => {
        const matchesQuery = Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
        const genericFilter = [
          "All",
          "All statuses",
          "All customers",
          "All providers",
          "All reports",
          "All notifications",
          "All activity",
        ].includes(filter)
        return (
          matchesQuery &&
          (genericFilter ||
            Object.values(row).some((value) => value === filter) ||
            page === "Financial Reports")
        )
      }),
    [definition.rows, filter, page, query],
  )
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400 ring-1 ring-slate-200">
            <Search size={17} />
            <input
              className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search customer, phone, invoice, transaction or reference"
              value={query}
            />
          </label>
          {definition.filters && (
            <label className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-500">
              <Filter size={15} />
              <select
                className="appearance-none bg-transparent py-2.5 pr-7 text-sm font-semibold text-slate-700 outline-none"
                onChange={(event) => setFilter(event.target.value)}
                value={filter}
              >
                {definition.filters.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3"
                size={14}
              />
            </label>
          )}
          <button
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            onClick={() => exportRows(page, visibleRows)}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50/80">
              <tr>
                {definition.columns.map((column) => (
                  <th
                    className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500"
                    key={column}
                  >
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRows.map((row, index) => (
                <tr
                  className="hover:bg-slate-50/70"
                  key={`${Object.values(row)[0]}-${index}`}
                >
                  {definition.columns.map((column) => (
                    <td
                      className="max-w-[240px] px-4 py-4 text-xs text-slate-600"
                      key={column}
                    >
                      {column === "Status" || column === "Payment Status" ? (
                        <StatusBadge value={row[column]} />
                      ) : (
                        <span
                          className={
                            column.includes("Amount") || column === "Total"
                              ? "font-bold text-slate-900"
                              : column === definition.columns[0]
                                ? "font-semibold text-slate-900"
                                : ""
                          }
                        >
                          {row[column]}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-right">
                    <div className="group relative inline-block">
                      <button
                        aria-label="Open actions"
                        className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                      <div className="invisible absolute right-0 top-9 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1.5 text-left opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        {definition.actions.map((action) => (
                          <button
                            className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                            key={action}
                            onClick={() => onAction(action, row)}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visibleRows.length && (
          <div className="p-12 text-center">
            <Search className="mx-auto text-slate-300" size={28} />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No finance records match your search.
            </p>
          </div>
        )}
        <div className="flex items-center border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          <span>{visibleRows.length} records</span>
          <span className="ml-auto">
            Finance access · Read and act within authorization
          </span>
        </div>
      </div>
    </div>
  )
}

function RevenueChart() {
  const values = [42, 57, 48, 72, 64, 88, 76, 95, 84, 112, 98, 126]
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start">
        <div>
          <p className="font-bold text-slate-950">Revenue performance</p>
          <p className="mt-1 text-xs text-slate-500">
            Confirmed revenue · Last 12 months
          </p>
        </div>
        <select className="ml-auto rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-semibold text-slate-600">
          <option>This month</option>
          <option>Today</option>
          <option>This week</option>
          <option>This year</option>
        </select>
      </div>
      <div className="mt-7 flex h-48 items-end gap-2 border-b border-slate-200">
        {values.map((value, index) => (
          <div
            className="group relative flex h-full flex-1 items-end"
            key={index}
          >
            <div
              className="w-full rounded-t-md bg-emerald-100 transition hover:bg-emerald-600"
              style={{ height: `${value / 1.35}%` }}
            />
            <span className="invisible absolute -top-1 left-1/2 -translate-x-1/2 rounded bg-slate-950 px-2 py-1 text-[10px] text-white group-hover:visible">
              RWF {value}K
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>Nov</span>
        <span>Feb</span>
        <span>May</span>
        <span>Aug</span>
        <span>Oct</span>
      </div>
    </div>
  )
}

function PaymentStatusChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-bold text-slate-950">Payment status</p>
      <p className="mt-1 text-xs text-slate-500">Current billing cycle</p>
      <div
        className="mx-auto mt-7 grid size-40 place-items-center rounded-full"
        style={{
          background:
            "conic-gradient(#059669 0 68%, #3b82f6 68% 82%, #f59e0b 82% 92%, #e11d48 92%)",
        }}
      >
        <div className="grid size-28 place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-2xl font-bold">1,284</p>
            <p className="text-[10px] text-slate-400">transactions</p>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          ["Successful", "68%", "bg-emerald-600"],
          ["Pending", "14%", "bg-blue-500"],
          ["Overdue", "10%", "bg-amber-500"],
          ["Failed", "8%", "bg-rose-600"],
        ].map(([label, value, color]) => (
          <div className="flex items-center text-xs" key={label}>
            <span className={`mr-2 size-2 rounded-full ${color}`} />
            <span className="text-slate-500">{label}</span>
            <strong className="ml-auto">{value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FinanceDashboard({
  onPage,
  profile,
}: {
  onPage: (page: string) => void
  profile?: FinanceProfile | null
}) {
  const [period, setPeriod] = useState("This month")
  const metrics: [string, string, string, LucideIcon][] = [
    ["Total revenue", "RWF 48.6M", "+12.4% year to date", CircleDollarSign],
    ["Today's payments", "RWF 1.84M", "126 confirmed payments", CheckCircle2],
    ["Pending payments", "RWF 842K", "18 awaiting confirmation", Clock3],
    ["Outstanding bills", "RWF 6.28M", "214 open invoices", FileText],
    ["Overdue bills", "RWF 2.14M", "47 need follow-up", AlertTriangle],
    ["Monthly revenue", "RWF 8.92M", "84% of target", TrendingUp],
  ]
  const methods = [
    ["MTN Mobile Money", "RWF 4.18M", "684 transactions", Smartphone],
    ["Airtel Money", "RWF 2.71M", "412 transactions", Smartphone],
    ["Cash payments", "RWF 884K", "92 verified entries", Banknote],
    ["Bank payments", "RWF 1.15M", "42 transfers", Landmark],
  ] as [string, string, string, LucideIcon][]
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-emerald-950 to-teal-800 p-6 text-white shadow-lg shadow-emerald-950/10 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            Finance control center
          </p>
          <p className="mt-2 text-2xl font-semibold">
            Welcome, {profile?.name ?? "Claudine Uwase"}
          </p>
          <p className="mt-1 text-sm text-emerald-100">
            Integration preview · Sample provider states for workflow validation
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-950"
            onClick={() => onPage("Payments & Billing")}
          >
            <FilePlus2 className="mr-2 inline" size={15} />
            Open billing
          </button>
          <button
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold ring-1 ring-white/20"
            onClick={() => onPage("Payments & Billing")}
          >
            <RefreshCw className="mr-2 inline" size={15} />
            Review payments
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <div>
          <p className="font-bold text-slate-950">Financial overview</p>
          <p className="text-xs text-slate-500">
            Only successful backend-confirmed transactions count toward revenue.
          </p>
        </div>
        <select
          className="ml-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
          onChange={(event) => setPeriod(event.target.value)}
          value={period}
        >
          <option>Today</option>
          <option>This week</option>
          <option>This month</option>
          <option>This year</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value, note, Icon]) => (
          <button
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            key={label}
            onClick={() => onPage("Payments & Billing")}
          >
            <div className="flex">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={19} />
              </div>
              <ArrowUpRight className="ml-auto text-slate-300" size={17} />
            </div>
            <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
              {value}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
            <p className="mt-1 text-xs text-slate-400">
              {note} · {period}
            </p>
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {methods.map(([label, value, note, Icon]) => (
          <button
            className="flex items-center rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-emerald-200"
            key={label}
            onClick={() => onPage("Payments & Billing")}
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <Icon size={18} />
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-slate-500">{label}</p>
              <p className="mt-1 font-bold text-slate-950">{value}</p>
              <p className="text-[10px] text-slate-400">{note}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <RevenueChart />
        <PaymentStatusChart />
      </div>
      <DashboardTable
        title="Recent transactions"
        columns={[
          "Transaction ID",
          "Customer",
          "Amount",
          "Payment Method",
          "Date & Time",
          "Status",
        ]}
        rows={transactions}
        actions={["View", "Verify", "Receipt"]}
        onOpen={() => onPage("Payments & Billing")}
      />
      <DashboardTable
        title="Outstanding customer payments"
        columns={[
          "Customer",
          "Invoice",
          "Remaining Balance",
          "Due Date",
          "Days Overdue",
          "Status",
        ]}
        rows={outstanding}
        actions={["View", "Send reminder", "View invoice"]}
        onOpen={() => onPage("Payments & Billing")}
      />
    </div>
  )
}

function DashboardTable({
  title,
  columns,
  rows,
  actions,
  onOpen,
}: {
  title: string
  columns: string[]
  rows: Row[]
  actions: string[]
  onOpen: () => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center border-b border-slate-100 p-5">
        <div>
          <p className="font-bold text-slate-950">{title}</p>
          <p className="text-xs text-slate-500">Current finance records</p>
        </div>
        <button
          className="ml-auto text-xs font-bold text-emerald-700"
          onClick={onOpen}
        >
          View all <ArrowUpRight className="inline" size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                  key={column}
                >
                  {column}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.slice(0, 4).map((row) => (
              <tr key={Object.values(row)[0]}>
                {columns.map((column) => (
                  <td className="px-4 py-3 text-xs text-slate-600" key={column}>
                    {column === "Status" ? (
                      <StatusBadge value={row[column]} />
                    ) : (
                      row[column]
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button
                    className="text-xs font-bold text-emerald-700"
                    onClick={onOpen}
                  >
                    {actions[0]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MobileMoneyPage({
  onAction,
}: {
  onAction: (action: string, row: Row) => void
}) {
  const providers = [
    [
      "MTN Mobile Money",
      "Not configured",
      "742",
      "684",
      "18",
      "40",
      "RWF 4.18M",
    ],
    ["Airtel Money", "Not configured", "486", "412", "31", "43", "RWF 2.71M"],
  ]
  const definition: PageDefinition = {
    description: "",
    columns: [
      "Transaction ID",
      "Provider",
      "Customer",
      "Phone",
      "Amount",
      "Reference",
      "Request Date",
      "Completion Date",
      "Status",
    ],
    rows: mobileMoney,
    actions: ["View details", "Check provider status", "Export record"],
    filters: [
      "All providers",
      "MTN Mobile Money",
      "Airtel Money",
      "Initiated",
      "Pending",
      "Successful",
      "Failed",
      "Cancelled",
    ],
  }
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <ShieldCheck className="mr-2 inline text-blue-700" size={18} />
        <strong>Payment-ready architecture:</strong> statuses are displayed from
        backend/provider records. Pending requests are never shown as successful
        before webhook verification.
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {providers.map(
          ([name, status, total, success, pending, failed, amount]) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              key={name}
            >
              <div className="flex items-center">
                <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Smartphone size={20} />
                </div>
                <div className="ml-3">
                  <p className="font-bold text-slate-950">{name}</p>
                  <p className="text-xs text-slate-500">
                    Provider adapter · webhook ready
                  </p>
                </div>
                <StatusBadge value={status} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                {[
                  ["Transactions", total],
                  ["Successful", success],
                  ["Pending", pending],
                  ["Failed", failed],
                  ["Total amount", amount],
                ].map(([label, value]) => (
                  <div
                    className={label === "Total amount" ? "col-span-2" : ""}
                    key={label}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
      <FinanceTable
        definition={definition}
        onAction={onAction}
        page="Mobile Money"
      />
    </div>
  )
}

function ProfilePage({
  profile,
  onNotify,
}: {
  profile?: FinanceProfile | null
  onNotify: (message: string) => void
}) {
  const fields = [
    ["Full name", profile?.name ?? "Claudine Uwase"],
    ["Employee ID", "FIN-0084"],
    ["Email", profile?.email ?? "finance@ecoroute.rw"],
    ["Phone", profile?.phone ?? "+250 788 420 116"],
    ["Role", "Finance"],
    ["Department", "Finance & Billing"],
    ["Account status", "Active"],
    ["Last login", "Oct 03, 2026 · 08:02"],
  ]
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_2fr]">
      <div className="rounded-2xl bg-emerald-950 p-6 text-white">
        <div className="grid size-16 place-items-center rounded-2xl bg-white/10 text-xl font-bold">
          CU
        </div>
        <p className="mt-5 text-xl font-bold">
          {profile?.name ?? "Claudine Uwase"}
        </p>
        <p className="mt-1 text-sm text-emerald-200">
          Finance & Billing Officer
        </p>
        <div className="mt-6 rounded-xl bg-white/10 p-4 text-xs leading-5 text-emerald-100">
          <ShieldCheck className="mb-2" size={18} />
          Your Finance role is fixed and can only be changed by an authorized
          administrator.
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-bold">Employee profile</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div className="rounded-xl bg-slate-50 p-4" key={label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Edit profile", "Change password", "Notification preferences"].map(
            (action) => (
              <button
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                key={action}
                onClick={() =>
                  onNotify(`${action} opened. Role access remains protected.`)
                }
              >
                {action}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

function SettingsPage({ onNotify }: { onNotify: (message: string) => void }) {
  const groups = [
    [
      "Invoice settings",
      "Invoice prefix, payment terms and tax display",
      FileText,
    ],
    ["Receipt settings", "Receipt numbering and company details", ReceiptText],
    [
      "Notification preferences",
      "Payment, invoice and reconciliation alerts",
      Bell,
    ],
    ["Report preferences", "Default periods and export format", Activity],
    ["Currency", "Rwandan Franc (RWF)", CircleDollarSign],
    ["Billing preferences", "Billing cycle and reminder timing", Settings],
  ] as [string, string, LucideIcon][]
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldCheck className="mr-2 inline" size={18} />
        Finance settings do not include user roles, security, AI, routes,
        vehicles, drivers or system-wide configuration.
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map(([title, text, Icon]) => (
          <button
            className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-emerald-200"
            key={title}
            onClick={() => onNotify(`${title} preferences opened.`)}
          >
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Icon size={18} />
            </div>
            <p className="mt-4 font-bold text-slate-900">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
            <span className="mt-4 inline-block text-xs font-bold text-emerald-700">
              Configure <ArrowUpRight className="inline" size={13} />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const collectionLocations = [
  {
    zone: "Kicukiro-Nyarugunga Route",
    address: "KG 218, Nyarugunga",
    schedule: "Mondays · 08:00–11:00",
    vehicle: "RW 412 A",
    customers: "184",
    paid: "152",
    unpaid: "32",
    collected: "RWF 2.74M",
    outstanding: "RWF 576K",
    coordinates: "-1.9355,30.1397",
  },
  {
    zone: "Kicukiro Central",
    address: "KK 15, Niboye",
    schedule: "Tuesdays · 07:30–10:30",
    vehicle: "RW 307 K",
    customers: "146",
    paid: "121",
    unpaid: "25",
    collected: "RWF 2.18M",
    outstanding: "RWF 450K",
    coordinates: "-1.9922,30.1044",
  },
  {
    zone: "Kimironko Market",
    address: "KG 11 Avenue, Kimironko",
    schedule: "Daily · 17:00–19:00",
    vehicle: "RW 118 T",
    customers: "68",
    paid: "59",
    unpaid: "9",
    collected: "RWF 5.01M",
    outstanding: "RWF 765K",
    coordinates: "-1.9498,30.1278",
  },
  {
    zone: "Nyarugenge West",
    address: "KN 7 Road, Nyamirambo",
    schedule: "Thursdays · 08:00–12:00",
    vehicle: "RW 922 D",
    customers: "172",
    paid: "139",
    unpaid: "33",
    collected: "RWF 2.50M",
    outstanding: "RWF 594K",
    coordinates: "-1.9807,30.0444",
  },
]

function CollectionSchedulePage() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(collectionLocations[0])
  const visible = collectionLocations.filter((location) =>
    Object.values(location)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const locationPayments: Row[] = customers
    .filter((customer) =>
      selected.zone.includes("Gasabo")
        ? customer.Address.includes("Nyarugunga") ||
          customer.Address.includes("Remera")
        : true,
    )
    .map((customer) => ({
      Customer: customer["Customer Name"],
      Phone: customer.Phone,
      Location: customer.Address,
      "Monthly Amount": customer["Monthly Amount"],
      "Current Balance": customer["Current Balance"],
      Status: customer["Payment Status"],
      "Last Payment": customer["Last Payment"],
    }))
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400 ring-1 ring-slate-200">
          <Search size={17} />
          <input
            className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search zone, collection address, vehicle or day"
            value={query}
          />
        </label>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
        <div className="space-y-3">
          {visible.map((location) => (
            <button
              className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                selected.zone === location.zone
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-white hover:border-emerald-200"
              }`}
              key={location.zone}
              onClick={() => setSelected(location)}
            >
              <div className="flex items-start">
                <div className="grid size-10 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <MapPin size={18} />
                </div>
                <div className="ml-3">
                  <p className="font-bold text-slate-950">{location.zone}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {location.address}
                  </p>
                </div>
                <StatusBadge value="Active" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-200/70 pt-4 text-xs">
                <div>
                  <p className="text-slate-400">Schedule</p>
                  <p className="mt-1 font-bold text-slate-700">
                    {location.schedule}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Vehicle</p>
                  <p className="mt-1 font-bold text-slate-700">
                    {location.vehicle}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Unpaid</p>
                  <p className="mt-1 font-bold text-rose-700">
                    {location.unpaid} customers
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-72 overflow-hidden bg-[#e7f0e3]">
            <div className="map-grid absolute inset-0" />
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 600 280"
            >
              <path
                d="M30 230 C140 205 125 78 245 102 S390 245 565 45"
                fill="none"
                stroke="#047857"
                strokeDasharray="9 7"
                strokeWidth="5"
              />
            </svg>
            {collectionLocations.map((location, index) => (
              <button
                aria-label={`Select ${location.zone}`}
                className={`absolute grid size-10 place-items-center rounded-full border-4 border-white text-xs font-bold text-white shadow-lg ${
                  selected.zone === location.zone
                    ? "bg-emerald-700 ring-4 ring-emerald-300/60"
                    : "bg-slate-700"
                }`}
                key={location.zone}
                onClick={() => setSelected(location)}
                style={{
                  left: `${14 + index * 23}%`,
                  top: `${64 - index * 14}%`,
                }}
              >
                {index + 1}
              </button>
            ))}
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 p-3 shadow-lg">
              <p className="text-xs font-bold text-slate-950">
                {selected.address}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {selected.coordinates}
              </p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start">
              <div>
                <p className="font-bold text-slate-950">
                  {selected.zone} collection plan
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {selected.schedule} · {selected.vehicle}
                </p>
              </div>
              <a
                className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.coordinates)}`}
                rel="noreferrer"
                target="_blank"
              >
                <MapPin size={14} />
                Open Google Maps
              </a>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Customers", selected.customers],
                ["Paid", selected.paid],
                ["Collected", selected.collected],
                ["Outstanding", selected.outstanding],
              ].map(([label, value]) => (
                <div className="rounded-xl bg-slate-50 p-3" key={label}>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center border-b border-slate-100 p-5">
          <div>
            <p className="font-bold text-slate-950">
              Customer payments from {selected.zone}
            </p>
            <p className="text-xs text-slate-500">
              Paid and unpaid balances attached to this collection location.
            </p>
          </div>
          <button
            className="ml-auto flex items-center gap-2 text-xs font-bold text-emerald-700"
            onClick={() =>
              exportRows(`${selected.zone}-payments`, locationPayments)
            }
          >
            <Download size={14} />
            Download report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Customer",
                  "Phone",
                  "Location",
                  "Monthly Amount",
                  "Current Balance",
                  "Status",
                  "Last Payment",
                ].map((column) => (
                  <th
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                    key={column}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locationPayments.map((row) => (
                <tr key={row.Customer}>
                  {Object.keys(row).map((key) => (
                    <td className="px-4 py-3 text-xs text-slate-600" key={key}>
                      {key === "Status" ? (
                        <StatusBadge value={row[key]} />
                      ) : (
                        row[key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

type SalaryRecord = {
  employee: string
  id: string
  role: string
  department: string
  monthly: string
  allowance: string
  deductions: string
  net: string
  status: string
  paidDate: string
}

const initialSalaries: SalaryRecord[] = [
  {
    employee: "Claudine Uwase",
    id: "FIN-012",
    role: "Finance Officer",
    department: "Finance",
    monthly: "850000",
    allowance: "80000",
    deductions: "45000",
    net: "885000",
    status: "Pending",
    paidDate: "—",
  },
  {
    employee: "Eric Niyonzima",
    id: "EMP-041",
    role: "Driver",
    department: "Operations",
    monthly: "420000",
    allowance: "65000",
    deductions: "22000",
    net: "463000",
    status: "Paid",
    paidDate: "Sep 30, 2026",
  },
  {
    employee: "Alice Uwera",
    id: "EMP-052",
    role: "Driver",
    department: "Operations",
    monthly: "420000",
    allowance: "65000",
    deductions: "22000",
    net: "463000",
    status: "Pending",
    paidDate: "—",
  },
  {
    employee: "Samuel Imanzi",
    id: "EMP-064",
    role: "Team Leader",
    department: "Operations",
    monthly: "520000",
    allowance: "70000",
    deductions: "28000",
    net: "562000",
    status: "Paid",
    paidDate: "Sep 30, 2026",
  },
  {
    employee: "Grace Ingabire",
    id: "EMP-071",
    role: "Payment Collector",
    department: "Finance",
    monthly: "390000",
    allowance: "50000",
    deductions: "19000",
    net: "421000",
    status: "Pending",
    paidDate: "—",
  },
  {
    employee: "Patrick Tuyishime",
    id: "EMP-083",
    role: "Transfer Staff",
    department: "Operations",
    monthly: "380000",
    allowance: "60000",
    deductions: "18000",
    net: "422000",
    status: "Paid",
    paidDate: "Sep 30, 2026",
  },
]

function salaryRows(records: SalaryRecord[]): Row[] {
  return records.map((record) => ({
    "Employee ID": record.id,
    Employee: record.employee,
    Role: record.role,
    Department: record.department,
    "Base Salary": `RWF ${Number(record.monthly).toLocaleString()}`,
    Allowance: `RWF ${Number(record.allowance).toLocaleString()}`,
    Deductions: `RWF ${Number(record.deductions).toLocaleString()}`,
    "Net Salary": `RWF ${Number(record.net).toLocaleString()}`,
    Status: record.status,
    "Paid Date": record.paidDate,
  }))
}

export function SalariesPage({ mode }: { mode: "Finance" | "Manager" }) {
  const [records, setRecords] = useState<SalaryRecord[]>(() => {
    const saved = localStorage.getItem("ecoroute-salaries")
    const existing = saved
      ? JSON.parse(saved) as SalaryRecord[]
      : initialSalaries
    const createdAccounts = JSON.parse(
      localStorage.getItem("ecoroute-created-accounts") ?? "[]",
    ) as { name?: string; role?: string; category?: string }[]
    const additional = createdAccounts
      .filter(
        (account) => account.role === "Employee" || account.role === "Finance",
      )
      .filter(
        (account) =>
          !existing.some((record) => record.employee === account.name),
      )
      .map(
        (account, index): SalaryRecord => ({
          employee: account.name ?? `Employee ${index + 1}`,
          id: `EMP-${100 + index}`,
          role: account.category ?? account.role ?? "Employee",
          department: account.role === "Finance" ? "Finance" : "Operations",
          monthly: "0",
          allowance: "0",
          deductions: "0",
          net: "0",
          status: "Not Set",
          paidDate: "—",
        }),
      )
    return [...existing, ...additional]
  })
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<SalaryRecord | null>(null)
  const [notice, setNotice] = useState("")
  const visible = records.filter((record) =>
    Object.values(record).join(" ").toLowerCase().includes(query.toLowerCase()),
  )
  const saveRecords = (next: SalaryRecord[]) => {
    setRecords(next)
    localStorage.setItem("ecoroute-salaries", JSON.stringify(next))
  }
  const updateSalary = (record: SalaryRecord) => {
    const monthly = Number(record.monthly || 0)
    const allowance = Number(record.allowance || 0)
    const deductions = Number(record.deductions || 0)
    saveRecords(
      records.map((item) =>
        item.id === record.id
          ? { ...record, net: String(monthly + allowance - deductions) }
          : item,
      ),
    )
    setSelected(null)
    setNotice(
      mode === "Manager"
        ? "Employee salary structure updated."
        : "Salary payment recorded and added to payroll history.",
    )
  }
  const total = records.reduce((sum, record) => sum + Number(record.net), 0)
  const pending = records
    .filter((record) => record.status === "Pending")
    .reduce((sum, record) => sum + Number(record.net), 0)
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <ShieldCheck className="mr-2 inline" size={18} />
        <strong>{mode} payroll access:</strong>{" "}
        {mode === "Manager"
          ? "Set salary structures for employees created in the system. Payment recording remains a Finance action."
          : "View all employee salary structures and record authorized salary payments. Salary changes remain visible to Manager."}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Monthly payroll", `RWF ${total.toLocaleString()}`, WalletCards],
          ["Pending payroll", `RWF ${pending.toLocaleString()}`, Clock3],
          ["Employees", String(records.length), UsersRound],
        ].map(([label, value, Icon]) => {
          const SalaryIcon = Icon as LucideIcon
          return (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              key={label as string}
            >
              <SalaryIcon className="text-emerald-700" size={18} />
              <p className="mt-4 text-xl font-bold">{value as string}</p>
              <p className="text-xs text-slate-500">{label as string}</p>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400 ring-1 ring-slate-200">
          <Search size={17} />
          <input
            className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search employee, ID, role or department"
            value={query}
          />
        </label>
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
          onClick={() => exportRows("employee-salaries", salaryRows(visible))}
        >
          <Download size={16} />
          Export payroll
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Employee ID",
                  "Employee",
                  "Role",
                  "Base Salary",
                  "Allowance",
                  "Deductions",
                  "Net Salary",
                  "Status",
                  "Paid Date",
                ].map((column) => (
                  <th
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                    key={column}
                  >
                    {column}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-4 text-xs font-bold text-slate-900">
                    {record.id}
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold text-slate-800">
                    {record.employee}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {record.role}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    RWF {Number(record.monthly).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    RWF {Number(record.allowance).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    RWF {Number(record.deductions).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-900">
                    RWF {Number(record.net).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge value={record.status} />
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {record.paidDate}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"
                      onClick={() => setSelected(record)}
                    >
                      {mode === "Manager" ? "Set salary" : "Record payment"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && (
        <Modal
          onClose={() => setSelected(null)}
          title={
            mode === "Manager"
              ? `Set salary · ${selected.employee}`
              : `Record salary payment · ${selected.employee}`
          }
        >
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {mode === "Manager" ? (
              <>
                {[
                  ["Base monthly salary", "monthly"],
                  ["Allowance", "allowance"],
                  ["Deductions", "deductions"],
                ].map(([label, key]) => (
                  <label key={key}>
                    <span className="text-xs font-bold text-slate-600">
                      {label}
                    </span>
                    <input
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
                      onChange={(event) =>
                        setSelected({ ...selected, [key]: event.target.value })
                      }
                      type="number"
                      value={
                        selected[
                          (key as "monthly" | "allowance" | "deductions")
                        ]
                      }
                    />
                  </label>
                ))}
              </>
            ) : (
              <>
                <label>
                  <span className="text-xs font-bold text-slate-600">
                    Net salary
                  </span>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                    readOnly
                    value={`RWF ${Number(selected.net).toLocaleString()}`}
                  />
                </label>
                <label>
                  <span className="text-xs font-bold text-slate-600">
                    Payment method
                  </span>
                  <select className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
                    <option>Bank transfer</option>
                    <option>Mobile Money</option>
                    <option>Authorized cash</option>
                  </select>
                </label>
                <label>
                  <span className="text-xs font-bold text-slate-600">
                    Payment reference
                  </span>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    placeholder="Bank or payroll reference"
                  />
                </label>
                <label>
                  <span className="text-xs font-bold text-slate-600">
                    Payment date
                  </span>
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    type="date"
                  />
                </label>
              </>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
              onClick={() => setSelected(null)}
            >
              Cancel
            </button>
            <button
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white"
              onClick={() =>
                updateSalary(
                  mode === "Finance"
                    ? {
                        ...selected,
                        status: "Paid",
                        paidDate: new Date().toLocaleDateString("en-RW", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }),
                      }
                    : selected,
                )
              }
            >
              {mode === "Manager" ? "Save salary" : "Record salary payment"}
            </button>
          </div>
        </Modal>
      )}
      {notice && <Notice message={notice} onClose={() => setNotice("")} />}
    </div>
  )
}

function CustomerFinanceDetails({
  customer,
  onClose,
}: {
  customer: Row
  onClose: () => void
}) {
  const history = transactions.filter(
    (payment) => payment.Customer === customer["Customer Name"],
  )
  const report: Row[] = [
    {
      Type: "Account summary",
      Reference: customer["Customer ID"],
      Amount: customer["Monthly Amount"],
      Method: customer["Service Plan"],
      Date: customer["Next Due Date"],
      Status: customer["Payment Status"],
      Balance: customer["Current Balance"],
    },
    ...history.map((payment) => ({
      Type: "Payment",
      Reference: payment["Transaction ID"],
      Amount: payment.Amount,
      Method: payment["Payment Method"],
      Date: payment["Date & Time"],
      Status: payment.Status,
      Balance: customer["Current Balance"],
    })),
  ]
  return (
    <Modal
      onClose={onClose}
      title={`${customer["Customer Name"]} · Financial profile`}
    >
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Current balance", customer["Current Balance"]],
          ["Monthly service", customer["Monthly Amount"]],
          ["Payment status", customer["Payment Status"]],
        ].map(([label, value]) => (
          <div className="rounded-xl bg-slate-50 p-4" key={label}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </p>
            <p
              className={`mt-1 text-lg font-bold ${
                label === "Current balance" && value !== "RWF 0"
                  ? "text-rose-700"
                  : "text-slate-900"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 p-4">
        <div className="flex items-start">
          <div>
            <p className="font-bold text-slate-900">
              Collection location and schedule
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {customer.Address} · Weekly collection
            </p>
          </div>
          <a
            className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-700"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.Address)}`}
            rel="noreferrer"
            target="_blank"
          >
            <MapPin size={14} />
            Google Maps
          </a>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center">
          <p className="font-bold text-slate-900">Payment history</p>
          <button
            className="ml-auto flex items-center gap-2 text-xs font-bold text-emerald-700"
            onClick={() =>
              exportRows(
                `${customer["Customer Name"]}-financial-report`,
                report,
              )
            }
          >
            <Download size={14} />
            Download customer report
          </button>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          {history.length ? (
            history.map((payment) => (
              <div
                className="grid grid-cols-2 gap-2 border-b border-slate-100 p-4 text-xs last:border-0 sm:grid-cols-4"
                key={payment["Transaction ID"]}
              >
                <strong>{payment["Transaction ID"]}</strong>
                <span>{payment.Amount}</span>
                <span>{payment["Payment Method"]}</span>
                <StatusBadge value={payment.Status} />
              </div>
            ))
          ) : (
            <div className="p-5 text-center text-sm text-slate-500">
              No recorded payments for this customer.
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

function ManualPayment({
  onClose,
  onRecord,
}: {
  onClose: () => void
  onRecord: (row: Row) => void
}) {
  const [form, setForm] = useState({
    customer: customers[0]["Customer Name"],
    invoice: "INV-2026-",
    amount: "",
    method: "Cash",
    reference: "",
  })
  const set = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value })
  return (
    <Modal onClose={onClose} title="Record manual payment">
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
        <ShieldCheck className="mr-2 inline" size={16} />
        Manual entries start <strong>Under Review</strong>. Finance must verify
        the receipt, bank reference or authorized cash evidence before marking
        payment successful.
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-xs font-bold text-slate-600">Customer</span>
          <select
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            onChange={(event) => set("customer", event.target.value)}
            value={form.customer}
          >
            {customers.map((customer) => (
              <option key={customer["Customer ID"]}>
                {customer["Customer Name"]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold text-slate-600">
            Invoice number
          </span>
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            onChange={(event) => set("invoice", event.target.value)}
            value={form.invoice}
          />
        </label>
        <label>
          <span className="text-xs font-bold text-slate-600">Amount paid</span>
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            min="0"
            onChange={(event) => set("amount", event.target.value)}
            placeholder="Amount in RWF"
            type="number"
            value={form.amount}
          />
        </label>
        <label>
          <span className="text-xs font-bold text-slate-600">
            Payment method
          </span>
          <select
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            onChange={(event) => set("method", event.target.value)}
            value={form.method}
          >
            <option>Cash</option>
            <option>Bank</option>
            <option>Other authorized method</option>
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="text-xs font-bold text-slate-600">
            Receipt / bank reference
          </span>
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            onChange={(event) => set("reference", event.target.value)}
            placeholder="Required supporting reference"
            value={form.reference}
          />
        </label>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          disabled={!form.amount || !form.reference}
          onClick={() =>
            onRecord({
              "Transaction ID": `MAN-${Date.now().toString().slice(-6)}`,
              Customer: form.customer,
              Invoice: form.invoice,
              Amount: `RWF ${Number(form.amount).toLocaleString()}`,
              "Payment Method": form.method,
              Provider: "Manual finance entry",
              Reference: form.reference,
              "Date & Time": new Date().toLocaleString("en-RW"),
              Status: "Under Review",
              "Verified By": "Finance queue",
            })
          }
        >
          Record for review
        </button>
      </div>
    </Modal>
  )
}

function CreateInvoice({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: () => void
}) {
  return (
    <Modal onClose={onClose} title="Create invoice">
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[
          "Customer",
          "Customer phone",
          "Billing period",
          "Service description",
          "Amount",
          "Tax",
          "Issue date",
          "Due date",
        ].map((label) => (
          <label
            className={label === "Service description" ? "sm:col-span-2" : ""}
            key={label}
          >
            <span className="text-xs font-bold text-slate-600">{label}</span>
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder={label}
              type={label.includes("date") ? "date" : "text"}
            />
          </label>
        ))}
      </div>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        The invoice starts as <strong>Draft</strong>. It will not be sent until
        an authorized Finance user reviews it.
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white"
          onClick={onCreate}
        >
          Save draft invoice
        </button>
      </div>
    </Modal>
  )
}

export function FinancePage({
  page,
  profile,
}: {
  page: string
  profile?: FinanceProfile | null
}) {
  const [billingTab, setBillingTab] = useState("Overview")
  const [notice, setNotice] = useState("")
  const [dialog, setDialog] = useState<{
    title: string
    row?: Row
  } | null>(null)
  const [createInvoice, setCreateInvoice] = useState(false)
  const [manualPayment, setManualPayment] = useState(false)
  const [manualPayments, setManualPayments] = useState<Row[]>(() =>
    JSON.parse(localStorage.getItem("ecoroute-manual-payments") ?? "[]"),
  )
  const billingPages: Record<string, string> = {
    Overview: "Payments",
    Payments: "Payments",
    Outstanding: "Outstanding Bills",
    "Billing Enforcement": "Billing Enforcement",
    Invoices: "Invoices & Billing",
  }
  const resolvedPage =
    page === "Payments & Billing"
      ? billingPages[billingTab]
      : page === "Customers & Collection Locations"
        ? "Customers"
        : page === "Salaries & Payroll"
          ? "Salaries"
          : page === "Communication"
            ? "Notifications"
            : page === "Activity Log"
              ? "Audit / Activity"
              : page
  const baseDefinition = pageDefinitions[resolvedPage]
  const definition =
    baseDefinition && resolvedPage === "Payments"
      ? { ...baseDefinition, rows: [...manualPayments, ...baseDefinition.rows] }
      : baseDefinition
  const handleAction = (action: string, row: Row) => {
    if (
      action.toLowerCase().includes("download") ||
      action.toLowerCase().includes("export")
    ) {
      exportRows(resolvedPage, [row])
      setNotice(`${action} prepared for ${Object.values(row)[0]}.`)
      return
    }
    if (action.toLowerCase().includes("print")) {
      window.print()
      return
    }
    if (
      [
        "Send reminder",
        "Send SMS reminder",
        "Send notification",
        "Send to customer",
        "Mark read",
        "Mark resolved",
        "Match",
        "Resolve",
        "Verify",
      ].includes(action)
    ) {
      setNotice(
        `${action} recorded for ${Object.values(row)[0]}. No provider status was changed without confirmation.`,
      )
      return
    }
    setDialog({ title: action, row })
  }
  if (page === "Mobile Money")
    return (
      <>
        <MobileMoneyPage onAction={handleAction} />
        {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      </>
    )
  if (page === "Collection Schedule") return <CollectionSchedulePage />
  if (resolvedPage === "Salaries") return <SalariesPage mode="Finance" />
  if (page === "My Profile")
    return (
      <>
        <ProfilePage onNotify={setNotice} profile={profile} />
        {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      </>
    )
  if (page === "Settings")
    return (
      <>
        <SettingsPage onNotify={setNotice} />
        {notice && <Notice message={notice} onClose={() => setNotice("")} />}
      </>
    )
  if (!definition)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <FileText className="mx-auto text-slate-300" />
        <p className="mt-3 font-bold">Finance module unavailable</p>
      </div>
    )
  return (
    <div className="space-y-5">
      {page === "Payments & Billing" && (
        <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {Object.keys(billingPages).map((tab) => (
            <button
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold ${
                billingTab === tab
                  ? "bg-emerald-700 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              key={tab}
              onClick={() => setBillingTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-slate-900">
            What Finance can do here
          </p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            {definition.description}
          </p>
        </div>
        {definition.primaryAction && (
          <button
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 sm:ml-auto"
            onClick={() =>
              resolvedPage === "Payments"
                ? setManualPayment(true)
                : setCreateInvoice(true)
            }
          >
            <FilePlus2 size={16} />
            {definition.primaryAction}
          </button>
        )}
      </div>
      {page === "Financial Reports" && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total revenue", "RWF 48.6M", TrendingUp],
            ["Payments", "12,842", CreditCard],
            ["Outstanding", "RWF 6.28M", AlertTriangle],
            ["Mobile Money", "RWF 31.4M", Smartphone],
          ].map(([label, value, Icon]) => {
            const ReportIcon = Icon as LucideIcon
            return (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                key={label as string}
              >
                <ReportIcon className="text-emerald-700" size={18} />
                <p className="mt-4 text-xl font-bold">{value as string}</p>
                <p className="text-xs text-slate-500">{label as string}</p>
              </div>
            )
          })}
        </div>
      )}
      <FinanceTable
        definition={definition}
        onAction={handleAction}
        page={resolvedPage}
      />
      {dialog && resolvedPage === "Customers" && dialog.row ? (
        <CustomerFinanceDetails
          customer={dialog.row}
          onClose={() => setDialog(null)}
        />
      ) : (
        dialog && (
          <Modal onClose={() => setDialog(null)} title={dialog.title}>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries(dialog.row ?? {}).map(([label, value]) => (
                <div className="rounded-xl bg-slate-50 p-4" key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white"
                onClick={() => setDialog(null)}
              >
                Done
              </button>
            </div>
          </Modal>
        )
      )}
      {createInvoice && (
        <CreateInvoice
          onClose={() => setCreateInvoice(false)}
          onCreate={() => {
            setCreateInvoice(false)
            setNotice(
              "Draft invoice created. Review it before sending to the customer.",
            )
          }}
        />
      )}
      {manualPayment && (
        <ManualPayment
          onClose={() => setManualPayment(false)}
          onRecord={(row) => {
            const next = [row, ...manualPayments]
            setManualPayments(next)
            localStorage.setItem(
              "ecoroute-manual-payments",
              JSON.stringify(next),
            )
            setManualPayment(false)
            setNotice(
              "Manual payment recorded as Under Review. Verify supporting evidence before confirmation.",
            )
          }}
        />
      )}
      {notice && <Notice message={notice} onClose={() => setNotice("")} />}
    </div>
  )
}
