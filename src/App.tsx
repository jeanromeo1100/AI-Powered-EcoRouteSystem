import { lazy, Suspense, useEffect, useState } from "react"
import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  LayoutDashboard,
  Leaf,
  LocateFixed,
  LockKeyhole,
  Map,
  MapPin,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Navigation,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  UsersRound,
  X,
  LogOut,
  Plus,
  Upload,
  CalendarPlus,
  Maximize2,
  CreditCard,
  History,
  Send,
  UserPlus,
  AlertTriangle,
  CalendarClock,
  KeyRound,
  type LucideIcon,
} from "lucide-react"
import { FinanceDashboard, FinancePage, SalariesPage } from "./FinanceModule"
import { StoreProvider, useStore } from "./Store"
import {
  ActivityPage,
  AdminCompanies,
  BellMenu,
  CommunicationPage,
  ConnectedDashboard,
  CustomerPayments,
  EmployeesPage,
  LocationsPage,
  PaymentsBilling,
  PayrollPage,
  PlansPage,
  QuickActions,
  UsersPage,
} from "./ConnectedPages"
import {
  AdminAIAssistantPage,
  AdminReportsPage,
  AdminSystemConfigurationPage,
  AdminZonesPage,
  DriverAssignedRoutesPage,
  DriverCollectionStatusPage,
  DriverNdubaPage,
  DriverTripManagementPage,
  ManagerDashboardSummary,
  ManagerRoutesAIPage,
  RouteAssignmentsPanel,
} from "./EcoRouteOperations"
import {
  BillingEnforcementPage,
  NdubaTripRecordsPage,
} from "./OperationsEnhancements"
import { CustomersPageEnhanced } from "./CustomersPageEnhanced"
import { CollectionsPageEnhanced } from "./CollectionsPageEnhanced"
import { CollectionScheduleEnhanced } from "./CollectionScheduleEnhanced"
import { UsersAndAccessEnhanced } from "./UsersAndAccessEnhanced"
import { FleetAndTripsEnhanced } from "./FleetAndTripsEnhanced"
import { FinanceBillingEnhanced } from "./FinanceBillingEnhanced"
import { SmsCommunicationEnhanced } from "./SmsCommunicationEnhanced"
import { NdubaLandfillEnhanced } from "./NdubaLandfillEnhanced"
import { ReportsEnhanced } from "./ReportsEnhanced"
import { AuditLogEnhanced } from "./AuditLogEnhanced"
import { AdminSystemEnhanced } from "./AdminSystemEnhanced"

const PublicSite = lazy(() => import("./PublicSite"))

export type Role = "Admin" | "Manager" | "Finance" | "Employee" | "Customer"

type NavItem = {
  label: string
  icon: LucideIcon
}

const roleConfig: Record<Role, {
  eyebrow: string
  title: string
  subtitle: string
  workspace: string
  user: string
  initials: string
  status: string
  nav: NavItem[]
}> = {
  Admin: {
    eyebrow: "Platform intelligence",
    title: "System overview",
    subtitle: "Monitor access, organizations, security and platform activity.",
    workspace: "Admin workspace",
    user: "System Administrator",
    initials: "AD",
    status: "All systems operational",
    nav: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Companies", icon: Building2 },
      { label: "Users & Roles", icon: UsersRound },
      { label: "System Configuration", icon: Settings },
      { label: "Zones / Collection Parameters", icon: MapPin },
      { label: "Activity Log", icon: LockKeyhole },
      { label: "Reports", icon: FileText },
      { label: "Communication", icon: MessageSquareText },
      { label: "AI Assistant", icon: Sparkles },
      { label: "Profile & Settings", icon: UserRound },
    ],
  },
  Manager: {
    eyebrow: "Operations command",
    title: "Good morning, Diane",
    subtitle: "Here is what is happening across Kigali operations today.",
    workspace: "Manager workspace",
    user: "Diane Mukamana",
    initials: "DM",
    status: "Operations connected",
    nav: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Customers", icon: UsersRound },
      { label: "Collection Schedule", icon: CalendarDays },
      { label: "Collections", icon: CalendarDays },
      { label: "Routes & AI EcoRoute", icon: Sparkles },
      { label: "Live Tracking", icon: LocateFixed },
      { label: "Fleet & Vehicles", icon: Truck },
      { label: "Nduba Landfill", icon: PackageCheck },
      { label: "Payments & Billing", icon: ReceiptText },
      { label: "Billing Enforcement", icon: ShieldCheck },
      { label: "Salaries & Payroll", icon: CreditCard },
      { label: "Employees & Staff", icon: UsersRound },
      { label: "Communication", icon: MessageSquareText },
      { label: "Reports", icon: FileText },
      { label: "Activity Log", icon: LockKeyhole },
      { label: "AI Assistant", icon: Sparkles },
      { label: "Profile & Settings", icon: Settings },
    ],
  },
  Finance: {
    eyebrow: "Financial operations",
    title: "Finance overview",
    subtitle: "Monitor revenue, billing, provider payments and reconciliation.",
    workspace: "Finance workspace",
    user: "Claudine Uwase",
    initials: "CU",
    status: "Prototype finance mode",
    nav: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Customers & Collection Locations", icon: MapPin },
      { label: "Payments & Billing", icon: CreditCard },
      { label: "Billing Enforcement", icon: ShieldCheck },
      { label: "Salaries & Payroll", icon: CreditCard },
      { label: "Financial Reports", icon: Activity },
      { label: "Communication", icon: MessageSquareText },
      { label: "Activity Log", icon: LockKeyhole },
      { label: "Profile & Settings", icon: UserRound },
    ],
  },
  Employee: {
    eyebrow: "My work",
    title: "Today’s assignments",
    subtitle: "Follow your route, complete collections and report exceptions.",
    workspace: "Driver workspace",
    user: "Eric Niyonzima",
    initials: "EN",
    status: "Shift active",
    nav: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "My Tasks", icon: ClipboardCheck },
      { label: "My Routes", icon: Route },
      { label: "Collection Points", icon: MapPin },
      { label: "Collection Status", icon: Check },
      { label: "Trip Management", icon: Navigation },
      { label: "Nduba Landfill", icon: Truck },
      { label: "Communication", icon: MessageSquareText },
      { label: "Activity Log", icon: LockKeyhole },
      { label: "Profile & Settings", icon: UserRound },
    ],
  },
  Customer: {
    eyebrow: "My waste service",
    title: "Good morning, Customer",
    subtitle: "View your next collection, account balance and service updates.",
    workspace: "Customer workspace",
    user: "Customer",
    initials: "CU",
    status: "Service active",
    nav: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "My Collection", icon: PackageCheck },
      { label: "My Schedule / History", icon: Clock3 },
      { label: "My Payments / Invoices", icon: ReceiptText },
      { label: "Communication", icon: MessageSquareText },
      { label: "Activity Log", icon: LockKeyhole },
      { label: "Request Service", icon: PackageCheck },
      { label: "AI Assistant", icon: Sparkles },
      { label: "Profile & Settings", icon: UserRound },
    ],
  },
}

const roleMetrics = {
  Admin: [
    {
      label: "Active companies",
      value: "12",
      note: "+2 this month",
      icon: Building2,
    },
    {
      label: "Platform users",
      value: "1,248",
      note: "1,176 active",
      icon: UsersRound,
    },
    {
      label: "Collections today",
      value: "386",
      note: "Across 8 zones",
      icon: Truck,
    },
    {
      label: "Security alerts",
      value: "0",
      note: "No action required",
      icon: ShieldCheck,
    },
  ],
  Manager: [
    {
      label: "Today’s collections",
      value: "148",
      note: "126 completed",
      icon: CalendarDays,
    },
    {
      label: "Total customers",
      value: "2,846",
      note: "Across 8 zones",
      icon: UsersRound,
    },
    {
      label: "Completed",
      value: "126",
      note: "85% of today’s work",
      icon: Check,
    },
    {
      label: "Pending / failed",
      value: "22",
      note: "4 need review",
      icon: CircleAlert,
    },
    {
      label: "Active routes",
      value: "8",
      note: "3 nearing completion",
      icon: Route,
    },
    {
      label: "Vehicles on route",
      value: "11",
      note: "2 currently available",
      icon: Truck,
    },
    {
      label: "Outstanding",
      value: "RWF 4.2m",
      note: "86 customer accounts",
      icon: ReceiptText,
    },
    {
      label: "Nduba trips",
      value: "3",
      note: "2 currently en route",
      icon: Navigation,
    },
    {
      label: "Service requests",
      value: "14",
      note: "5 newly submitted",
      icon: MessageSquareText,
    },
    {
      label: "Operational alerts",
      value: "3",
      note: "One route delayed",
      icon: Bell,
    },
  ],
  Finance: [
    {
      label: "Total revenue",
      value: "RWF 48.6M",
      note: "Confirmed payments",
      icon: ReceiptText,
    },
    {
      label: "Pending payments",
      value: "18",
      note: "Awaiting confirmation",
      icon: Clock3,
    },
    {
      label: "Outstanding bills",
      value: "RWF 6.28M",
      note: "214 open invoices",
      icon: FileText,
    },
    {
      label: "Reconciliation issues",
      value: "4",
      note: "Need finance review",
      icon: CircleAlert,
    },
  ],
  Employee: [
    {
      label: "Assigned stops",
      value: "18",
      note: "12 completed",
      icon: MapPin,
    },
    { label: "Completed tasks", value: "12", note: "On schedule", icon: Check },
    {
      label: "Remaining tasks",
      value: "6",
      note: "Next due at 10:55",
      icon: Clock3,
    },
    {
      label: "Route progress",
      value: "67%",
      note: "6 stops remaining",
      icon: Navigation,
    },
    {
      label: "Waste collected",
      value: "2.4 t",
      note: "Today’s total",
      icon: PackageCheck,
    },
    {
      label: "Exceptions",
      value: "1",
      note: "Needs review",
      icon: CircleAlert,
    },
  ],
  Customer: [
    {
      label: "Next collection",
      value: "Oct 05",
      note: "Monday · 08:00–11:00",
      icon: CalendarDays,
    },
    {
      label: "Collection status",
      value: "Scheduled",
      note: "Kicukiro-Nyarugunga Route",
      icon: Route,
    },
    {
      label: "Outstanding balance",
      value: "RWF 0",
      note: "No balance due",
      icon: ReceiptText,
    },
    {
      label: "Service plan",
      value: "Weekly",
      note: "240 kg allowance",
      icon: PackageCheck,
    },
    {
      label: "Collection point",
      value: "CP-2048",
      note: "Nyarugunga, Kicukiro",
      icon: MapPin,
    },
    {
      label: "Last collection",
      value: "Sep 28",
      note: "Completed successfully",
      icon: Check,
    },
    {
      label: "Communication",
      value: "2",
      note: "One unread message",
      icon: Bell,
    },
    {
      label: "Payment status",
      value: "Paid",
      note: "Receipt ECO-0921",
      icon: ShieldCheck,
    },
  ],
}

const records = {
  Admin: [
    ["Isuku Iwacu Services", "Waste operator", "Active", "Today, 09:42"],
    ["Simate Garbage Ltd", "Waste operator", "Active", "Today, 08:16"],
    ["Kigali Clean City", "Municipal partner", "Review", "Yesterday"],
    ["Ubumwe Waste Services", "Waste operator", "Active", "Sep 29, 2026"],
  ],
  Manager: [
    [
      "KG 218 · Kicukiro-Nyarugunga Route",
      "Truck RW 412 A",
      "In progress",
      "14 / 18 stops",
    ],
    [
      "KK 15 · Kicukiro Central",
      "Truck RW 307 K",
      "In progress",
      "11 / 15 stops",
    ],
    ["KN 7 · Nyarugenge", "Truck RW 922 D", "Completed", "21 / 21 stops"],
    ["KG 45 · Kimironko", "Truck RW 118 T", "Delayed", "6 / 16 stops"],
  ],
  Finance: [
    ["TXN-10482 · Jean Romeo", "MTN Mobile Money", "Successful", "RWF 18,000"],
    ["TXN-10481 · Aline Uwase", "Airtel Money", "Pending", "RWF 24,000"],
    ["INV-2026-1048", "Outstanding invoice", "Overdue", "RWF 85,000"],
    ["TXN-10476", "Reconciliation", "Amount mismatch", "RWF 2,000"],
  ],
  Employee: [
    ["Kimironko Market", "Collection", "Completed", "08:35"],
    ["KG 11 Ave, House 28", "Collection", "Completed", "09:10"],
    ["Green Hills Residence", "Collection", "In progress", "10:20"],
    ["Kibagabaga Sector Office", "Collection", "Next stop", "10:55"],
  ],
  Customer: [
    ["Monday household pickup", "Collection", "Scheduled", "Oct 05, 08:00"],
    ["Collection completed", "Collection", "Completed", "Sep 28, 08:42"],
    ["Collection completed", "Collection", "Completed", "Sep 21, 09:06"],
    ["Vehicle breakdown", "Collection", "Rescheduled", "Sep 15, 08:00"],
  ],
}

function downloadCsv(role: Role) {
  const rows = [["Name", "Type", "Status", "Updated"], ...records[role]]
  const csv = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `ecoroute-${role.toLowerCase()}-report.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
        <Leaf size={20} strokeWidth={2.4} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold tracking-tight text-slate-950 leading-tight">
          AI-Powered EcoRoute
        </p>
        <p className="text-[10px] font-semibold tracking-tight text-emerald-800 leading-tight">
          Smart Waste Collection, Route, Optimization
        </p>
      </div>
    </div>
  )
}

function Sidebar({
  role,
  page,
  open,
  onPage,
  onClose,
  profile,
}: {
  role: Role
  page: string
  open: boolean
  onPage: (page: string) => void
  onClose: () => void
  profile?: SessionProfile | null
}) {
  const config = roleConfig[role]
  const { messages } = useStore()
  const unread = messages.filter(
    (item) =>
      item.role === (role === "Employee" ? "Employee" : role) && item.unread,
  ).length
  const displayName = profile?.name ?? config.user
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-emerald-900/10 bg-[#f4f8f4] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-white lg:hidden"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>
        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {config.workspace}
        </p>
        <nav className="space-y-1 overflow-y-auto">
          {config.nav.map((item) => {
            const Icon = item.icon
            const active = page === item.label
            return (
              <button
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? "bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-900/5"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                }`}
                key={item.label}
                onClick={() => {
                  onPage(item.label)
                  onClose()
                }}
              >
                <Icon
                  className={active ? "text-emerald-700" : "text-slate-400"}
                  size={18}
                />
                <span>{item.label}</span>
                {item.label === "Communication" && unread > 0 && (
                  <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-emerald-600" />
                )}
              </button>
            )
          })}
        </nav>
        <button
          className="mt-auto w-full rounded-2xl border border-emerald-900/10 bg-white p-3.5 text-left hover:border-emerald-300"
          onClick={() => {
            onPage(
              role === "Admin" ? "System Configuration" : "Profile & Settings",
            )
            onClose()
          }}
        >
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-xs font-bold text-emerald-800">
              {initials || config.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="text-xs text-slate-500">{role}</p>
            </div>
            <MoreHorizontal className="ml-auto text-slate-400" size={18} />
          </div>
        </button>
      </aside>
    </>
  )
}

function Header({
  role,
  page,
  onMenu,
  onLogout,
  onCommunication,
}: {
  role: Role
  page: string
  onMenu: () => void
  onLogout: () => void
  onCommunication: () => void
}) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 py-2.5 backdrop-blur md:px-8">
      <div className="flex items-center gap-3 min-w-0 mr-4">
        <button
          aria-label="Open menu"
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
          onClick={onMenu}
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="hidden size-2 rounded-full bg-emerald-600 sm:inline-block" />
            <h1 className="text-xs sm:text-base font-black tracking-tight text-slate-900 truncate">
              AI-Powered EcoRoute
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs font-semibold text-emerald-800 tracking-tight truncate">
            Smart Waste Collection, Route, Optimization
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 hidden xl:inline-block">
          {role} <span className="mx-1 text-slate-300">/</span> {page}
        </span>
        <BellMenu onOpen={onCommunication} role={role} />
        <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:inline-flex border border-emerald-200">
          Authorized · {role}
        </span>
        <button
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800"
          onClick={onLogout}
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  )
}

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string
  value: string
  note: string
  icon: LucideIcon
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={19} />
        </div>
        <MoreHorizontal className="text-slate-300" size={18} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
    </div>
  )
}

function OperationsTable({ role, title }: { role: Role; title?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center border-b border-slate-100 px-5 py-4">
        <div>
          <p className="font-semibold text-slate-950">
            {title ?? "Recent activity"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Latest records from your workspace
          </p>
        </div>
        <button className="ml-auto text-sm font-semibold text-emerald-700 hover:text-emerald-900">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-left">
          <thead className="bg-slate-50/70">
            <tr className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              <th className="px-5 py-3">Record</th>
              <th className="px-5 py-3">Assignment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Progress / updated</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records[role].map((row) => (
              <tr
                className="text-sm transition hover:bg-emerald-50/30"
                key={row[0]}
              >
                <td className="px-5 py-4 font-semibold text-slate-800">
                  {row[0]}
                </td>
                <td className="px-5 py-4 text-slate-500">{row[1]}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row[2] === "Delayed" || row[2] === "Review"
                        ? "bg-slate-900 text-white"
                        : row[2] === "Completed" || row[2] === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {row[2]}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">{row[3]}</td>
                <td className="px-5 py-4">
                  <button
                    aria-label={`Open ${row[0]}`}
                    className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <ChevronRight size={16} />
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

function RouteVisual({ role }: { role: Role }) {
  const isEmployee = role === "Employee"
  return (
    <div className="relative min-h-72 overflow-hidden rounded-2xl border border-emerald-900/10 bg-[#eaf2ea] p-5 shadow-sm">
      <div className="absolute inset-0 map-grid opacity-70" />
      <div className="absolute left-[18%] top-[30%] h-28 w-2 rotate-[62deg] rounded-full bg-white shadow-sm" />
      <div className="absolute left-[39%] top-[25%] h-44 w-2 rotate-[12deg] rounded-full bg-white shadow-sm" />
      <div className="absolute right-[26%] top-[31%] h-36 w-2 rotate-[48deg] rounded-full bg-white shadow-sm" />
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 500 280"
      >
        <path
          d="M52 220 C110 220 105 85 190 100 S275 230 340 175 S395 55 455 82"
          fill="none"
          stroke="#047857"
          strokeDasharray={isEmployee ? "0" : "7 7"}
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
      {[
        ["left-[9%] top-[74%]", "1"],
        ["left-[35%] top-[31%]", "2"],
        ["left-[65%] top-[58%]", "3"],
        ["right-[7%] top-[23%]", "4"],
      ].map(([position, number]) => (
        <div
          className={`absolute ${position} grid size-7 place-items-center rounded-full border-2 border-white bg-emerald-700 text-[10px] font-bold text-white shadow`}
          key={number}
        >
          {number}
        </div>
      ))}
      <div className="relative flex items-start justify-between">
        <div className="rounded-xl bg-white/95 px-3 py-2 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            {isEmployee ? "KG 45 · Assigned route" : "Live route network"}
          </p>
          <p className="text-xs text-slate-500">
            {isEmployee ? "6 stops remaining" : "Prototype GPS data"}
          </p>
        </div>
        <div className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white shadow">
          <LocateFixed size={17} />
        </div>
      </div>
      <div className="absolute bottom-4 left-5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm">
        Estimated efficiency · 94%
      </div>
    </div>
  )
}

type SessionProfile = {
  name?: string
  email?: string
  phone?: string
  category?: string
  assignment?: string
  task?: string
}

function Dashboard({
  role,
  onPage,
  profile,
}: {
  role: Role
  onPage: (page: string) => void
  profile?: SessionProfile | null
}) {
  const quickActions =
    role === "Manager"
      ? ["Collections", "AI EcoRoute", "Live Operations", "Reports"]
      : role === "Customer"
        ? [
            "My Payments / Invoices",
            "My Schedule / History",
            "My Collection",
            "Request Service",
            "AI Assistant",
          ]
        : role === "Employee"
          ? ["My Routes", "My Tasks", "Collection Status", "Nduba Landfill"]
          : ["Companies", "Users", "Audit logs", "Reports"]
  return (
    <>
      {role === "Employee" && profile?.email && (
        <div className="mb-4 grid gap-4 rounded-2xl bg-emerald-900 p-5 text-white sm:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Signed-in employee
            </p>
            <p className="mt-2 text-xl font-bold">{profile.name}</p>
            <p className="mt-1 text-sm text-emerald-100">
              {profile.category} · {profile.email}
            </p>
            <p className="mt-1 text-xs text-emerald-200">{profile.phone}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              My assigned work
            </p>
            <p className="mt-2 font-bold">{profile.task}</p>
            <p className="mt-1 text-sm text-emerald-100">
              {profile.assignment}
            </p>
          </div>
        </div>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <span className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Quick actions
        </span>
        {quickActions.map((action) => (
          <button
            className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-700 hover:text-white"
            key={action}
            onClick={() => onPage(action)}
          >
            {action}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {roleMetrics[role].map((metric) => (
          <MetricCard {...metric} key={metric.label} />
        ))}
      </div>
      {role === "Manager" && <ManagerDashboardSummary onPage={onPage} />}
      {role === "Employee" && (
        <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Today’s customers", "18"],
            ["Collection points", "18"],
            ["Completed", "12"],
            ["Remaining", "6"],
            ["Next customer", "Patrick H. · 09:00"],
          ].map(([label, value]) => (
            <div className="rounded-xl bg-slate-50 p-3" key={label}>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
            </div>
          ))}
        </div>
      )}

      {role === "Admin" ? (
        <div className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          <OperationsTable role={role} title="Company network" />
          <div className="rounded-2xl bg-emerald-800 p-6 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-xl bg-white/10">
                <ShieldCheck size={21} />
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                Healthy
              </span>
            </div>
            <p className="mt-7 text-xl font-semibold">Platform health</p>
            <p className="mt-1 text-sm leading-6 text-emerald-100">
              Identity, messaging and data services are operating normally.
            </p>
            <div className="mt-6 space-y-3">
              {["API services", "SMS gateway", "Database backups"].map(
                (service) => (
                  <div className="flex items-center text-sm" key={service}>
                    <span className="mr-2 size-2 rounded-full bg-white" />
                    {service}
                    <span className="ml-auto text-emerald-100">
                      Operational
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <RouteVisual role={role} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-950">
                  {role === "Manager" ? "Operational pulse" : "Route checklist"}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Live shift summary
                </p>
              </div>
              <RefreshCw className="text-slate-400" size={17} />
            </div>
            <div className="mt-5 space-y-4">
              {(role === "Manager" || role === "Customer"
                ? [
                    role === "Customer"
                      ? ["Account setup", "Complete", "100%"]
                      : ["Collections completed", "126", "85%"],
                    role === "Customer"
                      ? ["Current service plan", "Active", "100%"]
                      : ["Routes on schedule", "7 of 8", "88%"],
                    role === "Customer"
                      ? ["Payment standing", "Clear", "100%"]
                      : ["Fleet utilization", "11 of 13", "84%"],
                  ]
                : [
                    ["Vehicle inspection", "Complete", "100%"],
                    ["Collections", "12 of 18", "67%"],
                    ["Nduba transfer", "Pending", "18%"],
                  ]
              ).map(([label, value, width]) => (
                <div key={label}>
                  <div className="mb-2 flex text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className="ml-auto font-semibold text-slate-900">
                      {value}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-50">
                    <div
                      className="h-full rounded-full bg-emerald-700"
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
              {role === "Manager"
                ? "Open operations center"
                : role === "Customer"
                  ? "View collection details"
                  : "Continue active route"}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {role !== "Admin" && (
        <div className="mt-4">
          <OperationsTable
            role={role}
            title={role === "Manager" ? "Active routes" : "Today’s stops"}
          />
        </div>
      )}
    </>
  )
}

const pageRequirements: Record<string, string[]> = {
  Customers: [
    "Customer ID and contact",
    "Collection point",
    "Service and payment status",
    "Collection history",
  ],
  Collections: [
    "Date, zone and route",
    "Vehicle and driver",
    "Collection status",
    "Exceptions and rescheduling",
  ],
  Locations: [
    "District to village",
    "Collection zones",
    "Mapped collection points",
    "Customers by area",
  ],
  "Live Operations": [
    "Simulated vehicle location",
    "Route progress",
    "Completed stops",
    "Operational exceptions",
  ],
  "Users / Staff": [
    "Employee and department",
    "Role and permissions",
    "Route assignment",
    "Account status",
  ],
  Notifications: [
    "Unread notices",
    "Payment or route alerts",
    "Assignment changes",
    "Timestamps",
  ],
  Messages: [
    "Customer or group",
    "SMS templates",
    "Message composer",
    "Communication history",
  ],
  Reports: [
    "Collection performance",
    "Routes and fleet",
    "Payments and customers",
    "Export by date",
  ],
  Routes: [
    "Zone and ordered stops",
    "Distance and time",
    "Vehicle and team",
    "Progress history",
  ],
  "AI EcoRoute": [
    "Date and operational zone",
    "Available vehicle and driver",
    "Alternative routes",
    "Estimated efficiency",
  ],
  "Fleet & vehicles": [
    "Plate and capacity",
    "Current assignment",
    "Maintenance status",
    "Utilization",
  ],
  Payments: [
    "Invoice and customer",
    "Transaction reference",
    "Method and amount",
    "Verification status",
  ],
  "Nduba landfill": [
    "Vehicle and driver",
    "Route and load",
    "Departure and arrival",
    "Trip status",
  ],
  Profile: [
    "Customer or employee ID",
    "Contact information",
    "Service status",
    "Security settings",
  ],
  "My Collection": [
    "Collection ID and date",
    "Assigned route and team",
    "Collection status",
    "Previous collections",
  ],
  "Collection schedule": [
    "Upcoming dates",
    "Time windows",
    "Status and reminders",
    "Route link",
  ],
  "My Location": [
    "Collection point ID",
    "Address and map",
    "Collection frequency",
    "Location-change request",
  ],
  Route: [
    "Assigned route",
    "Collection progress",
    "Vehicle or team",
    "Simulated location",
  ],
  Payment: [
    "Current invoice",
    "Service period",
    "Amount and due date",
    "Payment method",
  ],
  "Billing & Invoices": [
    "Invoice number",
    "Billing period",
    "Amount and due date",
    "Downloadable receipt",
  ],
  "Payment History": [
    "Transaction ID",
    "Payment method",
    "Date and status",
    "Receipt",
  ],
  SMS: ["Message type", "Message content", "Date sent", "Delivery status"],
  "Request service": [
    "Request type",
    "Collection point",
    "Description",
    "Manager review status",
  ],
  "Help / Support": [
    "Support topics",
    "Contact support",
    "FAQ",
    "Open requests",
  ],
  "My Tasks": [
    "Task and collection point",
    "Priority",
    "Due time",
    "Start or complete action",
  ],
  "My Route": [
    "Assigned vehicle",
    "Ordered stops",
    "Completed and remaining",
    "Route instructions",
  ],
  "Collection Points": [
    "Customer and address",
    "Scheduled time",
    "Service notes",
    "Collection action",
  ],
  "Collection Status": [
    "Start or complete",
    "Missed or failed",
    "Needs review",
    "Issue reason",
  ],
  "Trip Management": [
    "Current trip",
    "Vehicle and route",
    "Start time",
    "Update or complete",
  ],
  "Nduba Trip": ["Waste load", "Departure", "Landfill arrival", "Completion"],
  "Activity History": ["Date and time", "Activity", "Location", "Status"],
  Settings: [
    "Account security",
    "Notifications",
    "Language",
    "Permitted preferences",
  ],
  "AI Assistant": [
    "Operational questions",
    "Collection summary",
    "Route guidance",
    "Prototype response",
  ],
}

function AIWorkflow() {
  const [stage, setStage] = useState(0)
  const labels = [
    "Load collection points",
    "Recommendation ready",
    "Route accepted",
    "Vehicle & team assigned",
    "Route started",
  ]
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-900">
            <Sparkles size={17} /> AI Route Recommendation
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Prototype Data · Simulated optimization
          </p>
        </div>
        <span className="self-start rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
          {labels[stage]}
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-semibold text-slate-600">
          Collection date
          <input
            className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2.5 text-sm outline-none"
            defaultValue="2026-10-04"
            type="date"
          />
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Operational zone
          <select className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2.5 text-sm outline-none">
            <option>Kicukiro-Nyarugunga Route</option>
            <option>Kicukiro Central</option>
            <option>Nyarugenge</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Vehicle and team
          <select className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2.5 text-sm outline-none">
            <option>RW 412 A · Team Alpha</option>
            <option>RW 307 K · Team Delta</option>
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-4 ring-1 ring-emerald-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Collection points to visit · 18
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "Nyarugunga · Kamashashi",
              "Remera · Rukiri I",
              "Kimironko · Bibare",
              "Kibagabaga Estates",
            ].map((point, index) => (
              <div
                className="flex items-center gap-2 text-xs text-slate-600"
                key={point}
              >
                <span className="grid size-5 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                  {index + 1}
                </span>
                {point}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-emerald-100">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available resources
          </p>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <Truck className="text-emerald-700" size={17} />
            <span>3 available vehicles</span>
            <span className="ml-auto font-bold">RW 412 A</span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <UsersRound className="text-emerald-700" size={17} />
            <span>4 available teams</span>
            <span className="ml-auto font-bold">Team Alpha</span>
          </div>
        </div>
      </div>
      {stage > 0 && (
        <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["18.4 km", "Estimated distance"],
              ["1h 42m", "Estimated time"],
              ["94%", "Estimated efficiency"],
            ].map(([value, label]) => (
              <div
                className="rounded-xl bg-white p-3 ring-1 ring-emerald-100"
                key={label}
              >
                <p className="text-lg font-bold text-slate-950">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <RouteVisual role="Manager" />
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[
          "Collection points",
          "AI route",
          "Manager review",
          "Vehicle + team",
          "Start route",
        ].map((item, index) => (
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              index <= stage
                ? "bg-emerald-700 text-white"
                : "bg-white text-slate-400"
            }`}
            key={item}
          >
            {item}
          </span>
        ))}
      </div>
      <button
        className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        disabled={stage === 4}
        onClick={() => setStage(Math.min(4, stage + 1))}
      >
        {stage === 0
          ? "Generate Route"
          : stage === 1
            ? "Accept Route"
            : stage === 2
              ? "Assign Vehicle & Team"
              : stage === 3
                ? "Start Route"
                : "Route started"}
        {stage < 4 && <ChevronRight size={16} />}
      </button>
    </div>
  )
}

function CustomerPayment() {
  const currentProfile = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("ecoroute-current-user") ?? "null",
      )
    } catch {
      return null
    }
  })()
  const customerName = currentProfile?.name || "Customer"
  const [stage, setStage] = useState(0)
  const [method, setMethod] = useState("MTN Mobile Money")
  const [showReceipt, setShowReceipt] = useState(false)
  const transactionId = "TXN-2026-10482"
  const invoice = "INV-2026-00125"
  const paidAt = "04 Oct 2026 · 10:42"
  const processPayment = () => {
    setStage(3)
    window.setTimeout(() => setStage(4), 1400)
  }
  const downloadReceipt = () => {
    const receipt = [
      "ECOROUTE PAYMENT RECEIPT",
      `Transaction ID: ${transactionId}`,
      `Invoice: ${invoice}`,
      `Customer: ${customerName}`,
      `Date/time: ${paidAt}`,
      `Payment method: ${method}`,
      "Amount: RWF 6,000",
      "Status: Paid",
    ].join("\n")
    const url = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `EcoRoute-Receipt-${transactionId}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {stage === 0 && (
        <>
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Current Waste Collection Bill
              </p>
              <p className="mt-3 text-sm text-slate-500">Amount to pay</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                RWF 6,000
              </p>
            </div>
            <span className="self-start rounded-full bg-slate-950 px-3 py-1.5 text-xs font-bold text-white sm:ml-auto">
              Outstanding
            </span>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Customer name", customerName],
              ["Invoice number", invoice],
              ["Service period", "September 2026"],
              ["Collection service", "Waste collection service"],
              ["Collection point", "CP-2048 · Nyarugunga"],
              ["Amount", "RWF 6,000"],
              ["Due date", "10 Oct 2026"],
              ["Payment status", "Outstanding"],
            ].map(([label, value]) => (
              <div className="rounded-xl bg-slate-50 p-3" key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white sm:w-auto sm:px-8"
            onClick={() => setStage(1)}
          >
            Pay Now <ChevronRight size={16} />
          </button>
        </>
      )}
      {stage === 1 && (
        <>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Choose Payment Method
            </p>
            <h3 className="mt-2 text-2xl font-bold">Mobile Money</h3>
            <p className="mt-1 text-sm text-slate-500">
              Choose the registered mobile wallet you want to use.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["MTN Mobile Money", "Airtel Money"].map((item) => (
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 ${
                  method === item
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200"
                }`}
                key={item}
              >
                <input
                  checked={method === item}
                  name="payment-method"
                  onChange={() => setMethod(item)}
                  type="radio"
                />
                <span>
                  <span className="block font-bold text-slate-900">{item}</span>
                  <span className="text-xs text-slate-500">
                    Pay securely using your mobile number
                  </span>
                </span>
              </label>
            ))}
          </div>
          <label className="mt-4 block text-xs font-bold text-slate-600">
            Registered mobile number
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm sm:max-w-sm"
              defaultValue="+250 788 123 456"
            />
          </label>
          <div className="mt-6 flex gap-2">
            <button
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
              onClick={() => setStage(0)}
            >
              Back
            </button>
            <button
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
              onClick={() => setStage(2)}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
      {stage === 2 && (
        <>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
            Confirm Payment
          </p>
          <h3 className="mt-2 text-2xl font-bold">Review before paying</h3>
          <div className="mt-5 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
            {[
              ["Amount", "RWF 6,000"],
              ["Invoice", invoice],
              ["Method", method],
            ].map(([label, value]) => (
              <div
                className="flex border-b border-emerald-100 px-5 py-4 last:border-0"
                key={label}
              >
                <span className="text-sm text-slate-500">{label}</span>
                <strong className="ml-auto text-sm">{value}</strong>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <button
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
              onClick={() => setStage(1)}
            >
              Back
            </button>
            <button
              className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
              onClick={processPayment}
            >
              Confirm & Pay
            </button>
          </div>
        </>
      )}
      {stage === 3 && (
        <div className="py-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <RefreshCw className="animate-spin" size={24} />
          </div>
          <h3 className="mt-5 text-2xl font-bold">Processing payment...</h3>
          <p className="mt-2 text-sm text-slate-500">
            Confirm the payment request on your {method} phone.
          </p>
        </div>
      )}
      {stage === 4 && (
        <div>
          <div className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <Check size={25} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
              Payment Successful
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              RWF 6,000 paid successfully.
            </h3>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Transaction ID", transactionId],
              ["Invoice number", invoice],
              ["Date / time", paidAt],
              ["Payment method", method],
              ["Amount", "RWF 6,000"],
              ["Status", "Paid"],
            ].map(([label, value]) => (
              <div className="rounded-xl bg-slate-50 p-3" key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              className="rounded-xl border border-emerald-700 px-5 py-3 text-sm font-bold text-emerald-800"
              onClick={() => setShowReceipt(!showReceipt)}
            >
              View Receipt
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
              onClick={downloadReceipt}
            >
              <Download size={16} />
              Download Receipt
            </button>
          </div>
          {showReceipt && (
            <div className="mt-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <Leaf className="text-emerald-700" size={22} />
                <div>
                  <p className="font-bold">EcoRoute Payment Receipt</p>
                  <p className="text-xs text-slate-500">
                    {transactionId} · {invoice}
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-700 px-3 py-1 text-xs font-bold text-white">
                  PAID
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Received RWF 6,000 from Jean Romeo via {method} for the
                September 2026 waste collection service.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type CustomerMessage = {
  id: string
  date: string
  message: string
  type: string
  status: string
  sender: string
  unread: boolean
  relatedPage: string
}

function CustomerSmsPage({ onPage }: { onPage: (page: string) => void }) {
  const seeded = [
    {
      id: "APP-1048",
      channel: "App",
      date: "Oct 05",
      message: "Your collection is scheduled Monday at 08:00.",
      type: "Collection",
      sender: "EcoRoute Operations",
      unread: true,
      relatedPage: "My Schedule / History",
    },
    {
      id: "SMS-1047",
      channel: "SMS",
      date: "Sep 30",
      message: "Your payment of RWF 6,000 was successful.",
      type: "Payment",
      sender: "EcoRoute Billing",
      unread: false,
      relatedPage: "My Payments / Invoices",
    },
    {
      id: "APP-1046",
      channel: "App",
      date: "Sep 29",
      message: "Your collection at CP-2048 was completed.",
      type: "Collection",
      sender: "Team Alpha",
      unread: false,
      relatedPage: "My Collection",
    },
    {
      id: "SMS-1045",
      channel: "SMS",
      date: "Sep 27",
      message: "Your waste collection bill is due on 10 October.",
      type: "Payment reminder",
      sender: "EcoRoute Billing",
      unread: true,
      relatedPage: "My Payments / Invoices",
    },
  ]
  const [filter, setFilter] = useState("All")
  const [messages, setMessages] = useState(seeded)
  const [selected, setSelected] = useState(seeded[0])
  const visible = messages.filter(
    (item) => filter === "All" || item.channel === filter,
  )
  const open = (item: typeof seeded[number]) => {
    setSelected({ ...item, unread: false })
    setMessages(
      messages.map((message) =>
        message.id === item.id ? { ...message, unread: false } : message,
      ),
    )
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {["All", "App", "SMS"].map((item) => (
          <button
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              filter === item ? "bg-emerald-700 text-white" : "text-slate-500"
            }`}
            key={item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center border-b border-slate-100 p-5">
            <div>
              <p className="font-bold">Notifications</p>
              <p className="mt-1 text-xs text-slate-500">
                App and SMS updates for Jean Romeo only.
              </p>
            </div>
            <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              {messages.filter((item) => item.unread).length} unread
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {visible.map((item) => (
              <button
                className={`w-full p-4 text-left hover:bg-emerald-50/40 ${
                  item.unread ? "bg-emerald-50/20" : ""
                }`}
                key={item.id}
                onClick={() => open(item)}
              >
                <div className="flex items-center">
                  <span className="text-xs font-bold text-emerald-700">
                    {item.channel}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">
                    {item.date}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    item.unread ? "font-bold" : "text-slate-600"
                  }`}
                >
                  {item.message}
                </p>
                <p className="mt-1 text-xs text-slate-400">{item.sender}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Bell size={19} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            {selected.type} · {selected.channel}
          </p>
          <p className="mt-3 text-lg font-semibold leading-8">
            {selected.message}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Sent by {selected.sender}
          </p>
          <div className="mt-6 flex gap-2">
            <button
              className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white"
              onClick={() => onPage(selected.relatedPage)}
            >
              Open related page
            </button>
            <button
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold"
              onClick={() => {
                const remaining = messages.filter(
                  (item) => item.id !== selected.id,
                )
                setMessages(remaining)
                setSelected(remaining[0] ?? seeded[0])
              }}
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomerPaymentHistoryPage() {
  const [status, setStatus] = useState("All")
  const [method, setMethod] = useState("All")
  const [date, setDate] = useState("")
  const transactions = [
    [
      "TXN-2026-10482",
      "INV-2026-00125",
      "RWF 6,000",
      "MTN Mobile Money",
      "2026-10-04",
      "Paid",
    ],
    [
      "TXN-2026-09811",
      "INV-2026-00118",
      "RWF 6,000",
      "Airtel Money",
      "2026-09-02",
      "Paid",
    ],
    [
      "TXN-2026-09104",
      "INV-2026-00106",
      "RWF 6,000",
      "MTN Mobile Money",
      "2026-08-03",
      "Paid",
    ],
    [
      "TXN-2026-08428",
      "INV-2026-00092",
      "RWF 6,000",
      "MTN Mobile Money",
      "2026-07-04",
      "Failed",
    ],
  ]
  const filtered = transactions.filter(
    (item) =>
      (status === "All" || item[5] === status) &&
      (method === "All" || item[3] === method) &&
      (!date || item[4] === date),
  )
  const receipt = (row: string[]) => {
    const url = URL.createObjectURL(
      new Blob(
        [
          `EcoRoute Receipt\nTransaction: ${row[0]}\nInvoice: ${row[1]}\nAmount: ${row[2]}\nMethod: ${row[3]}\nDate: ${row[4]}\nStatus: ${row[5]}`,
        ],
        { type: "text/plain" },
      ),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `${row[0]}-receipt.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-emerald-800 p-5 text-white">
          <p className="text-xs text-emerald-100">Total paid</p>
          <p className="mt-2 text-2xl font-bold">RWF 45,000</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Successful payments</p>
          <p className="mt-2 text-2xl font-bold">3</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">Failed payments</p>
          <p className="mt-2 text-2xl font-bold">1</p>
        </div>
      </div>
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <label className="text-xs font-bold text-slate-600">
          Date
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
            onChange={(event) => setDate(event.target.value)}
            type="date"
            value={date}
          />
        </label>
        <label className="text-xs font-bold text-slate-600">
          Status
          <select
            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All</option>
            <option>Paid</option>
            <option>Failed</option>
            <option>Pending</option>
          </select>
        </label>
        <label className="text-xs font-bold text-slate-600">
          Payment method
          <select
            className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
            onChange={(event) => setMethod(event.target.value)}
          >
            <option>All</option>
            <option>MTN Mobile Money</option>
            <option>Airtel Money</option>
          </select>
        </label>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              {[
                "Transaction ID",
                "Invoice",
                "Amount",
                "Payment method",
                "Date",
                "Status",
                "Receipt",
              ].map((item) => (
                <th className="px-5 py-3" key={item}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((row) => (
              <tr className="text-sm" key={row[0]}>
                {row.map((item, index) => (
                  <td
                    className={`px-5 py-4 ${
                      index === 0 || index === 2
                        ? "font-bold"
                        : "text-slate-600"
                    }`}
                    key={item}
                  >
                    {index === 5 ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          item === "Paid"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-slate-950 text-white"
                        }`}
                      >
                        {item}
                      </span>
                    ) : (
                      item
                    )}
                  </td>
                ))}
                <td className="px-5 py-4">
                  <button
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 disabled:text-slate-300"
                    disabled={row[5] !== "Paid"}
                    onClick={() => receipt(row)}
                  >
                    <Download size={14} />
                    Download
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

function CustomerBillingPage({ onPage }: { onPage: (page: string) => void }) {
  const [tab, setTab] = useState("Overview")
  const invoices = [
    [
      "INV-00125",
      "September 2026",
      "RWF 6,000",
      "10 October 2026",
      "Outstanding",
    ],
    ["INV-00118", "August 2026", "RWF 6,000", "10 September 2026", "Paid"],
    ["INV-00110", "July 2026", "RWF 6,000", "10 August 2026", "Paid"],
  ]
  const download = (invoice: string[]) => {
    const text = [
      "ECOROUTE WASTE COLLECTION INVOICE",
      `Invoice: ${invoice[0]}`,
      "Customer: Jean Romeo",
      "Customer ID: CUS-2048",
      `Period: ${invoice[1]}`,
      `Amount: ${invoice[2]}`,
      `Due: ${invoice[3]}`,
      `Status: ${invoice[4]}`,
    ].join("\n")
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `${invoice[0]}-invoice.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {["Overview", "Payments", "Invoices"].map((item) => (
          <button
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              tab === item ? "bg-emerald-700 text-white" : "text-slate-500"
            }`}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <>
          <div className="rounded-2xl bg-emerald-900 p-5 text-white">
            <div className="flex">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Billing overview
                </p>
                <p className="mt-2 text-2xl font-bold">Jean Romeo · CUS-2048</p>
                <p className="mt-1 text-sm text-emerald-100">
                  Household Standard · Collection point CP-2048
                </p>
              </div>
              <span className="ml-auto self-start rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900">
                Paid
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                ["Total paid", "RWF 45,000"],
                ["Outstanding", "RWF 6,000"],
                ["Last payment", "30 Sep 2026"],
                ["Current status", "Invoice due"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-emerald-200">{label}</p>
                  <p className="mt-1 font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Next invoice due", "10 October 2026"],
              ["Payment method", "MTN Mobile Money"],
              ["Service", "Every Monday · 08:00–11:00"],
            ].map(([label, value]) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                key={label}
              >
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-2 font-bold">{value}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "Payments" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">Outstanding invoice · RWF 6,000</p>
              <p className="mt-1 text-sm text-slate-500">
                INV-00125 · Due 10 October 2026
              </p>
            </div>
            <button
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white sm:ml-auto"
              onClick={() => onPage("Payment")}
            >
              Pay now
            </button>
          </div>
          <CustomerPaymentHistoryPage />
        </div>
      )}
      {tab === "Invoices" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <p className="font-bold">My invoices</p>
            <p className="mt-1 text-xs text-slate-500">
              Invoices for Jean Romeo only.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  {[
                    "Invoice",
                    "Period",
                    "Amount",
                    "Due date",
                    "Status",
                    "Action",
                  ].map((item) => (
                    <th className="px-5 py-3" key={item}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr className="text-sm" key={invoice[0]}>
                    {invoice.slice(0, 5).map((value, index) => (
                      <td
                        className={`px-5 py-4 ${
                          index === 0 || index === 2
                            ? "font-bold"
                            : "text-slate-600"
                        }`}
                        key={value}
                      >
                        {value}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <button
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700"
                        onClick={() => download(invoice)}
                      >
                        <Download size={14} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function CustomerRoutePage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-emerald-900 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
          Today’s Route
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Route ID", "KG 45"],
            ["Collection zone", "Kicukiro-Nyarugunga Route"],
            ["Vehicle", "RW 412 A"],
            ["Driver / team", "Eric N. · Team Alpha"],
            ["Current progress", "14 / 18 stops"],
            ["Estimated arrival", "10:30"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-emerald-200">{label}</p>
              <p className="mt-1 text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-900">
            In Progress
          </span>
          <span className="text-xs text-emerald-100">
            Collection status · vehicle approaching your area
          </span>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_0.5fr]">
        <div className="relative min-h-[520px] overflow-hidden rounded-2xl bg-[#e5efe4]">
          <div className="absolute inset-0 map-grid" />
          <div className="absolute left-[18%] top-[-10%] h-[130%] w-3 rotate-[24deg] rounded-full bg-white" />
          <div className="absolute left-[-5%] top-[42%] h-3 w-[115%] -rotate-[8deg] rounded-full bg-white" />
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 700 520"
          >
            <path
              d="M45 430 C155 390 120 145 275 215 S430 390 650 75"
              fill="none"
              stroke="#047857"
              strokeWidth="5"
            />
          </svg>
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              className="absolute grid size-6 place-items-center rounded-full bg-emerald-700 text-[9px] font-bold text-white shadow"
              key={index}
              style={{
                left: `${8 + index * 5.4}%`,
                top: `${72 - Math.sin(index / 2) * 36}%`,
              }}
            >
              <Check size={11} />
            </span>
          ))}
          {[15, 16, 17, 18].map((stop, index) => (
            <span
              className="absolute grid size-7 place-items-center rounded-full border-2 border-emerald-700 bg-white text-[9px] font-bold text-emerald-800 shadow"
              key={stop}
              style={{ right: `${25 - index * 5}%`, top: `${42 - index * 8}%` }}
            >
              {stop}
            </span>
          ))}
          <span className="absolute right-[28%] top-[45%] grid size-12 place-items-center rounded-full border-4 border-white bg-slate-950 text-white shadow-xl">
            <Truck size={19} />
          </span>
          <span className="absolute right-[8%] top-[12%] grid size-12 place-items-center rounded-full border-4 border-white bg-emerald-700 text-white shadow-xl">
            <MapPin size={19} />
          </span>
          <div className="absolute bottom-4 left-4 rounded-xl bg-white p-4 shadow-lg">
            <p className="text-xs font-bold text-emerald-800">
              Simulated vehicle location
            </p>
            <p className="mt-1 text-sm font-bold">RW 412 A · Stop 14 of 18</p>
            <p className="text-xs text-slate-500">
              Estimated arrival at your point: 10:30
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            ["Completed stops", "14", Check],
            ["Remaining stops", "4", Clock3],
            ["Your collection point", "Stop 18", MapPin],
            ["Collection status", "In Progress", Truck],
          ].map(([label, value, Icon]) => {
            const ItemIcon = Icon as LucideIcon
            return (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-5"
                key={label as string}
              >
                <ItemIcon className="text-emerald-700" size={18} />
                <p className="mt-4 text-xl font-bold">{value as string}</p>
                <p className="text-xs text-slate-500">{label as string}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function UnifiedProfileSettings({
  role,
  profile: sessionProfile,
}: {
  role: Role
  profile?: SessionProfile | null
}) {
  const [tab, setTab] = useState("Profile")
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState("")
  const [locationRequest, setLocationRequest] = useState(false)
  const roleProfiles = {
    Customer: {
      name: "Jean Romeo",
      id: "CUS-2048",
      role: "Customer",
      department: "Household service",
      phone: "+250 788 123 456",
      email: "jean.romeo@example.com",
      address: "KG 218, Nyarugunga, Kicukiro, Kigali",
      extra: "Household · Level 2",
    },
    Employee: {
      name: "Eric Niyonzima",
      id: "EMP-0104",
      role: "Driver",
      department: "Team Alpha",
      phone: "+250 788 304 112",
      email: "eric.niyonzima@ecoroute.rw",
      address: "Kicukiro, Kigali",
      extra: "License category C",
    },
    Finance: {
      name: "Claudine Uwase",
      id: "EMP-0021",
      role: "Finance Officer",
      department: "Finance & Billing",
      phone: "+250 788 420 116",
      email: "claudine.uwase@ecoroute.rw",
      address: "Kigali, Rwanda",
      extra: "Finance Operations",
    },
    Manager: {
      name: "Diane Mukamana",
      id: "EMP-0007",
      role: "Manager",
      department: "Operations",
      phone: "+250 788 112 204",
      email: "diane.mukamana@ecoroute.rw",
      address: "Kigali, Rwanda",
      extra: "Operations Command",
    },
    Admin: {
      name: "System Administrator",
      id: "ADM-0001",
      role: "Administrator",
      department: "Platform",
      phone: "+250 788 000 001",
      email: "admin@ecoroute.rw",
      address: "Kigali, Rwanda",
      extra: "System Administration",
    },
  }[role]
  const [details, setDetails] = useState({
    ...roleProfiles,
    name: sessionProfile?.name ?? roleProfiles.name,
    phone: sessionProfile?.phone ?? roleProfiles.phone,
    email: sessionProfile?.email ?? roleProfiles.email,
  })
  const [original, setOriginal] = useState(details)
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  })
  const [notifications, setNotifications] = useState({
    collection: true,
    payment: true,
    sms: true,
    service: true,
  })
  const [language, setLanguage] = useState("English")
  const [compact, setCompact] = useState(false)
  const initials = details.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
  const saveProfile = () => {
    if (details.address !== original.address) setLocationRequest(true)
    setOriginal(details)
    setEditing(false)
    setNotice("Profile information saved successfully.")
  }
  const tabs = ["Profile", "Account & Security", "Notifications", "Preferences"]
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((item) => (
          <button
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold ${
              tab === item
                ? "bg-emerald-700 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {notice && (
        <div className="flex items-center rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <Check size={17} className="mr-2" />
          {notice}
          <button className="ml-auto" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {tab === "Profile" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-800">
                {initials}
              </div>
              <div>
                <p className="text-xl font-bold">{details.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {role === "Customer" ? "Customer" : "Employee"} ID ·{" "}
                  {details.id}
                </p>
              </div>
              <button
                className="rounded-xl border border-emerald-700 px-4 py-2.5 text-sm font-bold text-emerald-800 sm:ml-auto"
                onClick={() => (editing ? saveProfile() : setEditing(true))}
              >
                {editing ? "Save" : "Edit personal information"}
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Full name", "name", "text"],
                ["Email", "email", "email"],
                ["Phone", "phone", "tel"],
                ["Home address", "address", "text"],
              ].map(([label, key, type]) => (
                <label className="text-xs font-bold text-slate-600" key={key}>
                  {label}
                  <input
                    className={`mt-1.5 w-full rounded-xl border p-3 text-sm ${
                      editing
                        ? "border-emerald-300"
                        : "border-slate-100 bg-slate-50 text-slate-600"
                    }`}
                    disabled={!editing}
                    onChange={(event) =>
                      setDetails({ ...details, [key]: event.target.value })
                    }
                    type={type}
                    value={details[(key as keyof typeof details)]}
                  />
                </label>
              ))}
            </div>
            {role === "Customer" && editing && (
              <label className="mt-4 block text-xs font-bold text-slate-600">
                Requested collection zone
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={() => setLocationRequest(true)}
                >
                  <option>Nyarugunga, Kicukiro</option>
                  <option>Gasaraba, Kicukiro</option>
                  <option>Kicukiro Central</option>
                  <option>Another configured zone</option>
                </select>
              </label>
            )}
            {editing && (
              <button
                className="mt-4 text-sm font-semibold text-slate-400"
                onClick={() => {
                  setDetails(original)
                  setEditing(false)
                }}
              >
                Cancel
              </button>
            )}
            {locationRequest && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                Location change request sent to Operations · Pending
              </div>
            )}
            <button
              className="mt-5 text-sm font-bold text-emerald-700"
              onClick={() => setTab("Account & Security")}
            >
              Manage password and account security
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center">
              <p className="font-bold">
                {role === "Customer"
                  ? "Waste-service information"
                  : "Work information"}
              </p>
              {role === "Customer" && (
                <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Active
                </span>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {(role === "Customer"
                ? [
                    ["Collection point", "CP-2048"],
                    ["Service type", "Household · Level 2"],
                    ["Frequency", "Every Monday"],
                    ["Assigned route", "Kicukiro-Nyarugunga Route"],
                    ["Waste allowance", "Up to 240 kg"],
                    ["Collection location", "Nyarugunga, Kicukiro"],
                  ]
                : role === "Employee"
                  ? [
                      ["Role", "Driver"],
                      ["Team", "Team Alpha"],
                      ["Vehicle", "RW 412 A"],
                      ["License", "Category C"],
                      ["Department", "Collection Operations"],
                    ]
                  : [
                      ["Role", details.role],
                      ["Department", details.department],
                      ["Employee ID", details.id],
                      ["Workspace", details.extra],
                    ]
              ).map(([label, value]) => (
                <div
                  className="flex border-b border-slate-100 pb-3 text-sm last:border-0"
                  key={label}
                >
                  <span className="text-slate-500">{label}</span>
                  <strong className="ml-auto text-right">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "Account & Security" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-bold">Account information</p>
            <div className="mt-4 space-y-4">
              <label className="block text-xs font-bold">
                Phone
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={details.phone}
                  onChange={(e) =>
                    setDetails({ ...details, phone: e.target.value })
                  }
                />
              </label>
              <label className="block text-xs font-bold">
                Email
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={details.email}
                  onChange={(e) =>
                    setDetails({ ...details, email: e.target.value })
                  }
                />
              </label>
              <button
                className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
                onClick={() =>
                  setNotice(
                    "Account information saved. SMS notifications will use the updated phone number.",
                  )
                }
              >
                Save account information
              </button>
            </div>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="font-bold">Change password</p>
              <div className="mt-4 space-y-3">
                {[
                  ["Current password", "current"],
                  ["New password", "next"],
                  ["Confirm new password", "confirm"],
                ].map(([label, key]) => (
                  <label className="block text-xs font-bold" key={key}>
                    {label}
                    <input
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-emerald-600 focus:outline-none"
                      type="password"
                      value={passwords[(key as keyof typeof passwords)]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [key]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>

              {/* Password strength rules */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs space-y-2">
                <p className="font-bold text-slate-700">Password Strength Rules</p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <span
                    className={
                      passwords.next.length >= 8
                        ? "text-emerald-700 font-bold"
                        : "text-slate-400"
                    }
                  >
                    {passwords.next.length >= 8 ? "✓" : "○"} At least 8 characters
                  </span>
                  <span
                    className={
                      /[A-Z]/.test(passwords.next)
                        ? "text-emerald-700 font-bold"
                        : "text-slate-400"
                    }
                  >
                    {/[A-Z]/.test(passwords.next) ? "✓" : "○"} Uppercase letter
                  </span>
                  <span
                    className={
                      /\d/.test(passwords.next)
                        ? "text-emerald-700 font-bold"
                        : "text-slate-400"
                    }
                  >
                    {/\d/.test(passwords.next) ? "✓" : "○"} Numeric digit (0-9)
                  </span>
                  <span
                    className={
                      /[!@#$%^&*]/.test(passwords.next)
                        ? "text-emerald-700 font-bold"
                        : "text-slate-400"
                    }
                  >
                    {/[!@#$%^&*]/.test(passwords.next) ? "✓" : "○"} Special symbol
                  </span>
                </div>
              </div>

              <button
                className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800"
                onClick={() => {
                  if (!passwords.next || passwords.next.length < 8) {
                    setNotice("Password must meet the 8-character minimum.")
                    return
                  }
                  if (passwords.next !== passwords.confirm) {
                    setNotice("New password and confirmation do not match.")
                    return
                  }
                  setNotice("Password changed successfully in accordance with security policy.")
                  setPasswords({ current: "", next: "", confirm: "" })
                }}
              >
                Change password
              </button>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-900 p-5 text-white">
            <ShieldCheck size={20} />
            <p className="mt-4 font-bold">Security & login sessions</p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex">
                <span className="text-emerald-100">Current session</span>
                <strong className="ml-auto">Kigali · Active</strong>
              </div>
              <div className="flex">
                <span className="text-emerald-100">Last login</span>
                <strong className="ml-auto">Today · 08:42</strong>
              </div>
            </div>
            <button
              className="mt-6 w-full rounded-xl bg-white/10 py-3 text-xs font-bold"
              onClick={() =>
                setNotice("Other devices signed out successfully.")
              }
            >
              Sign out other devices
            </button>
          </div>
        </div>
      )}
      {tab === "Notifications" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold">Notification settings</p>
          <p className="mt-1 text-sm text-slate-500">
            SMS messages will be sent to {details.phone}.
          </p>
          <div className="mt-5 divide-y divide-slate-100">
            {[
              ["collection", "Collection reminders"],
              ["payment", "Payment notifications"],
              ["sms", "SMS"],
              ["service", "Service updates"],
            ].map(([key, label]) => (
              <label
                className="flex items-center py-4 text-sm font-semibold"
                key={key}
              >
                {label}
                <input
                  className="ml-auto size-5 accent-emerald-700"
                  type="checkbox"
                  checked={notifications[(key as keyof typeof notifications)]}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      [key]:
                        !notifications[(key as keyof typeof notifications)],
                    })
                  }
                />
              </label>
            ))}
          </div>
          <button
            className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
            onClick={() => setNotice("Notification settings saved.")}
          >
            Save notification settings
          </button>
        </div>
      )}
      {tab === "Preferences" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold">Display preferences</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Language
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Kinyarwanda</option>
                <option>French</option>
              </select>
            </label>
            <label className="flex items-center rounded-xl border border-slate-200 p-4 text-sm font-semibold">
              Compact page view
              <input
                className="ml-auto size-5 accent-emerald-700"
                type="checkbox"
                checked={compact}
                onChange={() => setCompact(!compact)}
              />
            </label>
          </div>
          <button
            className="mt-5 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
            onClick={() => setNotice("Preferences saved.")}
          >
            Save preferences
          </button>
        </div>
      )}
    </div>
  )
}

function CustomerRouteMap({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#e5efe4] ${
        compact ? "min-h-64" : "min-h-[420px]"
      }`}
    >
      <div className="absolute inset-0 map-grid" />
      <div className="absolute left-[18%] top-[-10%] h-[130%] w-3 rotate-[24deg] rounded-full bg-white" />
      <div className="absolute left-[-5%] top-[42%] h-3 w-[115%] -rotate-[8deg] rounded-full bg-white" />
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 700 420"
      >
        <path
          d="M45 350 C155 320 120 115 275 175 S430 330 650 60"
          fill="none"
          stroke="#047857"
          strokeWidth="5"
        />
      </svg>
      <span className="absolute left-[16%] top-[68%] grid size-10 place-items-center rounded-full border-4 border-white bg-emerald-700 text-white shadow">
        <Truck size={17} />
      </span>
      <span className="absolute right-[8%] top-[12%] grid size-11 place-items-center rounded-full border-4 border-white bg-emerald-700 text-white shadow">
        <MapPin size={18} />
      </span>
      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white p-4 shadow-lg">
        <p className="text-xs font-bold text-emerald-800">
          Kicukiro-Nyarugunga Route
        </p>
        <p className="mt-1 text-sm font-bold">
          Team Alpha · RW 412 A · Eric Niyonzima
        </p>
        <p className="text-xs text-slate-500">
          Collection point CP-2048 · Stop 18 of 18
        </p>
      </div>
    </div>
  )
}

function CustomerMyCollectionPage({
  onPage,
}: {
  onPage: (page: string) => void
}) {
  const [tab, setTab] = useState(
    () => localStorage.getItem("ecoroute-collection-tab") ?? "Overview",
  )
  useEffect(() => localStorage.removeItem("ecoroute-collection-tab"), [])
  const [status, setStatus] = useState(
    () =>
      localStorage.getItem("ecoroute-customer-collection-status") ??
      "Scheduled",
  )
  useEffect(() => {
    const sync = () =>
      setStatus(
        localStorage.getItem("ecoroute-customer-collection-status") ??
          "Scheduled",
      )
    window.addEventListener("ecoroute-status", sync)
    return () => window.removeEventListener("ecoroute-status", sync)
  }, [])
  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {["Overview", "Route & Map", "Location"].map((item) => (
          <button
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold ${
              tab === item
                ? "bg-emerald-700 text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <>
          <div className="rounded-2xl bg-emerald-900 p-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Current collection
                </p>
                <p className="mt-2 text-2xl font-bold">
                  Monday, 05 October 2026
                </p>
                <p className="mt-1 text-sm text-emerald-100">
                  08:00–11:00 · KG 218, Nyarugunga, Kicukiro
                </p>
              </div>
              <span className="self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-900 sm:ml-auto">
                {status}
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Collection point", "CP-2048"],
                ["Route", "Kicukiro-Nyarugunga Route"],
                ["Vehicle", "RW 412 A"],
                ["Collection team", "Team Alpha"],
                ["Driver", "Eric Niyonzima"],
                ["Frequency", "Every Monday"],
                ["Service", "Household · Level 2"],
                ["Waste allowance", "Up to 240 kg"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-emerald-200">{label}</p>
                  <p className="mt-1 text-sm font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-bold">Collection status</p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Scheduled", "On the way", "Collected"].map((item, index) => {
                  const current = [
                    "Scheduled",
                    "On the way",
                    "Collected",
                  ].indexOf(status)
                  return (
                    <div key={item}>
                      <div
                        className={`h-2 rounded-full ${
                          index <= current ? "bg-emerald-700" : "bg-slate-100"
                        }`}
                      />
                      <p className="mt-2 text-xs font-semibold text-slate-600">
                        {item}
                      </p>
                    </div>
                  )
                })}
              </div>
              <p className="mt-5 text-sm text-slate-500">
                Driver updates from Eric Niyonzima appear here immediately.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Next collection
              </p>
              <p className="mt-2 text-xl font-bold">Monday, 05 October</p>
              <p className="mt-1 text-sm text-slate-600">
                08:00–11:00 · Nyarugunga
              </p>
              <button
                className="mt-4 text-sm font-bold text-emerald-800"
                onClick={() => onPage("My Schedule / History")}
              >
                Open schedule and history
              </button>
            </div>
          </div>
        </>
      )}
      {tab === "Route & Map" && (
        <div className="space-y-4">
          <CustomerRouteMap />
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["Team", "Team Alpha"],
              ["Vehicle", "RW 412 A"],
              ["Driver", "Eric Niyonzima"],
              ["Stop progress", "18 stops · CP-2048"],
            ].map(([label, value]) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-4"
                key={label}
              >
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "Location" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <CustomerRouteMap compact />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-bold">My collection location</p>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Address", "KG 218, Nyarugunga, Kicukiro, Kigali"],
                ["Collection point", "CP-2048"],
                ["Configured zone", "Nyarugunga, Kicukiro"],
                ["Pickup window", "Every Monday · 08:00–11:00"],
              ].map(([label, value]) => (
                <div className="border-b border-slate-100 pb-3" key={label}>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 font-bold">{value}</p>
                </div>
              ))}
            </div>
            <a
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
              href="https://www.google.com/maps/search/?api=1&query=KG%20218%2C%20Nyarugunga%2C%20Kicukiro%2C%20Kigali"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={16} />
              View on Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

type ScheduleEntry = {
  day: number
  month: "September" | "October"
  status: "Scheduled" | "Completed" | "Missed"
  time: string
  reason?: string
  collected?: string
}
const customerSchedule: ScheduleEntry[] = [
  { day: 5, month: "October", status: "Scheduled", time: "08:00–11:00" },
  { day: 12, month: "October", status: "Scheduled", time: "08:00–11:00" },
  { day: 19, month: "October", status: "Scheduled", time: "08:00–11:00" },
  { day: 26, month: "October", status: "Scheduled", time: "08:00–11:00" },
  {
    day: 28,
    month: "September",
    status: "Completed",
    time: "08:00–11:00",
    collected: "08:42",
  },
  {
    day: 21,
    month: "September",
    status: "Completed",
    time: "08:00–11:00",
    collected: "09:06",
  },
  {
    day: 14,
    month: "September",
    status: "Missed",
    time: "08:00–11:00",
    reason: "Vehicle breakdown",
    collected: "Rescheduled and completed 15 Sep",
  },
]

function CustomerSchedulePage({ onPage }: { onPage: (page: string) => void }) {
  const [view, setView] = useState("Month")
  const [month, setMonth] = useState<"September" | "October">("October")
  const [selected, setSelected] = useState<ScheduleEntry | {
    day: number
    month: "September" | "October"
  }>({ day: 5, month: "October", status: "Scheduled", time: "08:00–11:00" })
  const [listTab, setListTab] = useState("Upcoming")
  const [reminderOpen, setReminderOpen] = useState(false)
  const [reminder, setReminder] = useState<{
    time: string
    app: boolean
    sms: boolean
  } | null>(null)
  const [draftReminder, setDraftReminder] = useState({
    time: "1 hour before",
    app: true,
    sms: true,
  })
  const [status, setStatus] = useState(
    () =>
      localStorage.getItem("ecoroute-customer-collection-status") ??
      "Scheduled",
  )
  useEffect(() => {
    const sync = () =>
      setStatus(
        localStorage.getItem("ecoroute-customer-collection-status") ??
          "Scheduled",
      )
    window.addEventListener("ecoroute-status", sync)
    return () => window.removeEventListener("ecoroute-status", sync)
  }, [])
  const daysInMonth = month === "October" ? 31 : 30
  const leading = month === "October" ? 3 : 1
  const entries = customerSchedule.filter((item) => item.month === month)
  const openRequest = (type: string) => {
    localStorage.setItem(
      "ecoroute-request-prefill",
      JSON.stringify({
        type,
        date: `${(selected as ScheduleEntry).day ?? 5} ${month} 2026`,
        reason:
          type === "Missed collection"
            ? "Collection was not completed as scheduled"
            : "Please request a new collection time",
      }),
    )
    onPage("Request Service")
  }
  const downloadHistory = () => {
    const text =
      "Date,Status,Collected time,Reason\n28 Sep 2026,Completed,08:42,\n21 Sep 2026,Completed,09:06,\n14 Sep 2026,Missed,,Vehicle breakdown; rescheduled and completed 15 Sep"
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "Jean-Romeo-collection-history.csv"
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-emerald-900 p-5 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Upcoming collection
            </p>
            <p className="mt-2 text-2xl font-bold">Monday, 05 October</p>
            <p className="mt-1 text-sm text-emerald-100">
              08:00–11:00 · KG 218, Nyarugunga, Kicukiro
            </p>
          </div>
          <span className="self-start rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-emerald-950 sm:ml-auto">
            Today
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {["Scheduled", "On the way", "Collected"].map((item, index) => {
            const current = ["Scheduled", "On the way", "Collected"].indexOf(
              status,
            )
            return (
              <div key={item}>
                <div
                  className={`h-2 rounded-full ${
                    index <= current ? "bg-white" : "bg-white/20"
                  }`}
                />
                <p className="mt-2 text-xs text-emerald-100">{item}</p>
              </div>
            )
          })}
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <button
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900"
            onClick={() => onPage("My Collection")}
          >
            View collection
          </button>
          <button
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold"
            onClick={() => {
              onPage("My Collection")
              localStorage.setItem("ecoroute-collection-tab", "Route & Map")
            }}
          >
            View route
          </button>
          <a
            className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold"
            href="https://www.google.com/maps/search/?api=1&query=KG%20218%2C%20Nyarugunga%2C%20Kicukiro%2C%20Kigali"
            rel="noreferrer"
            target="_blank"
          >
            <MapPin className="mr-1.5 inline" size={14} />
            Google Maps
          </a>
          <button
            className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
              reminder ? "bg-emerald-500 text-emerald-950" : "bg-white/10"
            }`}
            onClick={() => setReminderOpen(!reminderOpen)}
          >
            {reminder ? (
              <>
                <Check className="mr-1 inline" size={14} />
                Reminder set
              </>
            ) : (
              "Set reminder"
            )}
          </button>
          {reminderOpen && (
            <div className="absolute left-0 top-12 z-10 w-full max-w-sm rounded-2xl bg-white p-4 text-slate-900 shadow-xl ring-1 ring-slate-200">
              <p className="font-bold">Collection reminder</p>
              <div className="mt-3 space-y-2">
                {[
                  "1 hour before",
                  "Evening before (18:00)",
                  "Morning of (06:30)",
                ].map((time) => (
                  <label className="flex items-center text-sm" key={time}>
                    <input
                      className="mr-2 accent-emerald-700"
                      type="radio"
                      checked={draftReminder.time === time}
                      onChange={() =>
                        setDraftReminder({ ...draftReminder, time })
                      }
                    />
                    {time}
                  </label>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <label className="flex items-center text-sm">
                  App notification
                  <input
                    className="ml-auto accent-emerald-700"
                    type="checkbox"
                    checked={draftReminder.app}
                    onChange={() =>
                      setDraftReminder({
                        ...draftReminder,
                        app: !draftReminder.app,
                      })
                    }
                  />
                </label>
                <label className="mt-2 flex items-center text-sm">
                  SMS to +250 788 123 456
                  <input
                    className="ml-auto accent-emerald-700"
                    type="checkbox"
                    checked={draftReminder.sms}
                    onChange={() =>
                      setDraftReminder({
                        ...draftReminder,
                        sms: !draftReminder.sms,
                      })
                    }
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                  onClick={() => {
                    setReminder(draftReminder)
                    setReminderOpen(false)
                  }}
                >
                  {reminder ? "Save changes" : "Save reminder"}
                </button>
                {reminder && (
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                    onClick={() => {
                      setReminder(null)
                      setReminderOpen(false)
                    }}
                  >
                    Remove reminder
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {reminder && (
          <p className="mt-4 flex items-center text-xs text-emerald-100">
            <Check size={14} className="mr-2" />A collection reminder will be
            sent {reminder.time} by{" "}
            {reminder.app && reminder.sms
              ? "app notification and SMS"
              : reminder.sms
                ? "SMS"
                : "app notification"}
            .
          </p>
        )}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous month"
                className="grid size-9 place-items-center rounded-lg border border-slate-200"
                onClick={() => setMonth("September")}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                aria-label="Next month"
                className="grid size-9 place-items-center rounded-lg border border-slate-200"
                onClick={() => setMonth("October")}
              >
                <ChevronRight size={17} />
              </button>
              <button
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                onClick={() => {
                  setMonth("October")
                  setSelected({
                    day: 5,
                    month: "October",
                    status: "Scheduled",
                    time: "08:00–11:00",
                  })
                }}
              >
                Today
              </button>
              <p className="ml-2 font-bold">{month} 2026</p>
            </div>
            <div className="flex rounded-xl bg-slate-50 p-1 sm:ml-auto">
              {["Month", "Week", "Day"].map((item) => (
                <button
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${
                    view === item
                      ? "bg-white text-emerald-800 shadow"
                      : "text-slate-400"
                  }`}
                  key={item}
                  onClick={() => setView(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {view === "Month" && (
            <>
              <div className="mt-5 grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span className="py-2" key={d}>
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: leading }).map((_, i) => (
                  <span
                    className="min-h-16 rounded-lg bg-slate-50"
                    key={`blank-${i}`}
                  />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const entry = entries.find((e) => e.day === day)
                    const today = month === "October" && day === 5
                    return (
                      <button
                        className={`min-h-16 rounded-lg border p-1 text-left text-xs ${
                          today ? "ring-2 ring-emerald-700 ring-offset-1" : ""
                        } ${
                          entry?.status === "Completed"
                            ? "border-emerald-100 bg-emerald-50"
                            : entry?.status === "Missed"
                              ? "border-rose-400 bg-white text-rose-700"
                              : entry
                                ? "border-emerald-200 bg-emerald-100 text-emerald-900"
                                : "border-slate-100 hover:bg-slate-50"
                        }`}
                        key={day}
                        onClick={() => setSelected(entry ?? { day, month })}
                      >
                        <span className="font-bold">{day}</span>
                        {entry && (
                          <span className="mt-1 block text-[9px] font-bold">
                            {entry.status === "Completed"
                              ? "✓ Completed"
                              : entry.status}
                          </span>
                        )}
                      </button>
                    )
                  },
                )}
              </div>
            </>
          )}
          {view === "Week" && (
            <div className="mt-5 grid gap-2 sm:grid-cols-7">
              {[
                "Mon 5",
                "Tue 6",
                "Wed 7",
                "Thu 8",
                "Fri 9",
                "Sat 10",
                "Sun 11",
              ].map((day, i) => (
                <button
                  className={`min-h-28 rounded-xl border p-3 text-left ${
                    i === 0
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-100"
                  }`}
                  key={day}
                  onClick={() =>
                    setSelected(
                      i === 0
                        ? customerSchedule[0]
                        : { day: 5 + i, month: "October" },
                    )
                  }
                >
                  <p className="text-xs font-bold">{day}</p>
                  {i === 0 && (
                    <div className="mt-3 rounded-lg bg-emerald-700 p-2 text-[10px] font-bold text-white">
                      08:00–11:00
                      <br />
                      Collection
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
          {view === "Day" && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Monday, 05 October
              </p>
              <p className="mt-2 text-xl font-bold">08:00–11:00 · Scheduled</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Location", "KG 218, Nyarugunga, Kicukiro"],
                  ["Route", "Kicukiro-Nyarugunga Route"],
                  ["Vehicle", "RW 412 A"],
                  ["Driver", "Eric Niyonzima · Team Alpha"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>
              <span className="mr-1 inline-block size-2 rounded-full bg-emerald-600" />
              Scheduled
            </span>
            <span>
              <Check size={12} className="mr-1 inline text-emerald-600" />
              Completed
            </span>
            <span>
              <span className="mr-1 inline-block size-2 rounded-full border border-rose-500" />
              Missed
            </span>
            <span>
              <span className="mr-1 inline-block size-2 rounded-full ring-2 ring-emerald-700" />
              Today
            </span>
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            {"status" in selected ? (
              <>
                <p className="font-bold">
                  {selected.day} {selected.month} 2026 · {selected.status}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.time} · KG 218, Nyarugunga, Kicukiro
                </p>
                {selected.reason && (
                  <p className="mt-2 text-sm font-semibold text-rose-700">
                    Reason: {selected.reason}. {selected.collected}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-bold">
                  {selected.day} {selected.month} 2026
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  No collection scheduled.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex border-b border-slate-100 p-2">
            {["Upcoming", "History"].map((item) => (
              <button
                className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${
                  listTab === item
                    ? "bg-emerald-700 text-white"
                    : "text-slate-500"
                }`}
                key={item}
                onClick={() => setListTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="space-y-2 p-4">
            {customerSchedule
              .filter((e) =>
                listTab === "Upcoming"
                  ? e.month === "October"
                  : e.month === "September",
              )
              .map((entry) => (
                <button
                  className="w-full rounded-xl border border-slate-100 p-3 text-left hover:border-emerald-300"
                  key={`${entry.month}-${entry.day}`}
                  onClick={() => {
                    setMonth(entry.month)
                    setSelected(entry)
                  }}
                >
                  <div className="flex">
                    <p className="text-sm font-bold">
                      {entry.day} {entry.month}
                    </p>
                    <span
                      className={`ml-auto rounded-full px-2 py-1 text-[10px] font-bold ${
                        entry.status === "Missed"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {entry.status === "Completed"
                      ? `Collected at ${entry.collected}`
                      : `${entry.time} · Nyarugunga`}
                  </p>
                  {entry.reason && (
                    <p className="mt-1 text-xs font-semibold text-rose-700">
                      {entry.reason} · {entry.collected}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] text-slate-400">
                    Kicukiro-Nyarugunga Route
                  </p>
                </button>
              ))}
            {listTab === "History" && (
              <button
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 px-3 py-2.5 text-xs font-bold text-emerald-800"
                onClick={downloadHistory}
              >
                <Download size={14} />
                Download history
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.45fr]">
        <CustomerRouteMap compact />
        <div className="flex flex-col gap-3">
          <a
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
            href="https://www.google.com/maps/search/?api=1&query=KG%20218%2C%20Nyarugunga%2C%20Kicukiro%2C%20Kigali"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin size={16} />
            View on map
          </a>
          <button
            className="rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-700"
            onClick={() => openRequest("Missed collection")}
          >
            Report missed collection
          </button>
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
            onClick={() => openRequest("Request reschedule")}
          >
            Request reschedule
          </button>
        </div>
      </div>
    </div>
  )
}

function CustomerAIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "ai",
      text: "Hi Jean Romeo, how can I assist you today? I can help with your next collection, current bill, payment history, route progress, collection point, messages, or service requests.",
    },
  ])
  const [question, setQuestion] = useState("")
  const [typing, setTyping] = useState(false)
  const answer = (value: string) => {
    const query = value.toLowerCase()
    if (/^(hi|hy|hello|hey)\b/.test(query))
      return "Hi Jean Romeo, how can I assist you? You can ask about your collection schedule, route, payment, invoice, collection point, messages, or request a service."
    if (
      query.includes("next collection") ||
      query.includes("next pickup") ||
      (query.includes("when") && query.includes("collect"))
    )
      return "Your next waste collection is scheduled for Monday, 05 October 2026, between 08:00 and 11:00. The collection point is CP-2048 in Nyarugunga, Kicukiro. Your assigned route is Kicukiro-Nyarugunga Route, vehicle RW 412 A, with Team Alpha."
    if (
      query.includes("how much") ||
      query.includes("need to pay") ||
      query.includes("bill") ||
      query.includes("amount due")
    )
      return "Your current waste collection bill is RWF 6,000 for the September 2026 service period. Invoice INV-2026-00125 is outstanding and due on 10 October 2026. Open Payment and select Pay Now to use MTN Mobile Money or Airtel Money."
    if (
      query.includes("did you collect") ||
      query.includes("collect my waste today") ||
      (query.includes("today") && query.includes("waste"))
    )
      return "Your collection has not been completed yet. Kicukiro-Nyarugunga Route is In Progress at stop 14 of 18. Your collection point is stop 18, and the estimated arrival is 10:30. The vehicle is RW 412 A with Eric N. and Team Alpha."
    if (
      query.includes("show my payment") ||
      query.includes("payment history") ||
      query.includes("last payment") ||
      query.includes("receipt")
    )
      return "Your latest successful payment is transaction TXN-2026-10482 for RWF 6,000, invoice INV-2026-00125, paid by MTN Mobile Money on 04 October 2026. You can open My Payments / Invoices to view or download the receipt."
    if (
      query.includes("missed") ||
      query.includes("not collected") ||
      query.includes("what should i do")
    )
      return "If your collection was missed, open Request Service and choose Missed collection. Confirm collection point CP-2048, describe what happened, and submit it for Manager review. You will receive a service-request reference and updates through Notifications and SMS."
    if (
      query.includes("route") ||
      query.includes("vehicle") ||
      query.includes("where")
    )
      return "Your active route is Kicukiro-Nyarugunga Route. Vehicle RW 412 A is at stop 14 of 18 with Eric N. and Team Alpha. Your collection point is stop 18. Current status is In Progress, with estimated arrival at 10:30. Open My Collection > Route & Map to see the vehicle map."
    if (
      query.includes("location") ||
      query.includes("collection point") ||
      query.includes("address")
    )
      return "Your registered collection point is CP-2048 in Nyarugunga, Kicukiro. Service frequency is weekly, and the assigned route is Kicukiro-Nyarugunga Route. Open My Collection > Location to view it or request a location change."
    if (
      query.includes("message") ||
      query.includes("sms") ||
      query.includes("notification")
    )
      return "Your SMS page contains collection reminders, payment confirmations, collection-completed notices, payment reminders, service-request updates and route-delay messages from EcoRoute, the Manager and assigned employees. You currently have one unread service update."
    if (
      query.includes("service request") ||
      query.includes("help") ||
      query.includes("support")
    )
      return "You can request a missed collection, extra collection, collection-detail change, location change or payment help from Request Service. Submitted requests go to the Manager for review, and updates appear in Notifications and SMS."
    if (query.includes("profile") || query.includes("account"))
      return "Your customer account is active. Customer: Jean Romeo. Collection point: CP-2048, Nyarugunga, Kicukiro. Service plan: weekly household collection with a 240 kg allowance. You can update contact information or security settings from Profile and Settings."
    if (
      query.includes("website") ||
      query.includes("system") ||
      query.includes("what can")
    )
      return "EcoRoute lets you view your dashboard, profile, collections, schedule, location, route progress, bills, payment history, notifications, SMS messages, service requests, support and account settings. Ask me about any of those pages and I will use your customer account information."
    return "I can answer questions using your EcoRoute customer account. Try asking: When is my next collection? How much do I need to pay? Did you collect my waste today? Show my payment. Where is the vehicle? Or, I missed my collection—what should I do?"
  }
  const ask = (value: string) => {
    const clean = value.trim()
    if (!clean || typing) return
    setMessages((current) => [...current, { from: "user", text: clean }])
    setQuestion("")
    setTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { from: "ai", text: answer(clean) },
      ])
      setTyping(false)
    }, 900)
  }
  const suggestions = [
    "When is my next collection?",
    "How much do I need to pay?",
    "Did you collect my waste today?",
    "Show my payment.",
    "I missed my collection. What should I do?",
    "When is my next pickup?",
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.38fr]">
      <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center border-b border-slate-100 p-5">
          <div className="grid size-11 place-items-center rounded-2xl bg-emerald-700 text-white">
            <Sparkles size={20} />
          </div>
          <div className="ml-3">
            <p className="font-bold">My EcoRoute Assistant</p>
            <p className="text-xs text-slate-500">
              Answers based on Jean Romeo’s customer account · Prototype data
            </p>
          </div>
          <span className="ml-auto flex items-center gap-2 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-600" />
            Online
          </span>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8faf8] p-5">
          {messages.map((message, index) => (
            <div
              className={`flex ${
                message.from === "user" ? "justify-end" : "justify-start"
              }`}
              key={`${message.from}-${index}`}
            >
              <div
                className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.from === "user"
                    ? "rounded-br-sm bg-emerald-800 text-white"
                    : "rounded-bl-sm border border-emerald-100 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-emerald-100 bg-white px-4 py-4 shadow-sm">
                <span className="size-2 animate-bounce rounded-full bg-emerald-600" />
                <span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:150ms]" />
                <span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:300ms]" />
                <span className="ml-2 text-xs text-slate-400">
                  Your assistant is typing…
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-end gap-2">
            <textarea
              className="min-h-12 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  ask(question)
                }
              }}
              placeholder="Ask about your collection, route, bill or account..."
              value={question}
            />
            <button
              aria-label="Send question"
              className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white disabled:opacity-50"
              disabled={typing}
              onClick={() => ask(question)}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Press Enter to send. The assistant uses your prototype customer
            information.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Ask about your service
          </p>
          <div className="mt-3 space-y-2">
            {suggestions.map((item) => (
              <button
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
                disabled={typing}
                key={item}
                onClick={() => ask(item)}
              >
                {item}
                <ChevronRight
                  className="float-right text-emerald-700"
                  size={16}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-900 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Your account snapshot
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex">
              <span className="text-emerald-100">Next collection</span>
              <strong className="ml-auto">Oct 05 · 08:00</strong>
            </div>
            <div className="flex">
              <span className="text-emerald-100">Current bill</span>
              <strong className="ml-auto">RWF 6,000</strong>
            </div>
            <div className="flex">
              <span className="text-emerald-100">Route</span>
              <strong className="ml-auto">Kicukiro-Nyarugunga · 14/18</strong>
            </div>
            <div className="flex">
              <span className="text-emerald-100">Collection point</span>
              <strong className="ml-auto">CP-2048</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceRequestWorkflow() {
  const prefill = JSON.parse(
    localStorage.getItem("ecoroute-request-prefill") ?? "null",
  ) as { type?: string; date?: string; reason?: string } | null
  const [tab, setTab] = useState("Request Service")
  const [sent, setSent] = useState(false)
  const [type, setType] = useState(prefill?.type ?? "Missed collection")
  const [date, setDate] = useState(prefill?.date ?? "05 October 2026")
  const [reason, setReason] = useState(prefill?.reason ?? "")
  const submit = () => {
    localStorage.removeItem("ecoroute-request-prefill")
    setSent(true)
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {["Request Service", "Help & Support"].map((item) => (
          <button
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold ${
              tab === item ? "bg-emerald-700 text-white" : "text-slate-500"
            }`}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Request Service" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {sent ? (
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Check size={18} />
              </div>
              <div>
                <p className="font-bold">Request sent to Operations</p>
                <p className="mt-1 text-sm text-slate-500">
                  Reference SR-1048 · Status: Submitted. You will receive an
                  update after Manager review.
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="font-bold">New service request</p>
              <p className="mt-1 text-sm text-slate-500">
                Requests apply only to collection point CP-2048.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-bold">
                  Request type
                  <select
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Missed collection</option>
                    <option>Request reschedule</option>
                    <option>Extra collection</option>
                    <option>Location change</option>
                    <option>Payment issue</option>
                  </select>
                </label>
                <label className="text-xs font-bold">
                  Collection date
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </label>
                <label className="text-xs font-bold sm:col-span-2">
                  Reason
                  <textarea
                    className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe your request..."
                  />
                </label>
              </div>
              <button
                className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
                onClick={submit}
              >
                Submit for Manager review
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <MessageSquareText className="text-emerald-700" />
            <p className="mt-4 font-bold">Customer support</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Get help with your household service, collection point, invoices
              or account access.
            </p>
            <button
              className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
              onClick={() => {
                setTab("Request Service")
                setType("Extra collection")
              }}
            >
              Contact support
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-bold">Service details</p>
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <strong>Collection point:</strong> CP-2048
              </p>
              <p>
                <strong>Schedule:</strong> Every Monday · 08:00–11:00
              </p>
              <p>
                <strong>Location:</strong> Nyarugunga, Kicukiro
              </p>
              <p>
                <strong>Phone:</strong> +250 788 123 456
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmployeeWorkflow({ page }: { page: string }) {
  const isTrip = page === "Nduba Landfill" || page === "Trip Management"
  const isRoute = page === "My Routes"
  const stages = isTrip
    ? ["Not started", "En route", "Arrived at Nduba", "Completed"]
    : isRoute
      ? ["Assigned", "Started", "Stops in progress", "Completed"]
      : ["Scheduled", "In progress", "Completed", "Needs review"]
  const [stage, setStage] = useState(0)
  const advance = () => {
    const next = Math.min(stage + 1, 3)
    setStage(next)
    if (!isTrip && !isRoute) {
      const customerStatus =
        next === 1 ? "On the way" : next >= 2 ? "Collected" : "Scheduled"
      localStorage.setItem(
        "ecoroute-customer-collection-status",
        customerStatus,
      )
      window.dispatchEvent(new Event("ecoroute-status"))
    }
  }
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold text-slate-900">
            {isTrip
              ? "Nduba trip · TRIP-2404"
              : isRoute
                ? "Assigned route · KG 45"
                : "Collection · COL-8742"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isTrip
              ? "RW 412 A · 2.4 tonne load"
              : isRoute
                ? "RW 412 A · 18 ordered stops · Team Alpha"
                : "Green Hills Residence · KG 45"}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-800">
          {stages[stage]}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {stages.map((item, index) => (
          <div key={item}>
            <div
              className={`h-2 rounded-full ${
                index <= stage ? "bg-emerald-700" : "bg-white"
              }`}
            />
            <p className="mt-2 hidden text-[10px] text-slate-500 sm:block">
              {item}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          disabled={stage >= 3}
          onClick={advance}
        >
          {isTrip
            ? stage === 0
              ? "Start trip"
              : stage === 1
                ? "Record arrival"
                : "Complete trip"
            : isRoute
              ? stage === 0
                ? "Start route"
                : stage < 2
                  ? "Continue to next stop"
                  : "Complete route"
              : stage === 0
                ? "Start collection"
                : "Complete collection"}
        </button>
        {!isTrip && !isRoute && (
          <button
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
            onClick={() => setStage(3)}
          >
            Report issue
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Status changes are shared with Manager Operations and the relevant
        customer.
      </p>
    </div>
  )
}

function ContextWorkflow({ role, page }: { role: Role; page: string }) {
  if (role === "Manager" && page === "AI EcoRoute") return <AIWorkflow />
  if (role === "Manager" && page === "Live Operations")
    return <RouteVisual role={role} />
  if (role === "Customer" && page === "Payment") return <CustomerPayment />
  if (role === "Customer" && page === "Request service")
    return <ServiceRequestWorkflow />
  if (role === "Customer" && page === "Route")
    return <RouteVisual role={role} />
  if (
    role === "Employee" &&
    ["Collection Status", "Trip Management", "Nduba Trip"].includes(page)
  )
    return <EmployeeWorkflow page={page} />
  if (role === "Employee" && page === "My Route")
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <RouteVisual role={role} />
        <EmployeeWorkflow page={page} />
      </div>
    )
  return null
}

type CustomerRecord = {
  id: string
  name: string
  phone: string
  location: string
  route: string
  balance: string
  status: string
  company?: string
}

const initialCustomers: CustomerRecord[] = [
  {
    id: "CUS-2048",
    name: "Jean Romeo",
    phone: "+250 788 123 456",
    location: "KG 218, Nyarugunga, Kicukiro",
    route: "Kicukiro-Nyarugunga Route",
    balance: "RWF 0",
    status: "Active",
  },
  {
    id: "CUS-2049",
    name: "Aline Uwase",
    phone: "+250 783 222 410",
    location: "Kimironko, Gasabo",
    route: "KG 11",
    balance: "RWF 18,000",
    status: "Payment due",
  },
  {
    id: "CUS-2050",
    name: "Patrick Habimana",
    phone: "+250 720 087 114",
    location: "Gikondo, Kicukiro",
    route: "KK 15",
    balance: "RWF 0",
    status: "Active",
  },
  {
    id: "CUS-2051",
    name: "Green Hills Residence",
    phone: "+250 788 560 014",
    location: "Kibagabaga, Gasabo",
    route: "KG 18",
    balance: "RWF 36,000",
    status: "Payment due",
  },
]

function Overlay({
  children,
  onClose,
  wide = false,
}: {
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-5">
        <div
          className={`relative w-full rounded-3xl bg-white p-6 shadow-2xl ${
            wide ? "max-w-5xl" : "max-w-xl"
          }`}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-950"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

function CustomerDetails({
  customer,
  onClose,
}: {
  customer: CustomerRecord
  onClose: () => void
}) {
  const [tab, setTab] = useState("Overview")
  return (
    <Overlay onClose={onClose} wide>
      <div className="pr-12">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          {customer.id}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">
          {customer.name}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {customer.location} · Route {customer.route}
        </p>
      </div>
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
        {["Overview", "Collections", "Payments", "Activity"].map((item) => (
          <button
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${
              tab === item
                ? "border-emerald-700 text-emerald-800"
                : "border-transparent text-slate-400"
            }`}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Overview" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            ["Phone", customer.phone],
            ["Collection point", "CP-" + customer.id.slice(4)],
            ["Service", "Weekly household"],
            ["Route", customer.route],
            ["Account balance", customer.balance],
            ["Service status", customer.status],
            ["Assigned company", customer.company || "Simate Garbage Ltd"],
          ].map(([label, value]) => (
            <div className="rounded-xl bg-slate-50 p-4" key={label}>
              <p className="text-xs font-semibold text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "Collections" && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          {[
            ["COL-8742", "Oct 05, 2026", "Scheduled", "08:00–11:00"],
            ["COL-8618", "Sep 28, 2026", "Completed", "08:42"],
            ["COL-8477", "Sep 21, 2026", "Completed", "09:06"],
            [
              "COL-8324",
              "Sep 14, 2026",
              "Missed",
              "Vehicle breakdown · completed Sep 15",
            ],
          ].map((row) => (
            <div
              className="grid grid-cols-2 gap-2 border-b border-slate-100 p-4 text-sm last:border-0 sm:grid-cols-4"
              key={row[0]}
            >
              <strong>{row[0]}</strong>
              <span className="text-slate-500">{row[1]}</span>
              <span className="font-semibold text-emerald-700">{row[2]}</span>
              <span className="text-slate-500">{row[3]}</span>
            </div>
          ))}
        </div>
      )}
      {tab === "Payments" && (
        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-2xl bg-emerald-800 p-5 text-white">
            <CreditCard size={20} />
            <p className="mt-5 text-xs text-emerald-100">
              Total paid this year
            </p>
            <p className="mt-1 text-2xl font-bold">RWF 162,000</p>
            <p className="mt-5 text-xs text-emerald-100">Current balance</p>
            <p className="mt-1 text-xl font-bold">{customer.balance}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            {[
              ["TXN-90284", "Sep 26, 2026", "RWF 18,000", "MTN MoMo", "Paid"],
              [
                "TXN-88104",
                "Aug 27, 2026",
                "RWF 18,000",
                "Airtel Money",
                "Paid",
              ],
              ["TXN-86229", "Jul 25, 2026", "RWF 18,000", "MTN MoMo", "Paid"],
            ].map((row) => (
              <div
                className="grid grid-cols-2 gap-2 border-b border-slate-100 p-4 text-xs last:border-0 sm:grid-cols-5"
                key={row[0]}
              >
                <strong>{row[0]}</strong>
                <span>{row[1]}</span>
                <span className="font-bold">{row[2]}</span>
                <span>{row[3]}</span>
                <span className="text-emerald-700">{row[4]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "Activity" && (
        <div className="mt-5 space-y-3">
          {[
            [
              "Payment received",
              "Invoice ECO-2026-0921 was paid",
              "Sep 26 · 14:12",
            ],
            [
              "Collection completed",
              "240 kg collected by Team Alpha",
              "Sep 27 · 09:14",
            ],
            [
              "SMS delivered",
              "Next collection reminder sent",
              "Oct 02 · 16:00",
            ],
            [
              "Service request updated",
              "Location request approved by Manager",
              "Oct 03 · 11:25",
            ],
          ].map(([title, body, time]) => (
            <div
              className="flex gap-3 rounded-xl border border-slate-100 p-4"
              key={title}
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <History size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{body}</p>
              </div>
              <span className="ml-auto whitespace-nowrap text-xs text-slate-400">
                {time}
              </span>
            </div>
          ))}
        </div>
      )}
    </Overlay>
  )
}

function ManagerCustomersPage() {
  const { registeredCustomers } = useStore()
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => [
    ...registeredCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      location: `${customer.cell}, ${customer.sector}, ${customer.district}`,
      route: "Pending first schedule",
      balance: "RWF 0",
      status: "Active",
      company: customer.assignedCompany,
    })),
    ...initialCustomers,
  ])
  const [query, setQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [selected, setSelected] = useState<CustomerRecord | null>(null)
  const [importMessage, setImportMessage] = useState("")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    route: "KG 45",
  })
  const filtered = customers.filter((customer) =>
    `${customer.name} ${customer.id} ${customer.phone} ${customer.location}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  const addCustomer = () => {
    if (!form.name || !form.phone || !form.location) return
    setCustomers([
      {
        id: `CUS-${2052 + customers.length}`,
        name: form.name,
        phone: form.phone,
        location: form.location,
        route: form.route,
        balance: "RWF 0",
        status: "Active",
      },
      ...customers,
    ])
    setAddOpen(false)
    setForm({ name: "", phone: "", location: "", route: "KG 45" })
  }

  const importCsv = (file?: File) => {
    if (!file) return
    file.text().then((text) => {
      const lines = text.split(/\r?\n/).filter(Boolean).slice(1)
      const imported = lines.map((line, index) => {
        const [name, phone, location, route] = line
          .split(",")
          .map((value) => value?.trim().replace(/^"|"$/g, ""))
        return {
          id: `IMP-${Date.now().toString().slice(-5)}-${index + 1}`,
          name: name || `Imported Customer ${index + 1}`,
          phone: phone || "Not provided",
          location: location || "Location pending",
          route: route || "Unassigned",
          balance: "RWF 0",
          status: "Pending review",
        }
      })
      setCustomers([...imported, ...customers])
      setImportMessage(
        `${imported.length} customer${
          imported.length === 1 ? "" : "s"
        } imported for review.`,
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total customers", customers.length.toLocaleString(), UsersRound],
          [
            "Active service",
            customers
              .filter((item) => item.status === "Active")
              .length.toString(),
            Check,
          ],
          [
            "Payment follow-up",
            customers
              .filter((item) => item.balance !== "RWF 0")
              .length.toString(),
            ReceiptText,
          ],
        ].map(([label, value, Icon]) => {
          const ItemIcon = Icon as LucideIcon
          return (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              key={label as string}
            >
              <ItemIcon className="text-emerald-700" size={19} />
              <p className="mt-5 text-2xl font-bold">{value as string}</p>
              <p className="text-xs text-slate-500">{label as string}</p>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3">
          <Search className="text-slate-400" size={17} />
          <input
            className="w-full bg-transparent py-3 text-sm outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, ID, phone or location..."
            value={query}
          />
        </label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
          <Upload size={16} />
          Import customer list
          <input
            accept=".csv"
            className="hidden"
            onChange={(event) => importCsv(event.target.files?.[0])}
            type="file"
          />
        </label>
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={16} />
          Add customer
        </button>
      </div>
      {importMessage && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {importMessage} CSV order: name, phone, location, route.
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Collection point</th>
                <th className="px-5 py-3">Route</th>
                <th className="px-5 py-3">Assigned company</th>
                <th className="px-5 py-3">Balance</th>
                <th className="px-5 py-3">Status</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((customer) => (
                <tr
                  className="text-sm hover:bg-emerald-50/30"
                  key={customer.id}
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="text-xs text-slate-400">{customer.id}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{customer.phone}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {customer.location}
                  </td>
                  <td className="px-5 py-4 font-semibold">{customer.route}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {customer.company || "Simate Garbage Ltd"}
                  </td>
                  <td className="px-5 py-4 font-semibold">
                    {customer.balance}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                      onClick={() => setSelected(customer)}
                    >
                      View full record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {addOpen && (
        <Overlay onClose={() => setAddOpen(false)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Manual registration
          </p>
          <h2 className="mt-2 text-2xl font-bold">Add a new customer</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-600">
              Full name
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Phone number
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <label className="text-xs font-bold text-slate-600 sm:col-span-2">
              Collection location
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Assigned route
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, route: e.target.value })}
              >
                <option>KG 45</option>
                <option>KG 11</option>
                <option>KK 15</option>
                <option>Unassigned</option>
              </select>
            </label>
            <label className="text-xs font-bold text-slate-600">
              Collection frequency
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                <option>Weekly</option>
                <option>Twice weekly</option>
                <option>Monthly</option>
              </select>
            </label>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={addCustomer}
          >
            Save customer
          </button>
        </Overlay>
      )}
      {selected && (
        <CustomerDetails
          customer={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

type CollectionRecord = {
  id: string
  customer: string
  date: string
  window: string
  route: string
  status: string
}

const kigaliLocations: Record<string, Record<string, {
  cells: string[]
  villages: string[]
}>> = {
  Kicukiro: {
    Nyarugunga: {
      cells: ["Kamashashi", "Nonko", "Rwimbogo"],
      villages: ["Kabeza", "Busanza", "Rwinyange", "Karama"],
    },
    Niboye: {
      cells: ["Gatare", "Niboye", "Nyakabanda"],
      villages: ["Kigali", "Kanserege", "Munini"],
    },
    Gikondo: {
      cells: ["Kagunga", "Kanserege", "Kinunga"],
      villages: ["Ruganwa", "Rwampara", "Kigarama"],
    },
  },
  Gasabo: {
    Remera: {
      cells: ["Rukiri I", "Rukiri II", "Nyabisindu"],
      villages: ["Giporoso", "Amahoro", "Ruturusu"],
    },
    Kimironko: {
      cells: ["Bibare", "Kibagabaga", "Nyagatovu"],
      villages: ["Kagara", "Inyamibwa", "Kinyaga"],
    },
    Kacyiru: {
      cells: ["Kamatamu", "Kamutwa", "Kibaza"],
      villages: ["Ubumwe", "Urugwiro", "Amahoro"],
    },
  },
  Nyarugenge: {
    Nyamirambo: {
      cells: ["Mumena", "Rugarama", "Kivugiza"],
      villages: ["Cyivugiza", "Gasharu", "Munanira"],
    },
    Muhima: {
      cells: ["Amahoro", "Kabeza", "Nyabugogo"],
      villages: ["Ubumwe", "Imanzi", "Isangano"],
    },
    Kigali: {
      cells: ["Akirwanda", "Kigali", "Rwesero"],
      villages: ["Karama", "Nyabugogo", "Rugarama"],
    },
  },
}

function ManagerCollectionsPage() {
  const [records, setRecords] = useState<CollectionRecord[]>([
    {
      id: "COL-8742",
      customer: "Jean Romeo",
      date: "2026-10-05",
      window: "08:00–11:00",
      route: "Kicukiro-Nyarugunga Route",
      status: "Scheduled",
    },
    {
      id: "COL-8743",
      customer: "Aline Uwase",
      date: "2026-10-04",
      window: "09:00–12:00",
      route: "KG 11",
      status: "In Progress",
    },
    {
      id: "COL-8744",
      customer: "Green Hills Residence",
      date: "2026-10-04",
      window: "07:00–10:00",
      route: "KG 18",
      status: "Completed",
    },
  ])
  const [mode, setMode] = useState<"collection" | "schedule" | null>(null)
  const [customer, setCustomer] = useState("Jean Romeo")
  const [date, setDate] = useState("2026-10-04")
  const [scheduleForm, setScheduleForm] = useState({
    day: "Monday",
    district: "Kicukiro",
    sector: "Nyarugunga",
    cell: "Kamashashi",
    village: "Kabeza",
    time: "08:00–11:00",
    vehicle: "RW 412 A",
    team: "Team Alpha",
  })
  const [timetable, setTimetable] = useState([
    {
      day: "Monday",
      district: "Kicukiro",
      sector: "Nyarugunga",
      cell: "Kamashashi",
      village: "Kabeza",
      time: "08:00–11:00",
      vehicle: "RW 412 A",
      team: "Team Alpha",
      stops: 184,
    },
    {
      day: "Tuesday",
      district: "Gasabo",
      sector: "Remera",
      cell: "Rukiri I",
      village: "Giporoso",
      time: "07:30–11:30",
      vehicle: "RW 307 K",
      team: "Team Delta",
      stops: 156,
    },
    {
      day: "Wednesday",
      district: "Kicukiro",
      sector: "Niboye",
      cell: "Gatare",
      village: "Kanserege",
      time: "08:00–12:00",
      vehicle: "RW 118 T",
      team: "Team Bravo",
      stops: 132,
    },
    {
      day: "Thursday",
      district: "Nyarugenge",
      sector: "Nyamirambo",
      cell: "Mumena",
      village: "Cyivugiza",
      time: "09:00–13:00",
      vehicle: "RW 922 D",
      team: "Team Echo",
      stops: 211,
    },
    {
      day: "Friday",
      district: "Gasabo",
      sector: "Kimironko",
      cell: "Bibare",
      village: "Kagara",
      time: "07:00–11:00",
      vehicle: "RW 412 A",
      team: "Team Alpha",
      stops: 198,
    },
  ])
  const sectors = Object.keys(kigaliLocations[scheduleForm.district] ?? {})
  const areaOptions = kigaliLocations[scheduleForm.district]?.[
    scheduleForm.sector
  ] ?? { cells: [], villages: [] }
  const create = () => {
    if (mode === "schedule") {
      setTimetable([...timetable, { ...scheduleForm, stops: 0 }])
    } else {
      setRecords([
        {
          id: `COL-${8745 + records.length}`,
          customer,
          date,
          window: "08:00–11:00",
          route: "KG 45",
          status: "Scheduled",
        },
        ...records,
      ])
    }
    setMode(null)
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl bg-emerald-800 p-5 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xl font-bold">Collection planning</p>
          <p className="mt-1 text-sm text-emerald-100">
            Add one-time work or create a recurring collection schedule.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-900"
            onClick={() => setMode("collection")}
          >
            <Plus size={16} />
            New collection
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold"
            onClick={() => setMode("schedule")}
          >
            <CalendarPlus size={16} />
            Create schedule
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Today", "148"],
          ["Scheduled", "22"],
          ["In progress", "8"],
          ["Completed", "126"],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4"
            key={label}
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 font-bold text-slate-950">
              <CalendarClock className="text-emerald-700" size={18} />
              Sector & cell collection timetable
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Weekly pickup plan used by Operations, field teams and customer
              messaging.
            </p>
          </div>
          <button
            className="sm:ml-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
            onClick={() => setMode("schedule")}
          >
            <Plus size={15} />
            Add timetable entry
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Day</th>
                <th className="px-5 py-3">District</th>
                <th className="px-5 py-3">Sector</th>
                <th className="px-5 py-3">Cell</th>
                <th className="px-5 py-3">Village</th>
                <th className="px-5 py-3">Time</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Team</th>
                <th className="px-5 py-3">Stops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timetable.map((item, index) => (
                <tr
                  className="text-sm hover:bg-emerald-50/30"
                  key={`${item.day}-${item.cell}-${index}`}
                >
                  <td className="px-5 py-4 font-bold text-emerald-800">
                    {item.day}
                  </td>
                  <td className="px-5 py-4">{item.district}</td>
                  <td className="px-5 py-4 font-semibold">{item.sector}</td>
                  <td className="px-5 py-4 text-slate-500">{item.cell}</td>
                  <td className="px-5 py-4 text-slate-500">{item.village}</td>
                  <td className="px-5 py-4">{item.time}</td>
                  <td className="px-5 py-4">{item.vehicle}</td>
                  <td className="px-5 py-4">{item.team}</td>
                  <td className="px-5 py-4 font-bold">
                    {item.stops || "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {records.map((record) => (
          <div
            className="grid gap-3 border-b border-slate-100 p-4 text-sm last:border-0 sm:grid-cols-[0.8fr_1.3fr_1fr_1fr_1fr_auto]"
            key={record.id}
          >
            <strong>{record.id}</strong>
            <span>{record.customer}</span>
            <span className="text-slate-500">{record.date}</span>
            <span className="text-slate-500">{record.window}</span>
            <span>{record.route}</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
              {record.status}
            </span>
          </div>
        ))}
      </div>
      {mode && (
        <Overlay onClose={() => setMode(null)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {mode === "collection"
              ? "New collection"
              : "Weekly operations plan"}
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {mode === "collection"
              ? "Add collection work"
              : "Add district, sector, cell & village timetable"}
          </h2>
          {mode === "collection" ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold">
                Customer / group
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option>Jean Romeo</option>
                  <option>Aline Uwase</option>
                  <option>All customers · Kicukiro</option>
                </select>
              </label>
              <label className="text-xs font-bold">
                Collection date
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  value={date}
                />
              </label>
              <label className="text-xs font-bold">
                Route
                <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                  <option>KG 45</option>
                  <option>KG 11</option>
                  <option>Generate with AI EcoRoute</option>
                </select>
              </label>
              <label className="text-xs font-bold">
                Time window
                <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                  <option>08:00–11:00</option>
                  <option>12:00–15:00</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold">
                Collection day
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, day: e.target.value })
                  }
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                </select>
              </label>
              <label className="text-xs font-bold">
                District
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) => {
                    const district = e.target.value
                    const sector = Object.keys(kigaliLocations[district])[0]
                    const area = kigaliLocations[district][sector]
                    setScheduleForm({
                      ...scheduleForm,
                      district,
                      sector,
                      cell: area.cells[0],
                      village: area.villages[0],
                    })
                  }}
                  value={scheduleForm.district}
                >
                  {Object.keys(kigaliLocations).map((district) => (
                    <option key={district}>{district}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold">
                Sector
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) => {
                    const sector = e.target.value
                    const area = kigaliLocations[scheduleForm.district][sector]
                    setScheduleForm({
                      ...scheduleForm,
                      sector,
                      cell: area.cells[0],
                      village: area.villages[0],
                    })
                  }}
                  value={scheduleForm.sector}
                >
                  {sectors.map((sector) => (
                    <option key={sector}>{sector}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold">
                Cells{" "}
                <span className="font-normal text-slate-400">
                  (select one or many)
                </span>
                <select
                  className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  multiple
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      cell: Array.from(e.target.selectedOptions)
                        .map((item) => item.value)
                        .join(", "),
                    })
                  }
                >
                  {areaOptions.cells.map((cell) => (
                    <option key={cell}>{cell}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold">
                Villages{" "}
                <span className="font-normal text-slate-400">
                  (select one or many)
                </span>
                <select
                  className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  multiple
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      village: Array.from(e.target.selectedOptions)
                        .map((item) => item.value)
                        .join(", "),
                    })
                  }
                >
                  {areaOptions.villages.map((village) => (
                    <option key={village}>{village}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold">
                Pickup time
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, time: e.target.value })
                  }
                >
                  <option>08:00–11:00</option>
                  <option>07:00–10:00</option>
                  <option>12:00–15:00</option>
                </select>
              </label>
              <label className="text-xs font-bold">
                Vehicle
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      vehicle: e.target.value,
                    })
                  }
                >
                  <option>RW 412 A</option>
                  <option>RW 307 K</option>
                  <option>RW 118 T</option>
                </select>
              </label>
              <label className="text-xs font-bold sm:col-span-2">
                Assigned team
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, team: e.target.value })
                  }
                >
                  <option>Team Alpha</option>
                  <option>Team Delta</option>
                  <option>Team Bravo</option>
                  <option>Team Echo</option>
                </select>
              </label>
            </div>
          )}
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={create}
          >
            {mode === "schedule"
              ? "Add to weekly timetable"
              : "Create collection"}
          </button>
        </Overlay>
      )}
    </div>
  )
}

const pickupLocations = [
  {
    name: "Nyarugunga Cluster",
    area: "Kicukiro",
    customers: 184,
    route: "KG 45",
    position: "left-[22%] top-[58%]",
  },
  {
    name: "Kimironko Market",
    area: "Gasabo",
    customers: 96,
    route: "KG 11",
    position: "left-[48%] top-[24%]",
  },
  {
    name: "Gikondo Industrial",
    area: "Kicukiro",
    customers: 42,
    route: "KK 15",
    position: "left-[58%] top-[66%]",
  },
  {
    name: "Kibagabaga Estates",
    area: "Gasabo",
    customers: 128,
    route: "KG 18",
    position: "right-[15%] top-[36%]",
  },
  {
    name: "Nyamirambo Central",
    area: "Nyarugenge",
    customers: 211,
    route: "KN 07",
    position: "left-[32%] top-[42%]",
  },
]

function ServiceMap({ full = false }: { full?: boolean }) {
  const [active, setActive] = useState(pickupLocations[0])
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#e5efe4] ${
        full ? "h-[70vh]" : "min-h-[480px]"
      }`}
    >
      <div className="absolute inset-0 map-grid" />
      <div className="absolute left-[18%] top-[-20%] h-[140%] w-3 rotate-[24deg] rounded-full bg-white" />
      <div className="absolute left-[-5%] top-[38%] h-3 w-[115%] -rotate-[8deg] rounded-full bg-white" />
      <div className="absolute right-[24%] top-[-10%] h-[130%] w-2 -rotate-[19deg] rounded-full bg-white" />
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 700 480"
      >
        <path
          d="M45 400 C160 370 100 150 250 220 S420 390 650 90"
          fill="none"
          stroke="#047857"
          strokeDasharray="8 7"
          strokeWidth="5"
        />
      </svg>
      {pickupLocations.map((location) => (
        <button
          aria-label={location.name}
          className={`absolute ${location.position} grid size-10 place-items-center rounded-full border-4 border-white bg-emerald-700 text-white shadow-lg transition hover:scale-110`}
          key={location.name}
          onClick={() => setActive(location)}
        >
          <MapPin size={17} />
        </button>
      ))}
      <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Selected collection area
        </p>
        <p className="mt-1 font-bold text-slate-900">{active.name}</p>
        <p className="mt-1 text-xs text-slate-500">
          {active.area} · {active.customers} customers · Route {active.route}
        </p>
      </div>
      <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow">
        Prototype service map · Kigali
      </span>
    </div>
  )
}

function ManagerLocationsPage() {
  const [fullMap, setFullMap] = useState(false)
  const [query, setQuery] = useState("")
  const filtered = pickupLocations.filter((item) =>
    `${item.name} ${item.area} ${item.route}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3">
          <Search className="text-slate-400" size={17} />
          <input
            className="w-full bg-transparent py-3 text-sm outline-none"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search area, route or collection point..."
          />
        </label>
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          onClick={() => setFullMap(true)}
        >
          <Maximize2 size={16} />
          View full collection map
        </button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_2fr]">
        <div className="space-y-2">
          {filtered.map((location) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              key={location.name}
            >
              <div className="flex items-start">
                <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin size={17} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold">{location.name}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {location.area} · Route {location.route}
                  </p>
                </div>
                <span className="ml-auto text-xs font-bold text-emerald-700">
                  {location.customers} stops
                </span>
              </div>
            </div>
          ))}
        </div>
        <ServiceMap />
      </div>
      {fullMap && (
        <Overlay onClose={() => setFullMap(false)} wide>
          <div className="mb-5 pr-12">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Company service coverage
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              All waste collection locations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View company routes and every active pickup zone across Kigali.
            </p>
          </div>
          <ServiceMap full />
        </Overlay>
      )}
    </div>
  )
}

const liveVehicles = [
  {
    plate: "RW 412 A",
    driver: "Eric Niyonzima",
    route: "KG 45",
    status: "Collecting",
    location: "Nyarugunga · Kamashashi",
    progress: "14 / 18",
    position: "left-[22%] top-[58%]",
  },
  {
    plate: "RW 307 K",
    driver: "Claude Mugenzi",
    route: "KG 11",
    status: "On route",
    location: "Remera · Rukiri I",
    progress: "11 / 15",
    position: "left-[48%] top-[25%]",
  },
  {
    plate: "RW 118 T",
    driver: "Alice Uwera",
    route: "KK 15",
    status: "Delayed",
    location: "Niboye · Gatare",
    progress: "6 / 16",
    position: "left-[58%] top-[66%]",
  },
  {
    plate: "RW 922 D",
    driver: "Patrick Tuyishime",
    route: "KN 07",
    status: "Nduba trip",
    location: "Kigali–Nduba Road",
    progress: "En route",
    position: "right-[14%] top-[35%]",
  },
]

function LiveVehicleMap() {
  const [selected, setSelected] = useState(liveVehicles[0])
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl bg-[#e4eee3]">
      <div className="absolute inset-0 map-grid" />
      <div className="absolute left-[18%] top-[-15%] h-[140%] w-3 rotate-[24deg] rounded-full bg-white" />
      <div className="absolute left-[-5%] top-[40%] h-3 w-[115%] -rotate-[8deg] rounded-full bg-white" />
      <div className="absolute right-[23%] top-[-10%] h-[130%] w-2 -rotate-[19deg] rounded-full bg-white" />
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 700 520"
      >
        <path
          d="M35 430 C140 390 120 130 275 220 S430 405 650 80"
          fill="none"
          stroke="#047857"
          strokeDasharray="8 7"
          strokeWidth="5"
        />
      </svg>
      {liveVehicles.map((vehicle) => (
        <button
          aria-label={`View ${vehicle.plate}`}
          className={`absolute ${vehicle.position} grid size-11 place-items-center rounded-full border-4 border-white ${
            vehicle.status === "Delayed" ? "bg-slate-950" : "bg-emerald-700"
          } text-white shadow-lg transition hover:scale-110`}
          key={vehicle.plate}
          onClick={() => setSelected(vehicle)}
        >
          <Truck size={18} />
        </button>
      ))}
      <div className="absolute bottom-4 left-4 right-4 max-w-md rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="flex items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {selected.plate} · {selected.status}
            </p>
            <p className="mt-1 font-bold text-slate-900">{selected.driver}</p>
            <p className="mt-1 text-xs text-slate-500">
              Route {selected.route} · {selected.location}
            </p>
          </div>
          <span className="ml-auto rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
            {selected.progress}
          </span>
        </div>
      </div>
      <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow">
        Simulated vehicle locations
      </span>
    </div>
  )
}

function ManagerLiveOperationsPage() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(interval)
  }, [])
  const metrics = [
    ["Active vehicles", "4", Truck],
    ["Collections in progress", "8", RefreshCw],
    ["Completed today", "126", Check],
    ["Delayed / problems", "3", AlertTriangle],
    ["Active Nduba trips", "2", Navigation],
  ]
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">
            Live operations command
          </p>
          <p className="mt-1 text-xl font-bold">
            {now.toLocaleDateString("en-RW", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="sm:ml-auto">
          <p className="text-3xl font-semibold tabular-nums">
            {now.toLocaleTimeString("en-RW", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p className="mt-1 text-right text-xs text-emerald-200">
            Kigali local time · Prototype GPS
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(([label, value, Icon]) => {
          const MetricIcon = Icon as LucideIcon
          return (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              key={label as string}
            >
              <MetricIcon className="text-emerald-700" size={18} />
              <p className="mt-4 text-2xl font-bold">{value as string}</p>
              <p className="mt-1 text-xs text-slate-500">{label as string}</p>
            </div>
          )
        })}
      </div>
      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <LiveVehicleMap />
        <div className="space-y-2">
          <div className="mb-3">
            <p className="font-bold text-slate-950">Active fleet</p>
            <p className="text-xs text-slate-500">
              Vehicle, driver, route and current location
            </p>
          </div>
          {liveVehicles.map((vehicle) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              key={vehicle.plate}
            >
              <div className="flex items-start">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Truck size={17} />
                </div>
                <div className="ml-3 min-w-0">
                  <p className="font-bold text-slate-900">{vehicle.plate}</p>
                  <p className="text-xs text-slate-500">
                    {vehicle.driver} · Route {vehicle.route}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {vehicle.location}
                  </p>
                </div>
                <span
                  className={`ml-auto rounded-full px-2 py-1 text-[10px] font-bold ${
                    vehicle.status === "Delayed"
                      ? "bg-slate-950 text-white"
                      : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const staffCategories = [
  [
    "Finance",
    "Handles authorized billing, payments, receipts, reconciliation and financial reports",
    "Restricted Finance workspace",
  ],
  ["Driver", "Drives the waste collection vehicle", "Vehicle"],
  [
    "Waste Collector",
    "Collects waste from the customer and brings it to the collection point",
    "Vehicle + Team",
  ],
  [
    "Vehicle Loader",
    "Loads waste from the collection point into the vehicle",
    "Vehicle + Team",
  ],
  [
    "Payment Collector",
    "Collects approved physical or field payments",
    "Payment collection team",
  ],
  [
    "Team Leader",
    "Supervises the collection team and verifies work",
    "Vehicle + Team",
  ],
  [
    "Dispatcher / Operations Staff",
    "Coordinates routes, vehicles, teams and operational problems",
    "Manager / Operations",
  ],
  [
    "Nduba / Transfer Staff",
    "Handles waste movement and disposal trips to Nduba",
    "Nduba trip / Vehicle",
  ],
]

type StaffRecord = {
  id: string
  name: string
  category: string
  assignment: string
  phone: string
  email: string
  task: string
  status: string
}

function ManagerStaffPage() {
  const [staff, setStaff] = useState<StaffRecord[]>([
    {
      id: "FIN-012",
      name: "Claudine Uwase",
      category: "Finance",
      assignment: "Finance operations",
      phone: "+250 788 420 116",
      email: "finance@ecoroute.rw",
      task: "Manage authorized billing, payments and reconciliation",
      status: "Active",
    },
    {
      id: "EMP-041",
      name: "Eric Niyonzima",
      category: "Driver",
      assignment: "RW 412 A · KG 45",
      phone: "+250 788 304 112",
      email: "eric.n@ecoroute.rw",
      task: "Drive KG 45 · 18 collection stops",
      status: "On route",
    },
    {
      id: "EMP-052",
      name: "Alice Uwera",
      category: "Driver",
      assignment: "RW 118 T · KK 15",
      phone: "+250 783 113 204",
      email: "alice.u@ecoroute.rw",
      task: "Vehicle inspection · report brake issue",
      status: "Issue",
    },
    {
      id: "EMP-064",
      name: "Samuel Imanzi",
      category: "Team Leader",
      assignment: "Team Alpha",
      phone: "+250 720 818 221",
      email: "samuel.i@ecoroute.rw",
      task: "Supervise Nyarugunga collections",
      status: "Active",
    },
    {
      id: "EMP-071",
      name: "Grace Ingabire",
      category: "Payment Collector",
      assignment: "Kicukiro field team",
      phone: "+250 788 942 103",
      email: "grace.i@ecoroute.rw",
      task: "Verify 12 field payments",
      status: "Available",
    },
    {
      id: "EMP-083",
      name: "Patrick Tuyishime",
      category: "Nduba / Transfer Staff",
      assignment: "RW 922 D",
      phone: "+250 783 015 777",
      email: "patrick.t@ecoroute.rw",
      task: "Complete Nduba trip NDB-2404",
      status: "On route",
    },
  ])
  const [modal, setModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffRecord | null>(null)
  const [form, setForm] = useState({
    name: "",
    category: "Finance",
    assignment: "",
    phone: "",
    email: "",
    password: "",
    task: "",
  })
  const addStaff = () => {
    if (!form.name || !form.phone || !form.email || form.password.length < 8)
      return
    const isFinance = form.category === "Finance"
    const assignment =
      form.assignment || (isFinance ? "Finance operations" : "Unassigned")
    const task =
      form.task ||
      (isFinance
        ? "Manage authorized billing, payments and reconciliation"
        : "No task assigned")
    setStaff([
      {
        id: `${isFinance ? "FIN" : "EMP"}-${90 + staff.length}`,
        name: form.name,
        category: form.category,
        assignment,
        phone: form.phone,
        email: form.email,
        task,
        status: "Active",
      },
      ...staff,
    ])
    const existing = JSON.parse(
      localStorage.getItem("ecoroute-created-accounts") ?? "[]",
    ) as Array<{
      email: string
      password: string
      role: Role
      name: string
    }>
    localStorage.setItem(
      "ecoroute-created-accounts",
      JSON.stringify([
        ...existing.filter(
          (account) => account.email !== form.email.toLowerCase(),
        ),
        {
          email: form.email.toLowerCase(),
          password: form.password,
          role: isFinance ? "Finance" : "Employee",
          name: form.name,
          phone: form.phone,
          category: form.category,
          assignment,
          task,
        },
      ]),
    )
    setModal(false)
  }
  const metrics = [
    ["Total staff", "86"],
    ["Active staff", "72"],
    ["On routes", "34"],
    ["Available", "21"],
    ["Off duty", "9"],
    ["Staff leave", "3"],
    ["With issues", "2"],
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {metrics.map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            key={label}
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold text-slate-950">Staff & system users</p>
          <p className="mt-1 text-xs text-slate-500">
            Create employee or Finance accounts and assign the correct
            restricted workspace.
          </p>
        </div>
        <button
          className="sm:ml-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          onClick={() => setModal(true)}
        >
          <UserPlus size={16} />
          Create staff / user
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Assignment</th>
                <th className="px-5 py-3">Assigned task</th>
                <th className="px-5 py-3">Login / contact</th>
                <th className="px-5 py-3">Status</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((person) => (
                <tr className="text-sm" key={person.id}>
                  <td className="px-5 py-4">
                    <p className="font-bold">{person.name}</p>
                    <p className="text-xs text-slate-400">{person.id}</p>
                  </td>
                  <td className="px-5 py-4">{person.category}</td>
                  <td className="px-5 py-4 text-slate-500">
                    {person.assignment}
                  </td>
                  <td className="max-w-56 px-5 py-4 text-slate-500">
                    {person.task}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    <span className="block">{person.email}</span>
                    <span className="text-xs">{person.phone}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        person.status === "Issue"
                          ? "bg-slate-950 text-white"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                      onClick={() => setSelectedStaff(person)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <p className="font-bold">Staff categories & responsibilities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Main responsibility</th>
                <th className="px-5 py-3">Assigned to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffCategories.map(([category, responsibility, assignment]) => (
                <tr className="text-sm" key={category}>
                  <td className="px-5 py-4 font-bold text-emerald-800">
                    {category}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{responsibility}</td>
                  <td className="px-5 py-4 font-semibold">{assignment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <Overlay onClose={() => setModal(false)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            New authorized system user
          </p>
          <h2 className="mt-2 text-2xl font-bold">Create employee / staff</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Full name
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="text-xs font-bold">
              Registered phone number
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+250 7xx xxx xxx"
              />
            </label>
            <label className="text-xs font-bold">
              Login email
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="employee@ecoroute.rw"
                type="email"
              />
            </label>
            <label className="text-xs font-bold">
              Temporary password
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
                type="password"
              />
            </label>
            <label className="text-xs font-bold sm:col-span-2">
              Staff category
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {staffCategories.map(([category]) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="text-xs font-bold sm:col-span-2">
              Vehicle / team / operations assignment
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) =>
                  setForm({ ...form, assignment: e.target.value })
                }
                placeholder="e.g. RW 412 A · Team Alpha"
              />
            </label>
            <label className="text-xs font-bold sm:col-span-2">
              Assigned task
              <textarea
                className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setForm({ ...form, task: e.target.value })}
                placeholder="Describe today’s assigned work..."
              />
            </label>
            <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 sm:col-span-2">
              The employee uses this email and temporary password to access only
              their assigned Employee workspace. Login instructions are sent to
              the registered phone number.
            </div>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={addStaff}
          >
            Create employee login account
          </button>
        </Overlay>
      )}
      {selectedStaff && (
        <Overlay onClose={() => setSelectedStaff(null)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            {selectedStaff.id} · {selectedStaff.status}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{selectedStaff.name}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {selectedStaff.category}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Login email", selectedStaff.email],
              ["Registered phone", selectedStaff.phone],
              ["Assignment", selectedStaff.assignment],
              [
                "Access",
                selectedStaff.category === "Finance"
                  ? "Restricted Finance workspace"
                  : "Employee workspace only",
              ],
              ["Current task", selectedStaff.task],
              ["Account status", selectedStaff.status],
            ].map(([label, value]) => (
              <div
                className={`rounded-xl bg-slate-50 p-4 ${
                  label === "Current task" ? "sm:col-span-2" : ""
                }`}
                key={label}
              >
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
          {selectedStaff.category === "Finance" && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-slate-600">
              <strong className="text-emerald-800">Restricted access:</strong>{" "}
              Customer billing, invoices, payments, Mobile Money, outstanding
              balances, receipts, reconciliation and finance reports. No
              vehicles, routes, drivers, employee roles, AI, system
              configuration or Admin security.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Edit staff",
              "Assign new task",
              "Reset password",
              "Send message",
              "Deactivate access",
            ].map((action) => (
              <button
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-emerald-50"
                key={action}
              >
                {action}
              </button>
            ))}
          </div>
        </Overlay>
      )}
    </div>
  )
}

const messageAudiences = [
  {
    label: "Monday · Nyarugunga, Kamashashi",
    recipients: 184,
    schedule: "08:00–11:00",
  },
  {
    label: "Tuesday · Remera, Rukiri I",
    recipients: 156,
    schedule: "07:30–11:30",
  },
  {
    label: "Wednesday · Niboye, Gatare",
    recipients: 132,
    schedule: "08:00–12:00",
  },
  {
    label: "Thursday · Nyamirambo, Mumena",
    recipients: 211,
    schedule: "09:00–13:00",
  },
  {
    label: "Friday · Kimironko, Bibare",
    recipients: 198,
    schedule: "07:00–11:00",
  },
]

function ManagerMessagesPage() {
  const [audience, setAudience] = useState(messageAudiences[0])
  const [recipientType, setRecipientType] =
    useState<"Location" | "Team" | "Individual">("Location")
  const [team, setTeam] = useState("Team Alpha · 8 members")
  const [individual, setIndividual] = useState("Eric Niyonzima · Driver")
  const [channels, setChannels] = useState({ app: true, sms: true })
  const [message, setMessage] = useState(
    "Good morning. EcoRoute will collect waste in your location today between 08:00 and 11:00. Please have your waste ready at the approved collection point. Thank you.",
  )
  const [sent, setSent] = useState(false)
  const chooseAudience = (label: string) => {
    const selected =
      messageAudiences.find((item) => item.label === label) ??
      messageAudiences[0]
    setAudience(selected)
    setSent(false)
    setMessage(
      `Good morning. EcoRoute will collect waste in your location today between ${selected.schedule}. Please have your waste ready at the approved collection point. Thank you.`,
    )
  }
  const sendMessage = () => {
    setSent(true)
    const shouldReachCustomer =
      recipientType === "Location" ||
      (recipientType === "Individual" && individual.includes("Customer"))
    if (!shouldReachCustomer) return
    const stored = JSON.parse(
      localStorage.getItem("ecoroute-shared-messages") ?? "[]",
    ) as Array<Record<string, string | boolean>>
    localStorage.setItem(
      "ecoroute-shared-messages",
      JSON.stringify([
        {
          id: `MSG-${Date.now()}`,
          date: new Date().toLocaleDateString("en-RW", {
            month: "short",
            day: "2-digit",
          }),
          message,
          type: "Collection",
          status: "Sent",
          sender: "Manager · Diane Mukamana",
          location:
            recipientType === "Location"
              ? audience.label
              : "Direct customer message",
          unread: true,
        },
        ...stored,
      ]),
    )
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start">
          <div>
            <p className="font-bold text-slate-950">
              Send collection message by timetable
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Choose a scheduled location and notify every active customer in
              that sector or cell.
            </p>
          </div>
          <div className="ml-auto grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Send size={18} />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(["Location", "Team", "Individual"] as const).map((item) => (
              <button
                className={`rounded-xl px-3 py-2.5 text-xs font-bold ${
                  recipientType === item
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-50 text-slate-600"
                }`}
                key={item}
                onClick={() => {
                  setRecipientType(item)
                  setSent(false)
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {recipientType === "Location" && (
            <label className="block text-xs font-bold text-slate-600">
              Timetable location
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => chooseAudience(e.target.value)}
                value={audience.label}
              >
                {messageAudiences.map((item) => (
                  <option key={item.label}>{item.label}</option>
                ))}
              </select>
            </label>
          )}
          {recipientType === "Team" && (
            <label className="block text-xs font-bold text-slate-600">
              Collection team
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setTeam(e.target.value)}
                value={team}
              >
                <option>Team Alpha · 8 members</option>
                <option>Team Delta · 7 members</option>
                <option>Team Bravo · 9 members</option>
                <option>Team Echo · 6 members</option>
                <option>All drivers · 18 members</option>
                <option>All Nduba staff · 12 members</option>
              </select>
            </label>
          )}
          {recipientType === "Individual" && (
            <label className="block text-xs font-bold text-slate-600">
              Employee or customer
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setIndividual(e.target.value)}
                value={individual}
              >
                <option>Eric Niyonzima · Driver</option>
                <option>Alice Uwera · Driver</option>
                <option>Samuel Imanzi · Team Leader</option>
                <option>Jean Romeo · Customer</option>
                <option>Aline Uwase · Customer</option>
              </select>
            </label>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "Recipients",
                recipientType === "Location"
                  ? audience.recipients.toString()
                  : recipientType === "Team"
                    ? (team.match(/\d+/)?.[0] ?? "Team")
                    : "1",
              ],
              [
                "Target",
                recipientType === "Location"
                  ? audience.schedule
                  : recipientType === "Team"
                    ? team.split("·")[0].trim()
                    : individual.split("·")[0].trim(),
              ],
              [
                "Delivery",
                `${channels.app ? "App" : ""}${
                  channels.app && channels.sms ? " + " : ""
                }${channels.sms ? "SMS / phone" : ""}`,
              ],
            ].map(([label, value]) => (
              <div className="rounded-xl bg-emerald-50 p-3" key={label}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-bold text-emerald-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 rounded-xl border border-slate-200 p-4">
            <p className="w-full text-xs font-bold text-slate-600">
              Delivery channels
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                checked={channels.app}
                onChange={(e) =>
                  setChannels({ ...channels, app: e.target.checked })
                }
                type="checkbox"
              />
              EcoRoute app notification
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                checked={channels.sms}
                onChange={(e) =>
                  setChannels({ ...channels, sms: e.target.checked })
                }
                type="checkbox"
              />
              SMS to registered phone
            </label>
          </div>
          <label className="block text-xs font-bold text-slate-600">
            Message
            <textarea
              className="mt-1.5 min-h-40 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-emerald-500"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              disabled={!channels.app && !channels.sms}
              onClick={sendMessage}
            >
              <Send size={16} />
              Send to {recipientType.toLowerCase()}
            </button>
            <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
              Save as template
            </button>
          </div>
          {sent && (
            <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              Message queued successfully by{" "}
              {channels.app && channels.sms
                ? "app notification and SMS"
                : channels.sms
                  ? "SMS"
                  : "app notification"}
              . Recipients can read it in EcoRoute and on their registered
              phone.
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-bold">Upcoming timetable audiences</p>
          <div className="mt-4 space-y-3">
            {messageAudiences.map((item) => (
              <button
                className="flex w-full items-center rounded-xl border border-slate-100 p-3 text-left hover:border-emerald-200 hover:bg-emerald-50"
                key={item.label}
                onClick={() => chooseAudience(item.label)}
              >
                <CalendarDays className="text-emerald-700" size={17} />
                <span className="ml-3">
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="text-xs text-slate-500">
                    {item.schedule}
                  </span>
                </span>
                <span className="ml-auto text-xs font-bold text-emerald-700">
                  {item.recipients}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-900 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Recent delivery
          </p>
          <p className="mt-4 text-2xl font-bold">96.8%</p>
          <p className="mt-1 text-sm text-emerald-100">
            SMS delivery success this week
          </p>
          <div className="mt-5 h-2 rounded-full bg-white/15">
            <div className="h-full w-[97%] rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

type OperationNotification = {
  id: string
  category: string
  title: string
  detail: string
  source: string
  location: string
  time: string
  unread: boolean
  priority: string
}

function ManagerNotificationsPage() {
  const [filter, setFilter] = useState("All")
  const [items, setItems] = useState<OperationNotification[]>([
    {
      id: "NTF-1048",
      category: "Customer complaint",
      title: "Missed collection reported",
      detail:
        "Waste was not collected during the scheduled window. Customer requested urgent follow-up.",
      source: "Aline Uwase · CUS-2049",
      location: "Remera · Rukiri I",
      time: "8 min ago",
      unread: true,
      priority: "High",
    },
    {
      id: "NTF-1047",
      category: "Employee update",
      title: "Collection marked Needs Review",
      detail: "Driver reported an access problem at the customer compound.",
      source: "Eric Niyonzima · EMP-041",
      location: "Nyarugunga · Kamashashi",
      time: "16 min ago",
      unread: true,
      priority: "High",
    },
    {
      id: "NTF-1046",
      category: "Customer complaint",
      title: "Payment not reflected",
      detail:
        "Customer completed an MTN Mobile Money payment but the invoice still shows Pending.",
      source: "Patrick Habimana · CUS-2050",
      location: "Niboye · Gatare",
      time: "31 min ago",
      unread: true,
      priority: "Medium",
    },
    {
      id: "NTF-1045",
      category: "Employee update",
      title: "Route KG 45 started",
      detail: "Team Alpha started the assigned route with vehicle RW 412 A.",
      source: "Samuel Imanzi · EMP-064",
      location: "Nyarugunga",
      time: "1 hour ago",
      unread: false,
      priority: "Normal",
    },
    {
      id: "NTF-1044",
      category: "Customer complaint",
      title: "Request to change collection point",
      detail:
        "Customer submitted a new location pin and address for Manager approval.",
      source: "Jean Romeo · CUS-2048",
      location: "Kicukiro",
      time: "2 hours ago",
      unread: false,
      priority: "Normal",
    },
    {
      id: "NTF-1043",
      category: "Vehicle problem",
      title: "Brake inspection required",
      detail:
        "Vehicle RW 118 T was moved to Maintenance by the assigned driver.",
      source: "Alice Uwera · EMP-052",
      location: "Kicukiro depot",
      time: "3 hours ago",
      unread: false,
      priority: "High",
    },
  ])
  const visible = items.filter(
    (item) => filter === "All" || item.category === filter,
  )
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Unread alerts", items.filter((item) => item.unread).length],
          [
            "Customer complaints",
            items.filter((item) => item.category === "Customer complaint")
              .length,
          ],
          [
            "Employee changes",
            items.filter((item) => item.category === "Employee update").length,
          ],
          [
            "High priority",
            items.filter((item) => item.priority === "High").length,
          ],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4"
            key={label as string}
          >
            <p className="text-2xl font-bold">{value as number}</p>
            <p className="text-xs text-slate-500">{label as string}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "Customer complaint",
            "Employee update",
            "Vehicle problem",
          ].map((item) => (
            <button
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                filter === item
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-50 text-slate-600"
              }`}
              key={item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          className="text-xs font-bold text-emerald-700 sm:ml-auto"
          onClick={() =>
            setItems(items.map((item) => ({ ...item, unread: false })))
          }
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-3">
        {visible.map((item) => (
          <div
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              item.unread ? "border-emerald-300" : "border-slate-200"
            }`}
            key={item.id}
          >
            <div className="flex items-start gap-3">
              <div
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                  item.category === "Customer complaint"
                    ? "bg-slate-950 text-white"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {item.category === "Customer complaint" ? (
                  <MessageSquareText size={18} />
                ) : item.category === "Employee update" ? (
                  <UsersRound size={18} />
                ) : (
                  <Truck size={18} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{item.title}</p>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold">
                    {item.category}
                  </span>
                  {item.priority === "High" && (
                    <span className="rounded-full bg-slate-950 px-2 py-1 text-[10px] font-bold text-white">
                      High priority
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.detail}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {item.source} · {item.location} · {item.time}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                    onClick={() =>
                      setItems(
                        items.map((entry) =>
                          entry.id === item.id
                            ? { ...entry, unread: false }
                            : entry,
                        ),
                      )
                    }
                  >
                    Open & review
                  </button>
                  <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">
                    Assign follow-up
                  </button>
                  <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">
                    Send response
                  </button>
                </div>
              </div>
              {item.unread && (
                <span className="size-2 rounded-full bg-emerald-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ManagerReportsPage() {
  const [period, setPeriod] = useState("Daily")
  const reportMetrics = [
    [
      "Total waste collected",
      period === "Daily"
        ? "42.8 t"
        : period === "Weekly"
          ? "286.4 t"
          : "1,184 t",
    ],
    [
      "Completed collections",
      period === "Daily" ? "126" : period === "Weekly" ? "842" : "3,518",
    ],
    [
      "Missed collections",
      period === "Daily" ? "4" : period === "Weekly" ? "19" : "81",
    ],
    ["Collection success", "96.9%"],
    [
      "Payments received",
      period === "Daily"
        ? "RWF 3.8m"
        : period === "Weekly"
          ? "RWF 24.6m"
          : "RWF 104m",
    ],
    ["Outstanding bills", "RWF 4.2m"],
    [
      "Nduba trips",
      period === "Daily" ? "7" : period === "Weekly" ? "44" : "186",
    ],
    [
      "Service problems",
      period === "Daily" ? "6" : period === "Weekly" ? "31" : "124",
    ],
  ]
  const exportReport = () => {
    const rows = [["Metric", period], ...reportMetrics]
    const url = URL.createObjectURL(
      new Blob([rows.map((row) => row.join(",")).join("\n")], {
        type: "text/csv",
      }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `ecoroute-${period.toLowerCase()}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-2xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Business performance
          </p>
          <p className="mt-1 text-2xl font-bold">{period} operations report</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {["Daily", "Weekly", "Monthly"].map((item) => (
            <button
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                period === item ? "bg-white text-emerald-900" : "bg-white/10"
              }`}
              key={item}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>
          ))}
          <button
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-emerald-950"
            onClick={exportReport}
          >
            <Download size={15} />
            Export Report
          </button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {reportMetrics.map(([label, value], index) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            key={label}
          >
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
            <p className="mt-2 text-xs text-emerald-700">
              {index % 3 === 0
                ? "+6.2% from previous period"
                : "Updated from operations"}
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-bold">Vehicle performance</p>
          <div className="mt-4 space-y-4">
            {[
              ["RW 412 A", "94% utilization", "w-[94%]"],
              ["RW 307 K", "88% utilization", "w-[88%]"],
              ["RW 118 T", "62% utilization", "w-[62%]"],
            ].map(([plate, text, width]) => (
              <div key={plate}>
                <div className="mb-2 flex text-sm">
                  <strong>{plate}</strong>
                  <span className="ml-auto text-slate-500">{text}</span>
                </div>
                <div className="h-2 rounded-full bg-emerald-50">
                  <div
                    className={`h-full rounded-full bg-emerald-700 ${width}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-bold">Employee / team performance</p>
          <div className="mt-4 divide-y divide-slate-100">
            {[
              ["Team Alpha", "148 stops", "98%"],
              ["Team Delta", "132 stops", "95%"],
              ["Team Bravo", "119 stops", "91%"],
              ["Team Echo", "107 stops", "89%"],
            ].map((row) => (
              <div className="grid grid-cols-3 py-3 text-sm" key={row[0]}>
                <strong>{row[0]}</strong>
                <span className="text-slate-500">{row[1]}</span>
                <span className="text-right font-bold text-emerald-700">
                  {row[2]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="font-bold">Customer statistics</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          {[
            ["Total customers", "2,846"],
            ["Active service", "2,712"],
            ["Payment compliance", "92.4%"],
            ["Open service requests", "14"],
          ].map(([label, value]) => (
            <div className="rounded-xl bg-slate-50 p-4" key={label}>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

type VehicleRecord = {
  plate: string
  type: string
  capacity: string
  driver: string
  team: string
  route: string
  status: string
  maintenance: string
  fuel: string
  location: string
  progress: string
}

function ManagerFleetPage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([
    {
      plate: "RW 412 A",
      type: "Rear loader",
      capacity: "8 t",
      driver: "Eric Niyonzima",
      team: "Team Alpha",
      route: "KG 45",
      status: "On Route",
      maintenance: "Good · Nov 12",
      fuel: "68% · 7.4 km/L",
      location: "Nyarugunga",
      progress: "14 / 18",
    },
    {
      plate: "RW 307 K",
      type: "Compactor",
      capacity: "10 t",
      driver: "Claude Mugenzi",
      team: "Team Delta",
      route: "KG 11",
      status: "Loading",
      maintenance: "Good · Nov 20",
      fuel: "54% · 6.8 km/L",
      location: "Remera",
      progress: "11 / 15",
    },
    {
      plate: "RW 118 T",
      type: "Tipper truck",
      capacity: "6 t",
      driver: "Alice Uwera",
      team: "Team Bravo",
      route: "KK 15",
      status: "Maintenance",
      maintenance: "Brake inspection",
      fuel: "82% · 8.1 km/L",
      location: "Kicukiro depot",
      progress: "Paused",
    },
    {
      plate: "RW 922 D",
      type: "Transfer truck",
      capacity: "14 t",
      driver: "Patrick Tuyishime",
      team: "Nduba Transfer",
      route: "KN 07",
      status: "At Nduba",
      maintenance: "Good · Dec 02",
      fuel: "41% · 5.9 km/L",
      location: "Nduba landfill",
      progress: "Unloading",
    },
  ])
  const [add, setAdd] = useState(false)
  const [selected, setSelected] = useState<VehicleRecord | null>(null)
  const [plate, setPlate] = useState("")
  const addVehicle = () => {
    if (!plate) return
    setVehicles([
      ...vehicles,
      {
        plate,
        type: "Rear loader",
        capacity: "8 t",
        driver: "Unassigned",
        team: "Unassigned",
        route: "Unassigned",
        status: "Available",
        maintenance: "Inspection required",
        fuel: "Not recorded",
        location: "Company depot",
        progress: "0 / 0",
      },
    ])
    setAdd(false)
    setPlate("")
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          "Available",
          "On Route",
          "Loading",
          "At Nduba",
          "Maintenance",
          "Out of Service",
        ].map((status) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4"
            key={status}
          >
            <p className="text-2xl font-bold">
              {status === "Out of Service"
                ? "1"
                : vehicles.filter((item) => item.status === status).length ||
                  (status === "Available" ? 3 : 0)}
            </p>
            <p className="text-xs text-slate-500">{status}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold">Fleet & vehicle management</p>
          <p className="text-xs text-slate-500">
            Assignments, usage, maintenance and live progress.
          </p>
        </div>
        <button
          className="sm:ml-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white"
          onClick={() => setAdd(true)}
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1180px] text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              {[
                "Vehicle",
                "Capacity",
                "Driver & team",
                "Route",
                "Status",
                "Maintenance",
                "Fuel / usage",
                "Location",
                "Progress",
                "Actions",
              ].map((title) => (
                <th className="px-4 py-3" key={title}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.map((vehicle) => (
              <tr className="text-xs" key={vehicle.plate}>
                <td className="px-4 py-4">
                  <strong className="block text-sm">{vehicle.plate}</strong>
                  {vehicle.type}
                </td>
                <td className="px-4 py-4">{vehicle.capacity}</td>
                <td className="px-4 py-4">
                  <strong>{vehicle.driver}</strong>
                  <br />
                  <span className="text-slate-400">{vehicle.team}</span>
                </td>
                <td className="px-4 py-4 font-bold">{vehicle.route}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-emerald-50 px-2 py-1 font-bold text-emerald-800">
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-4 py-4">{vehicle.maintenance}</td>
                <td className="px-4 py-4">{vehicle.fuel}</td>
                <td className="px-4 py-4">{vehicle.location}</td>
                <td className="px-4 py-4 font-bold">{vehicle.progress}</td>
                <td className="px-4 py-4">
                  <button
                    className="rounded-lg border border-slate-200 px-3 py-2 font-bold"
                    onClick={() => setSelected(vehicle)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {add && (
        <Overlay onClose={() => setAdd(false)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Fleet registration
          </p>
          <h2 className="mt-2 text-2xl font-bold">Add vehicle</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Plate number
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setPlate(e.target.value)}
              />
            </label>
            <label className="text-xs font-bold">
              Vehicle type
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                <option>Rear loader</option>
                <option>Compactor</option>
                <option>Tipper truck</option>
                <option>Transfer truck</option>
              </select>
            </label>
            <label className="text-xs font-bold">
              Capacity
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                placeholder="e.g. 8 t"
              />
            </label>
            <label className="text-xs font-bold">
              Assigned team
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                <option>Unassigned</option>
                <option>Team Alpha</option>
                <option>Team Delta</option>
              </select>
            </label>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={addVehicle}
          >
            Save Vehicle
          </button>
        </Overlay>
      )}
      {selected && (
        <Overlay onClose={() => setSelected(null)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Vehicle details
          </p>
          <h2 className="mt-2 text-2xl font-bold">{selected.plate}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Object.entries(selected).map(([label, value]) => (
              <div className="rounded-xl bg-slate-50 p-3" key={label}>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  {label}
                </p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">
            {["Edit", "Assign Team", "Assign Route", "Maintenance"].map(
              (action) => (
                <button
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-emerald-50"
                  key={action}
                >
                  {action}
                </button>
              ),
            )}
          </div>
        </Overlay>
      )}
    </div>
  )
}

function ManagerPaymentsPage() {
  const [notice, setNotice] = useState("")
  const [manualOpen, setManualOpen] = useState(false)
  const [manual, setManual] = useState({
    customer: "Jean Romeo",
    location: "Nyarugunga · Kamashashi",
    invoice: "INV-0921",
    amount: "18000",
    method: "Cash / field payment",
  })
  const [payments, setPayments] = useState([
    [
      "TXN-90284",
      "Jean Romeo",
      "INV-0921",
      "RWF 18,000",
      "MTN MoMo",
      "Oct 04 · 09:42",
      "Paid",
    ],
    [
      "TXN-90285",
      "Aline Uwase",
      "INV-0922",
      "RWF 18,000",
      "Airtel Money",
      "Oct 04 · 09:18",
      "Pending",
    ],
    [
      "TXN-90286",
      "Green Hills Residence",
      "INV-0923",
      "RWF 36,000",
      "Bank transfer",
      "Oct 04 · 08:36",
      "Paid",
    ],
    [
      "TXN-90287",
      "Patrick Habimana",
      "INV-0924",
      "RWF 18,000",
      "MTN MoMo",
      "Oct 03 · 16:22",
      "Failed",
    ],
  ])
  const addManualPayment = () => {
    setPayments([
      [
        `MAN-${Date.now().toString().slice(-6)}`,
        manual.customer,
        manual.invoice,
        `RWF ${Number(manual.amount || 0).toLocaleString()}`,
        manual.method,
        new Date().toLocaleString("en-RW", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        "Paid",
      ],
      ...payments,
    ])
    setNotice(
      `Manual payment recorded for ${manual.customer} in ${manual.location}. A receipt is now available.`,
    )
    setManualOpen(false)
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xl font-bold">Customer payment activity</p>
          <p className="mt-1 text-sm text-emerald-100">
            Review digital payments or record an approved field payment.
          </p>
        </div>
        <button
          className="sm:ml-auto flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-900"
          onClick={() => setManualOpen(true)}
        >
          <Plus size={16} />
          Add Manual Payment
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          ["Total billed", "RWF 128.4m"],
          ["Total paid", "RWF 114.8m"],
          ["Outstanding", "RWF 9.2m"],
          ["Pending", "RWF 3.1m"],
          ["Failed", "RWF 1.3m"],
          ["Today’s payments", "RWF 3.8m"],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            key={label}
          >
            <p className="text-lg font-bold">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      {notice && (
        <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {notice}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              {[
                "Transaction",
                "Customer",
                "Invoice",
                "Amount",
                "Method",
                "Date",
                "Status",
                "Actions",
              ].map((title) => (
                <th className="px-4 py-3" key={title}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((row) => (
              <tr className="text-sm" key={row[0]}>
                {row.map((item, index) => (
                  <td
                    className={`px-4 py-4 ${
                      index === 0 || index === 3
                        ? "font-bold"
                        : "text-slate-600"
                    }`}
                    key={item}
                  >
                    {index === 6 ? (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          item === "Failed"
                            ? "bg-slate-950 text-white"
                            : "bg-emerald-50 text-emerald-800"
                        }`}
                      >
                        {item}
                      </span>
                    ) : (
                      item
                    )}
                  </td>
                ))}
                <td className="px-4 py-4">
                  <select
                    className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold"
                    onChange={(e) => {
                      if (e.target.value)
                        setNotice(
                          `${e.target.value} opened for ${row[1]} · ${row[0]}.`,
                        )
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Actions
                    </option>
                    <option>View Payment</option>
                    <option>View Invoice</option>
                    <option>Send Reminder</option>
                    <option>View Receipt</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="font-bold">Payment methods</p>
          <div className="mt-4 space-y-3">
            {[
              ["MTN Mobile Money", "RWF 72.8m", "64%"],
              ["Airtel Money", "RWF 28.3m", "25%"],
              ["Bank / field payment", "RWF 13.7m", "11%"],
            ].map((row) => (
              <div className="grid grid-cols-3 text-sm" key={row[0]}>
                <span>{row[0]}</span>
                <strong>{row[1]}</strong>
                <span className="text-right text-emerald-700">{row[2]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-emerald-900 p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-emerald-200">
            Collection rate
          </p>
          <p className="mt-3 text-4xl font-bold">89.4%</p>
          <p className="mt-2 text-sm text-emerald-100">
            RWF 114.8m of RWF 128.4m billed has been paid.
          </p>
        </div>
      </div>
      {manualOpen && (
        <Overlay onClose={() => setManualOpen(false)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Approved field process
          </p>
          <h2 className="mt-2 text-2xl font-bold">Add manual payment</h2>
          <p className="mt-1 text-sm text-slate-500">
            Select the customer and collection location, then record the
            payment.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Customer name
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) =>
                  setManual({ ...manual, customer: e.target.value })
                }
              >
                <option>Jean Romeo</option>
                <option>Aline Uwase</option>
                <option>Patrick Habimana</option>
                <option>Green Hills Residence</option>
              </select>
            </label>
            <label className="text-xs font-bold">
              Customer location
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) =>
                  setManual({ ...manual, location: e.target.value })
                }
              >
                <option>Nyarugunga · Kamashashi</option>
                <option>Remera · Rukiri I</option>
                <option>Niboye · Gatare</option>
                <option>Kibagabaga Estates</option>
              </select>
            </label>
            <label className="text-xs font-bold">
              Invoice
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) =>
                  setManual({ ...manual, invoice: e.target.value })
                }
                value={manual.invoice}
              />
            </label>
            <label className="text-xs font-bold">
              Amount (RWF)
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) =>
                  setManual({ ...manual, amount: e.target.value })
                }
                type="number"
                value={manual.amount}
              />
            </label>
            <label className="text-xs font-bold sm:col-span-2">
              Payment method
              <select
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) =>
                  setManual({ ...manual, method: e.target.value })
                }
              >
                <option>Cash / field payment</option>
                <option>Bank deposit</option>
                <option>Manager verified Mobile Money</option>
              </select>
            </label>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={addManualPayment}
          >
            Record payment & create receipt
          </button>
        </Overlay>
      )}
    </div>
  )
}

function ManagerNdubaPage() {
  const trips = [
    [
      "NDB-2404",
      "RW 922 D",
      "Patrick Tuyishime",
      "KN 07",
      "10:18",
      "11:06",
      "42 min",
      "At Nduba",
    ],
    [
      "NDB-2403",
      "RW 601 G",
      "Claude Mugenzi",
      "KG 11",
      "08:42",
      "09:31",
      "49 min",
      "Completed",
    ],
    [
      "NDB-2402",
      "RW 307 K",
      "Alice Uwera",
      "KK 15",
      "07:15",
      "08:09",
      "54 min",
      "Completed",
    ],
    [
      "NDB-2401",
      "RW 412 A",
      "Eric Niyonzima",
      "KG 45",
      "—",
      "—",
      "Scheduled 14:30",
      "Scheduled",
    ],
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Active trips", "2"],
          ["At Nduba", "1"],
          ["Completed today", "6"],
          ["Average travel time", "48 min"],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-5"
            key={label}
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="font-bold">Vehicle movement to Nduba landfill</p>
        <p className="mt-1 text-xs text-slate-500">
          Departure, arrival and journey time for every company vehicle.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                {[
                  "Trip",
                  "Vehicle",
                  "Driver",
                  "Route",
                  "Departure",
                  "Arrival",
                  "Travel / schedule",
                  "Status",
                ].map((item) => (
                  <th className="px-4 py-3" key={item}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((row) => (
                <tr className="text-sm" key={row[0]}>
                  {row.map((item, index) => (
                    <td
                      className={`px-4 py-4 ${
                        index === 0 || index === 1
                          ? "font-bold"
                          : "text-slate-600"
                      }`}
                      key={`${row[0]}-${index}`}
                    >
                      {index === 7 ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                          {item}
                        </span>
                      ) : (
                        item
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-2xl bg-emerald-900 p-5 text-white">
          <Truck size={21} />
          <p className="mt-5 text-lg font-bold">Next scheduled movement</p>
          <p className="mt-2 text-sm text-emerald-100">
            RW 412 A · Route KG 45
          </p>
          <p className="mt-1 text-3xl font-bold">14:30</p>
          <p className="mt-2 text-xs text-emerald-200">
            Estimated Nduba arrival · 15:18
          </p>
        </div>
        <LiveVehicleMap />
      </div>
    </div>
  )
}

function ManagerSettingsPage() {
  const [saved, setSaved] = useState("")
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  })
  const changePassword = () => {
    if (
      !passwords.current ||
      passwords.next.length < 8 ||
      passwords.next !== passwords.confirm
    ) {
      setSaved(
        "Password was not changed. Enter the current password and make sure the new passwords match.",
      )
      return
    }
    setSaved(
      "Password changed successfully. Other signed-in sessions will be closed.",
    )
    setPasswords({ current: "", next: "", confirm: "" })
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-emerald-100 font-bold text-emerald-800">
              DM
            </div>
            <div>
              <p className="text-lg font-bold">Diane Mukamana</p>
              <p className="text-sm text-slate-500">
                Operations Manager · MGR-0018
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Phone", "+250 788 410 220"],
              ["Department", "Operations"],
              ["Access role", "Manager"],
              ["Account status", "Active"],
            ].map(([label, value]) => (
              <div className="rounded-xl bg-slate-50 p-3" key={label}>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 className="text-emerald-700" size={19} />
            <p className="font-bold">Company details</p>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Company", "Simate Garbage Ltd"],
              ["Registration", "RDB-108842-RW"],
              ["Head office", "Kicukiro, Kigali"],
              ["Service districts", "Gasabo, Kicukiro, Nyarugenge"],
              ["Operating license", "Active · renews Mar 2027"],
            ].map(([label, value]) => (
              <div
                className="flex border-b border-slate-100 pb-3 text-sm last:border-0"
                key={label}
              >
                <span className="text-slate-500">{label}</span>
                <strong className="ml-auto text-right">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <KeyRound size={19} />
          </div>
          <div>
            <p className="font-bold">Change password</p>
            <p className="text-xs text-slate-500">
              This is the only editable manager setting.
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {[
            ["Current password", "current"],
            ["New password", "next"],
            ["Confirm new password", "confirm"],
          ].map(([label, key]) => (
            <label className="block text-xs font-bold text-slate-600" key={key}>
              {label}
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"
                onChange={(e) =>
                  setPasswords({ ...passwords, [key]: e.target.value })
                }
                type="password"
                value={passwords[(key as keyof typeof passwords)]}
              />
            </label>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">
          Use at least 8 characters. For security, changing the password closes
          other active sessions.
        </div>
        {saved && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm font-semibold ${
              saved.startsWith("Password changed")
                ? "bg-emerald-100 text-emerald-900"
                : "bg-slate-950 text-white"
            }`}
          >
            {saved}
          </div>
        )}
        <button
          className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
          onClick={changePassword}
        >
          Change password
        </button>
      </div>
    </div>
  )
}

type ChatMessage = { from: "ai" | "user"; text: string }

function ManagerAIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "ai",
      text: "Hi Diane, how can I help you today? Ask me about customers, payments, collection areas, routes, vehicles, staff, Nduba trips, schedules, or any part of the EcoRoute system.",
    },
  ])
  const [question, setQuestion] = useState("")
  const [typing, setTyping] = useState(false)
  const answerQuestion = (value: string) => {
    const query = value.toLowerCase()
    if (
      query.includes("what can") ||
      query.includes("help") ||
      query.includes("all pages") ||
      query === "tell me everything"
    )
      return "I can read and explain the same prototype information shown across every Manager page: Dashboard, Customers, Collections, sector and cell timetables, Locations, Live Operations, Users and Staff, Notifications and complaints, Messages and SMS, Reports, Routes, AI EcoRoute, Fleet and Vehicles, Payments, Nduba Landfill, Settings and account security. Ask for a summary, a specific record, current totals, an assignment, a location, or guidance for completing an action."
    if (query.includes("nyarugunga"))
      return "Nyarugunga currently has 184 active customers across Kamashashi, Nonko and Rwimbogo cells. 169 customers have paid on time, 11 have outstanding bills and 4 payments are pending. Today’s route is KG 45 with vehicle RW 412 A and Team Alpha. 126 collections are complete, 8 are in progress and 3 customer accounts need follow-up."
    if (
      query.includes("complaint") ||
      query.includes("notification") ||
      query.includes("problem")
    )
      return "Manager Notifications currently contains 3 customer complaints, 2 employee updates and 4 high-priority alerts. Open issues include a missed collection in Remera, a payment not reflected in Niboye, a collection-point change request in Kicukiro, an access problem reported by Eric Niyonzima and a brake inspection for vehicle RW 118 T."
    if (
      query.includes("message") ||
      query.includes("sms") ||
      query.includes("notify")
    )
      return "The Messages page can target a timetable location, collection team, individual employee, individual customer, all drivers or all Nduba staff. Delivery can use an EcoRoute app notification, SMS to the registered phone, or both. The upcoming audiences include Nyarugunga, Remera, Niboye, Nyamirambo and Kimironko."
    if (
      query.includes("manual payment") ||
      query.includes("field payment") ||
      query.includes("cash")
    )
      return "To add a manual payment, open Payments and choose Add Manual Payment. Select the customer and collection location, enter the invoice and amount, choose Cash / field payment, Bank deposit or Manager-verified Mobile Money, then record the payment. The system creates a transaction and receipt."
    if (
      query.includes("invoice") ||
      query.includes("payment") ||
      query.includes("paid") ||
      query.includes("outstanding")
    )
      return "Payments shows RWF 128.4 million billed, RWF 114.8 million paid, RWF 9.2 million outstanding, RWF 3.1 million pending, RWF 1.3 million failed and RWF 3.8 million received today. The collection rate is 89.4%. Managers can view a payment or invoice, send a reminder, view a receipt, or add an approved manual payment."
    if (
      query.includes("ai route") ||
      query.includes("ai ecoroute") ||
      query.includes("optimization") ||
      query.includes("ecoroute recommendation")
    )
      return "AI EcoRoute loads collection points, date and operating zone, checks available vehicles and teams, generates a recommended map, estimates 18.4 km, 1 hour 42 minutes and 94% efficiency, then lets the Manager accept, assign and start the route. All values are labeled as prototype recommendations."
    if (query.includes("kg-218") || query.includes("gasabo route"))
      return "Route KG-218 Gasabo covers Remera and Rukiri I. It has 48 collection points and 48 customers, an estimated distance of 18 km and collection time of 2 hours 20 minutes. It is assigned to vehicle RW 412 A, Team Alpha and driver Eric N. Status is Assigned with progress 0 of 48."
    if (query.includes("route"))
      return "There are 8 active routes today and seven are on schedule. Route KG-218 Gasabo is Assigned, KK-015 Kicukiro is In Progress at 21 of 36 stops, KN-007 Nyarugenge is Completed at 52 of 52, and KG-045 Kimironko is Delayed at 6 of 41. Managers can create, edit, assign, start or reassign routes and change their collection points."
    if (
      query.includes("maintenance") ||
      query.includes("fuel") ||
      query.includes("vehicle") ||
      query.includes("fleet")
    )
      return "Four vehicles are currently tracked. RW 412 A is On Route in Nyarugunga with 68% fuel and progress 14 of 18. RW 307 K is Loading in Remera with 54% fuel. RW 118 T is in Maintenance for a brake inspection. RW 922 D is At Nduba and unloading. Three additional vehicles are available."
    if (
      query.includes("create employee") ||
      query.includes("staff account") ||
      query.includes("login email")
    )
      return "Managers can create an authorized employee account with full name, registered phone, login email, temporary password, staff category, vehicle or team assignment and assigned task. The employee then signs in with that email and password and sees only the Employee workspace and their assigned work."
    if (
      query.includes("staff") ||
      query.includes("employee") ||
      query.includes("team")
    )
      return "The company has 86 staff members: 72 active, 34 on routes, 21 available, 9 off duty, 3 on leave and 2 with issues. Supported categories are Driver, Waste Collector, Vehicle Loader, Payment Collector, Team Leader, Dispatcher / Operations Staff and Nduba / Transfer Staff. Team Alpha has the highest completion rate at 98%."
    if (query.includes("nduba") || query.includes("landfill"))
      return "There are 2 active Nduba trips. RW 922 D departed at 10:18 and arrived at 11:06. The next scheduled movement is RW 412 A at 14:30 with an estimated arrival of 15:18."
    if (
      query.includes("live operation") ||
      query.includes("active vehicle") ||
      query.includes("current operation")
    )
      return "Live Operations shows 4 active vehicles, 8 collections in progress, 126 completed collections, 3 delayed or problem collections and 2 active Nduba trips. The live map tracks each vehicle’s plate, driver, route, status and simulated current location."
    if (query.includes("collection") || query.includes("today"))
      return "Today there are 148 scheduled collections: 126 completed, 8 in progress, 10 still scheduled and 4 missed or requiring review. Total waste collected today is approximately 42.8 tonnes. Managers can add one-time collections, reschedule work, update status and report exceptions."
    if (
      query.includes("schedule") ||
      query.includes("timetable") ||
      query.includes("sector") ||
      query.includes("cell") ||
      query.includes("village")
    )
      return "The weekly timetable includes Nyarugunga on Monday, Remera on Tuesday, Niboye on Wednesday, Nyamirambo on Thursday and Kimironko on Friday. A Manager can select a district, its sector, one or several cells and villages, pickup time, vehicle and assigned team."
    if (
      query.includes("location") ||
      query.includes("map") ||
      query.includes("zone")
    )
      return "The service map covers Nyarugunga Cluster with 184 customers, Kimironko Market with 96, Gikondo Industrial with 42, Kibagabaga Estates with 128 and Nyamirambo Central with 211. Managers can search by area, route or collection point and open the full Kigali service coverage map."
    if (query.includes("customer") || query.includes("client"))
      return "The system contains 2,846 customers and 2,712 active services. Payment compliance is 92.4%, with 14 open service requests. Managers can add a customer manually, import a CSV list, search by ID, name, phone or location, and inspect profile, collections, payments, balance, messages and complete activity history."
    if (
      query.includes("report") ||
      query.includes("performance") ||
      query.includes("waste collected")
    )
      return "The daily report shows 42.8 tonnes collected, 126 completed collections, 4 missed collections, 96.9% collection success, RWF 3.8 million received, RWF 4.2 million outstanding, 7 Nduba trips and 6 service problems. Daily, weekly and monthly reports can be exported as CSV."
    if (
      query.includes("setting") ||
      query.includes("password") ||
      query.includes("company detail") ||
      query.includes("profile")
    )
      return "Manager Settings displays Diane Mukamana’s ID, phone, department, access role and status, plus Simate Garbage Ltd registration, head office, service districts and license. The only editable setting is the Manager password, which requires the current password and a matching new password of at least 8 characters."
    if (query.includes("dashboard") || query.includes("summary"))
      return "Manager Dashboard summary: 2,846 customers, 148 collections today, 126 completed, 22 pending or failed, 8 active routes, 11 vehicles on route, RWF 4.2 million outstanding, 3 active Nduba trips, 14 service requests and 3 operational alerts."
    return "I could not match that to one exact Manager module, but I have the prototype knowledge used across every Manager page. Try including the customer or location name, route ID, vehicle plate, employee, payment, complaint, timetable, district, sector, report period or Nduba trip you want to check."
  }
  const ask = (value: string) => {
    const clean = value.trim()
    if (!clean) return
    setMessages((current) => [...current, { from: "user", text: clean }])
    setTyping(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { from: "ai", text: answerQuestion(clean) },
      ])
      setTyping(false)
    }, 900)
  }
  const send = () => {
    ask(question)
    setQuestion("")
  }
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.36fr]">
      <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center border-b border-slate-100 p-5">
          <div className="grid size-11 place-items-center rounded-2xl bg-emerald-700 text-white">
            <Sparkles size={20} />
          </div>
          <div className="ml-3">
            <p className="font-bold">EcoRoute AI Assistant</p>
            <p className="text-xs text-slate-500">
              System guidance and operational summaries · Prototype data
            </p>
          </div>
          <span className="ml-auto flex items-center gap-2 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-600" />
            Ready
          </span>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8faf8] p-5">
          {messages.map((message, index) => (
            <div
              className={`flex ${
                message.from === "user" ? "justify-end" : "justify-start"
              }`}
              key={`${message.from}-${index}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.from === "user"
                    ? "rounded-br-sm bg-emerald-800 text-white"
                    : "rounded-bl-sm border border-emerald-100 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-emerald-100 bg-white px-4 py-4 shadow-sm">
                <span className="size-2 animate-bounce rounded-full bg-emerald-600" />
                <span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:150ms]" />
                <span className="size-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:300ms]" />
                <span className="ml-2 text-xs text-slate-400">
                  EcoRoute AI is typing…
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="flex items-end gap-2">
            <textarea
              className="min-h-12 flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  send()
                }
              }}
              placeholder="Ask anything about your EcoRoute system..."
              value={question}
            />
            <button
              aria-label="Send question"
              className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white"
              onClick={send}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">
            Press Enter to send. Answers use prototype operational data.
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Suggested questions
          </p>
          {[
            "What is happening in Nyarugunga?",
            "Give me the Manager dashboard summary",
            "Show all payment totals",
            "Which vehicles are active?",
            "Show customer complaints",
            "When is the next Nduba trip?",
            "Explain this week’s timetable",
          ].map((item) => (
            <button
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left text-sm font-semibold text-slate-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
              disabled={typing}
              key={item}
              onClick={() => ask(item)}
            >
              {item}
              <ChevronRight
                className="float-right text-emerald-700"
                size={16}
              />
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Manager knowledge coverage
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Select any page to ask the AI for the same information shown in that
            Manager module.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Dashboard",
              "Customers",
              "Collections",
              "Locations",
              "Live Operations",
              "Users / Staff",
              "Notifications",
              "Messages",
              "Reports",
              "Routes",
              "AI EcoRoute",
              "Fleet & vehicles",
              "Payments",
              "Nduba landfill",
              "Settings",
            ].map((module) => (
              <button
                className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-100 hover:bg-emerald-700 hover:text-white"
                disabled={typing}
                key={module}
                onClick={() => ask(`Tell me everything about ${module}`)}
              >
                {module}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type RouteRecord = {
  id: string
  name: string
  district: string
  area: string
  points: number
  customers: number
  distance: string
  time: string
  vehicle: string
  team: string
  driver: string
  status: string
  progress: string
}

function ManagerRoutesPage() {
  const [routes, setRoutes] = useState<RouteRecord[]>([
    {
      id: "KG-218",
      name: "KG-218 Gasabo",
      district: "Gasabo",
      area: "Remera / Rukiri I",
      points: 48,
      customers: 48,
      distance: "18 km",
      time: "2h 20m",
      vehicle: "RW 412 A",
      team: "Team Alpha",
      driver: "Eric N.",
      status: "Assigned",
      progress: "0 / 48",
    },
    {
      id: "KK-015",
      name: "KK-015 Kicukiro",
      district: "Kicukiro",
      area: "Nyarugunga",
      points: 36,
      customers: 184,
      distance: "14.6 km",
      time: "1h 52m",
      vehicle: "RW 307 K",
      team: "Team Delta",
      driver: "Claude M.",
      status: "In Progress",
      progress: "21 / 36",
    },
    {
      id: "KN-007",
      name: "KN-007 Nyarugenge",
      district: "Nyarugenge",
      area: "Nyamirambo",
      points: 52,
      customers: 211,
      distance: "22 km",
      time: "3h 05m",
      vehicle: "RW 922 D",
      team: "Team Echo",
      driver: "Patrick T.",
      status: "Completed",
      progress: "52 / 52",
    },
    {
      id: "KG-045",
      name: "KG-045 Kimironko",
      district: "Gasabo",
      area: "Kimironko / Bibare",
      points: 41,
      customers: 198,
      distance: "16.2 km",
      time: "2h 10m",
      vehicle: "RW 118 T",
      team: "Team Bravo",
      driver: "Alice U.",
      status: "Delayed",
      progress: "6 / 41",
    },
  ])
  const [selected, setSelected] = useState<RouteRecord | null>(null)
  const [create, setCreate] = useState(false)
  const [routeName, setRouteName] = useState("")
  const addRoute = () => {
    if (!routeName) return
    setRoutes([
      {
        id: `KG-${220 + routes.length}`,
        name: routeName,
        district: "Gasabo",
        area: "Remera",
        points: 0,
        customers: 0,
        distance: "Pending AI",
        time: "Pending AI",
        vehicle: "Unassigned",
        team: "Unassigned",
        driver: "Unassigned",
        status: "Planned",
        progress: "0 / 0",
      },
      ...routes,
    ])
    setCreate(false)
    setRouteName("")
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl bg-emerald-900 p-5 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-xl font-bold">Route planning & assignment</p>
          <p className="mt-1 text-sm text-emerald-100">
            Create, organize and monitor every waste collection route.
          </p>
        </div>
        <button
          className="sm:ml-auto flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-900"
          onClick={() => setCreate(true)}
        >
          <Plus size={16} />
          Create Route
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          "Planned",
          "Assigned",
          "In Progress",
          "Completed",
          "Delayed",
          "Cancelled",
        ].map((status) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4"
            key={status}
          >
            <p className="text-2xl font-bold">
              {routes.filter((route) => route.status === status).length}
            </p>
            <p className="text-xs text-slate-500">{status}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {routes.map((route) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            key={route.id}
          >
            <div className="flex items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  {route.id}
                </p>
                <p className="mt-1 text-lg font-bold">{route.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {route.district} · {route.area}
                </p>
              </div>
              <span
                className={`ml-auto rounded-full px-2.5 py-1 text-xs font-bold ${
                  route.status === "Delayed"
                    ? "bg-slate-950 text-white"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                {route.status}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-slate-400">Customers</p>
                <p className="mt-1 font-bold">{route.customers}</p>
              </div>
              <div>
                <p className="text-slate-400">Distance</p>
                <p className="mt-1 font-bold">{route.distance}</p>
              </div>
              <div>
                <p className="text-slate-400">Est. time</p>
                <p className="mt-1 font-bold">{route.time}</p>
              </div>
              <div>
                <p className="text-slate-400">Vehicle</p>
                <p className="mt-1 font-bold">{route.vehicle}</p>
              </div>
              <div>
                <p className="text-slate-400">Team</p>
                <p className="mt-1 font-bold">{route.team}</p>
              </div>
              <div>
                <p className="text-slate-400">Driver</p>
                <p className="mt-1 font-bold">{route.driver}</p>
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex text-xs">
                <span>Route progress</span>
                <strong className="ml-auto">{route.progress}</strong>
              </div>
              <div className="h-2 rounded-full bg-emerald-50">
                <div
                  className={`h-full rounded-full bg-emerald-700 ${
                    route.status === "Completed"
                      ? "w-full"
                      : route.status === "In Progress"
                        ? "w-3/5"
                        : route.status === "Delayed"
                          ? "w-1/6"
                          : "w-0"
                  }`}
                />
              </div>
            </div>
            <button
              className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-bold hover:bg-emerald-50"
              onClick={() => setSelected(route)}
            >
              View & manage route
            </button>
          </div>
        ))}
      </div>
      {create && (
        <Overlay onClose={() => setCreate(false)}>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Route setup
          </p>
          <h2 className="mt-2 text-2xl font-bold">Create Route</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Route name
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g. KG-218 Gasabo"
              />
            </label>
            <label className="text-xs font-bold">
              District
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                <option>Gasabo</option>
                <option>Kicukiro</option>
                <option>Nyarugenge</option>
              </select>
            </label>
            <label className="text-xs font-bold">
              Sector / zone
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                placeholder="Remera / Rukiri I"
              />
            </label>
            <label className="text-xs font-bold">
              Collection points
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                placeholder="Select or add points"
              />
            </label>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={addRoute}
          >
            Create planned route
          </button>
        </Overlay>
      )}
      {selected && (
        <Overlay onClose={() => setSelected(null)} wide>
          <div className="pr-12">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {selected.id} · {selected.status}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{selected.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {selected.district} · {selected.area} · {selected.points}{" "}
              collection points
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Customers", selected.customers],
                ["Distance", selected.distance],
                ["Estimated time", selected.time],
                ["Vehicle", selected.vehicle],
                ["Team", selected.team],
                ["Driver", selected.driver],
                ["Status", selected.status],
                ["Progress", selected.progress],
              ].map(([label, value]) => (
                <div className="rounded-xl bg-slate-50 p-3" key={label}>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-bold">{value}</p>
                </div>
              ))}
            </div>
            <RouteVisual role="Manager" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Edit Route",
              "Assign Vehicle",
              "Assign Team",
              "Assign Driver",
              "Add / Remove Points",
              "Start Route",
              "Reassign Route",
            ].map((action) => (
              <button
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-emerald-50"
                key={action}
              >
                {action}
              </button>
            ))}
          </div>
        </Overlay>
      )}
    </div>
  )
}

type EmployeeTask = {
  time: string
  customer: string
  action: string
  address: string
  status: string
}

function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<EmployeeTask[]>([
    {
      time: "08:00",
      customer: "Customer A · Jean Romeo",
      action: "Collect Waste",
      address: "KG 218, Nyarugunga",
      status: "Completed",
    },
    {
      time: "08:20",
      customer: "Customer B · Aline Uwase",
      action: "Collect Waste",
      address: "Kamashashi, Kicukiro",
      status: "Completed",
    },
    {
      time: "08:40",
      customer: "Customer C · Green Hills",
      action: "Collect Waste",
      address: "Nonko, Nyarugunga",
      status: "In Progress",
    },
    {
      time: "09:00",
      customer: "Customer D · Patrick H.",
      action: "Collect Waste",
      address: "Rwimbogo, Kicukiro",
      status: "Scheduled",
    },
    {
      time: "09:20",
      customer: "Customer E · Aline Uwase",
      action: "Service suspended – skip",
      address: "Busanza, Kicukiro",
      status: "Suspended",
    },
  ])
  const update = (index: number, status: string) =>
    setTasks(
      tasks.map((task, taskIndex) =>
        taskIndex === index ? { ...task, status } : task,
      ),
    )
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Today’s customers", "18"],
          ["Completed", "12"],
          ["Remaining", "6"],
          ["Next customer", "Patrick H. · 09:00"],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            key={label}
          >
            <p className="text-xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <p className="font-bold">My Tasks · Today</p>
          <p className="mt-1 text-xs text-slate-500">
            Follow the collection sequence and update each customer task.
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {tasks.map((task, index) => (
            <div
              className="grid gap-3 p-4 sm:grid-cols-[0.45fr_1.3fr_1fr_0.7fr_auto] sm:items-center"
              key={`${task.time}-${task.customer}`}
            >
              <p className="font-bold text-emerald-800">{task.time}</p>
              <div>
                <p className="text-sm font-bold">{task.customer}</p>
                <p className="text-xs text-slate-400">{task.address}</p>
              </div>
              <p className="text-sm text-slate-600">{task.action}</p>
              <span className="self-start rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                {task.status}
              </span>
              <div className="flex gap-2">
                {task.status !== "Suspended" && <button
                  className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                  onClick={() =>
                    update(
                      index,
                      task.status === "Scheduled" ? "In Progress" : "Completed",
                    )
                  }
                >
                  {task.status === "Scheduled" ? "Start" : "Complete"}
                </button>}
                <button
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                  onClick={() => update(index, "Issue")}
                >
                  Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function EmployeeCollectionPointsPage() {
  const [active, setActive] = useState("CP-2048")
  const points = [
    [
      "CP-2048",
      "Jean Romeo",
      "KG 218, Nyarugunga",
      "+250 788 123 456",
      "08:00",
      "Completed",
    ],
    [
      "CP-2049",
      "Aline Uwase",
      "Kamashashi, Kicukiro",
      "+250 783 222 410",
      "08:20",
      "Completed",
    ],
    [
      "CP-2051",
      "Green Hills Residence",
      "Nonko, Nyarugunga",
      "+250 788 560 014",
      "08:40",
      "In Progress",
    ],
    [
      "CP-2050",
      "Patrick Habimana",
      "Rwimbogo, Kicukiro",
      "+250 720 087 114",
      "09:00",
      "Scheduled",
    ],
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <p className="font-bold">Assigned Collection Points</p>
          <p className="mt-1 text-xs text-slate-500">
            Customer details and collection status for today’s route.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address / point</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {points.map((point) => (
                <tr
                  className={`cursor-pointer text-sm ${
                    active === point[0] ? "bg-emerald-50/60" : ""
                  }`}
                  key={point[0]}
                  onClick={() => setActive(point[0])}
                >
                  <td className="px-4 py-4">
                    <strong>{point[1]}</strong>
                    <p className="text-xs text-slate-400">{point[0]}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{point[2]}</td>
                  <td className="px-4 py-4 text-slate-600">{point[3]}</td>
                  <td className="px-4 py-4 font-bold">{point[4]}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
                      {point[5]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
          Selected collection point
        </p>
        <p className="mt-2 text-xl font-bold">
          {points.find((point) => point[0] === active)?.[1]}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {points.find((point) => point[0] === active)?.[2]}
        </p>
        <div className="mt-5 h-48 overflow-hidden rounded-xl bg-[#dfebdd]">
          <div className="map-grid relative h-full">
            <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-emerald-700 text-white shadow">
              <MapPin size={18} />
            </span>
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          <button className="rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white">
            Start Collection
          </button>
          <button className="rounded-xl border border-emerald-300 bg-white py-3 text-sm font-bold text-emerald-800">
            Collect Waste → Complete
          </button>
          <button className="rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-600">
            Report Problem
          </button>
        </div>
      </div>
    </div>
  )
}

function EmployeeRoutePage() {
  const stops = [
    ["01", "Jean Romeo", "Completed"],
    ["02", "Aline Uwase", "Completed"],
    ["03", "Green Hills Residence", "Current"],
    ["04", "Patrick Habimana", "Next"],
    ["05", "Diane Mukamana", "Remaining"],
  ]
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <RouteVisual role="Employee" />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-bold">Collection sequence</p>
        <p className="mt-1 text-xs text-slate-500">
          Route KG 45 · 18 customer locations
        </p>
        <div className="mt-4 space-y-2">
          {stops.map((stop) => (
            <div
              className={`flex items-center rounded-xl p-3 ${
                stop[2] === "Current"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-50"
              }`}
              key={stop[0]}
            >
              <span
                className={`grid size-8 place-items-center rounded-full text-xs font-bold ${
                  stop[2] === "Current"
                    ? "bg-white text-emerald-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {stop[0]}
              </span>
              <span className="ml-3 text-sm font-bold">{stop[1]}</span>
              <span
                className={`ml-auto text-xs ${
                  stop[2] === "Current" ? "text-emerald-100" : "text-slate-400"
                }`}
              >
                {stop[2]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-slate-500">Next collection point</p>
          <p className="mt-1 font-bold">Patrick Habimana · Rwimbogo</p>
          <p className="mt-1 text-xs text-emerald-700">
            Estimated arrival · 09:00
          </p>
        </div>
      </div>
    </div>
  )
}

function EmployeeCollectionHistoryPage() {
  const [filter, setFilter] = useState("All")
  const history = [
    [
      "COL-1024",
      "Jean Romeo",
      "05 Oct · 08:12",
      "Completed",
      "240 kg collected",
    ],
    [
      "COL-1023",
      "Aline Uwase",
      "05 Oct · 08:31",
      "Completed",
      "180 kg collected",
    ],
    [
      "COL-1019",
      "Green Hills Residence",
      "04 Oct · 10:18",
      "Missed",
      "Customer unavailable",
    ],
    [
      "COL-1016",
      "Patrick Habimana",
      "04 Oct · 09:42",
      "Failed",
      "Access problem",
    ],
  ]
  const filtered = history.filter(
    (row) => filter === "All" || row[3] === filter,
  )
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Completed collections", "126"],
          ["Missed collections", "4"],
          ["Failed collections", "2"],
        ].map(([label, value]) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-5"
            key={label}
          >
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        {["All", "Completed", "Missed", "Failed"].map((item) => (
          <button
            className={`rounded-xl px-4 py-2 text-xs font-bold ${
              filter === item
                ? "bg-emerald-700 text-white"
                : "bg-slate-50 text-slate-600"
            }`}
            key={item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filtered.map((row) => (
          <div
            className="grid gap-2 border-b border-slate-100 p-4 text-sm last:border-0 sm:grid-cols-[0.8fr_1.2fr_1fr_0.8fr_1.4fr]"
            key={row[0]}
          >
            <strong>{row[0]}</strong>
            <span>{row[1]}</span>
            <span className="text-slate-500">{row[2]}</span>
            <span className="font-bold text-emerald-700">{row[3]}</span>
            <span className="text-slate-500">{row[4]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EmployeeReportProblemPage() {
  const [reason, setReason] = useState("Customer unavailable")
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {submitted ? (
        <div className="py-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check size={24} />
          </div>
          <h2 className="mt-5 text-2xl font-bold">Problem reported</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Operations received the {reason.toLowerCase()} report. The Manager
            and affected customer were notified.
          </p>
          <button
            className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
            onClick={() => setSubmitted(false)}
          >
            Report another problem
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Collection exception
          </p>
          <h2 className="mt-2 text-2xl font-bold">Report Problem</h2>
          <p className="mt-1 text-sm text-slate-500">
            Explain why a collection could not be completed.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Customer unavailable",
              "Waste not ready",
              "Access problem",
              "Excess waste",
              "Vehicle problem",
              "Other",
            ].map((item) => (
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-sm font-bold ${
                  reason === item
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200"
                }`}
                key={item}
              >
                <input
                  checked={reason === item}
                  name="problem"
                  onChange={() => setReason(item)}
                  type="radio"
                />
                {item}
              </label>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">
              Collection point
              <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                <option>CP-2050 · Patrick Habimana</option>
                <option>CP-2051 · Green Hills Residence</option>
              </select>
            </label>
            <label className="text-xs font-bold">
              Collection ID
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                defaultValue="COL-1025"
              />
            </label>
            <label className="text-xs font-bold sm:col-span-2">
              Additional details
              <textarea
                className="mt-1.5 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm"
                placeholder="Add notes, instructions or evidence..."
              />
            </label>
          </div>
          <button
            className="mt-6 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
            onClick={() => setSubmitted(true)}
          >
            Submit problem report
          </button>
        </>
      )}
    </div>
  )
}

function ModulePage({
  role,
  page,
  onPage,
}: {
  role: Role
  page: string
  onPage: (page: string) => void
}) {
  const [query, setQuery] = useState("")
  const requirements = pageRequirements[page] ?? [
    "Current records",
    "Status and ownership",
    "Activity history",
    "Available actions",
  ]
  if (page === "Profile & Settings")
    return <UnifiedProfileSettings role={role} />
  if (page === "Communication")
    return <SmsCommunicationEnhanced />
  if (page === "Activity Log")
    return <AuditLogEnhanced role={role} />
  if (role === "Admin" && page === "Companies")
    return (
      <AdminCompanies
        initialPending={
          sessionStorage.getItem("ecoroute-companies-tab") === "Pending"
        }
      />
    )
  if (role === "Admin" && page === "Users & Roles")
    return <UsersAndAccessEnhanced />
  if (role === "Admin" && page === "System Configuration")
    return <AdminSystemEnhanced />
  if (role === "Admin" && page === "Zones / Collection Parameters")
    return <AdminZonesPage />
  if (role === "Admin" && page === "Reports")
    return <ReportsEnhanced role="Admin" />
  if (role === "Admin" && page === "AI Assistant")
    return <AdminAIAssistantPage />
  if (role === "Finance" && page === "Customers & Collection Locations")
    return <CustomersPageEnhanced />
  if (role === "Finance" && page === "Payments & Billing")
    return <FinanceBillingEnhanced initialTab="billing" />
  if (role === "Finance" && page === "Salaries & Payroll")
    return <PayrollPage mode="Finance" />
  if (["Manager", "Finance"].includes(role) && page === "Billing Enforcement")
    return <FinanceBillingEnhanced initialTab="enforcement" />
  if (role === "Finance" && page === "Financial Reports")
    return <ReportsEnhanced role="Finance" />
  if (role === "Finance") return <FinancePage page={page} />
  if (role === "Manager" && page === "Customers")
    return <CustomersPageEnhanced />
  if (role === "Manager" && page === "Collections")
    return <CollectionsPageEnhanced />
  if (role === "Manager" && page === "Collection Schedule")
    return <CollectionScheduleEnhanced />
  if (role === "Manager" && page === "Live Tracking")
    return (
      <>
        <RouteAssignmentsPanel />
        <ManagerLiveOperationsPage />
      </>
    )
  if (role === "Manager" && page === "Employees & Staff")
    return <EmployeesPage />
  if (role === "Manager" && page === "Reports")
    return <ReportsEnhanced role="Manager" />
  if (role === "Manager" && page === "Fleet & Vehicles")
    return <FleetAndTripsEnhanced initialView="fleet" role="Manager" />
  if (role === "Manager" && page === "Payments & Billing")
    return <FinanceBillingEnhanced initialTab="billing" />
  if (role === "Manager" && page === "Salaries & Payroll")
    return <PayrollPage mode="Manager" />
  if (role === "Manager" && page === "Nduba Landfill")
    return <NdubaLandfillEnhanced role="Manager" />
  if (role === "Manager" && page === "AI Assistant")
    return <ManagerAIAssistantPage />
  if (role === "Manager" && page === "Routes & AI EcoRoute")
    return <FleetAndTripsEnhanced initialView="routes" role="Manager" />
  if (role === "Customer" && page === "My Payments / Invoices")
    return <CustomerPayments onPage={onPage} />
  if (role === "Customer" && page === "AI Assistant")
    return <CustomerAIAssistantPage />
  if (role === "Customer" && page === "My Collection")
    return <CustomerMyCollectionPage onPage={onPage} />
  if (role === "Customer" && page === "My Schedule / History")
    return <CustomerSchedulePage onPage={onPage} />
  if (role === "Customer" && page === "Request Service")
    return <ServiceRequestWorkflow />
  if (role === "Employee" && page === "My Tasks")
    return (
      <>
        <DriverAssignedRoutesPage />
        <div className="mt-4">
          <EmployeeTasksPage />
        </div>
      </>
    )
  if (role === "Employee" && page === "Collection Points")
    return <EmployeeCollectionPointsPage />
  if (role === "Employee" && page === "My Routes")
    return <FleetAndTripsEnhanced initialView="routes" role="Employee" />
  if (role === "Employee" && page === "Collection Status")
    return <DriverCollectionStatusPage />
  if (role === "Employee" && page === "Trip Management")
    return <FleetAndTripsEnhanced initialView="trips" role="Employee" />
  if (role === "Employee" && page === "Nduba Landfill")
    return <NdubaLandfillEnhanced role="Employee" />
  if (role === "Employee" && page === "Collection History")
    return <EmployeeCollectionHistoryPage />
  if (role === "Employee" && page === "Report Problem")
    return <EmployeeReportProblemPage />
  return (
    <div className="space-y-4">
      <ContextWorkflow page={page} role={role} />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400">
          <Search size={17} />
          <input
            className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${page.toLowerCase()}...`}
            value={query}
          />
        </label>
        <button
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={() => downloadCsv(role)}
        >
          <Download size={16} />
          Export CSV
        </button>
        <button className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
          Add new
        </button>
      </div>
      <OperationsTable role={role} title={`${page} records`} />
    </div>
  )
}

function EmployeeCommonStatus({
  profile,
}: {
  profile?: SessionProfile | null
}) {
  const employee = {
    name: profile?.name ?? "Eric Niyonzima",
    role: profile?.category ?? "Driver",
    assignment:
      profile?.task ?? "Complete 18 assigned collection stops in Nyarugunga",
    team: profile?.assignment?.includes("Team")
      ? (profile.assignment
          .split("·")
          .find((item) => item.includes("Team"))
          ?.trim() ?? "Team Alpha")
      : "Team Alpha",
    vehicle: profile?.assignment?.match(/RW\s\d+\s[A-Z]/)?.[0] ?? "RW 412 A",
  }
  return (
    <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Employee & role
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {employee.name} · {employee.role}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Today’s assignment
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {employee.assignment}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Team & vehicle
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {employee.team} · {employee.vehicle}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Current status
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            On route · Shift active
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 border-t border-emerald-200 pt-4 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Bell className="text-emerald-700" size={15} />
          <strong>2 notifications</strong>
          <span>· one unread</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Check className="text-emerald-700" size={15} />
          <strong>12 completed</strong>
          <span>· 6 remaining</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <AlertTriangle className="text-slate-900" size={15} />
          <strong>1 problem</strong>
          <span>· access issue</span>
        </div>
      </div>
    </div>
  )
}

function Workspace({
  role,
  onLogout,
}: {
  role: Role
  onLogout: () => void
}) {
  const [page, setPage] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const config = roleConfig[role]
  const currentProfile = JSON.parse(
    localStorage.getItem("ecoroute-current-user") ?? "null",
  ) as SessionProfile | null

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-950">
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        onPage={setPage}
        open={sidebarOpen}
        page={page}
        profile={currentProfile}
        role={role}
      />
      <div className="lg:pl-72">
        <Header
          onCommunication={() => setPage("Communication")}
          onMenu={() => setSidebarOpen(true)}
          onLogout={onLogout}
          page={page}
          role={role}
        />
        <main className="mx-auto max-w-[1450px] px-5 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-px w-6 bg-emerald-600" />
                {page === "Dashboard" ? config.eyebrow : config.workspace}
              </div>
              <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 md:text-4xl">
                {page === "Dashboard"
                  ? role === "Customer"
                    ? `Good morning, ${currentProfile?.name || "Customer"}`
                    : config.title
                  : page}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {page === "Dashboard"
                  ? config.subtitle
                  : page === "Profile & Settings"
                    ? "Manage your profile, account security, notifications and preferences."
                    : `Manage ${page.toLowerCase()} from one connected workspace.`}
              </p>
            </div>
            {role !== "Customer" && (
              <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100 sm:self-auto">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
                </span>
                {config.status}
              </div>
            )}
          </div>
          <QuickActions
            nav={config.nav.map((item) => item.label)}
            onPage={setPage}
            page={page}
            role={role}
          />
          {role === "Employee" && (
            <EmployeeCommonStatus profile={currentProfile} />
          )}
          {role === "Finance" && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              <CircleAlert
                className="mt-0.5 shrink-0 text-blue-700"
                size={18}
              />
              <p>
                <strong>Prototype data:</strong> No live payment provider is
                connected. These records demonstrate the workflow; production
                statuses must come from the EcoRoute backend after provider
                webhook verification.
              </p>
            </div>
          )}
          {page === "Dashboard" ? (
            ["Admin", "Manager", "Finance", "Customer"].includes(role) ? (
              <ConnectedDashboard
                onPage={setPage}
                profile={currentProfile}
                role={role}
              />
            ) : (
              <Dashboard
                onPage={setPage}
                profile={currentProfile}
                role={role}
              />
            )
          ) : page === "Profile & Settings" ? (
            <UnifiedProfileSettings profile={currentProfile} role={role} />
          ) : (
            <ModulePage onPage={setPage} page={page} role={role} />
          )}
          <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center">
            <p>EcoRoute prototype · Kigali, Rwanda</p>
            <a
              className="flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-900 sm:ml-auto"
              download
              href="/EcoRoute-System-Specification.docx"
            >
              <Download size={14} />
              Download system specification
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [sessionRole, setSessionRole] = useState<Role | null>(null)

  if (!sessionRole) {
    return (
      <StoreProvider>
        <Suspense
          fallback={
            <div className="grid min-h-screen place-items-center bg-[#fbfcf7] text-sm font-semibold text-emerald-800">
              Loading EcoRoute…
            </div>
          }
        >
          <PublicSite onAuthorized={setSessionRole} />
        </Suspense>
      </StoreProvider>
    )
  }

  return (
    <StoreProvider>
      <Workspace
        onLogout={() => {
          localStorage.removeItem("ecoroute-current-user")
          setSessionRole(null)
        }}
        role={sessionRole}
      />
    </StoreProvider>
  )
}
