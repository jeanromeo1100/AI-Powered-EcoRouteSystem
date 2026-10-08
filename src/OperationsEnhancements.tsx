import { useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MessageSquareText,
  PauseCircle,
  RotateCcw,
  Send,
  ShieldAlert,
  Truck,
  X,
} from "lucide-react"

const overdueSeed = [
  ["Aline Uwase", "Nyarugunga", "INV-2026-00128", 10000, 38, "Suspended", "Suspension SMS · 05 Oct"],
  ["Patrick Habimana", "Kimironko", "INV-2026-00131", 18000, 24, "Warning", "Warning sent · 04 Oct"],
  ["Green Hills Shop", "Remera", "INV-2026-00134", 45000, 17, "Warning", "Reminder sent · 01 Oct"],
  ["Diane Mukamana", "Kicukiro", "INV-2026-00136", 12000, 9, "Reminder", "Reminder sent · 03 Oct"],
  ["Kigali Fresh Foods", "Nyamirambo", "INV-2026-00139", 78000, 5, "Reminder due", "Invoice issued · 01 Oct"],
]

const actions = ["Send reminder", "Send warning", "Suspend", "Reactivate", "Add note"]

export function BillingEnforcementPage() {
  const [rows, setRows] = useState(overdueSeed)
  const [history, setHistory] = useState([
    "06 Oct, 09:12 · Claudine Uwase reactivated CUS-2071 after confirmed MTN payment.",
    "05 Oct, 16:30 · System suspended Aline Uwase after 38 days overdue.",
    "04 Oct, 11:05 · Diane Mukamana sent an overdue warning to Patrick Habimana.",
    "03 Oct, 08:10 · Automatic day-5 reminder delivered to Diane Mukamana.",
  ])
  const [dialog, setDialog] = useState<{ row: typeof rows[number]; action: string } | null>(null)
  const [note, setNote] = useState("")
  const total = rows.reduce((sum, row) => sum + Number(row[3]), 0)

  const completeAction = () => {
    if (!dialog) return
    const customer = String(dialog.row[0])
    const nextStage =
      dialog.action === "Suspend"
        ? "Suspended"
        : dialog.action === "Reactivate"
          ? "Reactivated"
          : dialog.action === "Send warning"
            ? "Warning"
            : dialog.action === "Send reminder"
              ? "Reminder"
              : String(dialog.row[5])
    setRows((current) =>
      current.map((row) =>
        row[0] === dialog.row[0]
          ? [
              ...row.slice(0, 5),
              nextStage,
              `${dialog.action}${note ? `: ${note}` : ""} · Just now`,
            ]
          : row,
      ),
    )
    setHistory((current) => [
      `Just now · Claudine Uwase completed “${dialog.action}” for ${customer}${note ? ` — ${note}` : "."}`,
      ...current,
    ])
    setDialog(null)
    setNote("")
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 text-amber-700" size={21} />
          <div>
            <p className="font-bold text-amber-950">Billing enforcement policy</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              5-day grace period → day 5 reminder SMS → day 15 warning → day 30 service suspension → automatic review and reactivation after confirmed payment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Overdue accounts", "47", "8 entered warning stage", AlertTriangle],
          ["Overdue amount", `RWF ${total.toLocaleString()}`, "Across active follow-ups", Clock3],
          ["Suspended", "6", "Drivers instructed to skip", PauseCircle],
          ["Recovered", "RWF 486,000", "18 accounts this month", CheckCircle2],
        ].map(([label, value, note, Icon]) => {
          const CardIcon = Icon as typeof AlertTriangle
          return (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={String(label)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{String(label)}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{String(value)}</p>
                  <p className="mt-1 text-xs text-slate-500">{String(note)}</p>
                </div>
                <CardIcon className="text-emerald-700" size={20} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <p className="font-bold">Overdue accounts</p>
          <p className="mt-1 text-xs text-slate-500">Actions are recorded in follow-up history and the Activity Log.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-400">
              <tr>
                {["Customer", "Zone", "Invoice", "Amount", "Days overdue", "Stage", "Last action", "Actions"].map((item) => (
                  <th className="px-4 py-3" key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={String(row[2])}>
                  {row.map((cell, index) => (
                    <td className={index === 0 || index === 2 ? "px-4 py-4 font-bold" : "px-4 py-4 text-slate-600"} key={index}>
                      {index === 3 ? `RWF ${Number(cell).toLocaleString()}` : String(cell)}
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <select
                      aria-label={`Action for ${row[0]}`}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-2 font-bold text-emerald-800"
                      defaultValue=""
                      onChange={(event) => {
                        if (event.target.value) setDialog({ row, action: event.target.value })
                        event.target.value = ""
                      }}
                    >
                      <option value="">Choose action</option>
                      {actions.map((action) => <option key={action}>{action}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquareText className="text-emerald-700" size={19} />
          <div>
            <p className="font-bold">Follow-up history</p>
            <p className="text-xs text-slate-500">Reminders, warnings, suspensions, notes and recoveries.</p>
          </div>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {history.map((item) => <p className="py-3 text-sm text-slate-600" key={item}>{item}</p>)}
        </div>
      </div>

      {dialog && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-bold">{dialog.action}</p>
                <p className="mt-1 text-sm text-slate-500">{String(dialog.row[0])} · {String(dialog.row[2])}</p>
              </div>
              <button aria-label="Close" onClick={() => setDialog(null)}><X size={18} /></button>
            </div>
            <label className="mt-5 block text-xs font-bold text-slate-600">
              Note
              <textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm" onChange={(event) => setNote(event.target.value)} placeholder="Add context for this action" value={note} />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold" onClick={() => setDialog(null)}>Cancel</button>
              <button className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white" onClick={completeAction}>
                {dialog.action.includes("Send") ? <Send size={15} /> : <RotateCcw size={15} />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const tripRows = [
  ["NDB-261006-018", "RW 922 D", "Patrick Tuyishime", "KN 07", "10:18", "11:06", "11:09", "11:38", "8.4", "80 min", "Completed"],
  ["NDB-261006-017", "RW 601 G", "Claude Mugenzi", "KG 11", "08:42", "09:31", "09:34", "10:02", "7.1", "80 min", "Completed"],
  ["NDB-261006-016", "RW 307 K", "Alice Uwera", "KK 15", "07:15", "08:09", "08:12", "08:43", "6.8", "88 min", "Completed"],
  ["NDB-261006-019", "RW 412 A", "Eric Niyonzima", "KG 45", "14:30", "—", "—", "—", "—", "—", "Scheduled"],
  ["NDB-260930-094", "RW 118 T", "Jean Bosco", "KG 22", "13:06", "14:01", "14:04", "14:36", "7.9", "90 min", "Completed"],
]

export function NdubaTripRecordsPage() {
  const [month, setMonth] = useState("October 2026")
  const [vehicle, setVehicle] = useState("All vehicles")
  const [driver, setDriver] = useState("All drivers")
  const visible = useMemo(
    () => tripRows.filter((row) => (vehicle === "All vehicles" || row[1] === vehicle) && (driver === "All drivers" || row[2] === driver)),
    [driver, vehicle],
  )
  const exportTrips = () => {
    const csv = [["Trip ID", "Vehicle", "Driver", "Route", "Departure", "Arrival", "Gate in", "Gate out", "Weight t", "Duration", "Status"], ...visible]
      .map((row) => row.join(",")).join("\n")
    const link = document.createElement("a")
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    link.download = "nduba-trip-report.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:flex-row xl:items-end">
        <div className="mr-auto">
          <div className="flex items-center gap-2"><Truck className="text-emerald-700" size={20} /><p className="font-bold">Nduba landfill trip register</p></div>
          <p className="mt-1 text-sm text-slate-500">Gate movements, tonnage and complete trip history.</p>
        </div>
        {[
          ["Period", month, setMonth, ["October 2026", "September 2026", "August 2026"]],
          ["Vehicle", vehicle, setVehicle, ["All vehicles", ...new Set(tripRows.map((row) => row[1]))]],
          ["Driver", driver, setDriver, ["All drivers", ...new Set(tripRows.map((row) => row[2]))]],
        ].map(([label, value, setter, options]) => (
          <label className="text-xs font-bold text-slate-500" key={String(label)}>
            {String(label)}
            <select className="mt-1 block rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800" onChange={(event) => (setter as (value: string) => void)(event.target.value)} value={String(value)}>
              {(options as string[]).map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        ))}
        <button className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white" onClick={exportTrips}><Download size={16} />Export Nduba trip report</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {[["Trips", "7"], ["Completed", "6"], ["Total received", "42.8 t"], ["Average duration", "84 min"]].map(([label, value]) => (
          <div className="rounded-2xl border border-slate-200 bg-white p-5" key={label}><p className="text-2xl font-bold">{value}</p><p className="text-xs text-slate-500">{label}</p></div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 p-5"><FileText className="text-emerald-700" size={18} /><p className="font-bold">Trip records · {month}</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-400"><tr>{["Trip ID", "Vehicle", "Driver", "Route", "Departure", "Arrival", "Gate in", "Gate out", "Weight t", "Duration", "Status"].map((item) => <th className="px-4 py-3" key={item}>{item}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{visible.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td className={index < 2 ? "px-4 py-4 font-bold" : "px-4 py-4 text-slate-600"} key={index}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
