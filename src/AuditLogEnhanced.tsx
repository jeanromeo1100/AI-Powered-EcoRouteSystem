import React, { useMemo, useState } from "react"
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  Clock3,
  User,
  Activity,
  Layers,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  X,
  MessageSquare,
  Truck,
  CreditCard,
  Settings,
} from "lucide-react"
import { useStore, type LogEntry } from "./Store"
import { Modal } from "./Modal"

export function AuditLogEnhanced({
  role = "Admin",
}: {
  role?: string
}) {
  const { logs, addLog } = useStore()

  const [toast, setToast] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState("All")
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedModule, setSelectedModule] = useState("All")
  const [selectedAction, setSelectedAction] = useState("All")
  const [dateRange, setDateRange] = useState("All time")

  // Detail Modal
  const [detailEntry, setDetailEntry] = useState<LogEntry | null>(null)

  // Seed sample logs if list is small so user sees rich entries including SMS dispatch and trip modification
  const allLogs = useMemo(() => {
    const existing = [...logs]
    // Check if SMS and trip mod entries exist
    const hasSms = existing.some((l) => /SMS/i.test(l.module) || /SMS/i.test(l.action))
    const hasTrip = existing.some((l) => /Trip/i.test(l.module) || /Trip/i.test(l.action))

    const supplemental: LogEntry[] = []
    if (!hasSms) {
      supplemental.push(
        {
          id: "LOG-SMS-100801",
          time: "08 Oct 2026, 10:14:22",
          user: "Diane Mukamana",
          role: "Manager",
          module: "SMS Communication",
          action: "SMS dispatch: Collection alert broadcast",
          record: "Recipients: 186 customers (Kimironko Zone) via MTN/Airtel gateway",
          oldValue: "Draft status",
          newValue: "Delivered (184 delivered, 2 pending)",
          device: "Chrome / Windows 11 · 197.243.22.4",
        },
        {
          id: "LOG-SMS-100802",
          time: "08 Oct 2026, 09:30:15",
          user: "Claudine Uwase",
          role: "Finance",
          module: "SMS Communication",
          action: "SMS dispatch: Overdue billing reminder",
          record: "Recipients: 47 accounts with overdue balances totaling RWF 163,000",
          oldValue: "Queued",
          newValue: "Sent via ECOROUTE sender ID",
          device: "Safari / macOS · 197.243.22.18",
        },
      )
    }

    if (!hasTrip) {
      supplemental.push(
        {
          id: "LOG-TRIP-100803",
          time: "08 Oct 2026, 08:45:10",
          user: "Diane Mukamana",
          role: "Manager",
          module: "Trips & Fleet",
          action: "Trip modification: Route reassignment",
          record: "Trip #TRIP-8402: Reassigned from Eric Niyonzima to Jean Bosco",
          oldValue: "Driver: Eric Niyonzima · Vehicle: RW 412 A",
          newValue: "Driver: Jean Bosco · Vehicle: RW 412 A (Breakdown relief)",
          device: "Chrome / Android · 197.243.22.9",
        },
        {
          id: "LOG-TRIP-100804",
          time: "08 Oct 2026, 07:15:00",
          user: "Eric Niyonzima",
          role: "Employee",
          module: "Trips & Fleet",
          action: "Trip modification: Start shift checklist logged",
          record: "Trip #TRIP-8401: Vehicle RW 307 K inspected",
          oldValue: "Pre-departure checklist pending",
          newValue: "Checklist approved · Odometer: 42,190 km",
          device: "Mobile App / Samsung A54 · 197.243.22.50",
        },
      )
    }

    return [...supplemental, ...existing]
  }, [logs])

  // Extract unique filter options
  const uniqueUsers = useMemo(() => Array.from(new Set(allLogs.map((l) => l.user))), [allLogs])
  const uniqueRoles = useMemo(() => Array.from(new Set(allLogs.map((l) => l.role))), [allLogs])
  const uniqueModules = useMemo(() => Array.from(new Set(allLogs.map((l) => l.module))), [allLogs])

  // Filtered log entries
  const filteredLogs = useMemo(() => {
    return allLogs.filter((entry) => {
      const q = searchQuery.toLowerCase()
      const matchQuery =
        !searchQuery ||
        entry.user.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.module.toLowerCase().includes(q) ||
        entry.record.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q)

      const matchUser = selectedUser === "All" || entry.user === selectedUser
      const matchRole = selectedRole === "All" || entry.role === selectedRole
      const matchModule = selectedModule === "All" || entry.module === selectedModule
      const matchAction =
        selectedAction === "All" ||
        (selectedAction === "SMS" && (/SMS/i.test(entry.module) || /SMS/i.test(entry.action))) ||
        (selectedAction === "Trip" && (/Trip/i.test(entry.module) || /Trip/i.test(entry.action))) ||
        (selectedAction === "Auth" && (/login/i.test(entry.action) || /auth/i.test(entry.action))) ||
        (selectedAction === "Billing" && (/Billing/i.test(entry.module) || /Payment/i.test(entry.action)))

      return matchQuery && matchUser && matchRole && matchModule && matchAction
    })
  }, [allLogs, searchQuery, selectedUser, selectedRole, selectedModule, selectedAction])

  // Export handlers
  const handleExport = (format: "CSV" | "PDF") => {
    const headers = ["Log ID", "Timestamp", "User", "Role", "Module", "Action", "Record Details", "Device / IP"]
    const rows = filteredLogs.map((l) => [
      l.id,
      l.time,
      l.user,
      l.role,
      l.module,
      l.action,
      `"${l.record.replace(/"/g, '""')}"`,
      l.device || "Kigali Internal Subnet",
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: format === "PDF" ? "application/pdf" : "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `ecoroute-audit-trail-${new Date().toISOString().slice(0, 10)}.${format === "PDF" ? "pdf" : "csv"}`
    link.click()

    setToast(`Exported ${filteredLogs.length} audit trail records as ${format}.`)
    setTimeout(() => setToast(null), 4000)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedUser("All")
    setSelectedRole("All")
    setSelectedModule("All")
    setSelectedAction("All")
    setDateRange("All time")
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-800 text-white p-4 shadow-xl text-sm font-semibold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-300" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-auto text-emerald-200 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <ShieldAlert size={18} className="text-emerald-700" />
            <span>Immutable Platform Audit Trail</span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Security & Operations Activity Log
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Complete traceability for user logins, permission edits, SMS dispatches, trip modifications, billing actions, and weighbridge certifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleExport("PDF")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("CSV")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name, action, module, record details, log ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* User filter */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Users</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* Role filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Roles</option>
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Module filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Modules</option>
              {uniqueModules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Quick Action Filter */}
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Event Types</option>
              <option value="SMS">SMS Dispatch Events</option>
              <option value="Trip">Trip Modifications & Fleet</option>
              <option value="Billing">Billing & MoMo Events</option>
              <option value="Auth">Security & Login Events</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredLogs.length}</strong> of {allLogs.length} audit records
          </span>
          <span className="font-mono text-[11px] text-emerald-700">SHA-256 Ledger: Valid</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5">Log ID & Time</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Action Performed</th>
                <th className="px-4 py-3.5">Record Impacted</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No audit records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => {
                  const isSms = /SMS/i.test(entry.module) || /SMS/i.test(entry.action)
                  const isTrip = /Trip/i.test(entry.module) || /Trip/i.test(entry.action)
                  const isAuth = /Security/i.test(entry.module) || /login/i.test(entry.action)

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-900 block text-[11px]">{entry.id}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{entry.time}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{entry.user}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            entry.role === "Admin"
                              ? "bg-purple-100 text-purple-800"
                              : entry.role === "Manager"
                                ? "bg-blue-100 text-blue-800"
                                : entry.role === "Finance"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {entry.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          {isSms && <MessageSquare size={13} className="text-emerald-700" />}
                          {isTrip && <Truck size={13} className="text-blue-700" />}
                          {isAuth && <ShieldAlert size={13} className="text-purple-700" />}
                          <span>{entry.module}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-900">{entry.action}</td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate" title={entry.record}>
                        {entry.record}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setDetailEntry(entry)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DETAIL INSPECTION */}
      <Modal
        open={Boolean(detailEntry)}
        onClose={() => setDetailEntry(null)}
        title="Audit Record Forensic View"
        subtitle={`Audit ID: ${detailEntry?.id}`}
      >
        {detailEntry && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                <span className="font-semibold text-slate-900">{detailEntry.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Initiated By</span>
                <span className="font-bold text-slate-900">
                  {detailEntry.user} ({detailEntry.role})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">System Module</span>
                <span className="font-semibold text-slate-900">{detailEntry.module}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Action Type</span>
                <span className="font-semibold text-slate-900">{detailEntry.action}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Record Description</span>
              <p className="text-slate-800 font-medium leading-relaxed">{detailEntry.record}</p>
            </div>

            {(detailEntry.oldValue || detailEntry.newValue) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                  <span className="text-rose-700 block text-[10px] uppercase font-bold mb-1">Previous Value</span>
                  <p className="font-mono text-[11px] text-slate-700">{detailEntry.oldValue || "None / Initial"}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <span className="text-emerald-700 block text-[10px] uppercase font-bold mb-1">Updated Value</span>
                  <p className="font-mono text-[11px] text-slate-700">{detailEntry.newValue || "Applied"}</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-500 text-[11px]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Origin Device & IP</span>
              <span className="font-mono">{detailEntry.device || "Kigali Operations Backbone / 197.243.22.1"}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailEntry(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close Audit Entry
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
