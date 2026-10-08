import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  Edit3,
  FileSpreadsheet,
  FileText,
  Fuel,
  GripVertical,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  Navigation,
  Plus,
  Route,
  Save,
  Send,
  Settings,
  Sparkles,
  Truck,
  UsersRound,
  X,
} from "lucide-react"
import { servicePlans } from "./Store"

export const KIGALI_OPERATIONS = {
  date: "06 Oct 2026",
  planned: 148,
  completed: 126,
  missed: 4,
  activeRoutes: 8,
  aiKmSaved: 34.7,
  paymentsToday: 3_800_000,
  overdue: 4_200_000,
  ndubaTrips: 7,
  tonnes: 42.8,
  smsSent: 184,
  activeUsers: 1176,
  lockedAccounts: 3,
  pendingCompanies: 3,
  failedSms: 6,
}

const money = (value: number) => `RWF ${value.toLocaleString()}`

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-500"
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"

const zones = [
  {
    district: "Gasabo",
    sector: "Kimironko",
    cell: "Kibagabaga",
    day: "Monday",
    team: "Team Alpha",
    vehicle: "RW 412 A",
    customers: 186,
  },
  {
    district: "Gasabo",
    sector: "Remera",
    cell: "Rukiri II",
    day: "Tuesday",
    team: "Team Delta",
    vehicle: "RW 307 K",
    customers: 164,
  },
  {
    district: "Kicukiro",
    sector: "Niboye",
    cell: "Gatare",
    day: "Wednesday",
    team: "Team Bravo",
    vehicle: "RW 118 T",
    customers: 172,
  },
  {
    district: "Nyarugenge",
    sector: "Nyamirambo",
    cell: "Rugarama",
    day: "Thursday",
    team: "Team Echo",
    vehicle: "RW 922 D",
    customers: 149,
  },
]

const stops = [
  {
    order: 1,
    customer: "Aline Mukamana",
    address: "KG 11 Ave, Kibagabaga",
    volume: "2 bins · 38 kg",
    status: "Collected",
    time: "07:42",
  },
  {
    order: 2,
    customer: "Kibagabaga Primary School",
    address: "KG 9 Ave, Kibagabaga",
    volume: "6 bins · 124 kg",
    status: "Collected",
    time: "08:06",
  },
  {
    order: 3,
    customer: "Mutesi Hardware",
    address: "KG 13 Ave, Kimironko",
    volume: "3 bins · 71 kg",
    status: "In progress",
    time: "08:35",
  },
  {
    order: 4,
    customer: "Patrick Habimana",
    address: "KG 17 St, Kimironko",
    volume: "2 bins · 42 kg",
    status: "Next",
    time: "09:00",
  },
  {
    order: 5,
    customer: "Kimironko Market Gate B",
    address: "Market Road, Kimironko",
    volume: "8 bins · 210 kg",
    status: "Pending",
    time: "09:25",
  },
  {
    order: 6,
    customer: "Uwera Residence",
    address: "KG 19 St, Bibare",
    volume: "1 bin · 26 kg",
    status: "Pending",
    time: "10:05",
  },
]

type AssignmentStatus = "Planned" | "Assigned" | "In progress" | "Completed" | "Delayed"

type RouteAssignment = {
  id: string
  route: string
  vehicle: string
  driver: string
  team: string
  date: string
  start: string
  status: AssignmentStatus
}

const defaultAssignments: RouteAssignment[] = [
  {
    id: "ASN-1048",
    route: "KG 45 · Kimironko",
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    team: "Team Alpha",
    date: "2026-10-06",
    start: "07:30",
    status: "In progress",
  },
  {
    id: "ASN-1049",
    route: "KK 15 · Niboye",
    vehicle: "RW 118 T",
    driver: "Alice Uwera",
    team: "Team Bravo",
    date: "2026-10-06",
    start: "08:00",
    status: "Assigned",
  },
  {
    id: "ASN-1050",
    route: "KN 07 · Nyamirambo",
    vehicle: "RW 922 D",
    driver: "Patrick Tuyishime",
    team: "Team Echo",
    date: "2026-10-06",
    start: "07:45",
    status: "Delayed",
  },
]

const loadAssignments = () => {
  try {
    return JSON.parse(
      localStorage.getItem("ecoroute-route-assignments") || "",
    ) as RouteAssignment[]
  } catch {
    return defaultAssignments
  }
}

const saveAssignments = (items: RouteAssignment[]) =>
  localStorage.setItem("ecoroute-route-assignments", JSON.stringify(items))

function PageIntro({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string
  title: string
  copy: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          {eyebrow}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-950">{title}</p>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          {copy}
        </p>
      </div>
      {action}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      aria-label={checked ? "Disable provider" : "Enable provider"}
      className={`relative h-7 w-12 rounded-full transition ${
        checked ? "bg-emerald-700" : "bg-slate-300"
      }`}
      onClick={onChange}
      type="button"
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  )
}

export function AdminSystemConfigurationPage() {
  const [mtn, setMtn] = useState(true)
  const [airtel, setAirtel] = useState(true)
  const [saved, setSaved] = useState(false)
  const Section = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: typeof Settings
    title: string
    children: React.ReactNode
  }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
        <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={18} />
        </span>
        <p className="font-bold text-slate-900">{title}</p>
      </div>
      {children}
    </div>
  )
  return (
    <div className="space-y-4">
      <PageIntro
        copy="Manage the settings used across billing, communication, landfill operations and account security."
        eyebrow="Platform settings"
        title="System configuration"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Section icon={Settings} title="Company profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-600">
              Company name
              <input className={fieldClass} defaultValue="Simate Garbage Ltd" />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Support phone
              <input className={fieldClass} defaultValue="+250 788 320 440" />
            </label>
            <label className="text-xs font-bold text-slate-600 sm:col-span-2">
              Registered address
              <input
                className={fieldClass}
                defaultValue="KG 17 Avenue, Kimironko, Gasabo, Kigali"
              />
            </label>
          </div>
        </Section>
        <Section icon={CalendarDays} title="Billing settings">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-xs font-bold text-slate-600">
              Currency
              <select className={fieldClass} defaultValue="RWF">
                <option>RWF</option>
              </select>
            </label>
            <label className="text-xs font-bold text-slate-600">
              Billing cycle
              <select className={fieldClass} defaultValue="Monthly">
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </label>
            <label className="text-xs font-bold text-slate-600">
              Grace period days
              <input className={fieldClass} defaultValue="7" type="number" />
            </label>
          </div>
        </Section>
        <Section icon={MessageSquareText} title="SMS configuration">
          <label className="text-xs font-bold text-slate-600">
            Sender ID
            <input className={fieldClass} defaultValue="ECOROUTE" />
          </label>
          <p className="mt-3 text-xs text-slate-500">
            Used for route assignments, payment receipts and collection alerts.
          </p>
        </Section>
        <Section icon={FileSpreadsheet} title="Mobile Money providers">
          {([
            ["MTN MoMo", "129842", mtn, () => setMtn(!mtn)],
            ["Airtel Money", "307611", airtel, () => setAirtel(!airtel)],
          ] as Array<[string, string, boolean, () => void]>).map(
            ([name, code, enabled, change]) => (
              <div
                className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 last:mb-0"
                key={String(name)}
              >
                <Toggle checked={enabled} onChange={change} />
                <div className="flex-1">
                  <p className="text-sm font-bold">{name}</p>
                  <p className="text-xs text-slate-500">Merchant code {code}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {enabled ? "On" : "Off"}
                </span>
              </div>
            ),
          )}
        </Section>
        <Section icon={MapPin} title="Nduba Landfill">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-600">
              Facility
              <input className={fieldClass} defaultValue="Nduba Landfill" />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Gate contact
              <input className={fieldClass} defaultValue="+250 788 090 221" />
            </label>
            <label className="text-xs font-bold text-slate-600 sm:col-span-2">
              Address
              <input
                className={fieldClass}
                defaultValue="Nduba Sector, Gasabo District, Kigali"
              />
            </label>
          </div>
        </Section>
        <Section icon={Clock3} title="Working hours & password policy">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-600">
              Weekdays
              <input className={fieldClass} defaultValue="06:30 – 18:00" />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Saturday
              <input className={fieldClass} defaultValue="07:00 – 14:00" />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Minimum password length
              <input className={fieldClass} defaultValue="10" type="number" />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Password expiry
              <select className={fieldClass} defaultValue="90 days">
                <option>90 days</option>
                <option>180 days</option>
              </select>
            </label>
          </div>
        </Section>
      </div>
      <div className="mt-6 flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {saved && (
          <span className="flex items-center gap-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 size={17} /> Settings saved
          </span>
        )}
        <button className={primaryButton} onClick={() => setSaved(true)}>
          <Save size={17} /> Save configuration
        </button>
      </div>
    </div>
  )
}

const reportRows = [
  {
    name: "Collection performance",
    description: "Planned, completed and missed collections by zone and team.",
    value: "126 / 148",
    note: "85.1% completed",
  },
  {
    name: "Route efficiency",
    description: "Distance, travel time, fuel usage and AI savings.",
    value: "34.7 km",
    note: "saved today",
  },
  {
    name: "Billing & payments",
    description: "Invoices, Mobile Money payments and overdue balances.",
    value: money(KIGALI_OPERATIONS.paymentsToday),
    note: "received today",
  },
  {
    name: "Landfill trips",
    description: "Nduba gate check-ins, weights and completed unloads.",
    value: "7 trips",
    note: "42.8 tonnes",
  },
  {
    name: "User activity",
    description: "Sign-ins, access changes and administrative actions.",
    value: "1,176",
    note: "active users",
  },
]

function downloadReport(name: string, format: "PDF" | "Excel") {
  const content = [
    `EcoRoute ${name}`,
    `Period,01 Oct 2026 - 06 Oct 2026`,
    `Planned collections,${KIGALI_OPERATIONS.planned}`,
    `Completed collections,${KIGALI_OPERATIONS.completed}`,
    `Missed collections,${KIGALI_OPERATIONS.missed}`,
    `Nduba tonnes,${KIGALI_OPERATIONS.tonnes}`,
  ].join("\n")
  const blob = new Blob([content], { type: "text/csv" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `${name.toLowerCase().replace(/ /g, "-")}.${
    format === "PDF" ? "pdf" : "csv"
  }`
  link.click()
  URL.revokeObjectURL(link.href)
}

export function AdminReportsPage() {
  return (
    <div className="space-y-4">
      <PageIntro
        action={
          <div className="flex gap-2">
            <label className="text-xs font-bold text-slate-500">
              From
              <input
                className={fieldClass}
                defaultValue="2026-10-01"
                type="date"
              />
            </label>
            <label className="text-xs font-bold text-slate-500">
              To
              <input
                className={fieldClass}
                defaultValue="2026-10-06"
                type="date"
              />
            </label>
          </div>
        }
        copy="Generate consistent operational, financial and platform reports for the selected period."
        eyebrow="Administration"
        title="Reports"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {reportRows.map((report) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            key={report.name}
          >
            <div className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileText size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">{report.name}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {report.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{report.value}</p>
                    <p className="text-xs text-emerald-700">{report.note}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className={secondaryButton}
                    onClick={() => downloadReport(report.name, "PDF")}
                  >
                    <Download size={15} /> Export PDF
                  </button>
                  <button
                    className={secondaryButton}
                    onClick={() => downloadReport(report.name, "Excel")}
                  >
                    <FileSpreadsheet size={15} /> Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdminAIAssistantPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      by: "ai",
      text: "Good morning. I can summarize platform access, company approvals and SMS delivery for Kigali operations.",
    },
  ])
  const answer = (question: string) => {
    const value = question.toLowerCase()
    let response =
      "I can help with active users, locked accounts, pending companies and failed SMS messages."
    if (value.includes("active"))
      response = `${KIGALI_OPERATIONS.activeUsers.toLocaleString()} users are active. 42 signed in today and the latest successful access was at 10:42.`
    if (value.includes("locked"))
      response = `${KIGALI_OPERATIONS.lockedAccounts} accounts are locked: two after repeated failed sign-ins and one by an administrator.`
    if (value.includes("pending"))
      response = `${KIGALI_OPERATIONS.pendingCompanies} company applications await review: Kigali Clean City, EcoSafe Rwanda and Umucyo Recycling.`
    if (value.includes("sms"))
      response = `${KIGALI_OPERATIONS.failedSms} of ${KIGALI_OPERATIONS.smsSent} SMS messages failed today. All six are queued for retry through the MTN gateway.`
    setMessages((current) => [
      ...current,
      { by: "user", text: question },
      { by: "ai", text: response },
    ])
    setInput("")
  }
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageIntro
        copy="Ask administrative questions using the same live Kigali sample data shown across EcoRoute."
        eyebrow="Platform intelligence"
        title="Admin AI Assistant"
      />
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-emerald-900 p-4 text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-white/10">
            <Bot size={20} />
          </span>
          <div>
            <p className="font-bold">EcoRoute Admin AI</p>
            <p className="text-xs text-emerald-200">
              Platform status · Data current at 10:45
            </p>
          </div>
        </div>
        <div className="min-h-96 space-y-4 bg-slate-50 p-5">
          {messages.map((message, index) => (
            <div
              className={`flex ${
                message.by === "user" ? "justify-end" : "justify-start"
              }`}
              key={`${message.by}-${index}`}
            >
              <p
                className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.by === "user"
                    ? "bg-emerald-700 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {[
              "How many active users?",
              "Show locked accounts",
              "Which companies are pending?",
              "Any failed SMS today?",
            ].map((prompt) => (
              <button
                className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"
                key={prompt}
                onClick={() => answer(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (input.trim()) answer(input.trim())
            }}
          >
            <input
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about platform operations..."
              value={input}
            />
            <button className={primaryButton} type="submit">
              <Send size={17} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export function AdminZonesPage() {
  const [tab, setTab] = useState<"Zones" | "Service plans">("Zones")
  const [items, setItems] = useState(zones)
  const [editing, setEditing] = useState<typeof zones[number] | null>(null)
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {(["Zones", "Service plans"] as const).map((item) => (
          <button
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
              tab === item
                ? "bg-emerald-700 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            key={item}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Zones" ? (
        <>
          <PageIntro
            action={
              <button
                className={primaryButton}
                onClick={() =>
                  setEditing({
                    district: "Gasabo",
                    sector: "",
                    cell: "",
                    day: "Monday",
                    team: "Team Alpha",
                    vehicle: "RW 412 A",
                    customers: 0,
                  })
                }
              >
                <Plus size={16} /> Add zone
              </button>
            }
            copy={`${items.reduce((sum, item) => sum + item.customers, 0)} customers are assigned across Kigali collection zones.`}
            eyebrow="Collection parameters"
            title="Zones"
          />
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-max text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {[
                    "District",
                    "Sector",
                    "Cell",
                    "Collection day",
                    "Team",
                    "Vehicle",
                    "Customers",
                    "Action",
                  ].map((column) => (
                    <th className="px-4 py-3 font-bold" key={column}>
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((zone) => (
                  <tr key={`${zone.district}-${zone.sector}`}>
                    <td className="px-4 py-4 font-bold">{zone.district}</td>
                    <td className="px-4 py-4">{zone.sector}</td>
                    <td className="px-4 py-4">{zone.cell}</td>
                    <td className="px-4 py-4">{zone.day}</td>
                    <td className="px-4 py-4">{zone.team}</td>
                    <td className="px-4 py-4">{zone.vehicle}</td>
                    <td className="px-4 py-4">{zone.customers}</td>
                    <td className="px-4 py-4">
                      <button
                        className="font-bold text-emerald-700"
                        onClick={() => setEditing(zone)}
                      >
                        Edit zone
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <PageIntro
            action={
              <button className={primaryButton}>
                <Plus size={16} /> Add plan
              </button>
            }
            copy="Prices are configured by the Administrator according to company tariffs."
            eyebrow="Collection parameters"
            title="Service plans & pricing"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {servicePlans.map((plan) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                key={plan.name}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">{plan.name}</p>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {plan.status}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold">
                  {plan.price ? money(plan.price) : "Manager-set"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {plan.period} · {plan.kg}
                </p>
                <p className="mt-4 text-sm text-slate-600">{plan.waste}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault()
              const existing = items.findIndex(
                (item) =>
                  item.district === editing.district &&
                  item.sector === editing.sector,
              )
              if (existing >= 0) {
                setItems(
                  items.map((item, index) =>
                    index === existing ? editing : item,
                  ),
                )
              } else setItems([...items, editing])
              setEditing(null)
            }}
          >
            <div className="flex items-center">
              <div>
                <p className="text-lg font-bold">Zone details</p>
                <p className="text-sm text-slate-500">
                  Assign coverage and operational resources.
                </p>
              </div>
              <button
                className="ml-auto text-slate-400"
                onClick={() => setEditing(null)}
                type="button"
              >
                <X />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {([
                ["district", "District"],
                ["sector", "Sector"],
                ["cell", "Cell"],
                ["day", "Collection day"],
                ["team", "Team"],
                ["vehicle", "Vehicle"],
              ] as const).map(([key, label]) => (
                <label className="text-xs font-bold text-slate-600" key={key}>
                  {label}
                  <input
                    className={fieldClass}
                    onChange={(event) =>
                      setEditing({ ...editing, [key]: event.target.value })
                    }
                    value={editing[key]}
                  />
                </label>
              ))}
              <label className="text-xs font-bold text-slate-600">
                Number of customers
                <input
                  className={fieldClass}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      customers: Number(event.target.value),
                    })
                  }
                  type="number"
                  value={editing.customers}
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className={secondaryButton}
                onClick={() => setEditing(null)}
                type="button"
              >
                Cancel
              </button>
              <button className={primaryButton} type="submit">
                <Save size={16} /> Save zone
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export function DriverCollectionStatusPage() {
  const [statuses, setStatuses] = useState(
    Object.fromEntries(stops.map((stop) => [stop.order, stop.status])),
  )
  const [history, setHistory] = useState([
    "08:06 · Kibagabaga Primary School collected · 124 kg",
    "07:42 · Aline Mukamana collected · 38 kg",
    "07:31 · Route KG 45 started",
  ])
  const update = (order: number, status: string) => {
    const stop = stops.find((item) => item.order === order)
    setStatuses({ ...statuses, [order]: status })
    setHistory([
      `Just now · ${stop?.customer} marked ${status.toLowerCase()}`,
      ...history,
    ])
  }
  const done = Object.values(statuses).filter(
    (item) => item === "Collected" || item.startsWith("Missed"),
  ).length
  return (
    <div className="space-y-4">
      <PageIntro
        copy="Route KG 45 · Kimironko and Kibagabaga · Vehicle RW 412 A"
        eyebrow="Tuesday, 06 October"
        title="Today’s collection status"
      />
      <div className="rounded-2xl bg-emerald-900 p-5 text-white">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-emerald-200">Route progress</p>
            <p className="mt-1 text-2xl font-bold">
              {done} of {stops.length} stops
            </p>
          </div>
          <p className="text-3xl font-bold">
            {Math.round((done / stops.length) * 100)}%
          </p>
        </div>
        <div className="mt-4 h-2.5 rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-lime-300 transition-all"
            style={{ width: `${(done / stops.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-3">
        {stops.map((stop) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            key={stop.order}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-700 font-bold text-white">
                {stop.order}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{stop.customer}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      statuses[stop.order] === "Collected"
                        ? "bg-emerald-50 text-emerald-700"
                        : statuses[stop.order].startsWith("Missed")
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {statuses[stop.order]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {stop.address} · {stop.volume} · {stop.time}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={secondaryButton}
                  onClick={() => update(stop.order, "In progress")}
                >
                  Start
                </button>
                <button
                  className={primaryButton}
                  onClick={() => update(stop.order, "Collected")}
                >
                  <Check size={16} /> Collected
                </button>
                <button
                  className={secondaryButton}
                  onClick={() =>
                    update(
                      stop.order,
                      `Missed · ${window.prompt("Reason for missed collection") || "Customer unavailable"}`,
                    )
                  }
                >
                  Missed (+reason)
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700"
                  onClick={() =>
                    setHistory([
                      `Just now · Problem reported at ${stop.customer}`,
                      ...history,
                    ])
                  }
                >
                  <AlertTriangle size={15} /> Report problem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-bold">Status history</p>
        <div className="mt-4 space-y-3">
          {history.map((entry) => (
            <div className="flex gap-3 text-sm" key={entry}>
              <span className="mt-1 size-2 rounded-full bg-emerald-500" />
              <p className="text-slate-600">{entry}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const tripSteps = [
  "Start trip",
  "Stops done",
  "Depart to Nduba",
  "Arrived at Nduba",
  "Enter weight",
  "Unloaded / Completed",
]

export function DriverTripManagementPage() {
  const [step, setStep] = useState(2)
  const [weight, setWeight] = useState("5.8")
  return (
    <div className="space-y-4">
      <PageIntro
        copy="TRIP-2406 · Route KG 45 · Vehicle RW 412 A · Eric Niyonzima"
        eyebrow="Active trip"
        title="Trip management"
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-6">
          {tripSteps.map((label, index) => (
            <button
              className={`rounded-xl border p-3 text-left ${
                index < step
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : index === step
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 text-slate-400"
              }`}
              key={label}
              onClick={() => index <= step && setStep(index)}
            >
              <span className="text-xs font-bold">0{index + 1}</span>
              <span className="mt-2 block text-xs font-bold">{label}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          {step === 0 && (
            <p className="text-sm text-slate-600">
              Confirm the vehicle safety check before starting route KG 45.
            </p>
          )}
          {step === 1 && (
            <p className="text-sm text-slate-600">
              Complete all assigned collection stops before landfill departure.
            </p>
          )}
          {step === 2 && (
            <div>
              <p className="font-bold">Ready to depart to Nduba</p>
              <p className="mt-1 text-sm text-slate-500">
                6 stops complete · Estimated load 5.6 tonnes · 18.4 km
              </p>
            </div>
          )}
          {step === 3 && (
            <div>
              <p className="font-bold">Nduba gate check-in</p>
              <p className="mt-1 text-sm text-slate-500">
                GPS verified at Nduba Landfill gate. Record arrival to continue.
              </p>
            </div>
          )}
          {step === 4 && (
            <label className="block max-w-xs text-xs font-bold text-slate-600">
              Weighbridge weight (tonnes)
              <input
                className={fieldClass}
                onChange={(event) => setWeight(event.target.value)}
                step="0.1"
                type="number"
                value={weight}
              />
            </label>
          )}
          {step === 5 && (
            <div className="flex items-center gap-3 text-emerald-800">
              <CheckCircle2 size={28} />
              <div>
                <p className="font-bold">Unload completed · Gate check-out</p>
                <p className="text-sm">
                  {weight} tonnes recorded at 11:18 for trip TRIP-2406.
                </p>
              </div>
            </div>
          )}
          {step < 5 && (
            <button
              className={`${primaryButton} mt-5`}
              onClick={() => setStep(step + 1)}
            >
              {tripSteps[step]} complete <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold">Trip timeline</p>
          <div className="mt-4 space-y-4">
            {tripSteps.slice(0, Math.max(step + 1, 3)).map((label, index) => (
              <div className="flex gap-3" key={label}>
                <span
                  className={`mt-0.5 grid size-6 place-items-center rounded-full ${
                    index < step
                      ? "bg-emerald-700 text-white"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {index < step ? <Check size={13} /> : index + 1}
                </span>
                <div>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs text-slate-500">
                    {index < step
                      ? `${7 + index}:3${index} · Verified`
                      : "Current stage"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="font-bold">Today’s trips</p>
          <div className="mt-4 divide-y divide-slate-100">
            {[
              ["TRIP-2405", "RW 307 K", "4.9 t", "Completed"],
              ["TRIP-2406", "RW 412 A", `${weight} t est.`, "In progress"],
              ["TRIP-2407", "RW 551 C", "—", "Planned 14:30"],
            ].map((trip) => (
              <div className="flex items-center gap-3 py-3" key={trip[0]}>
                <Truck className="text-emerald-700" size={18} />
                <p className="flex-1 text-sm font-bold">{trip[0]}</p>
                <p className="text-xs text-slate-500">{trip[1]}</p>
                <p className="text-xs text-slate-500">{trip[2]}</p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">
                  {trip[3]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DriverNdubaPage() {
  const trips = [
    ["TRIP-2405", "06 Oct · 08:12", "RW 412 A", "5.2 t", "09:06", "Completed"],
    ["TRIP-2381", "05 Oct · 14:26", "RW 412 A", "4.8 t", "15:19", "Completed"],
    ["TRIP-2344", "03 Oct · 10:08", "RW 412 A", "5.5 t", "11:02", "Completed"],
    ["TRIP-2298", "01 Oct · 13:44", "RW 307 K", "4.6 t", "14:38", "Completed"],
  ]
  return (
    <div className="space-y-4">
      <PageIntro
        copy="Eric Niyonzima · Driver EMP-1001 · October total 20.1 tonnes"
        eyebrow="My landfill records"
        title="Nduba trip history"
      />
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              {[
                "Trip",
                "Departure",
                "Vehicle",
                "Weight",
                "Gate check-out",
                "Status",
              ].map((column) => (
                <th className="px-5 py-3 font-bold" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trips.map((trip) => (
              <tr key={trip[0]}>
                {trip.map((value, index) => (
                  <td
                    className={`px-5 py-4 ${index === 0 ? "font-bold" : ""}`}
                    key={value}
                  >
                    {index === 5 ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {value}
                      </span>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const routeCards = [
  {
    id: "KG 45",
    zone: "Kimironko · Kibagabaga",
    driver: "Eric Niyonzima",
    vehicle: "RW 412 A",
    stops: 18,
    progress: 67,
  },
  {
    id: "KK 15",
    zone: "Niboye · Gatare",
    driver: "Alice Uwera",
    vehicle: "RW 118 T",
    stops: 16,
    progress: 43,
  },
  {
    id: "KN 07",
    zone: "Nyamirambo · Rugarama",
    driver: "Patrick Tuyishime",
    vehicle: "RW 922 D",
    stops: 15,
    progress: 28,
  },
]

export function ManagerRoutesAIPage() {
  const [selected, setSelected] = useState("KG 45")
  const [optimized, setOptimized] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assignments, setAssignments] =
    useState<RouteAssignment[]>(loadAssignments)
  const [order, setOrder] = useState([1, 4, 3, 2, 6, 5])
  const [editingOrder, setEditingOrder] = useState(false)
  const [history, setHistory] = useState([
    "05 Oct · KK 15 · 3.1 km saved · Accepted by Diane",
    "03 Oct · KG 18 · 4.7 km saved · Accepted by Diane",
    "01 Oct · KN 07 · 2.2 km saved · Edited then accepted",
  ])
  const [form, setForm] = useState<RouteAssignment>({
    id: `ASN-${Date.now().toString().slice(-4)}`,
    route: `${selected} · Kimironko`,
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    team: "Team Alpha",
    date: "2026-10-06",
    start: "07:30",
    status: "Assigned",
  })

  useEffect(() => {
    if (!assignOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAssignOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [assignOpen])
  const optimize = (id = selected) => {
    setSelected(id)
    setOptimized(true)
    setForm((current) => ({ ...current, route: `${id} · Kimironko` }))
    window.setTimeout(
      () =>
        document
          .getElementById("ai-optimizer")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    )
  }
  return (
    <div className="space-y-4">
      <PageIntro
        action={
          <button className={primaryButton} onClick={() => optimize()}>
            <Sparkles size={17} /> Generate optimized route
          </button>
        }
        copy="Plan, optimize and assign Kigali collection routes using vehicle capacity, traffic and Nduba distance."
        eyebrow="Operations intelligence"
        title="Routes & AI EcoRoute"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {routeCards.map((route) => (
          <div
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            key={route.id}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold">{route.id}</p>
                <p className="text-sm text-slate-500">{route.zone}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                In progress
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <p className="rounded-xl bg-slate-50 p-3">
                <span className="block text-slate-400">Driver</span>
                <strong>{route.driver}</strong>
              </p>
              <p className="rounded-xl bg-slate-50 p-3">
                <span className="block text-slate-400">Vehicle</span>
                <strong>{route.vehicle}</strong>
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span>{route.stops} stops</span>
              <span>{route.progress}% complete</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{ width: `${route.progress}%` }}
              />
            </div>
            <button
              className={`${primaryButton} mt-4 w-full`}
              onClick={() => optimize(route.id)}
            >
              <Sparkles size={16} /> Optimize with AI
            </button>
          </div>
        ))}
      </div>
      <div
        className="scroll-mt-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"
        id="ai-optimizer"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end">
          <div className="flex-1">
            <p className="flex items-center gap-2 font-bold text-slate-950">
              <Sparkles className="text-emerald-700" size={19} />
              Generate optimized route
            </p>
            <p className="mt-1 text-sm text-slate-500">
              AI considers location, waste volume, priority, missed pickups,
              Kigali traffic, vehicle capacity and distance to Nduba.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select
              className={fieldClass}
              onChange={(event) => setSelected(event.target.value)}
              value={selected}
            >
              <option>KG 45</option>
              <option>KK 15</option>
              <option>KN 07</option>
            </select>
            <input
              className={fieldClass}
              defaultValue="2026-10-06"
              type="date"
            />
            <select className={fieldClass} defaultValue="RW 412 A">
              <option>RW 412 A</option>
              <option>RW 118 T</option>
              <option>RW 922 D</option>
            </select>
          </div>
          <button className={primaryButton} onClick={() => setOptimized(true)}>
            <Sparkles size={16} /> Analyze
          </button>
        </div>
        {optimized ? (
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 xl:grid-cols-2">
              <RouteMap
                label="Current route"
                metrics={["18.6 km", "1 hr 42 min", "7.4 L fuel"]}
                order={[1, 2, 3, 4, 5, 6]}
                tone="slate"
              />
              <RouteMap
                label="AI-optimized route"
                metrics={["14.2 km", "1 hr 07 min", "5.6 L fuel"]}
                order={order}
                tone="emerald"
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl bg-emerald-950 p-5 text-white">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Distance", "18.6 → 14.2 km", "−24%"],
                    ["Travel time", "1h 42m → 1h 07m", "35 min saved"],
                    ["Fuel", "7.4 → 5.6 L", "−1.8 litres"],
                  ].map((metric) => (
                    <div key={metric[0]}>
                      <p className="text-xs text-emerald-300">{metric[0]}</p>
                      <p className="mt-1 text-sm font-bold">{metric[1]}</p>
                      <p className="mt-1 text-xs font-bold text-lime-300">
                        {metric[2]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="font-bold">Why AI reordered these stops</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Prioritized a missed pickup from Monday.</li>
                  <li>• Avoided KG 11 Avenue traffic after 08:30.</li>
                  <li>• Collected the market load before peak activity.</li>
                  <li>• Finished nearest the road to Nduba Landfill.</li>
                </ul>
              </div>
            </div>
            {editingOrder && (
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="mb-3 text-sm font-bold">
                  Drag to edit stop order
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {order.map((stop, index) => (
                    <button
                      className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs font-bold"
                      draggable
                      key={stop}
                      onDragStart={(event) =>
                        event.dataTransfer.setData("text/plain", String(index))
                      }
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        const from = Number(
                          event.dataTransfer.getData("text/plain"),
                        )
                        const next = [...order]
                        const [moved] = next.splice(from, 1)
                        next.splice(index, 0, moved)
                        setOrder(next)
                      }}
                    >
                      <GripVertical size={15} /> Stop {stop} ·{" "}
                      {stops[stop - 1].customer}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                className={primaryButton}
                onClick={() => {
                  setHistory([
                    `Just now · ${selected} · 4.4 km saved · Accepted by Diane`,
                    ...history,
                  ])
                  setAssignOpen(true)
                }}
              >
                <Check size={16} /> Accept & assign
              </button>
              <button
                className={secondaryButton}
                onClick={() => setEditingOrder(!editingOrder)}
              >
                <Edit3 size={16} /> Edit order (drag)
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700"
                onClick={() => setOptimized(false)}
              >
                <X size={16} /> Reject
              </button>
            </div>
          </div>
        ) : (
          <div className="grid min-h-56 place-items-center text-center">
            <div>
              <Sparkles className="mx-auto text-emerald-600" size={30} />
              <p className="mt-3 font-bold">Ready to optimize {selected}</p>
              <p className="mt-1 text-sm text-slate-500">
                Select route inputs and run the AI analysis.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-bold">Route assignments</p>
          <button className={primaryButton} onClick={() => setAssignOpen(true)}>
            <Plus size={16} /> Assign route
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                {[
                  "Route",
                  "Vehicle",
                  "Driver / team",
                  "Date",
                  "Start",
                  "Status",
                ].map((item) => (
                  <th className="px-3 py-3" key={item}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td className="px-3 py-4 font-bold">{assignment.route}</td>
                  <td className="px-3 py-4">{assignment.vehicle}</td>
                  <td className="px-3 py-4">
                    {assignment.driver}
                    <span className="block text-xs text-slate-400">
                      {assignment.team}
                    </span>
                  </td>
                  <td className="px-3 py-4">{assignment.date}</td>
                  <td className="px-3 py-4">{assignment.start}</td>
                  <td className="px-3 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-bold">Optimization history</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {history.map((entry) => (
            <p
              className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600"
              key={entry}
            >
              {entry}
            </p>
          ))}
        </div>
      </div>
      {assignOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setAssignOpen(false)}
        >
          <form
            className="w-full max-w-2xl my-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault()
              const next = [form, ...assignments]
              setAssignments(next)
              saveAssignments(next)
              setAssignOpen(false)
            }}
          >
            <div className="flex items-center">
              <div>
                <p className="text-lg font-bold">Assign route</p>
                <p className="text-sm text-slate-500">
                  The assignment will appear in Driver My Routes, My Tasks and
                  Live Tracking. An SMS will be sent to the driver.
                </p>
              </div>
              <button
                className="ml-auto text-slate-400"
                onClick={() => setAssignOpen(false)}
                type="button"
              >
                <X />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {([
                ["route", "Route"],
                ["vehicle", "Vehicle"],
                ["driver", "Driver"],
                ["team", "Team"],
                ["date", "Date"],
                ["start", "Start time"],
              ] as const).map(([key, label]) => (
                <label className="text-xs font-bold text-slate-600" key={key}>
                  {label}
                  <input
                    className={fieldClass}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.value })
                    }
                    type={
                      key === "date"
                        ? "date"
                        : key === "start"
                          ? "time"
                          : "text"
                    }
                    value={form[key]}
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              <span>
                <strong>SMS preview:</strong> ECOROUTE: You are assigned to{" "}
                {form.route} at {form.start}.
              </span>
              <Send size={16} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className={secondaryButton}
                onClick={() => setAssignOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button className={primaryButton} type="submit">
                <Check size={16} /> Assign & send SMS
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function RouteMap({
  label,
  metrics,
  order,
  tone,
}: {
  label: string
  metrics: string[]
  order: number[]
  tone: "slate" | "emerald"
}) {
  const positions = [
    "left-[12%] top-[62%]",
    "left-[26%] top-[30%]",
    "left-[44%] top-[55%]",
    "left-[58%] top-[24%]",
    "left-[73%] top-[49%]",
    "left-[84%] top-[18%]",
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between bg-white p-4">
        <p className="font-bold">{label}</p>
        <div className="flex gap-2 text-xs text-slate-500">
          {metrics.map((metric) => (
            <span key={metric}>{metric}</span>
          ))}
        </div>
      </div>
      <div className="map-grid relative h-72 bg-emerald-50">
        <div
          className={`absolute left-[14%] top-1/2 h-1 w-[70%] -rotate-12 rounded-full ${
            tone === "emerald" ? "bg-emerald-600" : "bg-slate-400"
          }`}
        />
        {order.map((stop, index) => (
          <span
            className={`absolute z-10 grid size-8 place-items-center rounded-full border-2 border-white text-xs font-bold text-white shadow ${positions[index]} ${
              tone === "emerald" ? "bg-emerald-700" : "bg-slate-600"
            }`}
            key={`${stop}-${index}`}
          >
            {stop}
          </span>
        ))}
        <span className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow">
          <MapPin className="mr-1 inline text-emerald-700" size={14} />
          Nduba Landfill
        </span>
      </div>
    </div>
  )
}

export function ManagerDashboardSummary({
  onPage,
}: {
  onPage: (page: string) => void
}) {
  const cards = [
    ["Collections planned", "148", "126 completed · 4 missed", "Collections"],
    ["Active routes", "8", "3 nearing completion", "Routes & AI EcoRoute"],
    [
      "AI km saved",
      "34.7 km",
      "24% on optimized routes",
      "Routes & AI EcoRoute",
    ],
    [
      "Payments today",
      money(KIGALI_OPERATIONS.paymentsToday),
      `${money(KIGALI_OPERATIONS.overdue)} overdue`,
      "Payments & Billing",
    ],
    ["Nduba trips", "7", "42.8 tonnes received", "Nduba Landfill"],
    ["SMS sent", "184", "6 queued for retry", "Communication"],
  ]
  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-bold">Today’s operations summary</p>
          <p className="text-xs text-slate-500">
            One shared Kigali dataset · {KIGALI_OPERATIONS.date}
          </p>
        </div>
        <Activity className="text-emerald-700" size={20} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, note, page]) => (
          <button
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            key={label}
            onClick={() => onPage(page)}
          >
            <span className="flex items-start justify-between">
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  {label}
                </span>
                <span className="mt-2 block text-xl font-bold text-slate-950">
                  {value}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {note}
                </span>
              </span>
              <ArrowRight
                className="text-slate-300 transition group-hover:text-emerald-700"
                size={17}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function DriverAssignedRoutesPage() {
  const assignments = useMemo(
    () =>
      loadAssignments().filter(
        (item) =>
          item.driver === "Eric Niyonzima" || item.team === "Team Alpha",
      ),
    [],
  )
  return (
    <div className="space-y-4">
      <PageIntro
        copy="Assignments accepted by Operations are synchronized here and sent by SMS."
        eyebrow="Driver workspace"
        title="My routes"
      />
      {assignments.map((assignment) => (
        <div
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
          key={assignment.id}
        >
          <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Route />
          </span>
          <div className="flex-1">
            <p className="font-bold">{assignment.route}</p>
            <p className="mt-1 text-sm text-slate-500">
              {assignment.date} · {assignment.start} · {assignment.vehicle} ·{" "}
              {assignment.team}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            {assignment.status}
          </span>
        </div>
      ))}
    </div>
  )
}

export function RouteAssignmentsPanel() {
  const assignments = useMemo(() => loadAssignments(), [])
  return (
    <div className="mb-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">Synchronized route assignments</p>
          <p className="text-xs text-slate-500">
            Accepted assignments are visible to drivers and live operations.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
          {assignments.length} active
        </span>
      </div>
      <div className="mt-4 grid gap-2 lg:grid-cols-3">
        {assignments.slice(0, 3).map((assignment) => (
          <div className="rounded-xl bg-slate-50 p-3" key={assignment.id}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">{assignment.route}</p>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {assignment.vehicle} · {assignment.driver}
            </p>
            <p className="mt-2 text-xs font-bold text-emerald-700">
              {assignment.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
