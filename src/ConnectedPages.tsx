import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  FileText,
  GripVertical,
  MapPin,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  ReceiptText,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react"
import type { Role } from "./App"
import {
  customers,
  locations,
  servicePlans,
  type Company,
  type CompanyStatus,
  type Employee,
  useStore,
} from "./Store"
import {
  WorkflowStepper,
  DashboardFilterPanel,
  PlannedVsCompletedBarChart,
  PaymentsPerDayLineChart,
  PaymentMethodsPieChart,
  OperationsKPIsAndMap,
  AdminSystemHealthPanel,
  type DashboardFilters,
} from "./DashboardComponents"

const money = (value: number) => `RWF ${value.toLocaleString()}`
const roleName = (role: Role) => (role === "Employee" ? "Employee" : role)

export function QuickActions({
  role,
  page,
  nav,
  onPage,
}: {
  role: Role
  page: string
  nav: string[]
  onPage: (page: string) => void
}) {
  const defaults = nav
    .filter((item) => !["Dashboard", "Profile & Settings"].includes(item))
    .slice(0, 5)
  const key = `ecoroute-quick-actions-${role}`
  const [items, setItems] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(key) || "") as string[]
    } catch {
      return defaults
    }
  })
  const [open, setOpen] = useState(false)
  const [alignment, setAlignment] = useState<"start" | "center" | "end">(
    "start",
  )
  const [hidden, setHidden] = useState(false)
  const save = (next: string[]) => {
    setItems(next)
    sessionStorage.setItem(key, JSON.stringify(next))
  }
  const move = (index: number, change: number) => {
    const target = index + change
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    save(next)
  }
  const shown = items.filter((item) => item !== page)
  return (
    <div className="relative mb-6">
      {!hidden && (
        <div
          className={`flex items-center gap-2 overflow-x-auto rounded-2xl border border-emerald-100 bg-white p-2 shadow-sm justify-${alignment}`}
        >
          <span className="shrink-0 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick actions
          </span>
          {shown.map((item) => {
            const index = items.indexOf(item)
            return (
              <button
                className="group flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-700 hover:text-white"
                draggable
                key={item}
                onClick={() => onPage(item)}
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/plain", String(index))
                }
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const from = Number(event.dataTransfer.getData("text/plain"))
                  const next = [...items]
                  const [dragged] = next.splice(from, 1)
                  next.splice(index, 0, dragged)
                  save(next)
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    move(index, -1)
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault()
                    move(index, 1)
                  }
                }}
              >
                <GripVertical size={13} />
                {item}
              </button>
            )
          })}
          <button
            aria-label="Customize quick actions"
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
            onClick={() => setOpen(!open)}
          >
            <Settings2 size={14} />
            Customize
          </button>
        </div>
      )}
      {hidden && (
        <button
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"
          onClick={() => setHidden(false)}
        >
          Show quick actions
        </button>
      )}
      {open && (
        <div className="absolute right-0 top-12 z-40 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="flex items-center">
            <div>
              <p className="font-bold">Customize shortcuts</p>
              <p className="text-xs text-slate-500">
                Changes apply to every page this session.
              </p>
            </div>
            <button
              className="ml-auto text-slate-400"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4 max-h-60 space-y-2 overflow-y-auto">
            {nav
              .filter(
                (item) => !["Dashboard", "Profile & Settings"].includes(item),
              )
              .map((item) => {
                const selected = items.includes(item)
                const index = items.indexOf(item)
                return (
                  <div
                    className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 text-xs"
                    key={item}
                  >
                    <GripVertical size={14} className="text-slate-400" />
                    <span className="flex-1 font-semibold">{item}</span>
                    {selected && (
                      <>
                        <button
                          aria-label={`Move ${item} up`}
                          onClick={() => move(index, -1)}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          aria-label={`Move ${item} down`}
                          onClick={() => move(index, 1)}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </>
                    )}
                    <button
                      className={`rounded-lg px-2 py-1 font-bold ${
                        selected
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                      onClick={() =>
                        save(
                          selected
                            ? items.filter((value) => value !== item)
                            : [...items, item],
                        )
                      }
                    >
                      {selected ? "Remove" : "Add"}
                    </button>
                  </div>
                )
              })}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-500">Align</span>
            {(["start", "center", "end"] as const).map((value) => (
              <button
                className={`rounded-lg px-2 py-1 text-xs font-bold ${
                  alignment === value
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100"
                }`}
                key={value}
                onClick={() => setAlignment(value)}
              >
                {value === "start"
                  ? "Left"
                  : value === "end"
                    ? "Right"
                    : "Center"}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              onClick={() => save(defaults)}
            >
              Reset to default
            </button>
            <button
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              onClick={() => {
                setHidden(true)
                setOpen(false)
              }}
            >
              Hide bar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function BellMenu({
  role,
  onOpen,
}: {
  role: Role
  onOpen: () => void
}) {
  const { messages, markMessage } = useStore()
  const [open, setOpen] = useState(false)
  const roleMessages = messages.filter(
    (item) =>
      item.role === roleName(role) &&
      (role !== "Customer" ||
        ((!item.recipientId || item.recipientId === "CUS-2048") &&
          (!item.location || item.location === "Nyarugunga"))) &&
      (role !== "Employee" ||
        ((!item.recipientId || item.recipientId === "EMP-1001") &&
          (!item.team || item.team === "Team Alpha"))),
  )
  const unread = roleMessages.filter((item) => item.unread).length
  return (
    <div className="relative">
      <button
        aria-label="Open messages"
        className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600"
        onClick={() => setOpen(!open)}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(90vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center border-b border-slate-100 p-4">
            <div>
              <p className="font-bold">Communication</p>
              <p className="text-xs text-slate-500">{unread} unread messages</p>
            </div>
            <button
              className="ml-auto text-xs font-bold text-emerald-700"
              onClick={() => markMessage(roleName(role))}
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
            {roleMessages.slice(0, 5).map((message) => (
              <button
                className={`block w-full p-4 text-left ${
                  message.unread ? "bg-emerald-50/50" : ""
                }`}
                key={message.id}
                onClick={() => markMessage(roleName(role), message.id)}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  {message.unread && (
                    <span className="size-2 rounded-full bg-emerald-600" />
                  )}
                  {message.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {message.text}
                </span>
                <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {message.channel} · {message.time}
                </span>
              </button>
            ))}
          </div>
          <button
            className="w-full bg-slate-50 p-3 text-sm font-bold text-emerald-700"
            onClick={() => {
              setOpen(false)
              onOpen()
            }}
          >
            Open Communication
          </button>
        </div>
      )}
    </div>
  )
}

function Status({ value }: { value: string }) {
  const tone =
    value === "Active" || value === "Paid" || value === "Authorized"
      ? "bg-emerald-50 text-emerald-700"
      : value === "Rejected" || value === "Overdue"
        ? "bg-rose-50 text-rose-700"
        : value === "Suspended"
          ? "bg-amber-50 text-amber-800"
          : "bg-blue-50 text-blue-700"
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tone}`}
    >
      {value}
    </span>
  )
}

export function AdminCompanies({
  initialPending = false,
}: {
  initialPending?: boolean
}) {
  const { companies, updateCompany, deleteCompany } = useStore()
  const [tab, setTab] = useState(initialPending ? "Pending" : "All")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Company | null>(null)
  const [dialog, setDialog] = useState<{
    action: string
    company: Company
  } | null>(null)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [typed, setTyped] = useState("")
  const [notice, setNotice] = useState("")
  const filtered = companies.filter(
    (item) => tab === "All" || item.status === tab,
  )
  const rows = filtered.slice((page - 1) * 10, page * 10)
  const act = () => {
    if (!dialog) return
    if (dialog.action === "Delete") {
      const error = deleteCompany(dialog.company.id)
      if (error) {
        setNotice(error)
        return
      }
    } else
      updateCompany(
        dialog.company.id,
        dialog.action === "Accept" || dialog.action === "Reactivate"
          ? "Active"
          : dialog.action === "Reject"
            ? "Rejected"
            : "Suspended",
        dialog.action === "Reject"
          ? `${reason}${notes ? ` — ${notes}` : ""}`
          : undefined,
      )
    setNotice(
      dialog.action === "Accept"
        ? "Company accepted"
        : `Company ${dialog.action.toLowerCase()}d`,
    )
    setDialog(null)
    setSelected(null)
    setReason("")
    setNotes("")
    setTyped("")
  }
  const actionButton = (item: Company, action: string) => (
    <button
      className={`${
        action === "Accept"
          ? "bg-emerald-700 text-white"
          : action === "Reject" || action === "Delete"
            ? "border border-rose-200 text-rose-700"
            : action === "Suspend"
              ? "border border-amber-200 text-amber-800"
              : "border border-slate-200 text-slate-700"
      } rounded-lg px-2.5 py-1.5 text-[11px] font-bold`}
      onClick={() =>
        action === "View"
          ? setSelected(item)
          : setDialog({ action, company: item })
      }
    >
      {action}
    </button>
  )
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {([
          "Active",
          "Pending",
          "Suspended",
          "Rejected",
        ] as CompanyStatus[]).map((status) => (
          <button
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
            key={status}
            onClick={() => {
              setTab(status)
              setPage(1)
            }}
          >
            <p className="text-2xl font-bold">
              {companies.filter((item) => item.status === status).length}
            </p>
            <p className="text-xs text-slate-500">{status} companies</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
          {["All", "Active", "Pending", "Suspended", "Rejected"].map((item) => (
            <button
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                tab === item
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-50 text-slate-600"
              }`}
              key={item}
              onClick={() => {
                setTab(item)
                setPage(1)
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                {[
                  "Company",
                  "Type",
                  "License",
                  "Contact",
                  "Requested",
                  "Users",
                  "Status",
                  "Actions",
                ].map((item) => (
                  <th
                    className={`px-4 py-3 ${
                      item === "Actions" ? "w-[300px]" : ""
                    }`}
                    key={item}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((item) => (
                <tr className="text-xs" key={item.id}>
                  <td className="px-4 py-4">
                    <strong className="text-sm">{item.name}</strong>
                    {item.isNew && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        New
                      </span>
                    )}
                    <span className="block text-slate-400">{item.id}</span>
                  </td>
                  <td className="px-4 py-4">{item.type}</td>
                  <td className="px-4 py-4 font-semibold">{item.license}</td>
                  <td className="px-4 py-4">{item.contact}</td>
                  <td className="px-4 py-4">{item.requested}</td>
                  <td className="px-4 py-4">{item.users}</td>
                  <td className="px-4 py-4">
                    <Status value={item.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      {item.status === "Pending" &&
                        actionButton(item, "Accept")}
                      {item.status === "Pending" &&
                        actionButton(item, "Reject")}
                      {item.status === "Active" &&
                        actionButton(item, "Suspend")}
                      {item.status === "Suspended" &&
                        actionButton(item, "Reactivate")}
                      {actionButton(item, "View")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center border-t border-slate-100 p-4 text-xs text-slate-500">
          <span>
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, filtered.length)}{" "}
            of {filtered.length}
          </span>
          <button
            className="ml-auto rounded-lg border border-slate-200 px-3 py-2 font-bold disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="ml-2 rounded-lg border border-slate-200 px-3 py-2 font-bold disabled:opacity-40"
            disabled={page * 10 >= filtered.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
      {selected && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/30"
          onClick={() => setSelected(null)}
        >
          <aside
            className="ml-auto h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Registration record
                </p>
                <p className="mt-1 text-2xl font-bold">{selected.name}</p>
              </div>
              <button
                className="ml-auto text-slate-400"
                onClick={() => setSelected(null)}
              >
                <X />
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Company type", selected.type],
                ["License number", selected.license],
                ["Contact person", selected.contact],
                ["Phone", selected.phone],
                ["Email", selected.email],
                ["Address", selected.address],
                ["Province", selected.province || "—"],
                ["District", selected.district || "—"],
                ["Sector", selected.sector || "—"],
                ["Cell", selected.cell || "—"],
                ["Street", selected.street || "—"],
                ["Building", selected.building || "—"],
                ["Business description", selected.description || "—"],
                ["Office phone", selected.officePhone || "—"],
                ["Verification document", selected.verificationDocument || "—"],
                ["Date requested", selected.requested],
                ["Users", String(selected.users)],
                ["Status", selected.status],
                ["Rejection reason", selected.rejectionReason || "—"],
              ].map(([label, value]) => (
                <div className="rounded-xl bg-slate-50 p-3" key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="font-bold">Status history</p>
              <div className="mt-2 space-y-2">
                {selected.history.map((item) => (
                  <div
                    className="rounded-xl border border-slate-100 p-3 text-xs"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {selected.status === "Pending" &&
                actionButton(selected, "Accept")}
              {selected.status === "Pending" &&
                actionButton(selected, "Reject")}
              {selected.status === "Active" &&
                actionButton(selected, "Suspend")}
              {selected.status === "Suspended" &&
                actionButton(selected, "Reactivate")}
              {actionButton(selected, "Delete")}
            </div>
          </aside>
        </div>
      )}
      {dialog && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div
              className={`grid size-11 place-items-center rounded-xl ${
                ["Reject", "Delete"].includes(dialog.action)
                  ? "bg-rose-50 text-rose-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {dialog.action === "Delete" ? <Trash2 /> : <ShieldCheck />}
            </div>
            <p className="mt-4 text-xl font-bold">
              {dialog.action} {dialog.company.name}?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action updates every connected workspace and adds an Activity
              Log entry.
            </p>
            {dialog.action === "Reject" && (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-bold text-slate-600">
                  Reason
                  <select
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  >
                    <option value="">Select a required reason</option>
                    <option>Incomplete documents</option>
                    <option>Invalid license</option>
                    <option>Duplicate company</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block text-xs font-bold text-slate-600">
                  Notes
                  <textarea
                    className="mt-1.5 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </label>
              </div>
            )}
            {dialog.action === "Delete" && (
              <label className="mt-4 block text-xs font-bold text-slate-600">
                Type “{dialog.company.name}”
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={typed}
                  onChange={(event) => setTyped(event.target.value)}
                />
              </label>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
                onClick={() => setDialog(null)}
              >
                Cancel
              </button>
              <button
                className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white ${
                  ["Reject", "Delete"].includes(dialog.action)
                    ? "bg-rose-700"
                    : "bg-emerald-700"
                }`}
                disabled={
                  (dialog.action === "Reject" && !reason) ||
                  (dialog.action === "Delete" && typed !== dialog.company.name)
                }
                onClick={act}
              >
                Confirm {dialog.action.toLowerCase()}
              </button>
            </div>
          </div>
        </div>
      )}
      {notice && (
        <div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-2xl bg-slate-950 p-4 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="text-emerald-400" size={18} />
          {notice}
          <button onClick={() => setNotice("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  )
}

export function CommunicationPage({
  role,
  onPage,
}: {
  role: Role
  onPage: (page: string) => void
}) {
  const { messages, markMessage, sendMessage, employees } = useStore()
  const [tab, setTab] = useState("All")
  const [search, setSearch] = useState("")
  const [audience, setAudience] =
    useState<"Individual" | "Team" | "Customer" | "Location customers">(
      "Location customers",
    )
  const [target, setTarget] = useState("Nyarugunga")
  const [title, setTitle] = useState("Collection reminder for today")
  const [text, setText] = useState(
    "Good morning. Our collection team will work in your area today. Please prepare your waste before your assigned collection time and make it accessible. Thank you for helping us collect safely and on time.",
  )
  const [channel, setChannel] = useState<"App" | "SMS" | "App + SMS">(
    "App + SMS",
  )
  const [sentNotice, setSentNotice] = useState("")
  const canManageSms = ["Admin", "Manager", "Finance"].includes(role)
  const [templates, setTemplates] = useState([
    ["Collection reminder", "Hi {name}, your collection is scheduled for {date}."],
    ["Truck on the way", "Hi {name}, your EcoRoute truck is on the way."],
    ["Completed", "Hi {name}, today’s collection is complete."],
    ["Missed collection", "Hi {name}, we could not complete your collection on {date}."],
    ["Invoice due", "Hi {name}, RWF {amount} is due on {date}."],
    ["Overdue warning", "Hi {name}, RWF {amount} is overdue. Please pay promptly."],
    ["Service suspended", "Hi {name}, service is suspended pending payment of RWF {amount}."],
    ["Payment received", "Hi {name}, we received RWF {amount}. Thank you."],
    ["Route changed", "Hi {name}, your collection route changed for {date}."],
  ])
  const [triggers, setTriggers] = useState([
    ["Day-5 invoice reminder", true],
    ["Truck departs route", true],
    ["Collection completed", true],
    ["Day-15 overdue warning", true],
    ["Day-30 suspension", true],
    ["Payment received", true],
    ["Route assignment changed", false],
  ] as [string, boolean][])
  const targetOptions =
    audience === "Location customers"
      ? locations.map((location) => ({
          value: location.name,
          label: `${location.name} · ${customers.filter((customer) => customer.location === location.name).length} customers`,
        }))
      : audience === "Team"
        ? [...new Set(employees.map((employee) => employee.team))].map(
            (team) => ({
              value: team,
              label: `${team} · ${employees.filter((employee) => employee.team === team).length} staff`,
            }),
          )
        : audience === "Customer"
          ? customers.map((customer) => ({
              value: customer.id,
              label: `${customer.name} · ${customer.location} · ${customer.id}`,
            }))
          : [
              ...employees.map((employee) => ({
                value: employee.id,
                label: `${employee.name} · ${employee.type} · ${employee.id}`,
              })),
              ...customers.map((customer) => ({
                value: customer.id,
                label: `${customer.name} · Customer · ${customer.id}`,
              })),
            ]
  const visibleToCurrentUser = (item: typeof messages[number]) =>
    (role !== "Customer" ||
      ((!item.recipientId || item.recipientId === "CUS-2048") &&
        (!item.location || item.location === "Nyarugunga"))) &&
    (role !== "Employee" ||
      ((!item.recipientId || item.recipientId === "EMP-1001") &&
        (!item.team || item.team === "Team Alpha")))
  const roleMessages = messages.filter(
    (item) =>
      (role === "Manager" && ["History", "Delivery log"].includes(tab)
        ? item.sentBy === "Diane Mukamana"
        : item.role === roleName(role) && visibleToCurrentUser(item)) &&
      (tab === "All" ||
        tab === "Inbox" ||
        tab === "History" ||
        tab === "Delivery log" ||
        (tab === "Unread" && item.unread) ||
        (["SMS", "Alerts"].includes(tab) &&
          (tab === "SMS"
            ? item.channel.includes("SMS")
            : /alert|failed|overdue|due/i.test(item.title)))) &&
      `${item.title} ${item.text}`.toLowerCase().includes(search.toLowerCase()),
  )
  const specific =
    canManageSms
      ? ["Inbox", "Send SMS", "Templates", "Automatic triggers", "Delivery log"]
      : role === "Customer"
        ? ["Reminders", "Collections", "Payments", "SMS history"]
        : role === "Finance"
          ? ["Payments", "Outstanding", "Delivery log"]
          : role === "Employee"
            ? ["Assignments", "Manager messages"]
            : ["Registrations", "Security", "System"]
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={16}
            />
            <input
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm"
              placeholder="Search communication"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold"
            onClick={() => markMessage(roleName(role))}
          >
            Mark all as read
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto p-4">
          {["All", "Unread", "SMS", "Alerts", ...specific].map((item) => (
            <button
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${
                tab === item
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-50 text-slate-600"
              }`}
              key={item}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {canManageSms && tab === "Send SMS" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.72fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Send size={19} />
              </span>
              <div>
              <p className="text-lg font-bold">Send SMS</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Choose exactly who should receive this communication. Other
                  customers and teams will not see it.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-600">
                Send to
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={audience}
                  onChange={(event) => {
                    const next = event.target.value as typeof audience
                    setAudience(next)
                    setTarget(
                      next === "Location customers"
                        ? locations[0].name
                        : next === "Team"
                          ? employees[0]?.team || ""
                          : next === "Customer"
                            ? customers[0].id
                            : employees[0]?.id || customers[0].id,
                    )
                  }}
                >
                  <option>Individual</option>
                  <option>Team</option>
                  <option>Customer</option>
                  <option>Location customers</option>
                </select>
              </label>
              <label className="text-xs font-bold text-slate-600">
                {audience === "Location customers"
                  ? "Collection location"
                  : audience === "Team"
                    ? "Team"
                    : audience}
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={target}
                  onChange={(event) => setTarget(event.target.value)}
                >
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold text-slate-600 sm:col-span-2">
                Message title
                <input
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              <label className="text-xs font-bold text-slate-600 sm:col-span-2">
                Message
                <textarea
                  className="mt-1.5 min-h-36 w-full rounded-xl border border-slate-200 p-3 text-sm leading-6"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </label>
              <label className="text-xs font-bold text-slate-600">
                Delivery channel
                <select
                  className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                  value={channel}
                  onChange={(event) =>
                    setChannel(event.target.value as typeof channel)
                  }
                >
                  <option>App</option>
                  <option>SMS</option>
                  <option>App + SMS</option>
                </select>
              </label>
              <div className="flex items-end">
                <button
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                  disabled={!target || !title.trim() || !text.trim()}
                  onClick={() => {
                    const delivered = sendMessage({
                      audience,
                      target,
                      title: title.trim(),
                      text: text.trim(),
                      channel,
                    })
                    setSentNotice(
                      `Message sent successfully to ${delivered} recipient${
                        delivered === 1 ? "" : "s"
                      }.`,
                    )
                  }}
                >
                  <Send size={16} />
                  Send message
                </button>
              </div>
            </div>
            {sentNotice && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
                <CheckCircle2 size={18} />
                {sentNotice}
                <button
                  className="ml-auto text-emerald-700"
                  onClick={() => setSentNotice("")}
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-bold">Morning templates</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Select a template, then adjust the location or assigned time
                before sending.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs hover:border-emerald-300"
                  onClick={() => {
                    setAudience("Team")
                    setTarget("Team Alpha")
                    setTitle("Today’s team assignment")
                    setText(
                      "Good morning team. Today you will work in the assigned area shown on your route. Review your stops, vehicle and collection notes before departure, and begin on time.",
                    )
                  }}
                >
                  <strong className="block text-sm">
                    Morning team assignment
                  </strong>
                  <span className="mt-1 block text-slate-500">
                    Tell a selected team where they will work today.
                  </span>
                </button>
                <button
                  className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs hover:border-emerald-300"
                  onClick={() => {
                    setAudience("Location customers")
                    setTarget("Nyarugunga")
                    setTitle("Collection reminder for today")
                    setText(
                      "Good morning. Our collection team will work in your area today. Please prepare your waste before your assigned collection time and make it accessible. Thank you for helping us collect safely and on time.",
                    )
                  }}
                >
                  <strong className="block text-sm">
                    Customer collection reminder
                  </strong>
                  <span className="mt-1 block text-slate-500">
                    Notify only customers in the selected collection location.
                  </span>
                </button>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-bold text-emerald-950">
                Targeting protection
              </p>
              <p className="mt-2 text-xs leading-5 text-emerald-900">
                Location messages are copied only to customer accounts assigned
                to that location. Team messages are visible only to staff in the
                selected team.
              </p>
            </div>
          </div>
        </div>
      )}
      {canManageSms && tab === "Templates" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-lg font-bold">Editable SMS templates</p>
          <p className="mt-2 text-sm text-slate-500">Use {"{name}"}, {"{amount}"} and {"{date}"} placeholders. Changes are applied immediately in this workspace.</p>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {templates.map(([name, body], index) => (
              <label className="rounded-xl border border-slate-200 p-4 text-xs font-bold text-slate-700" key={name}>
                {name}
                <textarea
                  className="mt-2 min-h-24 w-full rounded-lg bg-slate-50 p-3 text-sm font-normal leading-5"
                  onChange={(event) => setTemplates((current) => current.map((item, itemIndex) => itemIndex === index ? [item[0], event.target.value] : item))}
                  value={body}
                />
              </label>
            ))}
          </div>
          <button className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white" onClick={() => setSentNotice("SMS templates saved successfully.")}>Save templates</button>
        </div>
      )}
      {canManageSms && tab === "Automatic triggers" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-lg font-bold">Automatic SMS triggers</p>
          <p className="mt-1 text-sm text-slate-500">Control event-based customer and driver notifications.</p>
          <div className="mt-5 divide-y divide-slate-100">
            {triggers.map(([name, enabled], index) => (
              <div className="flex items-center py-4" key={name}>
                <div><p className="text-sm font-bold">{name}</p><p className="text-xs text-slate-500">{enabled ? "Messages send automatically" : "Manual sending only"}</p></div>
                <button
                  aria-label={`Toggle ${name}`}
                  className={`ml-auto rounded-full px-4 py-2 text-xs font-bold ${enabled ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"}`}
                  onClick={() => setTriggers((current) => current.map((item, itemIndex) => itemIndex === index ? [item[0], !item[1]] : item))}
                >
                  {enabled ? "On" : "Off"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {canManageSms && tab === "Delivery log" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5"><p className="font-bold">SMS delivery log</p><p className="text-xs text-slate-500">Provider delivery status and messaging cost.</p></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="bg-slate-50 uppercase tracking-wider text-slate-400"><tr>{["Recipient", "Phone", "Message", "Time", "Status", "Cost", "Action"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Aline Uwase", "+250 788 411 022", "Overdue warning", "09:12", "Delivered", "RWF 18"],
                  ["Eric Niyonzima", "+250 788 121 212", "Route changed", "08:44", "Delivered", "RWF 18"],
                  ["Patrick Habimana", "+250 788 231 114", "Invoice due", "08:31", "Failed", "RWF 0"],
                  ["Nyarugunga zone · 184", "Bulk list", "Collection reminder", "07:15", "Pending", "RWF 3,312"],
                ].map((row) => (
                  <tr key={`${row[0]}-${row[3]}`}>
                    {row.map((cell) => <td className="px-4 py-4 text-slate-600" key={cell}>{cell}</td>)}
                    <td className="px-4 py-4"><button className="font-bold text-emerald-700" onClick={() => setSentNotice(`SMS resent to ${row[0]}.`)}>Resend</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {sentNotice && canManageSms && !["Send SMS"].includes(tab) && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900"><CheckCircle2 size={18} />{sentNotice}<button className="ml-auto" onClick={() => setSentNotice("")}><X size={15} /></button></div>
      )}
      {!(canManageSms && ["Send SMS", "Templates", "Automatic triggers", "Delivery log"].includes(tab)) && (
        <div className="space-y-3">
          {roleMessages.map((message) => (
            <div
              className={`rounded-2xl border bg-white p-5 ${
                message.unread
                  ? "border-emerald-200 shadow-sm"
                  : "border-slate-200"
              }`}
              key={message.id}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 size-2 shrink-0 rounded-full ${
                    message.unread ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{message.title}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold">
                      {message.channel}
                    </span>
                    {message.audience && (
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                        {message.audience}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {message.time}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {message.text}
                  </p>
                  <div className="mt-3 flex gap-3">
                    {message.unread && (
                      <button
                        className="text-xs font-bold text-emerald-700"
                        onClick={() => markMessage(roleName(role), message.id)}
                      >
                        Mark as read
                      </button>
                    )}
                    {message.action && (
                      <button
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700"
                        onClick={() =>
                          onPage(
                            message.action?.toLowerCase().includes("pay")
                              ? "My Payments / Invoices"
                              : message.action
                                    ?.toLowerCase()
                                    .includes("company")
                                ? "Companies"
                                : message.action
                                      ?.toLowerCase()
                                      .includes("route")
                                  ? "My Routes"
                                  : role === "Finance" || role === "Manager"
                                    ? "Payments & Billing"
                                    : "Dashboard",
                          )
                        }
                      >
                        {message.action}
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {roleMessages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <MessageSquareText className="mx-auto text-slate-300" />
              <p className="mt-3 font-bold">No messages in this view</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CustomerPayments({
  onPage,
}: {
  onPage: (page: string) => void
}) {
  const { invoices, payments, payInvoice } = useStore()
  const [tab, setTab] = useState("Overview")
  const [stage, setStage] = useState(0)
  const [method, setMethod] = useState("MTN Mobile Money")
  const [countdown, setCountdown] = useState(60)
  const [failure, setFailure] = useState("Declined")
  const [transactionReference, setTransactionReference] = useState("")
  const mine = invoices.filter((item) => item.customerId === "CUS-2048")
  const unpaid = mine.filter((item) => item.status !== "Paid")
  const minePayments = payments.filter((item) => item.customerId === "CUS-2048")
  const totalPaid = minePayments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0)
  const finish = () => {
    setCountdown(60)
    setStage(3)
  }
  const approve = () => {
    let reference = ""
    unpaid.forEach((invoice) => {
      reference = payInvoice(invoice.id, method).reference
    })
    setTransactionReference(reference)
    setStage(4)
  }
  useEffect(() => {
    if (stage !== 3) return
    if (countdown === 0) {
      setFailure("Timed out")
      setStage(5)
      return
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [countdown, stage])
  if (stage > 0)
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {stage === 1 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Unpaid receipts
            </p>
            <p className="mt-2 text-2xl font-bold">Select invoices to pay</p>
            <div className="mt-5 space-y-3">
              {unpaid.map((invoice) => (
                <label
                  className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4"
                  key={invoice.id}
                >
                  <input defaultChecked type="checkbox" />
                  <div>
                    <strong className="text-sm">
                      {invoice.id} · {invoice.period}
                    </strong>
                    <p className="text-xs text-slate-500">
                      {invoice.plan} · Due {invoice.due}
                    </p>
                  </div>
                  <strong className="ml-auto text-sm">
                    {money(invoice.amount)}
                  </strong>
                </label>
              ))}
            </div>
            <div className="mt-5 flex items-center border-t border-slate-100 pt-5">
              <span className="text-sm text-slate-500">Total</span>
              <strong className="ml-auto text-xl">
                {money(unpaid.reduce((sum, item) => sum + item.amount, 0))}
              </strong>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold" onClick={() => setStage(0)}>Back</button>
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-rose-700" onClick={() => setStage(0)}>Cancel</button>
              <button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white sm:ml-auto" onClick={() => setStage(2)}>Continue to payment</button>
            </div>
          </>
        )}
        {stage === 2 && (
          <>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Payment method
            </p>
            <p className="mt-2 text-2xl font-bold">Confirm mobile payment</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["MTN Mobile Money", "Airtel Money"].map((item) => (
                <button
                  className={`rounded-2xl border-2 p-4 text-left ${
                    method === item
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200"
                  }`}
                  key={item}
                  onClick={() => setMethod(item)}
                >
                  <strong>{item}</strong>
                  <span className="mt-1 block text-xs text-slate-500">
                    Secure mobile wallet
                  </span>
                </button>
              ))}
            </div>
            <label className="mt-4 block text-xs font-bold text-slate-600">
              Phone number
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                defaultValue="+250 788 123 456"
              />
            </label>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
              <span>Amount</span>
              <strong className="float-right">
                {money(unpaid.reduce((sum, item) => sum + item.amount, 0))}
              </strong>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold" onClick={() => setStage(1)}>Back</button>
              <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-rose-700" onClick={() => setStage(0)}>Cancel</button>
              <button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white sm:ml-auto" onClick={finish}>Confirm payment</button>
            </div>
          </>
        )}
        {stage === 3 && (
          <div className="py-10 text-center">
            <MoreHorizontal
              className="mx-auto animate-spin text-emerald-700"
              size={40}
            />
            <p className="mt-4 text-2xl font-bold">Waiting for confirmation</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Request sent to +250 788 123 456. Enter your {method.startsWith("MTN") ? "MTN MoMo" : "Airtel Money"} PIN or dial *182# to approve RWF 6,000.
            </p>
            <div className="mx-auto mt-6 grid size-20 place-items-center rounded-full border-4 border-emerald-100 text-xl font-bold text-emerald-800">{countdown}s</div>
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold" onClick={() => setStage(0)}>Cancel</button>
              <button className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white" onClick={approve}>Simulate approve</button>
              <button className="rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700" onClick={() => { setFailure("Declined"); setStage(5) }}>Simulate decline</button>
              <button className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-bold text-amber-800" onClick={() => { setFailure("Insufficient balance"); setStage(5) }}>Simulate insufficient balance</button>
            </div>
          </div>
        )}
        {stage === 4 && (
          <div className="py-8 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <Check size={30} />
            </span>
            <p className="mt-5 text-3xl font-bold">Payment successful</p>
            <p className="mt-2 text-sm text-slate-500">
              Receipt generated and Finance notified immediately. SMS confirmation sent.
            </p>
            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 p-5 text-left text-sm">
              {[
                ["Receipt no.", payments[0]?.id || "RCT-NEW"],
                ["Transaction", transactionReference],
                ["Method", method],
                ["Billing period", "October 2026"],
                ["Amount", "RWF 6,000"],
              ].map(([label, value]) => (
                <div
                  className="flex border-b border-slate-200 py-3 last:border-0"
                  key={label}
                >
                  <span className="text-slate-500">{label}</span>
                  <strong className="ml-auto">{value}</strong>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold">
                <Download className="mr-2 inline" size={15} />
                Download receipt
              </button>
              <button
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
                onClick={() => {
                  setStage(0)
                  setTab("Overview")
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
        {stage === 5 && (
          <div className="py-10 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-rose-100 text-rose-700"><X size={30} /></span>
            <p className="mt-5 text-3xl font-bold">Payment failed</p>
            <p className="mt-2 text-sm font-semibold text-rose-700">{failure}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">No charge was made and your invoice remains unpaid. Check your wallet or try another provider.</p>
            <div className="mt-6 flex justify-center gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold" onClick={() => setStage(0)}>Cancel</button>
              <button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white" onClick={() => setStage(2)}>Try again</button>
            </div>
          </div>
        )}
      </div>
    )
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2">
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
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["Total paid", money(totalPaid)],
              [
                "Balance",
                money(unpaid.reduce((sum, item) => sum + item.amount, 0)),
              ],
              ["Last payment", minePayments[0]?.date || "—"],
              ["Status", unpaid.length ? "Payment due" : "Paid"],
            ].map(([label, value]) => (
              <div
                className="rounded-2xl border border-slate-200 bg-white p-5"
                key={label}
              >
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          {unpaid.length ? (
            <div className="flex flex-col gap-4 rounded-2xl bg-amber-50 p-5 text-amber-950 sm:flex-row sm:items-center">
              <AlertTriangle />
              <div>
                <p className="font-bold">
                  {unpaid.length} unpaid invoice: {money(unpaid[0].amount)}, due{" "}
                  {unpaid[0].due}
                </p>
                <p className="text-xs">Household Standard · Monthly</p>
              </div>
              <button
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white sm:ml-auto"
                onClick={() => setStage(1)}
              >
                Pay now
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
              <CheckCircle2 className="mx-auto text-emerald-700" size={38} />
              <p className="mt-4 text-2xl font-bold">
                No unpaid receipts. Everything is paid.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Last payment: RWF 6,000 · October 2026
              </p>
              <p className="text-sm text-slate-500">
                Next invoice: November 2026, RWF 6,000, issued 01 Nov
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  className="rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold"
                  onClick={() => setTab("Payments")}
                >
                  View payment history
                </button>
                <button className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white">
                  Download last receipt
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {tab === "Payments" && (
        <DataTable
          columns={[
            "Invoice no.",
            "Provider",
            "Transaction ref",
            "Phone",
            "Amount",
            "Status",
          ]}
          rows={minePayments.map((item) => [
            item.invoiceId,
            item.method,
            item.reference,
            "+250 788 123 456",
            money(item.amount),
            item.status,
          ])}
          action="Download Statement"
        />
      )}
      {tab === "Invoices" && (
        <DataTable
          columns={[
            "Invoice no.",
            "Period",
            "Plan",
            "Amount",
            "Due date",
            "Status",
            "Actions",
          ]}
          rows={mine.map((item) => [
            item.id,
            item.period,
            item.plan,
            money(item.amount),
            item.due,
            item.status,
            "View · Download",
          ])}
        />
      )}
    </div>
  )
}

function DataTable({
  columns,
  rows,
  action,
}: {
  columns: string[]
  rows: string[][]
  action?: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {action && (
        <div className="flex justify-end border-b border-slate-100 p-4">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold">
            <Download size={14} />
            {action}
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((item) => (
                <th className="px-4 py-3" key={item}>
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr className="text-xs" key={index}>
                {row.map((item, cell) => (
                  <td className="px-4 py-4" key={cell}>
                    {columns[cell] === "Status" ? (
                      <Status value={item} />
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
  )
}

export function LocationsPage({ onPage }: { onPage: (page: string) => void }) {
  const { invoices, payments } = useStore()
  const [selected, setSelected] = useState("All locations")
  const visible = locations.filter(
    (item) => selected === "All locations" || item.name === selected,
  )
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label className="text-xs font-bold text-slate-500">
          Select collection location
          <select
            className="ml-3 rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            <option>All locations</option>
            {locations.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((location) => {
          const people = customers.filter(
            (item) => item.location === location.name,
          )
          const ids = people.map((item) => item.id)
          const bills = invoices.filter((item) => ids.includes(item.customerId))
          const paid = bills.filter((item) => item.status === "Paid")
          const collected = payments
            .filter(
              (item) => ids.includes(item.customerId) && item.status === "Paid",
            )
            .reduce((sum, item) => sum + item.amount, 0)
          const outstanding = bills
            .filter((item) => item.status !== "Paid")
            .reduce((sum, item) => sum + item.amount - (item.paid || 0), 0)
          return (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              key={location.name}
            >
              <div className="flex items-start">
                <span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin />
                </span>
                <div className="ml-3">
                  <p className="text-lg font-bold">{location.name}</p>
                  <p className="text-xs text-slate-500">
                    {location.district} · Every {location.day}
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  {location.route}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["Customers served", String(people.length)],
                  [
                    "Paid / unpaid",
                    `${paid.length} / ${bills.length - paid.length}`,
                  ],
                  ["Collected", money(collected)],
                  ["Outstanding", money(outstanding)],
                  ["Next collection", `${location.day}, 07:30`],
                  ["Vehicle & team", `${location.vehicle} · ${location.team}`],
                ].map(([label, value]) => (
                  <div className="rounded-xl bg-slate-50 p-3" key={label}>
                    <p className="text-[10px] text-slate-400">{label}</p>
                    <p className="mt-1 text-xs font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Driver: <strong>{location.driver}</strong>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white"
                  onClick={() => onPage("Customers")}
                >
                  View Customers
                </button>
                <button
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                  onClick={() => onPage("Live Tracking")}
                >
                  View Route
                </button>
                <button
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                  onClick={() => onPage("Collection Schedule")}
                >
                  View Schedule
                </button>
                <button
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                  onClick={() => onPage("Payments & Billing")}
                >
                  Payments
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PlansPage() {
  const [plans, setPlans] = useState(servicePlans)
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold">Service plans & pricing</p>
          <p className="mt-1 text-xs text-slate-500">
            Prices are configured by the Administrator according to company
            tariffs.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white sm:ml-auto">
          <Plus size={15} />
          Add plan
        </button>
      </div>
      <DataTable
        columns={[
          "Plan",
          "Customer type",
          "Kg limit",
          "Waste types",
          "Billing period",
          "Price",
          "Status",
          "Actions",
        ]}
        rows={plans.map((plan) => [
          plan.name,
          plan.type,
          plan.kg,
          plan.waste,
          plan.period,
          plan.price ? money(plan.price) : "Manager-set",
          plan.status,
          "Edit · Deactivate",
        ])}
      />
    </div>
  )
}

export function EmployeesPage() {
  const { employees, addEmployee } = useStore()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState<Employee>({
    id: `EMP-${Date.now().toString().slice(-4)}`,
    name: "",
    phone: "",
    email: "",
    type: "Driver",
    department: "Operations",
    team: "Team Alpha",
    salary: 0,
    salaryType: "Monthly fixed",
    startDate: "2026-10-06",
    status: "Active",
  })
  const set = (key: keyof Employee, value: string | number) =>
    setForm({ ...form, [key]: value })
  const filtered = employees.filter((item) =>
    `${item.id} ${item.name} ${item.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <input
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 text-sm"
            placeholder="Search name, phone or employee ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"
          onClick={() => setOpen(true)}
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>
      <DataTable
        columns={[
          "Employee",
          "ID",
          "Phone",
          "Type",
          "Department",
          "Team",
          "Status",
          "Actions",
        ]}
        rows={filtered.map((item) => [
          item.name,
          item.id,
          item.phone,
          item.type,
          item.department,
          item.team,
          item.status,
          "Edit · Change status · Deactivate",
        ])}
      />
      {open && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/40 p-4">
          <div className="mx-auto my-6 max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  New staff record
                </p>
                <p className="mt-1 text-2xl font-bold">Add employee</p>
              </div>
              <button className="ml-auto" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {([
                ["Full name", "name"],
                ["Phone", "phone"],
                ["Email", "email"],
                ["Employee ID", "id"],
                ["Department", "department"],
                ["Team", "team"],
                ["Monthly salary (RWF)", "salary"],
                ["Start date", "startDate"],
                ["Assigned vehicle (optional)", "vehicle"],
              ] as [string, keyof Employee][]).map(([label, key]) => (
                <label className="text-xs font-bold text-slate-600" key={key}>
                  {label}
                  <input
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                    type={
                      key === "salary"
                        ? "number"
                        : key === "startDate"
                          ? "date"
                          : "text"
                    }
                    value={form[key] || ""}
                    onChange={(event) =>
                      set(
                        key,
                        key === "salary"
                          ? Number(event.target.value)
                          : event.target.value,
                      )
                    }
                  />
                </label>
              ))}
              {([
                [
                  "Employee type",
                  "type",
                  [
                    "Driver",
                    "Collection Staff",
                    "Finance Officer",
                    "Dispatcher",
                    "Fleet Officer",
                    "Field Supervisor",
                    "Manager",
                  ],
                ],
                [
                  "Salary type",
                  "salaryType",
                  ["Monthly fixed", "Daily", "Per trip"],
                ],
                ["Status", "status", ["Active", "On leave", "Inactive"]],
              ] as [string, keyof Employee, string[]][]).map(
                ([label, key, options]) => (
                  <label className="text-xs font-bold text-slate-600" key={key}>
                    {label}
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      value={form[key]}
                      onChange={(event) => set(key, event.target.value)}
                    >
                      {options.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                ),
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                disabled={!form.name || !form.email || !form.salary}
                onClick={() => {
                  addEmployee(form)
                  setOpen(false)
                }}
              >
                Save employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function PayrollPage({ mode }: { mode: "Manager" | "Finance" }) {
  const { payroll, employees, updatePayroll } = useStore()
  const total = payroll.reduce((sum, item) => sum + item.salary, 0)
  const paid = payroll
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.salary, 0)
  const pending = payroll
    .filter((item) => item.status !== "Paid")
    .reduce((sum, item) => sum + item.salary, 0)
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Total employees", payroll.length],
          ["Paid this month", money(paid)],
          ["Pending salaries", money(pending)],
          ["Total payroll", money(total)],
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
      <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-4">
        <label className="text-xs font-bold text-slate-500">
          Month
          <select className="ml-3 rounded-xl border border-slate-200 p-2 text-sm">
            <option>October 2026</option>
            <option>September 2026</option>
          </select>
        </label>
        {mode === "Manager" && (
          <button
            className="ml-auto rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white"
            onClick={() =>
              payroll
                .filter((item) => item.status === "Pending")
                .forEach((item) =>
                  updatePayroll(
                    item.employeeId,
                    "Authorized",
                    "Diane Mukamana",
                  ),
                )
            }
          >
            Authorize all pending
          </button>
        )}
        {mode === "Finance" && (
          <button className="ml-auto rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold">
            <Download className="mr-2 inline" size={14} />
            Generate payroll report
          </button>
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              {["Employee", "Role", "Salary", "Month", "Status", "Actions"].map(
                (item) => (
                  <th className="px-4 py-3" key={item}>
                    {item}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payroll.map((item) => {
              const employee = employees.find(
                (value) => value.id === item.employeeId,
              )
              return (
                <tr className="text-xs" key={item.employeeId}>
                  <td className="px-4 py-4 font-bold">{employee?.name}</td>
                  <td className="px-4 py-4">{employee?.type}</td>
                  <td className="px-4 py-4">{money(item.salary)}</td>
                  <td className="px-4 py-4">{item.month}</td>
                  <td className="px-4 py-4">
                    <Status value={item.status} />
                  </td>
                  <td className="px-4 py-4">
                    {mode === "Manager" && item.status === "Pending" && (
                      <button
                        className="font-bold text-emerald-700"
                        onClick={() =>
                          updatePayroll(
                            item.employeeId,
                            "Authorized",
                            "Diane Mukamana",
                          )
                        }
                      >
                        Authorize
                      </button>
                    )}
                    {mode === "Finance" && item.status === "Authorized" && (
                      <button
                        className="font-bold text-emerald-700"
                        onClick={() =>
                          updatePayroll(
                            item.employeeId,
                            "Paid",
                            "Claudine Uwase",
                          )
                        }
                      >
                        Record salary payment
                      </button>
                    )}
                    {mode === "Finance" && item.status === "Pending" && (
                      <span className="text-slate-400">
                        Awaiting Manager authorization
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ActivityPage({ role }: { role: Role }) {
  const { logs, addLog } = useStore()
  const [search, setSearch] = useState("")
  const visible = logs.filter(
    (item) =>
      (role === "Admin" ||
        (role === "Manager" && !["Security"].includes(item.module)) ||
        (role === "Finance" &&
          ["Payments", "Invoices", "Billing", "Payroll", "Reports"].includes(
            item.module,
          )) ||
        (role === "Employee" && item.role === "Employee") ||
        (role === "Customer" && item.role === "Customer")) &&
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  )
  const exportCsv = () => {
    const csv = [
      ["Date/time", "User", "Role", "Action", "Module", "Record", "Old value", "New value", "Device"],
      ...visible.map((item) => [
        item.time,
        item.user,
        item.role,
        item.action,
        item.module,
        item.record,
        item.oldValue || "—",
        item.newValue || "—",
        item.device || "Web app",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "ecoroute-activity.csv"
    link.click()
    URL.revokeObjectURL(url)
    addLog({
      user:
        role === "Admin"
          ? "System Administrator"
          : role === "Manager"
            ? "Diane Mukamana"
            : "Claudine Uwase",
      role,
      action: "Report exported",
      module: "Reports",
      record: "Activity Log CSV",
    })
  }
  return (
    <div className="space-y-4">
      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <input
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 text-sm"
            placeholder="Search activity"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold"
          onClick={exportCsv}
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>
      <DataTable
        columns={[
          "Date/time",
          "User",
          "Role",
          "Action",
          "Module",
          "Record",
          "Old value",
          "New value",
          "Device",
        ]}
        rows={visible.map((item) => [
          item.time,
          item.user,
          item.role,
          item.action,
          item.module,
          item.record,
          item.oldValue || "—",
          item.newValue || "—",
          item.device || "Web app",
        ])}
      />
    </div>
  )
}

export function ConnectedDashboard({
  role,
  onPage,
  profile,
}: {
  role: Role
  onPage: (page: string) => void
  profile?: {
    name?: string
    email?: string
    phone?: string
    customerId?: string
    assignment?: string
    sector?: string
    cell?: string
    address?: string
    plan?: string
    fee?: number
  } | null
}) {
  const {
    companies,
    invoices,
    payments,
    messages,
    updateCompany,
    metrics,
    collections,
    overdueAccounts,
    landfillTrips,
    vehicles,
    activeSessions,
  } = useStore()

  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "Today",
    zone: "All zones",
    vehicle: "All vehicles",
    status: "All statuses",
  })

  const handleFilterChange = (key: keyof DashboardFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      dateRange: "Today",
      zone: "All zones",
      vehicle: "All vehicles",
      status: "All statuses",
    })
  }

  if (role === "Admin") {
    const pending = companies.filter((item) => item.status === "Pending")
    return (
      <div className="space-y-6">
        {/* Requirement 4: Filter panel */}
        <DashboardFilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Requirement 4: Operations KPIs and Map */}
        <OperationsKPIsAndMap filters={filters} onPage={onPage} />

        {/* Requirement 4: Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PlannedVsCompletedBarChart zoneFilter={filters.zone} />
          </div>
          <div className="lg:col-span-1">
            <PaymentsPerDayLineChart />
          </div>
          <div className="lg:col-span-1">
            <PaymentMethodsPieChart />
          </div>
        </div>

        {/* Requirement 4: Admin System Health Panel */}
        <AdminSystemHealthPanel
          onViewSessions={() => onPage("Users & Roles")}
        />

        {/* Retained Admin approvals flow */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center border-b border-slate-100 p-5">
            <div>
              <p className="font-bold">Pending company registrations</p>
              <p className="text-xs text-slate-500">
                Registration details match the Companies list.
              </p>
            </div>
            <button
              className="ml-auto text-xs font-bold text-emerald-700"
              onClick={() => {
                sessionStorage.setItem("ecoroute-companies-tab", "Pending")
                onPage("Companies")
              }}
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {pending.slice(0, 3).map((item) => (
              <div
                className="flex flex-col gap-3 p-4 text-sm sm:flex-row sm:items-center"
                key={item.id}
              >
                <div>
                  <strong>{item.name}</strong>
                  <p className="text-xs text-slate-500">
                    {item.type} · {item.license} · {item.contact}
                  </p>
                </div>
                <button
                  className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white sm:ml-auto"
                  onClick={() => updateCompany(item.id, "Active")}
                >
                  Accept
                </button>
                <button
                  className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700"
                  onClick={() => {
                    sessionStorage.setItem("ecoroute-companies-tab", "Pending")
                    onPage("Companies")
                  }}
                >
                  Reject
                </button>
                <button
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold"
                  onClick={() => onPage("Companies")}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (role === "Finance") {
    const paid = payments.filter((item) => item.status === "Paid")
    const outstanding = invoices.filter((item) => item.status !== "Paid")
    return (
      <div className="space-y-6">
        {/* Requirement 4: Filter panel */}
        <DashboardFilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Consistent Finance KPIs */}
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            [
              "Revenue",
              money(metrics.revenueToday),
            ],
            ["Today's payments", paid.length],
            [
              "Pending",
              payments.filter((item) => item.status === "Pending confirmation").length,
            ],
            [
              "Outstanding",
              money(
                outstanding.reduce(
                  (sum, item) => sum + item.amount - (item.paid || 0),
                  0,
                ),
              ),
            ],
            [
              "Overdue",
              `${metrics.overdueCount} (RWF ${metrics.overdueTotal.toLocaleString()})`,
            ],
            ["Active zones", "4 zones"],
          ].map(([label, value]) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              key={label as string}
            >
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label as string}</p>
            </div>
          ))}
        </div>

        {/* Requirement 4: Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PaymentsPerDayLineChart />
          <PaymentMethodsPieChart />
        </div>

        {/* Recent payments table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Recent Reconciled MoMo & Bank Payments</p>
              <p className="text-xs text-slate-500">Live verified customer transactions</p>
            </div>
            <button
              onClick={() => onPage("Payments & Billing")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View Billing Center →
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <DataTable
              columns={[
                "Customer",
                "Amount",
                "Method",
                "Plan",
                "Location",
                "Status",
              ]}
              rows={paid.slice(0, 5).map((item) => {
                const customer = customers.find(
                  (value) => value.id === item.customerId,
                )
                return [
                  customer?.name || item.customerId,
                  money(item.amount),
                  item.method,
                  customer?.plan || "Standard Household",
                  customer?.location || "Kigali",
                  item.status,
                ]
              })}
            />
          </div>
        </div>
      </div>
    )
  }

  if (role === "Manager") {
    const paid = payments.filter((item) => item.status === "Paid")
    const outstanding = invoices.filter((item) => item.status !== "Paid")
    return (
      <div className="space-y-6">
        {/* Requirement 4: Filter panel */}
        <DashboardFilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Requirement 3 & 4: Consistent KPIs and Map */}
        <OperationsKPIsAndMap filters={filters} onPage={onPage} />

        {/* Requirement 4: Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <PlannedVsCompletedBarChart zoneFilter={filters.zone} />
          </div>
          <div className="lg:col-span-1">
            <PaymentsPerDayLineChart />
          </div>
          <div className="lg:col-span-1">
            <PaymentMethodsPieChart />
          </div>
        </div>

        {/* Customer Operations Sample Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <p className="font-bold text-slate-900">Customer Collection Locations</p>
              <p className="text-xs text-slate-500">Real-time status across 671 subscribed accounts</p>
            </div>
            <button
              onClick={() => onPage("Customers")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View all 671 customers →
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <DataTable
              columns={["Customer", "Plan", "Location", "Amount", "Payment status"]}
              rows={customers.slice(0, 5).map((customer) => {
                const invoice = invoices.find(
                  (item) => item.customerId === customer.id,
                )
                return [
                  customer.name,
                  customer.plan,
                  customer.location,
                  money(customer.fee),
                  invoice?.status || "Paid",
                ]
              })}
            />
          </div>
        </div>
      </div>
    )
  }
  if (role === "Customer") {
    const customerId = profile?.customerId || "CUS-2048"
    const customerName = profile?.name || "Customer"
    const mine = invoices.filter(
      (item) =>
        item.customerId === customerId ||
        (profile?.email &&
          item.customer?.toLowerCase().includes(customerName.toLowerCase())),
    )
    const unpaid = mine.filter((item) => item.status !== "Paid")
    const lastMessage = messages.find((item) => item.role === "Customer")
    const locationArea = profile?.sector
      ? `${profile.sector} · Route KG 45 · Scheduled`
      : "Nyarugunga · Route KG 45 · Scheduled"
    const balanceAmount =
      unpaid.length > 0
        ? unpaid.reduce((sum, item) => sum + item.amount, 0)
        : profile?.fee
          ? profile.fee
          : 6000

    return (
      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl bg-emerald-900 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Next collection
            </p>
            <p className="mt-3 text-3xl font-bold">Monday · 07:30–09:30</p>
            <p className="mt-2 text-sm text-emerald-100">
              {locationArea}
            </p>
            <button
              className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-900"
              onClick={() => onPage("My Collection")}
            >
              View on Map
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account balance
            </p>
            <p className="mt-3 text-3xl font-bold">
              {money(balanceAmount)}
            </p>
            <Status value={unpaid.length > 0 || !mine.length ? "Unpaid" : "Paid"} />
            {(unpaid.length > 0 || !mine.length) && (
              <button
                className="mt-5 block w-full rounded-xl bg-emerald-700 p-3 text-sm font-bold text-white"
                onClick={() => onPage("My Payments / Invoices")}
              >
                Pay now
              </button>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Latest communication
          </p>
          <p className="mt-2 font-bold">{lastMessage?.title || "Service Update"}</p>
          <p className="mt-1 text-sm text-slate-500">
            {lastMessage?.text || `Your household waste collection service is active for ${customerName}.`}
          </p>
          <button
            className="mt-3 text-xs font-bold text-emerald-700"
            onClick={() => onPage("Communication")}
          >
            Open Communication
          </button>
        </div>
      </div>
    )
  }
  return null
}

export function UsersPage() {
  const { employees, registeredCustomers } = useStore()
  const employeeAccounts = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("ecoroute-employee-accounts") || "[]",
      ) as {
        id: string
        name: string
        email: string
        role: string
        status: string
      }[]
    } catch {
      return []
    }
  })()
  const rows = [
    ...registeredCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      role: `Customer · ${customer.assignedCompany}`,
      status: customer.status,
    })),
    ...employeeAccounts,
    ...employees
      .filter(
        (employee) =>
          !employeeAccounts.some((account) => account.id === employee.id),
      )
      .map((employee) => ({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role:
          employee.type === "Finance Officer"
            ? "Finance"
            : "Driver / Collection Team",
        status: "Active",
      })),
    {
      id: "CUS-2048",
      name: "Jean Romeo",
      email: "customer@ecoroute.rw",
      role: "Customer",
      status: "Active",
    },
  ]
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Platform users", "1,248"],
          ["Active", "1,176"],
          ["Inactive", "61"],
          ["Locked", "11"],
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
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        New customer and employee accounts appear here immediately. Salary
        information is intentionally excluded from Admin.
      </div>
      <DataTable
        columns={[
          "User",
          "User ID",
          "Email",
          "Workspace role",
          "Status",
          "Actions",
        ]}
        rows={rows.map((item) => [
          item.name,
          item.id,
          item.email,
          item.role,
          item.status,
          "View · Change role",
        ])}
      />
    </div>
  )
}

export function PaymentsBilling({ mode }: { mode: "Manager" | "Finance" }) {
  const { invoices, payments, payInvoice } = useStore()
  const [open, setOpen] = useState(false)
  const [customerId, setCustomerId] = useState("CUS-2048")
  const selectedCustomer = customers.find((item) => item.id === customerId)!
  const outstanding = invoices.filter(
    (item) => item.customerId === customerId && item.status !== "Paid",
  )
  const [amount, setAmount] = useState(selectedCustomer.fee)
  const [method, setMethod] = useState("Cash")
  const [reference, setReference] = useState(
    `MAN-${Date.now().toString().slice(-6)}`,
  )
  const [saved, setSaved] = useState<ReturnType<typeof payInvoice> | null>(null)
  const collected = payments
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0)
  const rows = invoices.map((invoice) => {
    const customer = customers.find((item) => item.id === invoice.customerId)!
    const payment = payments.find((item) => item.invoiceId === invoice.id)
    return [
      customer.name,
      invoice.id,
      payment?.method || "—",
      payment?.reference || "—",
      customer.phone,
      money(invoice.amount),
      invoice.status,
      customer.period,
      customer.location,
    ]
  })
  const record = () => {
    if (!outstanding[0]) return
    const payment = payInvoice(
      outstanding[0].id,
      method,
      mode === "Manager" ? "Diane Mukamana" : "Claudine Uwase",
      amount,
      mode === "Manager",
    )
    setSaved({ ...payment, reference })
  }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Payments", payments.length],
          ["Collected", money(collected)],
          [
            "Outstanding invoices",
            invoices.filter((item) => item.status !== "Paid").length,
          ],
          [
            "Outstanding amount",
            money(
              invoices
                .filter((item) => item.status !== "Paid")
                .reduce((sum, item) => sum + item.amount - (item.paid || 0), 0),
            ),
          ],
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
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold">Payments by plan</p>
          <p className="text-xs text-slate-500">
            {servicePlans
              .filter((item) => item.price)
              .map(
                (item) =>
                  `${item.name}: ${invoices.filter((invoice) => invoice.plan === item.name).length} · ${money(invoices.filter((invoice) => invoice.plan === item.name).reduce((sum, invoice) => sum + invoice.amount, 0))}`,
              )
              .join("  |  ")}
          </p>
        </div>
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white sm:ml-auto"
          onClick={() => {
            setSaved(null)
            setOpen(true)
          }}
        >
          <Plus size={16} />
          {mode === "Manager" ? "Add Manual Payment" : "Record Manual Payment"}
        </button>
        <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold">
          <Download className="mr-2 inline" size={15} />
          Export CSV
        </button>
      </div>
      <DataTable
        columns={[
          "Customer",
          "Invoice no.",
          "Provider",
          "Transaction ref",
          "Phone",
          "Amount",
          "Status",
          "Billing period",
          "Location",
        ]}
        rows={rows}
      />
      {open && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/40 p-4">
          <div className="mx-auto my-6 max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            {saved ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto text-emerald-700" size={48} />
                <p className="mt-4 text-3xl font-bold">
                  {saved.status === "Paid" ? "Paid" : saved.status}
                </p>
                <div className="mx-auto mt-3 flex max-w-md justify-center gap-2">
                  <Status value={saved.status} />
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                    Manual Payment
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Recorded by {saved.recordedBy} · {saved.date}
                  <br />
                  Receipt {saved.id} · Reference {saved.reference}
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold">
                    Download receipt
                  </button>
                  <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold">
                    Download Statement / Report
                  </button>
                  <button
                    className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white"
                    onClick={() => setOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Finance workflow
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      Record manual payment
                    </p>
                  </div>
                  <button className="ml-auto" onClick={() => setOpen(false)}>
                    <X />
                  </button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-600 sm:col-span-2">
                    Search and select customer
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      value={customerId}
                      onChange={(event) => {
                        const id = event.target.value
                        setCustomerId(id)
                        setAmount(
                          customers.find((item) => item.id === id)?.fee || 0,
                        )
                      }}
                    >
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} · {customer.phone} · {customer.id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="rounded-xl bg-slate-50 p-4 text-xs sm:col-span-2">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <span>
                        Location
                        <strong className="block mt-1">
                          {selectedCustomer.location}
                        </strong>
                      </span>
                      <span>
                        Billing account
                        <strong className="block mt-1">
                          {selectedCustomer.id} · {selectedCustomer.plan}
                        </strong>
                      </span>
                      <span>
                        Period / fee
                        <strong className="block mt-1">
                          {selectedCustomer.period} ·{" "}
                          {money(selectedCustomer.fee)}
                        </strong>
                      </span>
                    </div>
                    <p className="mt-3 border-t border-slate-200 pt-3">
                      Outstanding:{" "}
                      <strong>
                        {outstanding
                          .map((item) => `${item.id} (${money(item.amount)})`)
                          .join(", ") || "No unpaid invoices"}
                      </strong>
                    </p>
                  </div>
                  <label className="text-xs font-bold text-slate-600">
                    Billing period
                    <select className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm">
                      <option>
                        {outstanding[0]?.period || "No outstanding period"}
                      </option>
                    </select>
                  </label>
                  <label className="text-xs font-bold text-slate-600">
                    Amount
                    <input
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      type="number"
                      value={amount}
                      onChange={(event) =>
                        setAmount(Number(event.target.value))
                      }
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-600">
                    Payment method
                    <select
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      value={method}
                      onChange={(event) => setMethod(event.target.value)}
                    >
                      {[
                        "Cash",
                        "Bank transfer",
                        "MTN Mobile Money",
                        "Airtel Money",
                        "Field payment",
                      ].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs font-bold text-slate-600">
                    Payment date
                    <input
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      defaultValue="2026-10-06"
                      type="date"
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-600 sm:col-span-2">
                    Receipt / reference number
                    <input
                      className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                      value={reference}
                      onChange={(event) => setReference(event.target.value)}
                    />
                  </label>
                  <label className="text-xs font-bold text-slate-600 sm:col-span-2">
                    Notes
                    <textarea className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm" />
                  </label>
                </div>
                {outstanding[0] && amount < outstanding[0].amount && (
                  <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                    This invoice will be Partially paid; the remaining balance
                    stays outstanding.
                  </p>
                )}
                {outstanding[0] && amount > outstanding[0].amount && (
                  <p className="mt-3 rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-900">
                    The extra {money(amount - outstanding[0].amount)} will be
                    retained as customer credit.
                  </p>
                )}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
                    disabled={!outstanding[0] || !reference}
                    onClick={record}
                  >
                    Save payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
