import React, { useState } from "react"
import {
  Truck,
  Navigation,
  Route,
  Sparkles,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Calendar,
  Check,
  Edit2,
  History,
  MapPin,
  ChevronRight,
  Flag,
  ArrowRight,
  AlertCircle,
  X,
  Search,
} from "lucide-react"
import { useStore, type Vehicle, type TripRecord } from "./Store"
import { Modal } from "./Modal"

export function FleetAndTripsEnhanced({
  initialView = "fleet",
  role = "Manager",
}: {
  initialView?: "fleet" | "trips" | "routes"
  role?: string
}) {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    toggleVehicleStatus,
    trips,
    recordTrip,
    reportTripException,
    turnByTurn,
    metrics,
  } = useStore()

  const [view, setView] = useState<"fleet" | "trips" | "routes">(initialView)
  const [toast, setToast] = useState<string | null>(null)

  // Fleet modal state
  const [addVehicleOpen, setAddVehicleOpen] = useState(false)
  const [editVehicleItem, setEditVehicleItem] = useState<Vehicle | null>(null)
  const [historyVehicleItem, setHistoryVehicleItem] = useState<Vehicle | null>(null)
  const [vehicleForm, setVehicleForm] = useState({
    plateNumber: "",
    model: "",
    capacityTonnes: 7.0,
    wasteType: "General / Mixed",
    driver: "Eric Niyonzima",
    status: "Available" as Vehicle["status"],
    currentRoute: "Unassigned",
    lastServiceDate: "2026-10-01",
  })
  const [conflictAlert, setConflictAlert] = useState<string | null>(null)

  // Trips modal state
  const [recordTripOpen, setRecordTripOpen] = useState(false)
  const [tripExceptionItem, setTripExceptionItem] = useState<TripRecord | null>(null)
  const [tripTimelineItem, setTripTimelineItem] = useState<TripRecord | null>(null)
  const [tripForm, setTripForm] = useState({
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    route: "KG 18 – Kimironko",
    zone: "Kimironko",
    startTime: "07:00",
    distanceKm: 24.5,
    durationMins: 90,
    status: "In progress" as TripRecord["status"],
  })
  const [exceptionForm, setExceptionForm] = useState({
    type: "Delay" as const,
    details: "",
    status: "Investigating" as const,
  })

  // Trip filters
  const [tripStatusFilter, setTripStatusFilter] = useState("All")

  // Check vehicle conflict
  const checkAssignmentConflict = (plate: string, driver: string) => {
    const v = vehicles.find((item) => item.plateNumber === plate)
    if (v && v.status === "In maintenance") {
      return `Vehicle ${plate} is currently in maintenance (${v.currentRoute}) and cannot be dispatched.`
    }
    const driverActive = vehicles.find(
      (item) => item.driver === driver && item.status === "On route" && item.plateNumber !== plate,
    )
    if (driverActive) {
      return `Driver ${driver} is already operating vehicle ${driverActive.plateNumber} on an active shift.`
    }
    return null
  }

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicleForm.plateNumber || !vehicleForm.model) return

    const conflict = checkAssignmentConflict(vehicleForm.plateNumber, vehicleForm.driver)
    if (conflict) {
      setConflictAlert(conflict)
      return
    }

    addVehicle({
      ...vehicleForm,
    })

    setAddVehicleOpen(false)
    setConflictAlert(null)
    setToast(`Vehicle ${vehicleForm.plateNumber} added to fleet!`)
    setTimeout(() => setToast(null), 4000)
    setVehicleForm({
      plateNumber: "",
      model: "",
      capacityTonnes: 7.0,
      wasteType: "General / Mixed",
      driver: "Eric Niyonzima",
      status: "Available",
      currentRoute: "Unassigned",
      lastServiceDate: "2026-10-01",
    })
  }

  const handleEditVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editVehicleItem) return

    const conflict = checkAssignmentConflict(editVehicleItem.plateNumber, editVehicleItem.driver)
    if (conflict) {
      setConflictAlert(conflict)
      return
    }

    updateVehicle(editVehicleItem.id, editVehicleItem)
    setEditVehicleItem(null)
    setConflictAlert(null)
    setToast(`Vehicle ${editVehicleItem.plateNumber} updated!`)
    setTimeout(() => setToast(null), 4000)
  }

  const handleRecordTripSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const conflict = checkAssignmentConflict(tripForm.vehicle, tripForm.driver)
    if (conflict) {
      setConflictAlert(conflict)
      return
    }

    recordTrip(tripForm)
    setRecordTripOpen(false)
    setConflictAlert(null)
    setToast(`Trip for ${tripForm.vehicle} (${tripForm.route}) recorded!`)
    setTimeout(() => setToast(null), 4000)
  }

  const handleReportExceptionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tripExceptionItem) return

    reportTripException(tripExceptionItem.id, {
      type: exceptionForm.type,
      details: exceptionForm.details || `Vehicle reported ${exceptionForm.type.toLowerCase()} on route.`,
      reportedBy: role === "Employee" ? "Eric Niyonzima" : "Diane Mukamana",
      time: new Date().toLocaleTimeString("en-GB").slice(0, 5),
      status: "Investigating",
    })

    setTripExceptionItem(null)
    setToast(`Trip exception logged for ${tripExceptionItem.vehicle}. Dispatch notified.`)
    setTimeout(() => setToast(null), 4000)
  }

  const filteredTrips = trips.filter(
    (t) => tripStatusFilter === "All" || t.status === tripStatusFilter,
  )

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

      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              Fleet Operations, Trips & AI Routes
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage vehicles, track trip durations, resolve exceptions, and follow turn-by-turn AI optimized routes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setView("routes")}
              className={`rounded-lg px-3 py-1.5 transition ${
                view === "routes" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles size={13} className="inline mr-1 text-emerald-700" /> Turn-by-Turn Directions
            </button>
            <button
              type="button"
              onClick={() => setView("fleet")}
              className={`rounded-lg px-3 py-1.5 transition ${
                view === "fleet" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Truck size={13} className="inline mr-1" /> Fleet & Vehicles ({vehicles.length})
            </button>
            <button
              type="button"
              onClick={() => setView("trips")}
              className={`rounded-lg px-3 py-1.5 transition ${
                view === "trips" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Navigation size={13} className="inline mr-1" /> Trip Records ({trips.length})
            </button>
          </div>

          {view === "fleet" && (
            <button
              type="button"
              onClick={() => setAddVehicleOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              <Plus size={14} /> Add Vehicle
            </button>
          )}

          {view === "trips" && (
            <button
              type="button"
              onClick={() => setRecordTripOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              <Plus size={14} /> Record Trip
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: TURN-BY-TURN DIRECTIONS (AI-OPTIMIZED ROUTE) */}
      {view === "routes" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-700 text-white uppercase tracking-wider mb-1">
                  AI Optimization Engine
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  Route KG 18 – Kimironko & Kibagabaga Loop (Vehicle RW 412 A)
                </h4>
                <p className="text-xs text-emerald-950 mt-0.5">
                  Turn-by-turn navigation generated with dynamic stop re-ordering. 18.6 km saved (14.2% fuel reduction).
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="rounded-2xl bg-white px-3.5 py-2 border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Route</span>
                  <span className="text-sm font-black text-slate-900">14.2 km</span>
                </div>
                <div className="rounded-2xl bg-white px-3.5 py-2 border border-emerald-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Duration</span>
                  <span className="text-sm font-black text-slate-900">45 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Turn-by-turn directions list */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Turn-by-Turn Directions List (Step-by-Step Navigation)
            </h4>

            <div className="divide-y divide-slate-100">
              {turnByTurn.map((step) => (
                <div key={step.step} className="py-3 flex items-start gap-4 hover:bg-slate-50/60 rounded-xl px-2 transition">
                  <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {step.step}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900">{step.instruction}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-semibold text-emerald-800">{step.distance}</span>
                      <span>·</span>
                      <span>Est. time: {step.time}</span>
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="inline-block text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {step.maneuver}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FLEET & VEHICLES */}
      {view === "fleet" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {vehicles.map((v) => {
              const isOnRoute = v.status === "On route"
              const isMaintenance = v.status === "In maintenance"
              const isAvailable = v.status === "Available"

              return (
                <div
                  key={v.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                        {v.plateNumber}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOnRoute
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : isAvailable
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isMaintenance
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isOnRoute ? "bg-blue-600 animate-ping" : isAvailable ? "bg-emerald-600" : isMaintenance ? "bg-amber-600" : "bg-slate-400"
                          }`}
                        />
                        {v.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-2.5">{v.model}</h4>
                    <p className="text-[11px] text-slate-500">
                      Capacity: <strong>{v.capacityTonnes} Tonnes</strong> · {v.wasteType}
                    </p>

                    <div className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 mt-3 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Driver:</span>
                        <strong className="text-slate-800">{v.driver}</strong>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Route:</span>
                        <strong className="text-emerald-800">{v.currentRoute}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setHistoryVehicleItem(v)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900"
                    >
                      <History size={12} /> Log
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditVehicleItem(v)}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleVehicleStatus(v.id, v.status === "Deactivated" ? "Available" : "Deactivated")}
                        className={`rounded-lg px-2 py-1 text-xs font-bold border ${
                          v.status === "Deactivated"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {v.status === "Deactivated" ? "Activate" : "Deactivate"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: TRIPS LIST */}
      {view === "trips" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <span>Filter by Status:</span>
              {["All", "In progress", "Completed", "Cancelled"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTripStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    tripStatusFilter === st ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setRecordTripOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              <Plus size={14} /> Record Trip
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Trip ID & Vehicle</th>
                    <th className="px-4 py-3.5">Driver</th>
                    <th className="px-4 py-3.5">Route & Zone</th>
                    <th className="px-4 py-3.5">Timing</th>
                    <th className="px-4 py-3.5">Distance & Duration</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrips.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{t.vehicle}</div>
                        <div className="text-[11px] font-mono text-slate-400">{t.id}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{t.driver}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-800">{t.route}</span>
                        <div className="text-[11px] text-slate-500">{t.zone}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-800">{t.startTime}</span>
                        {t.endTime && <span className="text-slate-400"> → {t.endTime}</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900">{t.distanceKm} km</span>
                        <span className="text-[11px] text-slate-400 ml-1.5">({t.durationMins} mins)</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            t.status === "Completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : t.status === "In progress"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {t.status}
                        </span>
                        {t.exception && (
                          <span className="ml-1.5 inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                            {t.exception.type}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setTripTimelineItem(t)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          Timeline
                        </button>
                        <button
                          type="button"
                          onClick={() => setTripExceptionItem(t)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          Report Exception
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal
        open={addVehicleOpen}
        onClose={() => {
          setAddVehicleOpen(false)
          setConflictAlert(null)
        }}
        title="Add Fleet Vehicle"
        subtitle="Register new waste compactor or collection truck."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddVehicle} className="space-y-3.5">
          {conflictAlert && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-semibold flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{conflictAlert}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Plate Number *</label>
            <input
              type="text"
              placeholder="e.g. RW 412 A"
              value={vehicleForm.plateNumber}
              onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs uppercase font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Model & Spec *</label>
            <input
              type="text"
              placeholder="Isuzu Forward Compactor"
              value={vehicleForm.model}
              onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capacity (Tonnes)</label>
              <input
                type="number"
                step="0.5"
                value={vehicleForm.capacityTonnes}
                onChange={(e) => setVehicleForm({ ...vehicleForm, capacityTonnes: parseFloat(e.target.value) || 7.0 })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select
                value={vehicleForm.status}
                onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              >
                <option value="Available">Available</option>
                <option value="On route">On route</option>
                <option value="In maintenance">In maintenance</option>
                <option value="Deactivated">Deactivated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Driver</label>
            <input
              type="text"
              placeholder="Driver name"
              value={vehicleForm.driver}
              onChange={(e) => setVehicleForm({ ...vehicleForm, driver: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setAddVehicleOpen(false)
                setConflictAlert(null)
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Vehicle Modal */}
      {editVehicleItem && (
        <Modal
          open={!!editVehicleItem}
          onClose={() => {
            setEditVehicleItem(null)
            setConflictAlert(null)
          }}
          title={`Edit Vehicle: ${editVehicleItem.plateNumber}`}
          subtitle={`Current Status: ${editVehicleItem.status}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditVehicle} className="space-y-3.5">
            {conflictAlert && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-semibold flex items-start gap-2">
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{conflictAlert}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model Description</label>
              <input
                type="text"
                value={editVehicleItem.model}
                onChange={(e) => setEditVehicleItem({ ...editVehicleItem, model: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Driver</label>
                <input
                  type="text"
                  value={editVehicleItem.driver}
                  onChange={(e) => setEditVehicleItem({ ...editVehicleItem, driver: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editVehicleItem.status}
                  onChange={(e) => setEditVehicleItem({ ...editVehicleItem, status: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                >
                  <option value="Available">Available</option>
                  <option value="On route">On route</option>
                  <option value="In maintenance">In maintenance</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Assigned Route</label>
              <input
                type="text"
                value={editVehicleItem.currentRoute}
                onChange={(e) => setEditVehicleItem({ ...editVehicleItem, currentRoute: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setEditVehicleItem(null)
                  setConflictAlert(null)
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Vehicle Assignment History Log Modal */}
      {historyVehicleItem && (
        <Modal
          open={!!historyVehicleItem}
          onClose={() => setHistoryVehicleItem(null)}
          title={`Assignment History: ${historyVehicleItem.plateNumber}`}
          subtitle={`${historyVehicleItem.model} · Assigned Driver: ${historyVehicleItem.driver}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100">
              {historyVehicleItem.assignmentHistory?.map((item, idx) => (
                <div key={idx} className="p-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{item.action}</span>
                    <span className="text-[11px] text-slate-400 font-normal">{item.date}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5 text-[11px]">
                    Route: <strong>{item.route}</strong> · Operator: <strong>{item.driver}</strong>
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setHistoryVehicleItem(null)}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold"
              >
                Close Log
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Trip Modal */}
      <Modal
        open={recordTripOpen}
        onClose={() => {
          setRecordTripOpen(false)
          setConflictAlert(null)
        }}
        title="Record New Operation Trip"
        subtitle="Log vehicle departure, assigned driver, and scheduled route."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRecordTripSubmit} className="space-y-3.5">
          {conflictAlert && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 font-semibold flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <span>{conflictAlert}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Vehicle</label>
            <select
              value={tripForm.vehicle}
              onChange={(e) => {
                const v = vehicles.find((item) => item.plateNumber === e.target.value)
                setTripForm({
                  ...tripForm,
                  vehicle: e.target.value,
                  driver: v?.driver || tripForm.driver,
                })
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.plateNumber}>
                  {v.plateNumber} ({v.driver} - {v.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Driver Name</label>
            <input
              type="text"
              value={tripForm.driver}
              onChange={(e) => setTripForm({ ...tripForm, driver: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Route</label>
            <select
              value={tripForm.route}
              onChange={(e) => {
                const zone = e.target.value.includes("Kimironko") ? "Kimironko" : e.target.value.includes("Remera") ? "Remera" : e.target.value.includes("Niboye") ? "Niboye" : "Nyamirambo"
                setTripForm({ ...tripForm, route: e.target.value, zone })
              }}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
            >
              <option value="KG 18 – Kimironko">KG 18 – Kimironko</option>
              <option value="KG 11 – Remera">KG 11 – Remera</option>
              <option value="KK 15 – Niboye">KK 15 – Niboye</option>
              <option value="KN 07 – Nyamirambo">KN 07 – Nyamirambo</option>
              <option value="Nduba Landfill Expressway">Nduba Landfill Expressway</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="text"
                value={tripForm.startTime}
                onChange={(e) => setTripForm({ ...tripForm, startTime: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={tripForm.distanceKm}
                onChange={(e) => setTripForm({ ...tripForm, distanceKm: parseFloat(e.target.value) || 20 })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setRecordTripOpen(false)
                setConflictAlert(null)
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              Record Trip
            </button>
          </div>
        </form>
      </Modal>

      {/* Report Trip Exception Modal */}
      {tripExceptionItem && (
        <Modal
          open={!!tripExceptionItem}
          onClose={() => setTripExceptionItem(null)}
          title={`Report Exception: Trip ${tripExceptionItem.id}`}
          subtitle={`Vehicle ${tripExceptionItem.vehicle} (${tripExceptionItem.driver}) on ${tripExceptionItem.route}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleReportExceptionSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exception Category *</label>
              <select
                value={exceptionForm.type}
                onChange={(e) => setExceptionForm({ ...exceptionForm, type: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-rose-700"
              >
                <option value="Breakdown">Vehicle Breakdown / Engine Trouble</option>
                <option value="Accident">Accident / Collision Incident</option>
                <option value="Road blocked">Road Blocked / Impassable Lane</option>
                <option value="Delay">Severe Operational Delay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Details & Location</label>
              <textarea
                rows={3}
                placeholder="Describe situation, location, and required support..."
                value={exceptionForm.details}
                onChange={(e) => setExceptionForm({ ...exceptionForm, details: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-rose-600"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTripExceptionItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-rose-700 px-5 py-2 text-xs font-bold text-white hover:bg-rose-800 shadow-sm"
              >
                Submit Incident Report
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Trip Timeline Modal */}
      {tripTimelineItem && (
        <Modal
          open={!!tripTimelineItem}
          onClose={() => setTripTimelineItem(null)}
          title={`Trip Timeline: ${tripTimelineItem.id}`}
          subtitle={`${tripTimelineItem.vehicle} · Driver: ${tripTimelineItem.driver}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {tripTimelineItem.timeline?.map((ev, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-6 top-1 flex size-4 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-white" />
                  <div className="text-xs font-bold text-slate-900">{ev.time}</div>
                  <p className="text-xs text-slate-700 font-medium">{ev.event}</p>
                  <p className="text-[11px] text-slate-400">{ev.location}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTripTimelineItem(null)}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
