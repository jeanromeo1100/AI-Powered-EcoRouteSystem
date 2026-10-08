import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  generateAllCustomers,
  generateTodayCollections,
  generateOverdueAccounts,
  initialFleetVehicles,
  initialLandfillTrips,
  initialActiveSessions,
  initialPermissionMatrix,
  initialSecurityPolicy,
  initialDatabaseBackups,
  initialScheduledSmsList,
  initialReconciliationTransactions,
  turnByTurnDirections,
  type CustomerRecord,
  type CollectionRecord,
  type OverdueAccount,
  type Vehicle,
  type TripRecord,
  type LandfillTrip,
  type ScheduledSms,
  type ActiveSession,
} from "./ecoRouteData"

export type {
  CustomerRecord,
  CollectionRecord,
  OverdueAccount,
  Vehicle,
  TripRecord,
  LandfillTrip,
  ScheduledSms,
  ActiveSession,
}

export type CompanyStatus = "Active" | "Pending" | "Suspended" | "Rejected"
export type Company = {
  id: string
  name: string
  type: "Waste operator" | "Municipal partner"
  license: string
  contact: string
  phone: string
  email: string
  address: string
  requested: string
  users: number
  status: CompanyStatus
  history: string[]
  rejectionReason?: string
  isNew?: boolean
  activeCollections?: boolean
  province?: string
  district?: string
  sector?: string
  cell?: string
  street?: string
  building?: string
  description?: string
  officePhone?: string
  verificationDocument?: string
}
export type Message = {
  id: string
  role: "Admin" | "Manager" | "Finance" | "Employee" | "Customer"
  title: string
  text: string
  time: string
  channel: "App" | "SMS" | "App + SMS"
  unread: boolean
  action?: string
  recipientId?: string
  team?: string
  location?: string
  audience?: string
  sentBy?: string
}
export type Invoice = {
  id: string
  customerId: string
  period: string
  plan: string
  amount: number
  due: string
  status: "Paid" | "Unpaid" | "Overdue" | "Partially paid"
  paid?: number
}
export type Payment = {
  id: string
  customerId: string
  invoiceId: string
  amount: number
  method: string
  reference: string
  date: string
  status: "Paid" | "Pending confirmation" | "Failed"
  recordedBy: string
  manual?: boolean
}
export type Employee = {
  id: string
  name: string
  phone: string
  email: string
  type: string
  department: string
  team: string
  salary: number
  salaryType: string
  startDate: string
  status: string
  vehicle?: string
}
export type RegisteredCustomer = {
  id: string
  name: string
  phone: string
  email: string
  province: string
  district: string
  sector: string
  cell: string
  address: string
  customerType: string
  estimatedWaste: number
  plan: string
  fee: number
  assignedCompanyId: string
  assignedCompany: string
  status: "Active"
  created: string
}
export type Payroll = {
  employeeId: string
  month: string
  salary: number
  status: "Pending" | "Authorized" | "Paid"
  history: string[]
}
export type LogEntry = {
  id: string
  time: string
  user: string
  role: string
  action: string
  module: string
  record: string
  oldValue?: string
  newValue?: string
  device?: string
}

const today = () => new Date().toLocaleDateString("en-CA")
const now = () => new Date().toLocaleString("en-RW")
const company = (
  id: string,
  name: string,
  type: Company["type"],
  license: string,
  contact: string,
  users: number,
  status: CompanyStatus,
  extra: Partial<Company> = {},
): Company => ({
  id,
  name,
  type,
  license,
  contact,
  users,
  status,
  phone: "+250 788 000 000",
  email: `${name
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/\.$/, "")}@example.rw`,
  address: "Kigali, Rwanda",
  requested: status === "Pending" ? "2026-10-06" : "2026-08-14",
  history: [
    `${status} · ${status === "Pending" ? "06 Oct 2026" : "14 Aug 2026"}`,
  ],
  ...extra,
})

const initialCompanies: Company[] = [
  company(
    "COM-2017",
    "Kigali Clean City",
    "Municipal partner",
    "LIC-2088",
    "Mugisha David",
    1,
    "Pending",
  ),
  company(
    "COM-2016",
    "EcoSafe Rwanda",
    "Waste operator",
    "LIC-2091",
    "Mutesi Alice",
    1,
    "Pending",
  ),
  company(
    "COM-2015",
    "Umucyo Recycling",
    "Waste operator",
    "LIC-2094",
    "Uwimana Grace",
    1,
    "Pending",
  ),
  company(
    "COM-2001",
    "Simate Garbage Ltd",
    "Waste operator",
    "LIC-2031",
    "Diane Mukamana",
    18,
    "Active",
    { activeCollections: true },
  ),
  company(
    "COM-2002",
    "Isuku Iwacu Services",
    "Waste operator",
    "LIC-2044",
    "Emmanuel Rukundo",
    12,
    "Active",
  ),
  company(
    "COM-2003",
    "Isuku Kinyinya",
    "Waste operator",
    "LIC-2047",
    "Aline Uwera",
    9,
    "Active",
  ),
  company(
    "COM-2004",
    "Gasabo Green Services",
    "Municipal partner",
    "LIC-2050",
    "Eric Niyonzima",
    14,
    "Active",
  ),
  company(
    "COM-2005",
    "Kicukiro Waste Solutions",
    "Waste operator",
    "LIC-2052",
    "Patrick Habimana",
    8,
    "Active",
  ),
  company(
    "COM-2006",
    "Nyarugenge Sanitation",
    "Municipal partner",
    "LIC-2055",
    "Claudine Uwase",
    15,
    "Active",
  ),
  company(
    "COM-2007",
    "Ireme Eco Services",
    "Waste operator",
    "LIC-2059",
    "Jean Bosco",
    7,
    "Active",
  ),
  company(
    "COM-2008",
    "Virunga Recycling Co",
    "Waste operator",
    "LIC-2062",
    "Keza Bella",
    11,
    "Active",
  ),
  company(
    "COM-2009",
    "Imena Environmental",
    "Waste operator",
    "LIC-2066",
    "Mugabo Claude",
    6,
    "Active",
  ),
  company(
    "COM-2010",
    "Twisungane Waste Co",
    "Waste operator",
    "LIC-2071",
    "Mukamana Rose",
    10,
    "Active",
  ),
  company(
    "COM-2011",
    "Akagera Circular Ltd",
    "Waste operator",
    "LIC-2075",
    "Ndayisenga Paul",
    13,
    "Active",
  ),
  company(
    "COM-2012",
    "Intego Sanitation Ltd",
    "Waste operator",
    "LIC-2080",
    "Uwamahoro Diane",
    5,
    "Active",
  ),
  company(
    "COM-2013",
    "Ubumwe Waste Services",
    "Waste operator",
    "LIC-1988",
    "Mugenzi Claude",
    4,
    "Suspended",
  ),
  company(
    "COM-2014",
    "CleanWave Ltd",
    "Waste operator",
    "LIC-1994",
    "Kayitesi Marie",
    1,
    "Rejected",
    { rejectionReason: "Incomplete license documents" },
  ),
]

export const servicePlans = [
  {
    name: "Household Basic",
    type: "Household",
    kg: "Up to 120 kg / month",
    waste: "General",
    period: "Monthly",
    price: 5000,
    status: "Active",
  },
  {
    name: "Household Standard",
    type: "Household",
    kg: "Up to 240 kg / month",
    waste: "General, Organic, Recyclable",
    period: "Monthly",
    price: 6000,
    status: "Active",
  },
  {
    name: "Household Large / Shared compound",
    type: "Household",
    kg: "Up to 500 kg / month",
    waste: "General, Organic, Recyclable",
    period: "Monthly",
    price: 10000,
    status: "Active",
  },
  {
    name: "Business Weekly",
    type: "Business",
    kg: "Up to 150 kg / week",
    waste: "Commercial",
    period: "Weekly",
    price: 5000,
    status: "Active",
  },
  {
    name: "Company / Institution",
    type: "Company / Institution",
    kg: "Over 1,000 kg / month",
    waste: "Bulky or mixed",
    period: "Monthly",
    price: 20000,
    status: "Active",
  },
  {
    name: "Custom",
    type: "Any",
    kg: "Custom",
    waste: "Custom",
    period: "Monthly / Weekly",
    price: 0,
    status: "Active",
  },
]

export const locations = [
  {
    name: "Nyarugunga",
    district: "Kicukiro",
    day: "Monday",
    route: "KG 45",
    vehicle: "RW 412 A",
    team: "Team Alpha",
    driver: "Eric Niyonzima",
  },
  {
    name: "Remera",
    district: "Gasabo",
    day: "Tuesday",
    route: "KG 11",
    vehicle: "RW 307 K",
    team: "Team Delta",
    driver: "Claude Mugenzi",
  },
  {
    name: "Niboye",
    district: "Kicukiro",
    day: "Wednesday",
    route: "KK 15",
    vehicle: "RW 118 T",
    team: "Team Bravo",
    driver: "Alice Uwera",
  },
  {
    name: "Nyamirambo",
    district: "Nyarugenge",
    day: "Thursday",
    route: "KN 07",
    vehicle: "RW 922 D",
    team: "Team Echo",
    driver: "Patrick Tuyishime",
  },
  {
    name: "Kimironko",
    district: "Gasabo",
    day: "Friday",
    route: "KG 18",
    vehicle: "RW 551 C",
    team: "Team Kivu",
    driver: "Emmanuel Karemera",
  },
  {
    name: "Gasaraba",
    district: "Kicukiro",
    day: "Saturday",
    route: "KK 22",
    vehicle: "RW 684 M",
    team: "Team Ubumwe",
    driver: "Aline Mukamana",
  },
]

export const customers: CustomerRecord[] = generateAllCustomers()


const initialInvoices: Invoice[] = [
  {
    id: "INV-2026-00098",
    customerId: "CUS-2048",
    period: "September 2026",
    plan: "Household Standard",
    amount: 6000,
    due: "10 Sep 2026",
    status: "Paid",
    paid: 6000,
  },
  {
    id: "INV-2026-00125",
    customerId: "CUS-2048",
    period: "October 2026",
    plan: "Household Standard",
    amount: 6000,
    due: "10 Oct 2026",
    status: "Unpaid",
  },
  {
    id: "INV-2026-00127",
    customerId: "CUS-2051",
    period: "October 2026",
    plan: "Household Basic",
    amount: 5000,
    due: "10 Oct 2026",
    status: "Unpaid",
  },
  {
    id: "INV-2026-00128",
    customerId: "CUS-2055",
    period: "October 2026",
    plan: "Household Large / Shared compound",
    amount: 10000,
    due: "10 Oct 2026",
    status: "Paid",
    paid: 10000,
  },
  {
    id: "INV-2026-00129",
    customerId: "CUS-2060",
    period: "Week 41",
    plan: "Business Weekly",
    amount: 5000,
    due: "09 Oct 2026",
    status: "Unpaid",
  },
  {
    id: "INV-2026-00130",
    customerId: "CUS-2064",
    period: "October 2026",
    plan: "Company / Institution",
    amount: 20000,
    due: "10 Oct 2026",
    status: "Paid",
    paid: 20000,
  },
]

const initialPayments: Payment[] = [
  {
    id: "RCT-4081",
    customerId: "CUS-2048",
    invoiceId: "INV-2026-00098",
    amount: 6000,
    method: "MTN MoMo",
    reference: "TXN-90284",
    date: "04 Oct 2026",
    status: "Paid",
    recordedBy: "Mobile Money",
  },
  {
    id: "RCT-4077",
    customerId: "CUS-2055",
    invoiceId: "INV-2026-00128",
    amount: 10000,
    method: "Airtel Money",
    reference: "TXN-90142",
    date: "03 Oct 2026",
    status: "Paid",
    recordedBy: "Mobile Money",
  },
  {
    id: "RCT-4070",
    customerId: "CUS-2064",
    invoiceId: "INV-2026-00130",
    amount: 20000,
    method: "Bank transfer",
    reference: "BNK-77301",
    date: "02 Oct 2026",
    status: "Paid",
    recordedBy: "Claudine Uwase",
  },
]

const initialMessages: Message[] = [
  {
    id: "MSG-1",
    role: "Customer",
    title: "October invoice due",
    text: "RWF 6,000 is due on 10 Oct 2026 for Household Standard.",
    time: "10 min ago",
    channel: "App + SMS",
    unread: true,
    action: "Pay now",
  },
  {
    id: "MSG-2",
    role: "Finance",
    title: "Payment received",
    text: "Aline Uwase paid RWF 10,000 via Airtel Money.",
    time: "25 min ago",
    channel: "App",
    unread: true,
    action: "View payment",
  },
  {
    id: "MSG-3",
    role: "Manager",
    title: "Daily payment summary",
    text: "3 payments received today totalling RWF 36,000.",
    time: "1 hour ago",
    channel: "App",
    unread: true,
    action: "View payments",
  },
  {
    id: "MSG-4",
    role: "Employee",
    title: "Route changed",
    text: "Route KG 45 now begins at Nyarugunga sector office.",
    time: "2 hours ago",
    channel: "App",
    unread: true,
    action: "View route",
  },
  {
    id: "MSG-5",
    role: "Admin",
    title: "Security review",
    text: "One locked account requires administrator review.",
    time: "3 hours ago",
    channel: "App",
    unread: true,
    action: "View user",
  },
]

const initialEmployees: Employee[] = [
  {
    id: "EMP-1001",
    name: "Eric Niyonzima",
    phone: "+250 788 121 212",
    email: "eric@ecoroute.rw",
    type: "Driver",
    department: "Operations",
    team: "Team Alpha",
    salary: 280000,
    salaryType: "Monthly fixed",
    startDate: "2025-01-10",
    status: "Active",
    vehicle: "RW 412 A",
  },
  {
    id: "EMP-1002",
    name: "Claudine Uwase",
    phone: "+250 788 343 434",
    email: "claudine@ecoroute.rw",
    type: "Finance Officer",
    department: "Finance",
    team: "Finance",
    salary: 420000,
    salaryType: "Monthly fixed",
    startDate: "2024-03-01",
    status: "Active",
  },
]
const initialPayroll: Payroll[] = initialEmployees.map((employee) => ({
  employeeId: employee.id,
  month: "October 2026",
  salary: employee.salary,
  status: "Pending",
  history: ["Created · Pending"],
}))

const initialLogs: LogEntry[] = [
  ["Claudine Uwase", "Finance", "Payment confirmed", "Payments", "INV-2026-00128", "Pending", "Paid", "Chrome · Windows"],
  ["Diane Mukamana", "Manager", "Route optimized", "Routes", "KG 45", "18.6 km", "14.2 km", "Safari · iPad"],
  ["Eric Niyonzima", "Employee", "Collection updated", "Collections", "CUS-2048", "In progress", "Completed", "EcoRoute Android"],
  ["System Administrator", "Admin", "Role changed", "Users", "USR-1042", "Dispatcher", "Manager", "Chrome · Windows"],
  ["Claudine Uwase", "Finance", "Account suspended", "Billing", "CUS-2055", "Warning", "Suspended", "Chrome · Windows"],
  ["Diane Mukamana", "Manager", "SMS sent", "Communication", "Nyarugunga zone", "Queued", "Delivered", "Safari · iPad"],
  ["Patrick Tuyishime", "Employee", "Trip completed", "Nduba", "NDB-261006-018", "At gate", "Completed", "EcoRoute Android"],
  ["Jean Romeo", "Customer", "Logged in", "Security", "CUS-2048", "Signed out", "Authenticated", "Chrome · Android"],
  ["Diane Mukamana", "Manager", "Route assigned", "Routes", "KG 45", "Planned", "Assigned", "Safari · iPad"],
  ["Claudine Uwase", "Finance", "Reminder sent", "Billing", "INV-2026-00136", "Due", "Reminder sent", "Chrome · Windows"],
  ["Eric Niyonzima", "Employee", "Route started", "Routes", "KG 45", "Assigned", "In progress", "EcoRoute Android"],
  ["System Administrator", "Admin", "User unlocked", "Security", "USR-1021", "Locked", "Active", "Chrome · Windows"],
  ["Aline Uwase", "Customer", "Payment initiated", "Payments", "INV-2026-00128", "Unpaid", "Waiting confirmation", "Safari · iPhone"],
  ["Diane Mukamana", "Manager", "Route changed", "Routes", "KK 15", "RW 118 T", "RW 307 K", "Safari · iPad"],
  ["Claudine Uwase", "Finance", "Invoice issued", "Invoices", "INV-2026-00139", "Draft", "Unpaid", "Chrome · Windows"],
  ["Eric Niyonzima", "Employee", "Missed collection reported", "Collections", "CUS-2074", "Scheduled", "Missed", "EcoRoute Android"],
  ["Diane Mukamana", "Manager", "Account reactivated", "Billing", "CUS-2071", "Suspended", "Active", "Safari · iPad"],
  ["System Administrator", "Admin", "Company approved", "Companies", "COM-1024", "Pending", "Active", "Chrome · Windows"],
  ["Claudine Uwase", "Finance", "Report exported", "Reports", "Billing October", "Not generated", "Excel exported", "Chrome · Windows"],
  ["Jean Romeo", "Customer", "SMS opened", "Communication", "MSG-1", "Delivered", "Read", "Chrome · Android"],
].map((entry, index) => ({
  id: `LOG-${index + 1}`,
  time: `06 Oct 2026, ${String(9 - Math.floor(index / 3)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`,
  user: entry[0],
  role: entry[1],
  action: entry[2],
  module: entry[3],
  record: entry[4],
  oldValue: entry[5],
  newValue: entry[6],
  device: entry[7],
}))

type Registration = Omit<Company, "id" | "requested" | "users" | "status" | "history"> & {
  password?: string
}
type Store = {
  companies: Company[]
  invoices: Invoice[]
  payments: Payment[]
  messages: Message[]
  employees: Employee[]
  registeredCustomers: RegisteredCustomer[]
  payroll: Payroll[]
  logs: LogEntry[]
  customerList: CustomerRecord[]
  collections: CollectionRecord[]
  overdueAccounts: OverdueAccount[]
  vehicles: Vehicle[]
  trips: TripRecord[]
  landfillTrips: LandfillTrip[]
  scheduledSms: ScheduledSms[]
  activeSessions: ActiveSession[]
  permissionMatrix: Record<string, Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>>
  securityPolicy: typeof initialSecurityPolicy
  backups: typeof initialDatabaseBackups
  reconciliation: typeof initialReconciliationTransactions
  billingConfig: {
    feeBasic: number
    feeStandard: number
    feeLarge: number
    feeBusiness: number
    feeInstitution: number
    cycle: string
    dueDay: number
    lateFeePercent: number
  }
  mobileMoneySettings: {
    mtnEnabled: boolean
    mtnMerchantCode: string
    mtnStatus: string
    airtelEnabled: boolean
    airtelMerchantCode: string
    airtelStatus: string
  }
  turnByTurn: typeof turnByTurnDirections
  metrics: {
    customersCount: number
    collectionsTodayCount: number
    collectionsCompletedCount: number
    collectionsInProgressCount: number
    collectionsPendingMissedCount: number
    overdueCount: number
    overdueTotal: number
    revenueToday: number
    landfillTripsCount: number
    landfillTonnesTotal: number
    smsSummary: { sent: number; delivered: number; failed: number }
    routeEfficiency: { kmSaved: number; fuelSavedPercent: number }
  }
  registerCompany: (data: Registration) => void
  registerCustomer: (
    data: Omit<RegisteredCustomer, "id" | "assignedCompanyId" | "assignedCompany" | "status" | "created" | "plan" | "fee"> & {
      password: string
    },
  ) => RegisteredCustomer
  updateCompany: (id: string, status: CompanyStatus, reason?: string) => void
  deleteCompany: (id: string) => string | null
  markMessage: (role: Message["role"], id?: string) => void
  sendMessage: (message: {
    audience: "Individual" | "Team" | "Customer" | "Location customers"
    target: string
    title: string
    text: string
    channel: Message["channel"]
  }) => number
  payInvoice: (
    invoiceId: string,
    method: string,
    recorder?: string,
    amount?: number,
    pending?: boolean,
  ) => Payment
  addEmployee: (employee: Employee) => void
  updatePayroll: (
    employeeId: string,
    status: Payroll["status"],
    actor: string,
  ) => void
  addLog: (entry: Omit<LogEntry, "id" | "time">) => void
  addCustomer: (c: Omit<CustomerRecord, "id">) => CustomerRecord
  updateCustomer: (id: string, data: Partial<CustomerRecord>) => void
  importCustomers: (imported: CustomerRecord[]) => void
  confirmCollection: (id: string, weightKg?: number, notes?: string) => void
  reportCollectionException: (id: string, reason: string) => void
  addVehicle: (v: Omit<Vehicle, "id" | "assignmentHistory">) => void
  updateVehicle: (id: string, data: Partial<Vehicle>) => void
  toggleVehicleStatus: (id: string, status: Vehicle["status"]) => void
  recordTrip: (trip: Omit<TripRecord, "id" | "timeline">) => void
  reportTripException: (tripId: string, exc: NonNullable<TripRecord["exception"]>) => void
  recordLandfillTrip: (trip: Omit<LandfillTrip, "id">) => void
  confirmLandfillDelivery: (id: string, ticketNo: string, netWeight: number, confirmedBy: string) => void
  scheduleSms: (sms: Omit<ScheduledSms, "id" | "createdAt" | "status">) => void
  cancelScheduledSms: (id: string) => void
  terminateSession: (sessionId: string) => void
  updatePermission: (role: string, module: string, perm: "view" | "create" | "edit" | "delete", val: boolean) => void
  savePermissionMatrix: () => void
  createBackup: () => void
  restoreBackup: (id: string) => void
  updateSecurityPolicy: (policy: Partial<typeof initialSecurityPolicy>) => void
  updateBillingConfig: (config: any) => void
  updateMobileMoneySettings: (settings: any) => void
  updateEnforcementAccount: (id: string, action: string, note?: string, nextStage?: OverdueAccount["stage"]) => void
  bulkEnforcementAction: (ids: string[], action: string) => void
  matchPaymentManually: (txnId: string, invoiceId: string) => void
}

const StoreContext = createContext<Store | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState(() =>
    load("ecoroute-companies-v3", initialCompanies),
  )
  const [invoices, setInvoices] = useState(() =>
    load("ecoroute-invoices-v3", initialInvoices),
  )
  const [payments, setPayments] = useState(() =>
    load("ecoroute-payments-v3", initialPayments),
  )
  const [messages, setMessages] = useState(() =>
    load("ecoroute-messages-v3", initialMessages),
  )
  const [employees, setEmployees] = useState(() =>
    load("ecoroute-employees-v3", initialEmployees),
  )
  const [registeredCustomers, setRegisteredCustomers] =
    useState<RegisteredCustomer[]>(() =>
      load("ecoroute-registered-customers-v1", []),
    )
  const [payroll, setPayroll] = useState(() =>
    load("ecoroute-payroll-v3", initialPayroll),
  )
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    load("ecoroute-logs-v4", initialLogs),
  )
  const [customerList, setCustomerList] = useState<CustomerRecord[]>(() =>
    load("ecoroute-customers-v4", customers),
  )
  const [collections, setCollections] = useState<CollectionRecord[]>(() =>
    load("ecoroute-collections-v4", generateTodayCollections(customers)),
  )
  const [overdueAccounts, setOverdueAccounts] = useState<OverdueAccount[]>(() =>
    load("ecoroute-overdue-v4", generateOverdueAccounts(customers)),
  )
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    load("ecoroute-vehicles-v4", initialFleetVehicles),
  )
  const [trips, setTrips] = useState<TripRecord[]>(() =>
    load("ecoroute-trips-v4", [
      {
        id: "TRP-261008-01",
        vehicle: "RW 412 A",
        driver: "Eric Niyonzima",
        route: "KG 18",
        zone: "Kimironko",
        startTime: "06:30",
        endTime: "08:15",
        distanceKm: 28.4,
        durationMins: 105,
        status: "Completed",
        timeline: [
          { time: "06:30", event: "Shift started from Gikondo Depot", location: "Depot" },
          { time: "07:15", event: "Reached Kimironko Market Hub", location: "KG 18" },
          { time: "08:15", event: "Completed morning round 1", location: "Kimironko" },
        ],
      },
      {
        id: "TRP-261008-02",
        vehicle: "RW 307 K",
        driver: "Claude Mugenzi",
        route: "KG 11",
        zone: "Remera",
        startTime: "06:45",
        distanceKm: 18.2,
        durationMins: 75,
        status: "In progress",
        timeline: [
          { time: "06:45", event: "Shift started", location: "Gikondo Depot" },
          { time: "07:20", event: "Collecting at Gisimenti sector", location: "KG 11" },
        ],
      },
    ]),
  )
  const [landfillTrips, setLandfillTrips] = useState<LandfillTrip[]>(() =>
    load("ecoroute-landfill-v4", initialLandfillTrips),
  )
  const [scheduledSms, setScheduledSms] = useState<ScheduledSms[]>(() =>
    load("ecoroute-scheduled-sms-v4", initialScheduledSmsList),
  )
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() =>
    load("ecoroute-active-sessions-v4", initialActiveSessions),
  )
  const [permissionMatrix, setPermissionMatrix] = useState(() =>
    load("ecoroute-permissions-v4", initialPermissionMatrix),
  )
  const [securityPolicy, setSecurityPolicy] = useState(() =>
    load("ecoroute-security-policy-v4", initialSecurityPolicy),
  )
  const [backups, setBackups] = useState(() =>
    load("ecoroute-backups-v4", initialDatabaseBackups),
  )
  const [reconciliation, setReconciliation] = useState(() =>
    load("ecoroute-reconcile-v4", initialReconciliationTransactions),
  )
  const [billingConfig, setBillingConfig] = useState(() =>
    load("ecoroute-billing-config-v4", {
      feeBasic: 5000,
      feeStandard: 6000,
      feeLarge: 10000,
      feeBusiness: 5000,
      feeInstitution: 20000,
      cycle: "Monthly",
      dueDay: 10,
      lateFeePercent: 5,
    }),
  )
  const [mobileMoneySettings, setMobileMoneySettings] = useState(() =>
    load("ecoroute-momo-settings-v4", {
      mtnEnabled: true,
      mtnMerchantCode: "154829",
      mtnStatus: "Online",
      airtelEnabled: true,
      airtelMerchantCode: "982140",
      airtelStatus: "Online",
    }),
  )

  const persist = <T,>(key: string, setter: (value: T) => void, value: T) => {
    setter(value)
    localStorage.setItem(key, JSON.stringify(value))
  }
  const addLog: Store["addLog"] = (entry) =>
    persist("ecoroute-logs-v4", setLogs, [
      { id: `LOG-${Date.now()}`, time: now(), ...entry },
      ...logs,
    ])
  const registerCompany: Store["registerCompany"] = (data) => {
    const next: Company = {
      ...data,
      id: `COM-${Date.now().toString().slice(-5)}`,
      requested: today(),
      users: 1,
      status: "Pending",
      history: [`Pending · ${today()}`],
      isNew: true,
    }
    persist("ecoroute-companies-v3", setCompanies, [next, ...companies])
    persist("ecoroute-messages-v3", setMessages, [
      {
        id: `MSG-${Date.now()}`,
        role: "Admin",
        title: "Company registration request",
        text: `${next.name} submitted a ${next.type.toLowerCase()} registration.`,
        time: "Just now",
        channel: "App",
        unread: true,
        action: "View company",
      },
      ...messages,
    ])
    addLog({
      user: next.contact,
      role: "Public",
      action: "Company registration submitted",
      module: "Companies",
      record: next.name,
    })
    localStorage.setItem(
      `ecoroute-company-login-${next.email.toLowerCase()}`,
      JSON.stringify({
        password: data.password,
        status: "Pending",
        companyId: next.id,
      }),
    )
  }
  const registerCustomer: Store["registerCustomer"] = (data) => {
    const { password, ...registration } = data
    const areaCompanies: Record<string, string> = {
      Nyarugunga: "Simate Garbage Ltd",
      Niboye: "Simate Garbage Ltd",
      Gahanga: "Simate Garbage Ltd",
      Remera: "Gasabo Green Services",
      Kimironko: "Gasabo Green Services",
      Kinyinya: "Isuku Kinyinya",
      Nyamirambo: "Nyarugenge Sanitation",
      Nyarugenge: "Nyarugenge Sanitation",
    }
    const preferredName =
      areaCompanies[data.sector] ||
      (data.province === "Kigali City"
        ? "Simate Garbage Ltd"
        : "Isuku Iwacu Services")
    const assigned =
      companies.find(
        (item) => item.name === preferredName && item.status === "Active",
      ) || companies.find((item) => item.status === "Active")!
    const suggested =
      data.customerType === "Business"
        ? servicePlans[3]
        : data.customerType === "Company / Institution"
          ? servicePlans[4]
          : data.estimatedWaste <= 120
            ? servicePlans[0]
            : data.estimatedWaste <= 240
              ? servicePlans[1]
              : servicePlans[2]
    const customer: RegisteredCustomer = {
      ...registration,
      id: `CUS-${Date.now().toString().slice(-5)}`,
      plan: suggested.name,
      fee: suggested.price,
      assignedCompanyId: assigned.id,
      assignedCompany: assigned.name,
      status: "Active",
      created: today(),
    }
    persist("ecoroute-registered-customers-v1", setRegisteredCustomers, [
      customer,
      ...registeredCustomers,
    ])
    const accounts = load<Array<{
      email: string
      password: string
      role: "Customer"
      name: string
      phone: string
      status: string
      customerId: string
      assignment: string
    }>>("ecoroute-created-accounts", [])
    localStorage.setItem(
      "ecoroute-created-accounts",
      JSON.stringify([
        {
          email: data.email.toLowerCase(),
          password,
          role: "Customer",
          name: data.name,
          phone: data.phone,
          status: "Active",
          customerId: customer.id,
          assignment: assigned.name,
        },
        ...accounts.filter(
          (account) => account.email !== data.email.toLowerCase(),
        ),
      ]),
    )
    addLog({
      user: data.name,
      role: "Customer",
      action: "Customer account created",
      module: "Users",
      record: `${customer.id} · Assigned to ${assigned.name}`,
    })
    return customer
  }
  const updateCompany: Store["updateCompany"] = (id, status, reason) => {
    const target = companies.find((item) => item.id === id)
    if (!target) return
    const next = companies.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            rejectionReason: reason || item.rejectionReason,
            isNew: false,
            history: [`${status} · ${now()}`, ...item.history],
          }
        : item,
    )
    persist("ecoroute-companies-v3", setCompanies, next)
    persist("ecoroute-messages-v3", setMessages, [
      {
        id: `MSG-${Date.now()}`,
        role: "Admin",
        title: `Company ${status.toLowerCase()}`,
        text: `${target.name} is now ${status.toLowerCase()}.`,
        time: "Just now",
        channel: "App",
        unread: false,
        action: "View company",
      },
      ...messages,
    ])
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: `Company ${status.toLowerCase()}`,
      module: "Companies",
      record: target.name,
    })
    const loginKey = `ecoroute-company-login-${target.email.toLowerCase()}`
    const login = load<Record<string, unknown>>(loginKey, {})
    localStorage.setItem(loginKey, JSON.stringify({ ...login, status, reason }))
  }
  const deleteCompany: Store["deleteCompany"] = (id) => {
    const target = companies.find((item) => item.id === id)
    if (!target) return null
    if (target.activeCollections) return "Suspend or reassign operations first."
    persist(
      "ecoroute-companies-v3",
      setCompanies,
      companies.filter((item) => item.id !== id),
    )
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Company deleted",
      module: "Companies",
      record: target.name,
    })
    return null
  }
  const markMessage: Store["markMessage"] = (role, id) =>
    persist(
      "ecoroute-messages-v3",
      setMessages,
      messages.map((item) =>
        item.role === role &&
        (!id || item.id === id) &&
        (role !== "Customer" ||
          ((!item.recipientId || item.recipientId === "CUS-2048") &&
            (!item.location || item.location === "Nyarugunga"))) &&
        (role !== "Employee" ||
          ((!item.recipientId || item.recipientId === "EMP-1001") &&
            (!item.team || item.team === "Team Alpha")))
          ? { ...item, unread: false }
          : item,
      ),
    )
  const sendMessage: Store["sendMessage"] = ({
    audience,
    target,
    title,
    text,
    channel,
  }) => {
    const base = {
      title,
      text,
      time: "Just now",
      channel,
      unread: true,
      audience: `${audience}: ${target}`,
      sentBy: "Diane Mukamana",
    } as const
    let deliveries: Message[] = []
    if (audience === "Location customers") {
      deliveries = customers
        .filter((customer) => customer.location === target)
        .map((customer, index) => ({
          ...base,
          id: `MSG-${Date.now()}-${index}`,
          role: "Customer",
          recipientId: customer.id,
          location: target,
        }))
    } else if (audience === "Customer") {
      deliveries = [
        {
          ...base,
          id: `MSG-${Date.now()}`,
          role: "Customer",
          recipientId: target,
        },
      ]
    } else if (audience === "Team") {
      deliveries = employees
        .filter((employee) => employee.team === target)
        .map((employee, index) => ({
          ...base,
          id: `MSG-${Date.now()}-${index}`,
          role:
            employee.type === "Finance Officer"
              ? "Finance"
              : employee.type === "Manager"
                ? "Manager"
                : "Employee",
          recipientId: employee.id,
          team: target,
        }))
    } else {
      const customer = customers.some((item) => item.id === target)
      const employee = employees.find((item) => item.id === target)
      deliveries = [
        {
          ...base,
          id: `MSG-${Date.now()}`,
          role: customer
            ? "Customer"
            : employee?.type === "Finance Officer"
              ? "Finance"
              : employee?.type === "Manager"
                ? "Manager"
                : "Employee",
          recipientId: target,
        },
      ]
    }
    persist("ecoroute-messages-v3", setMessages, [...deliveries, ...messages])
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Message sent",
      module: "Communication",
      record: `${audience}: ${target} (${deliveries.length} delivered)`,
    })
    return deliveries.length
  }
  const payInvoice: Store["payInvoice"] = (
    invoiceId,
    method,
    recorder = "Jean Romeo",
    amount,
    pending = false,
  ) => {
    const invoice = invoices.find((item) => item.id === invoiceId)!
    const customer = customers.find((item) => item.id === invoice.customerId)!
    const paidAmount = amount ?? invoice.amount
    const payment: Payment = {
      id: `RCT-${Date.now().toString().slice(-4)}`,
      customerId: customer.id,
      invoiceId,
      amount: paidAmount,
      method,
      reference: method.toLowerCase().includes("airtel")
        ? `AM-261007-${Date.now().toString().slice(-5)}`
        : method.toLowerCase().includes("mtn")
          ? `MP261007.1532.A${Date.now().toString().slice(-5)}`
          : `TXN-${Date.now().toString().slice(-5)}`,
      date: now(),
      status: pending ? "Pending confirmation" : "Paid",
      recordedBy: recorder,
      manual: recorder !== "Jean Romeo",
    }
    persist("ecoroute-payments-v3", setPayments, [payment, ...payments])
    if (!pending)
      persist(
        "ecoroute-invoices-v3",
        setInvoices,
        invoices.map((item) =>
          item.id === invoiceId
            ? {
                ...item,
                status: paidAmount < item.amount ? "Partially paid" : "Paid",
                paid: paidAmount,
              }
            : item,
        ),
      )
    const paymentMessages: Message[] = [
      {
        id: `MSG-C-${Date.now()}`,
        role: "Customer",
        title: pending ? "Payment pending" : "Payment received",
        text: pending
          ? `Your payment for ${invoice.period} is pending confirmation.`
          : `Payment received RWF ${paidAmount.toLocaleString()} for ${invoice.period}. Receipt ${payment.id}`,
        time: "Just now",
        channel: "App + SMS",
        unread: true,
        action: "View payment",
      },
      {
        id: `MSG-F-${Date.now()}`,
        role: "Finance",
        title: pending ? "Pending confirmation" : "Customer payment received",
        text: `${customer.name} (${customer.id}) has paid RWF ${paidAmount.toLocaleString()} for ${invoice.period}, ${customer.period.toLowerCase()} waste collection, ${customer.plan}, ${customer.location}, via ${method} (${payment.reference}).`,
        time: "Just now",
        channel: "App",
        unread: true,
        action: "View payment",
      },
      {
        id: `MSG-M-${Date.now()}`,
        role: "Manager",
        title: "Daily payment summary updated",
        text: `${customer.name}'s RWF ${paidAmount.toLocaleString()} payment was added to today's summary.`,
        time: "Just now",
        channel: "App",
        unread: true,
        action: "View payments",
      },
    ]
    persist("ecoroute-messages-v3", setMessages, [
      ...paymentMessages,
      ...messages,
    ])
    addLog({
      user: recorder,
      role:
        recorder === "Jean Romeo"
          ? "Customer"
          : recorder.includes("Diane")
            ? "Manager"
            : "Finance",
      action: payment.manual ? "Manual payment recorded" : "Payment confirmed",
      module: "Payments",
      record: payment.id,
    })
    return payment
  }
  const addEmployee: Store["addEmployee"] = (employee) => {
    persist("ecoroute-employees-v3", setEmployees, [employee, ...employees])
    persist("ecoroute-payroll-v3", setPayroll, [
      {
        employeeId: employee.id,
        month: "October 2026",
        salary: employee.salary,
        status: "Pending",
        history: ["Created · Pending"],
      },
      ...payroll,
    ])
    const accounts = load<Record<string, unknown>[]>(
      "ecoroute-employee-accounts",
      [],
    )
    localStorage.setItem(
      "ecoroute-employee-accounts",
      JSON.stringify([
        {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role:
            employee.type === "Finance Officer"
              ? "Finance"
              : employee.type === "Driver" ||
                  employee.type === "Collection Staff"
                ? "Driver / Collection Team"
                : "Manager",
          status: "Pending invitation",
        },
        ...accounts,
      ]),
    )
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Employee created",
      module: "Employees",
      record: employee.id,
    })
  }
  const updatePayroll: Store["updatePayroll"] = (employeeId, status, actor) => {
    persist(
      "ecoroute-payroll-v3",
      setPayroll,
      payroll.map((item) =>
        item.employeeId === employeeId
          ? {
              ...item,
              status,
              history: [`${status} · ${now()} · ${actor}`, ...item.history],
            }
          : item,
      ),
    )
    const employee = employees.find((item) => item.id === employeeId)
    addLog({
      user: actor,
      role: status === "Authorized" ? "Manager" : "Finance",
      action: `Salary ${status.toLowerCase()}`,
      module: "Payroll",
      record: employee?.name || employeeId,
    })
    if (status === "Paid")
      persist("ecoroute-messages-v3", setMessages, [
        {
          id: `MSG-S-${Date.now()}`,
          role: "Employee",
          title: "Salary paid",
          text: "Your salary for October 2026 has been paid.",
          time: "Just now",
          channel: "App",
          unread: true,
        },
        ...messages,
      ])
  }

  const addCustomer: Store["addCustomer"] = (data) => {
    const newCust: CustomerRecord = {
      ...data,
      id: `CUS-${Date.now().toString().slice(-5)}`,
      createdDate: today(),
    }
    const updated = [newCust, ...customerList]
    persist("ecoroute-customers-v4", setCustomerList, updated)
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Customer registered",
      module: "Customers",
      record: `${newCust.name} (${newCust.id}) · ${newCust.zone}`,
    })
    return newCust
  }

  const updateCustomer: Store["updateCustomer"] = (id, data) => {
    const updated = customerList.map((c) => (c.id === id ? { ...c, ...data } : c))
    persist("ecoroute-customers-v4", setCustomerList, updated)
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Customer details updated",
      module: "Customers",
      record: id,
    })
  }

  const importCustomers: Store["importCustomers"] = (imported) => {
    const updated = [...imported, ...customerList]
    persist("ecoroute-customers-v4", setCustomerList, updated)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Batch customers imported",
      module: "Customers",
      record: `${imported.length} customer records`,
    })
  }

  const confirmCollection: Store["confirmCollection"] = (id, weightKg, notes) => {
    const target = collections.find((c) => c.id === id)
    const updated = collections.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "Completed" as const,
            completedAt: now().split(", ")[1]?.slice(0, 5) || "10:30",
            weightKg: weightKg || c.weightKg || 32,
            notes: notes || "Collection confirmed and completed.",
          }
        : c,
    )
    persist("ecoroute-collections-v4", setCollections, updated)
    addLog({
      user: target?.driver || "Eric Niyonzima",
      role: "Employee",
      action: "Collection completed",
      module: "Collections",
      record: `${target?.customerName || id} · ${target?.zone}`,
    })
  }

  const reportCollectionException: Store["reportCollectionException"] = (id, reason) => {
    const target = collections.find((c) => c.id === id)
    const updated = collections.map((c) =>
      c.id === id
        ? {
            ...c,
            status: "Missed" as const,
            missedReason: reason,
            notes: `Exception flagged: ${reason}`,
          }
        : c,
    )
    persist("ecoroute-collections-v4", setCollections, updated)
    addLog({
      user: target?.driver || "Eric Niyonzima",
      role: "Employee",
      action: "Collection exception reported",
      module: "Collections",
      record: `${target?.customerName || id}: ${reason}`,
    })
  }

  const addVehicle: Store["addVehicle"] = (v) => {
    const newV: Vehicle = {
      ...v,
      id: `VEH-${Date.now().toString().slice(-4)}`,
      assignmentHistory: [
        {
          date: today(),
          route: v.currentRoute,
          driver: v.driver,
          action: "Vehicle added to fleet",
        },
      ],
    }
    persist("ecoroute-vehicles-v4", setVehicles, [newV, ...vehicles])
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Fleet vehicle added",
      module: "Fleet",
      record: `${newV.plateNumber} (${newV.model})`,
    })
  }

  const updateVehicle: Store["updateVehicle"] = (id, data) => {
    const updated = vehicles.map((v) =>
      v.id === id
        ? {
            ...v,
            ...data,
            assignmentHistory:
              data.currentRoute && data.currentRoute !== v.currentRoute
                ? [
                    {
                      date: today(),
                      route: data.currentRoute,
                      driver: data.driver || v.driver,
                      action: `Route reassigned to ${data.currentRoute}`,
                    },
                    ...v.assignmentHistory,
                  ]
                : v.assignmentHistory,
          }
        : v,
    )
    persist("ecoroute-vehicles-v4", setVehicles, updated)
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Vehicle updated",
      module: "Fleet",
      record: id,
    })
  }

  const toggleVehicleStatus: Store["toggleVehicleStatus"] = (id, status) => {
    const updated = vehicles.map((v) => (v.id === id ? { ...v, status } : v))
    persist("ecoroute-vehicles-v4", setVehicles, updated)
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: `Vehicle status changed to ${status}`,
      module: "Fleet",
      record: id,
    })
  }

  const recordTrip: Store["recordTrip"] = (t) => {
    const newTrip: TripRecord = {
      ...t,
      id: `TRP-${Date.now().toString().slice(-6)}`,
      timeline: [
        { time: t.startTime, event: "Trip started", location: `${t.route} Start Point` },
      ],
    }
    persist("ecoroute-trips-v4", setTrips, [newTrip, ...trips])
    addLog({
      user: t.driver,
      role: "Employee",
      action: "Trip initiated",
      module: "Trips",
      record: `${newTrip.id} · ${t.vehicle} · ${t.route}`,
    })
  }

  const reportTripException: Store["reportTripException"] = (tripId, exc) => {
    const updated = trips.map((t) =>
      t.id === tripId ? { ...t, exception: exc } : t,
    )
    persist("ecoroute-trips-v4", setTrips, updated)
    addLog({
      user: exc.reportedBy,
      role: "Employee",
      action: `Trip exception: ${exc.type}`,
      module: "Trips",
      record: `${tripId}: ${exc.details}`,
    })
  }

  const recordLandfillTrip: Store["recordLandfillTrip"] = (lt) => {
    const newLandfill: LandfillTrip = {
      ...lt,
      id: `NDB-${Date.now().toString().slice(-6)}`,
    }
    persist("ecoroute-landfill-v4", setLandfillTrips, [newLandfill, ...landfillTrips])
    addLog({
      user: lt.driver,
      role: "Employee",
      action: "Nduba Landfill haul recorded",
      module: "Landfill",
      record: `${newLandfill.ticketNo} · ${lt.vehicle} · ${lt.netWeightTonnes} t`,
    })
  }

  const confirmLandfillDelivery: Store["confirmLandfillDelivery"] = (
    id,
    ticketNo,
    netWeight,
    confirmedBy,
  ) => {
    const updated = landfillTrips.map((lt) =>
      lt.id === id
        ? {
            ...lt,
            ticketNo,
            netWeightTonnes: netWeight,
            status: "Completed" as const,
            confirmedBy,
            confirmedAt: now(),
          }
        : lt,
    )
    persist("ecoroute-landfill-v4", setLandfillTrips, updated)
    addLog({
      user: confirmedBy,
      role: "Operations Staff",
      action: "Weighbridge delivery confirmed",
      module: "Landfill",
      record: `Ticket ${ticketNo} · ${netWeight} Tonnes`,
    })
  }

  const scheduleSms: Store["scheduleSms"] = (smsData) => {
    const newSms: ScheduledSms = {
      ...smsData,
      id: `SMS-SCH-${Date.now().toString().slice(-4)}`,
      status: "Scheduled",
      createdAt: now(),
    }
    persist("ecoroute-scheduled-sms-v4", setScheduledSms, [newSms, ...scheduledSms])
    addLog({
      user: smsData.createdBy,
      role: "Manager",
      action: "SMS dispatch scheduled",
      module: "Communication",
      record: `${smsData.recipientGroup}: ${smsData.targetName} (${smsData.scheduledDate} ${smsData.scheduledTime})`,
    })
  }

  const cancelScheduledSms: Store["cancelScheduledSms"] = (id) => {
    const updated = scheduledSms.map((s) =>
      s.id === id ? { ...s, status: "Cancelled" as const } : s,
    )
    persist("ecoroute-scheduled-sms-v4", setScheduledSms, updated)
    addLog({
      user: "Diane Mukamana",
      role: "Manager",
      action: "Scheduled SMS cancelled",
      module: "Communication",
      record: id,
    })
  }

  const terminateSession: Store["terminateSession"] = (sessionId) => {
    const updated = activeSessions.filter((s) => s.id !== sessionId)
    persist("ecoroute-active-sessions-v4", setActiveSessions, updated)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Session terminated remotely",
      module: "Security",
      record: sessionId,
    })
  }

  const updatePermission: Store["updatePermission"] = (role, module, perm, val) => {
    setPermissionMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: {
          ...prev[role]?.[module],
          [perm]: val,
        },
      },
    }))
  }

  const savePermissionMatrix: Store["savePermissionMatrix"] = () => {
    persist("ecoroute-permissions-v4", setPermissionMatrix, permissionMatrix)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Permission matrix saved",
      module: "Security",
      record: "Role-Module Access Matrix",
    })
  }

  const createBackup: Store["createBackup"] = () => {
    const newBak = {
      id: `BAK-${Date.now().toString().slice(-6)}`,
      name: `manual_snapshot_${Date.now()}.sql.gz`,
      sizeMb: 24.9,
      checksum: `sha256:${Date.now().toString(16)}...${Math.random().toString(16).slice(2, 6)}`,
      createdAt: now(),
      type: "Manual",
      status: "Healthy",
    }
    const updated = [newBak, ...backups]
    persist("ecoroute-backups-v4", setBackups, updated)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Database backup created",
      module: "System",
      record: newBak.name,
    })
  }

  const restoreBackup: Store["restoreBackup"] = (id) => {
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Database restored from snapshot",
      module: "System",
      record: id,
    })
  }

  const updateSecurityPolicy: Store["updateSecurityPolicy"] = (policy) => {
    const updated = { ...securityPolicy, ...policy }
    persist("ecoroute-security-policy-v4", setSecurityPolicy, updated)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Security policy updated",
      module: "Security",
      record: "Password & session thresholds",
    })
  }

  const updateBillingConfig: Store["updateBillingConfig"] = (cfg) => {
    const updated = { ...billingConfig, ...cfg }
    persist("ecoroute-billing-config-v4", setBillingConfig, updated)
    addLog({
      user: "Claudine Uwase",
      role: "Finance",
      action: "Billing configuration updated",
      module: "Billing",
      record: "Tariffs and grace periods",
    })
  }

  const updateMobileMoneySettings: Store["updateMobileMoneySettings"] = (settings) => {
    const updated = { ...mobileMoneySettings, ...settings }
    persist("ecoroute-momo-settings-v4", setMobileMoneySettings, updated)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "Mobile money provider settings saved",
      module: "Integrations",
      record: "MTN MoMo & Airtel Money gateway",
    })
  }

  const updateEnforcementAccount: Store["updateEnforcementAccount"] = (
    id,
    action,
    note,
    nextStage,
  ) => {
    const updated = overdueAccounts.map((a) =>
      a.id === id
        ? {
            ...a,
            stage: nextStage || a.stage,
            lastAction: `${action}${note ? `: ${note}` : ""} · Just now`,
            status: action.includes("Resolve") ? ("Resolved" as const) : a.status,
          }
        : a,
    )
    persist("ecoroute-overdue-v4", setOverdueAccounts, updated)
    addLog({
      user: "Claudine Uwase",
      role: "Finance",
      action: `Enforcement action: ${action}`,
      module: "Enforcement",
      record: `${id}: ${note || action}`,
    })
  }

  const bulkEnforcementAction: Store["bulkEnforcementAction"] = (ids, action) => {
    const updated = overdueAccounts.map((a) =>
      ids.includes(a.id)
        ? {
            ...a,
            lastAction: `${action} (bulk) · Just now`,
            stage:
              action === "Send warning"
                ? ("Warning" as const)
                : action === "Escalate to Manager"
                  ? ("Legal" as const)
                  : a.stage,
          }
        : a,
    )
    persist("ecoroute-overdue-v4", setOverdueAccounts, updated)
    addLog({
      user: "Claudine Uwase",
      role: "Finance",
      action: `Bulk enforcement: ${action}`,
      module: "Enforcement",
      record: `${ids.length} accounts processed`,
    })
  }

  const matchPaymentManually: Store["matchPaymentManually"] = (txnId, invoiceId) => {
    const updated = reconciliation.map((r) =>
      r.id === txnId ? { ...r, invoice: invoiceId, status: "Matched" } : r,
    )
    persist("ecoroute-reconcile-v4", setReconciliation, updated)
    addLog({
      user: "Claudine Uwase",
      role: "Finance",
      action: "Manual transaction reconciliation",
      module: "Payments",
      record: `${txnId} matched with ${invoiceId}`,
    })
  }

  const metrics = useMemo(() => {
    const overdueTotal = overdueAccounts.reduce((sum, a) => sum + a.amount, 0)
    const landfillTonnesTotal = Number(
      landfillTrips.reduce((sum, t) => sum + t.netWeightTonnes, 0).toFixed(1),
    )
    return {
      customersCount: customerList.length,
      collectionsTodayCount: collections.length,
      collectionsCompletedCount: collections.filter((c) => c.status === "Completed").length,
      collectionsInProgressCount: collections.filter((c) => c.status === "In progress").length,
      collectionsPendingMissedCount: collections.filter((c) => c.status === "Pending" || c.status === "Missed").length,
      overdueCount: overdueAccounts.length,
      overdueTotal,
      revenueToday: 1840000,
      landfillTripsCount: landfillTrips.length,
      landfillTonnesTotal,
      smsSummary: { sent: 248, delivered: 243, failed: 5 },
      routeEfficiency: { kmSaved: 18.6, fuelSavedPercent: 14.2 },
    }
  }, [customerList, collections, overdueAccounts, landfillTrips])

  const value = useMemo(
    () => ({
      companies,
      invoices,
      payments,
      messages,
      employees,
      registeredCustomers,
      payroll,
      logs,
      customerList,
      collections,
      overdueAccounts,
      vehicles,
      trips,
      landfillTrips,
      scheduledSms,
      activeSessions,
      permissionMatrix,
      securityPolicy,
      backups,
      reconciliation,
      billingConfig,
      mobileMoneySettings,
      turnByTurn: turnByTurnDirections,
      metrics,
      registerCompany,
      registerCustomer,
      updateCompany,
      deleteCompany,
      markMessage,
      sendMessage,
      payInvoice,
      addEmployee,
      updatePayroll,
      addLog,
      addCustomer,
      updateCustomer,
      importCustomers,
      confirmCollection,
      reportCollectionException,
      addVehicle,
      updateVehicle,
      toggleVehicleStatus,
      recordTrip,
      reportTripException,
      recordLandfillTrip,
      confirmLandfillDelivery,
      scheduleSms,
      cancelScheduledSms,
      terminateSession,
      updatePermission,
      savePermissionMatrix,
      createBackup,
      restoreBackup,
      updateSecurityPolicy,
      updateBillingConfig,
      updateMobileMoneySettings,
      updateEnforcementAccount,
      bulkEnforcementAction,
      matchPaymentManually,
    }),
    [
      companies,
      invoices,
      payments,
      messages,
      employees,
      registeredCustomers,
      payroll,
      logs,
      customerList,
      collections,
      overdueAccounts,
      vehicles,
      trips,
      landfillTrips,
      scheduledSms,
      activeSessions,
      permissionMatrix,
      securityPolicy,
      backups,
      reconciliation,
      billingConfig,
      mobileMoneySettings,
      metrics,
    ],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const value = useContext(StoreContext)
  if (!value) throw new Error("useStore must be used inside StoreProvider")
  return value
}
