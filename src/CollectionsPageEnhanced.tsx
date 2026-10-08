import React, { useMemo, useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Search,
  Filter,
  Check,
  Truck,
  MapPin,
  Camera,
  FileText,
  AlertCircle,
  RotateCcw,
  History,
  X,
  ChevronRight,
  UserCheck,
} from "lucide-react"
import { useStore, type CollectionRecord } from "./Store"
import { Modal } from "./Modal"

export function CollectionsPageEnhanced() {
  const { collections, confirmCollection, reportCollectionException, metrics } = useStore()

  const [activeTab, setActiveTab] = useState<"records" | "exceptions" | "timeline">("records")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [zoneFilter, setZoneFilter] = useState("All zones")
  const [driverFilter, setDriverFilter] = useState("All drivers")
  const [dateFilter, setDateFilter] = useState("2026-10-08")

  // Confirm collection modal
  const [confirmModalItem, setConfirmModalItem] = useState<CollectionRecord | null>(null)
  const [confirmWeight, setConfirmWeight] = useState("32")
  const [confirmNotes, setConfirmNotes] = useState("")
  const [confirmPhotoSimulated, setConfirmPhotoSimulated] = useState(false)

  // Report exception modal
  const [exceptionModalItem, setExceptionModalItem] = useState<CollectionRecord | null>(null)
  const [exceptionReason, setExceptionReason] = useState("Gate locked / Resident away")
  const [exceptionDetails, setExceptionDetails] = useState("")

  const [toast, setToast] = useState<string | null>(null)

  // Filtering records
  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      const matchesQuery =
        !query ||
        `${c.customerName} ${c.id} ${c.route} ${c.address} ${c.vehicle}`
          .toLowerCase()
          .includes(query.toLowerCase())

      const matchesStatus = statusFilter === "All statuses" || c.status === statusFilter
      const matchesZone = zoneFilter === "All zones" || c.zone === zoneFilter
      const matchesDriver = driverFilter === "All drivers" || c.driver === driverFilter

      return matchesQuery && matchesStatus && matchesZone && matchesDriver
    })
  }, [collections, query, statusFilter, zoneFilter, driverFilter])

  // Exceptions list
  const exceptions = useMemo(() => {
    return collections.filter((c) => c.status === "Missed" || !!c.missedReason)
  }, [collections])

  // Completed timeline
  const completedTimeline = useMemo(() => {
    return collections
      .filter((c) => c.status === "Completed")
      .slice(0, 20)
  }, [collections])

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmModalItem) return

    confirmCollection(
      confirmModalItem.id,
      parseFloat(confirmWeight) || 30,
      confirmNotes || "Verified on-site by driver with digital checklist.",
    )

    setToast(`Collection ${confirmModalItem.id} for ${confirmModalItem.customerName} confirmed as completed!`)
    setTimeout(() => setToast(null), 4000)
    setConfirmModalItem(null)
    setConfirmWeight("32")
    setConfirmNotes("")
    setConfirmPhotoSimulated(false)
  }

  const handleExceptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!exceptionModalItem) return

    reportCollectionException(
      exceptionModalItem.id,
      `${exceptionReason}${exceptionDetails ? `: ${exceptionDetails}` : ""}`,
    )

    setToast(`Exception flagged for ${exceptionModalItem.customerName}. Notification queued.`)
    setTimeout(() => setToast(null), 4000)
    setExceptionModalItem(null)
    setExceptionDetails("")
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{toast}</span>
          </div>
          <button type="button" onClick={() => setToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Planned vs Completed Tracker by Zone */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                Today's Collection Operations Tracker
              </h3>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                148 Total Planned Today
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Real-time progress across Kigali zones: 126 completed, 8 in progress, 14 pending/missed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Overall Progress:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-emerald-700">85.1%</span>
              <span className="text-xs text-slate-400">(126 / 148)</span>
            </div>
          </div>
        </div>

        {/* Zone Tracker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Kimironko Zone</span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">85.7%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">36 <span className="text-xs font-normal text-slate-400">/ 42 completed</span></p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "85.7%" }} />
            </div>
            <p className="text-[11px] text-slate-500 flex justify-between">
              <span>2 In progress</span>
              <span className="text-amber-700">4 Pending/Missed</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Remera Zone</span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">86.8%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">33 <span className="text-xs font-normal text-slate-400">/ 38 completed</span></p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "86.8%" }} />
            </div>
            <p className="text-[11px] text-slate-500 flex justify-between">
              <span>2 In progress</span>
              <span className="text-amber-700">3 Pending/Missed</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Niboye Zone</span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">86.1%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">31 <span className="text-xs font-normal text-slate-400">/ 36 completed</span></p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "86.1%" }} />
            </div>
            <p className="text-[11px] text-slate-500 flex justify-between">
              <span>2 In progress</span>
              <span className="text-amber-700">3 Pending/Missed</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Nyamirambo Zone</span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">81.3%</span>
            </div>
            <p className="text-2xl font-black text-slate-900">26 <span className="text-xs font-normal text-slate-400">/ 32 completed</span></p>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "81.3%" }} />
            </div>
            <p className="text-[11px] text-slate-500 flex justify-between">
              <span>2 In progress</span>
              <span className="text-amber-700">4 Pending/Missed</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("records")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "records"
              ? "bg-emerald-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CalendarDays size={14} />
          <span>All Collection Records ({collections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("exceptions")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "exceptions"
              ? "bg-rose-700 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <AlertTriangle size={14} />
          <span>Exceptions & Missed Pickups ({exceptions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "timeline"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <History size={14} />
          <span>Completed Timeline ({metrics.collectionsCompletedCount})</span>
        </button>
      </div>

      {/* TAB 1: ALL COLLECTION RECORDS */}
      {activeTab === "records" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-1">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, route..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  <option value="All statuses">All Statuses ({collections.length})</option>
                  <option value="Completed">Completed ({metrics.collectionsCompletedCount})</option>
                  <option value="In progress">In Progress ({metrics.collectionsInProgressCount})</option>
                  <option value="Pending">Pending ({metrics.collectionsPendingMissedCount})</option>
                  <option value="Missed">Missed Only ({exceptions.length})</option>
                </select>
              </div>

              <div>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  <option value="All zones">All Zones</option>
                  <option value="Kimironko">Kimironko (42 collections)</option>
                  <option value="Remera">Remera (38 collections)</option>
                  <option value="Niboye">Niboye (36 collections)</option>
                  <option value="Nyamirambo">Nyamirambo (32 collections)</option>
                </select>
              </div>

              <div>
                <select
                  value={driverFilter}
                  onChange={(e) => setDriverFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  <option value="All drivers">All Drivers</option>
                  <option value="Eric Niyonzima">Eric Niyonzima (RW 412 A)</option>
                  <option value="Claude Mugenzi">Claude Mugenzi (RW 307 K)</option>
                  <option value="Alice Uwera">Alice Uwera (RW 118 T)</option>
                  <option value="Patrick Tuyishime">Patrick Tuyishime (RW 922 D)</option>
                </select>
              </div>

              <div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-xs">
                <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-100 font-bold">
                  <tr>
                    <th className="px-5 py-3.5">ID & Customer</th>
                    <th className="px-4 py-3.5">Zone & Address</th>
                    <th className="px-4 py-3.5">Route & Truck</th>
                    <th className="px-4 py-3.5">Driver</th>
                    <th className="px-4 py-3.5">Time Window</th>
                    <th className="px-4 py-3.5">Waste & Weight</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCollections.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{c.customerName}</div>
                        <div className="text-[11px] text-slate-400">{c.id}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">{c.zone}</div>
                        <div className="text-[11px] text-slate-400">{c.address}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-800">{c.route}</span>
                        <div className="text-[11px] text-slate-500">{c.vehicle}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        {c.driver}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800">{c.timeSlot}</div>
                        {c.completedAt && (
                          <div className="text-[10px] text-emerald-700 font-bold">Done at {c.completedAt}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-700">{c.wasteType}</span>
                        {c.weightKg && (
                          <span className="ml-1.5 font-bold text-slate-900">({c.weightKg} kg)</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            c.status === "Completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : c.status === "In progress"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : c.status === "Missed"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        {c.status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() => setConfirmModalItem(c)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 text-white px-2.5 py-1 text-xs font-bold hover:bg-emerald-800 shadow-sm"
                          >
                            <Check size={13} /> Confirm
                          </button>
                        )}
                        {c.status !== "Missed" && c.status !== "Completed" && (
                          <button
                            type="button"
                            onClick={() => setExceptionModalItem(c)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 text-rose-700 bg-white px-2 py-1 text-xs font-bold hover:bg-rose-50"
                          >
                            Flag Missed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXCEPTIONS LIST */}
      {activeTab === "exceptions" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900 flex items-start gap-3">
            <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Exception & Missed Collections Queue ({exceptions.length} exceptions)</p>
              <p className="mt-0.5 leading-relaxed">
                Collections flagged by drivers during route execution. Requires immediate dispatcher review, rescheduling, or re-assignment to standby vehicles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {exceptions.map((ex) => (
              <div key={ex.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Exception Flagged
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">{ex.customerName}</h4>
                    <p className="text-xs text-slate-500">{ex.address} · {ex.zone}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{ex.id}</span>
                </div>

                <div className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100">
                  <span className="font-bold text-slate-700 block">Reported Reason:</span>
                  <span className="text-rose-700 font-semibold">{ex.missedReason || "Gate locked / Resident away"}</span>
                  <p className="text-[11px] text-slate-400 mt-1">Driver: {ex.driver} ({ex.vehicle})</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmModalItem(ex)
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Override & Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setToast(`Rescheduled collection for ${ex.customerName} added to tomorrow's first shift.`)
                      setTimeout(() => setToast(null), 4000)
                    }}
                    className="rounded-xl bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-emerald-800 shadow-sm"
                  >
                    Reschedule Next Shift
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === "timeline" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Today's Collection Sign-off Timeline</h4>
              <p className="text-xs text-slate-500">Live chronological stream of confirmed collections across Kigali.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              126 Completed Pickups
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {completedTimeline.map((item, idx) => (
              <div key={item.id} className="relative group">
                <span className="absolute -left-6 top-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-white" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="text-xs font-bold text-slate-900">
                    <span>{item.completedAt || "09:30"}</span>
                    <span className="mx-2 text-slate-300">·</span>
                    <span>{item.customerName} ({item.zone})</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.id}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Picked up by <strong>{item.driver}</strong> with {item.vehicle} ({item.route}). Waste: {item.wasteType} ({item.weightKg} kg).
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Collection Modal */}
      {confirmModalItem && (
        <Modal
          open={!!confirmModalItem}
          onClose={() => setConfirmModalItem(null)}
          title={`Confirm Collection: ${confirmModalItem.customerName}`}
          subtitle={`Route ${confirmModalItem.route} · ${confirmModalItem.address} (${confirmModalItem.zone})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Waste Weight Collected (kg) *
              </label>
              <input
                type="number"
                step="0.5"
                value={confirmWeight}
                onChange={(e) => setConfirmWeight(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Driver Signature & Field Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Bin cleared, gate secure, customer signed off."
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-600"
              />
            </div>

            {/* Photo Verification Simulator */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Camera size={14} className="text-emerald-700" /> Photo Proof
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmPhotoSimulated(!confirmPhotoSimulated)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    confirmPhotoSimulated ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-700"
                  }`}
                >
                  {confirmPhotoSimulated ? "Photo Attached ✓" : "Simulate Photo"}
                </button>
              </div>
              {confirmPhotoSimulated && (
                <p className="mt-1.5 text-[10px] text-emerald-700 font-semibold">
                  IMG_COL_261008_{confirmModalItem.id.slice(-4)}.jpg (GPS Geo-tagged)
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModalItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                Mark as Completed
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Flag Exception Modal */}
      {exceptionModalItem && (
        <Modal
          open={!!exceptionModalItem}
          onClose={() => setExceptionModalItem(null)}
          title={`Report Exception: ${exceptionModalItem.customerName}`}
          subtitle={`Route ${exceptionModalItem.route} · ${exceptionModalItem.address}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleExceptionSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Delay / Missed Pickup *
              </label>
              <select
                value={exceptionReason}
                onChange={(e) => setExceptionReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
              >
                <option value="Gate locked / Resident away">Gate locked / Resident away</option>
                <option value="Narrow street blocked by construction">Narrow street blocked by construction</option>
                <option value="Bin not presented at designated collection point">Bin not presented at designated collection point</option>
                <option value="Heavy rain soil blockage in unpaved lane">Heavy rain soil blockage in unpaved lane</option>
                <option value="Hazardous or unsegregated waste">Hazardous or unsegregated waste</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Additional Details
              </label>
              <textarea
                rows={2}
                placeholder="Driver notes..."
                value={exceptionDetails}
                onChange={(e) => setExceptionDetails(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setExceptionModalItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rose-700 px-5 py-2 text-xs font-bold text-white hover:bg-rose-800 shadow-sm"
              >
                Flag Exception
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
