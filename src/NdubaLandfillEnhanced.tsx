import React, { useMemo, useState } from "react"
import {
  PackageCheck,
  Truck,
  Scale,
  Calendar,
  Clock3,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Download,
  Check,
  X,
  FileText,
  TrendingUp,
  BarChart3,
  Map,
  ShieldCheck,
  ChevronRight,
  Layers,
} from "lucide-react"
import { useStore, type LandfillTrip } from "./Store"
import { Modal } from "./Modal"

export function NdubaLandfillEnhanced({
  role = "Manager",
}: {
  role?: string
}) {
  const {
    landfillTrips,
    recordLandfillTrip,
    confirmLandfillDelivery,
    vehicles,
    metrics,
  } = useStore()

  const [toast, setToast] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"trips" | "analytics" | "map" | "exceptions">("trips")

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [vehicleFilter, setVehicleFilter] = useState("All")
  const [wasteTypeFilter, setWasteTypeFilter] = useState("All")
  const [dateRange, setDateRange] = useState("Today")

  // Modals
  const [recordTripModalOpen, setRecordTripModalOpen] = useState(false)
  const [confirmDeliveryItem, setConfirmDeliveryItem] = useState<LandfillTrip | null>(null)
  const [detailModalItem, setDetailModalItem] = useState<LandfillTrip | null>(null)

  // Trip recording form state
  const [tripForm, setTripForm] = useState({
    ticketNo: `WB-${Math.floor(100000 + Math.random() * 900000)}`,
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    wasteType: "General" as LandfillTrip["wasteType"],
    departureTime: "08:30",
    arrivalTime: "09:20",
    grossWeightTonnes: 12.4,
    tareWeightTonnes: 5.2,
    netWeightTonnes: 7.2,
    status: "En route" as LandfillTrip["status"],
    zone: "Kimironko",
    destination: "Nduba Landfill Sector 3",
    notes: "",
  })

  // Delivery confirmation form state
  const [confirmForm, setConfirmForm] = useState({
    ticketNo: "",
    netWeight: 0,
    confirmedBy: "Kigali City Weighbridge Inspector",
  })

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return landfillTrips.filter((trip) => {
      const matchSearch =
        !searchQuery ||
        `${trip.ticketNo} ${trip.vehicle} ${trip.driver} ${trip.zone}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      const matchStatus = statusFilter === "All" || trip.status === statusFilter
      const matchVehicle = vehicleFilter === "All" || trip.vehicle === vehicleFilter
      const matchWaste = wasteTypeFilter === "All" || trip.wasteType === wasteTypeFilter
      return matchSearch && matchStatus && matchVehicle && matchWaste
    })
  }, [landfillTrips, searchQuery, statusFilter, vehicleFilter, wasteTypeFilter])

  // Aggregate stats
  const totalTonnes = useMemo(() => {
    return Number(
      landfillTrips.reduce((sum, t) => sum + (t.netWeightTonnes || 0), 0).toFixed(1),
    )
  }, [landfillTrips])

  const completedTrips = landfillTrips.filter((t) => t.status === "Completed")
  const enRouteTrips = landfillTrips.filter((t) => t.status === "En route")
  const arrivedTrips = landfillTrips.filter((t) => t.status === "Arrived")

  // Handlers
  const handleOpenRecordTrip = () => {
    setTripForm({
      ticketNo: `WB-${Math.floor(100000 + Math.random() * 900000)}`,
      vehicle: vehicles[0]?.plateNumber || "RW 412 A",
      driver: vehicles[0]?.driver || "Eric Niyonzima",
      wasteType: "General",
      departureTime: "09:00",
      arrivalTime: "10:15",
      grossWeightTonnes: 12.8,
      tareWeightTonnes: 5.4,
      netWeightTonnes: 7.4,
      status: "En route",
      zone: "Kimironko",
      destination: "Nduba Landfill Sector 2",
      notes: "Direct transfer from sector consolidation depot.",
    })
    setRecordTripModalOpen(true)
  }

  const handleRecordTripSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const net = Number(
      Math.max(0.1, tripForm.grossWeightTonnes - tripForm.tareWeightTonnes).toFixed(1),
    )
    recordLandfillTrip({
      ...tripForm,
      netWeightTonnes: net,
    })
    setRecordTripModalOpen(false)
    setToast(`Nduba Landfill haul recorded for vehicle ${tripForm.vehicle} (${net} Tonnes).`)
    setTimeout(() => setToast(null), 4000)
  }

  const handleOpenConfirm = (trip: LandfillTrip) => {
    setConfirmDeliveryItem(trip)
    setConfirmForm({
      ticketNo: trip.ticketNo || `WB-${Math.floor(100000 + Math.random() * 900000)}`,
      netWeight: trip.netWeightTonnes || 6.5,
      confirmedBy: "Kigali City Weighbridge Inspector",
    })
  }

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmDeliveryItem) return
    confirmLandfillDelivery(
      confirmDeliveryItem.id,
      confirmForm.ticketNo,
      Number(confirmForm.netWeight),
      confirmForm.confirmedBy,
    )
    setConfirmDeliveryItem(null)
    setToast(`Delivery verified! Weighbridge ticket #${confirmForm.ticketNo} logged.`)
    setTimeout(() => setToast(null), 4000)
  }

  const exportCsv = () => {
    const headers = [
      "Ticket No",
      "Vehicle",
      "Driver",
      "Zone",
      "Waste Type",
      "Gross (t)",
      "Tare (t)",
      "Net Weight (t)",
      "Departure",
      "Arrival",
      "Status",
      "Confirmed By",
    ]
    const rows = filteredTrips.map((t) => [
      t.ticketNo,
      t.vehicle,
      t.driver,
      t.zone,
      t.wasteType,
      t.grossWeightTonnes,
      t.tareWeightTonnes,
      t.netWeightTonnes,
      t.departureTime,
      t.arrivalTime,
      t.status,
      t.confirmedBy || "Pending",
    ])
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `ecoroute-nduba-landfill-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  // Trips per day simulation data
  const tripsPerDay = [
    { day: "Thu (Today)", trips: landfillTrips.length, tonnes: totalTonnes },
    { day: "Wed 07 Oct", trips: 8, tonnes: 48.2 },
    { day: "Tue 06 Oct", trips: 7, tonnes: 42.8 },
    { day: "Mon 05 Oct", trips: 9, tonnes: 55.1 },
    { day: "Sun 04 Oct", trips: 4, tonnes: 23.4 },
    { day: "Sat 03 Oct", trips: 6, tonnes: 37.0 },
    { day: "Fri 02 Oct", trips: 8, tonnes: 50.6 },
  ]

  // Tonnes per vehicle data
  const vehicleTonnages = vehicles.map((v) => {
    const vTrips = landfillTrips.filter((t) => t.vehicle === v.plateNumber)
    const tonnes = Number(vTrips.reduce((sum, t) => sum + (t.netWeightTonnes || 0), 0).toFixed(1))
    return {
      plate: v.plateNumber,
      driver: v.driver,
      trips: vTrips.length,
      tonnes: tonnes || Number((v.capacityTonnes * 1.8).toFixed(1)),
    }
  })

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

      {/* Top Banner and Actions */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <PackageCheck size={18} className="text-emerald-700" />
            <span>Nduba Landfill Waste Haulage & Weighbridge Control</span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Kigali Municipal Disposal Registry
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Live tracking of municipal refuse transport to Nduba Landfill, certified weighbridge receipts, gate turnarounds, and compliance logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleOpenRecordTrip}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Plus size={16} />
            <span>Record Landfill Trip</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">Total Hauled</span>
            <Scale size={16} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalTonnes} t</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Net certified waste today</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">Trips Today</span>
            <Truck size={16} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{landfillTrips.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{completedTrips.length} verified completed</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">En Route</span>
            <Clock3 size={16} className="text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700">{enRouteTrips.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">In transit along RN3 corridor</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">At Gate / Weighbridge</span>
            <MapPin size={16} className="text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700">{arrivedTrips.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting net-scale stamp</p>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-bold uppercase">Site Integrity</span>
            <ShieldCheck size={16} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-black text-emerald-900">100%</p>
          <p className="text-[11px] text-emerald-800 mt-0.5">Nduba Sector 2 active</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "trips", label: "Haulage Trip Register", count: landfillTrips.length },
          { id: "analytics", label: "Tonnage & Fleet Charts" },
          { id: "map", label: "Landfill Corridor Map" },
          { id: "exceptions", label: "Gate Exceptions (1)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.id
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  activeTab === tab.id ? "bg-emerald-950 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: TRIPS TABLE */}
      {activeTab === "trips" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket #, vehicle plate, driver name, zone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="All">All statuses</option>
                <option value="En route">En route</option>
                <option value="Arrived">Arrived</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="All">All vehicles</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} ({v.driver})
                  </option>
                ))}
              </select>

              <select
                value={wasteTypeFilter}
                onChange={(e) => setWasteTypeFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <option value="All">All waste types</option>
                <option value="General">General</option>
                <option value="Organic">Organic</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Bulky">Bulky</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3.5">Ticket #</th>
                    <th className="px-4 py-3.5">Vehicle & Driver</th>
                    <th className="px-4 py-3.5">Zone & Route</th>
                    <th className="px-4 py-3.5">Waste Type</th>
                    <th className="px-4 py-3.5 text-right">Net Weight</th>
                    <th className="px-4 py-3.5">Departure / Arrival</th>
                    <th className="px-4 py-3.5 text-center">Status</th>
                    <th className="px-4 py-3.5">Weighbridge Stamped By</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No Nduba Landfill trips match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip) => {
                      const isComplete = trip.status === "Completed"
                      const isEnRoute = trip.status === "En route"
                      const isArrived = trip.status === "Arrived"

                      return (
                        <tr key={trip.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                            {trip.ticketNo}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-slate-900">{trip.vehicle}</p>
                            <p className="text-[11px] text-slate-500">{trip.driver}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-slate-800">{trip.zone}</p>
                            <p className="text-[11px] text-slate-400">{trip.destination}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                              {trip.wasteType}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-black text-slate-900 text-sm">
                            {trip.netWeightTonnes} t
                            <span className="block text-[10px] font-normal text-slate-400">
                              G: {trip.grossWeightTonnes}t · T: {trip.tareWeightTonnes}t
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-semibold text-slate-800">Dep: {trip.departureTime}</p>
                            <p className="text-[11px] text-slate-500">
                              {isComplete ? `Arr: ${trip.arrivalTime}` : "ETA: 45 min"}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border ${
                                isComplete
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : isArrived
                                    ? "bg-purple-50 text-purple-800 border-purple-200"
                                    : "bg-blue-50 text-blue-800 border-blue-200"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  isComplete
                                    ? "bg-emerald-500"
                                    : isArrived
                                      ? "bg-purple-500 animate-pulse"
                                      : "bg-blue-500 animate-pulse"
                                }`}
                              />
                              {trip.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            {trip.confirmedBy ? (
                              <div>
                                <p className="font-semibold text-slate-800 text-[11px]">{trip.confirmedBy}</p>
                                <p className="text-[10px] text-emerald-700 font-mono">{trip.confirmedAt || "Verified"}</p>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-600 font-semibold italic">
                                Pending weighbridge confirmation
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isComplete && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenConfirm(trip)}
                                  className="rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-emerald-800"
                                >
                                  Confirm Delivery
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setDetailModalItem(trip)}
                                className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                              >
                                Ticket View
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & CHARTS */}
      {activeTab === "analytics" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart 1: Trips per Day */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BarChart3 size={16} className="text-emerald-700" />
                  Trips Per Day to Nduba Landfill
                </h3>
                <p className="text-xs text-slate-500">Daily haul frequency & aggregated weight</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Past 7 Days
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {tripsPerDay.map((d) => {
                const maxTrips = 10
                const percent = Math.min(100, Math.round((d.trips / maxTrips) * 100))
                return (
                  <div key={d.day}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span>{d.day}</span>
                      <span>
                        {d.trips} trips · <strong className="text-emerald-800">{d.tonnes} t</strong>
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Chart 2: Tonnes per Vehicle */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Truck size={16} className="text-emerald-700" />
                  Tonnes Hauled Per Vehicle
                </h3>
                <p className="text-xs text-slate-500">Fleet capacity utilization breakdown</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {vehicles.length} Trucks
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {vehicleTonnages.map((v) => {
                const maxTonnes = 15
                const percent = Math.min(100, Math.round((v.tonnes / maxTonnes) * 100))
                return (
                  <div key={v.plate}>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-emerald-800">{v.plate}</span>
                        <span className="text-[11px] font-normal text-slate-500">({v.driver})</span>
                      </span>
                      <span>
                        {v.trips} hauls · <strong className="text-slate-900">{v.tonnes} t</strong>
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-600 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LANDFILL TRIP MAP */}
      {activeTab === "map" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Map size={16} className="text-emerald-700" />
                Kigali Urban Transfer → Nduba Landfill Corridor (RN3)
              </h3>
              <p className="text-xs text-slate-500">
                Corridor overview from Gasabo, Kicukiro & Nyarugenge staging points to the Nduba Landfill gate.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              <span>RN3 Traffic: Smooth</span>
            </div>
          </div>

          <div className="mt-4 relative h-96 w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 p-6 flex flex-col justify-between">
            {/* Visual map background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex justify-between items-start">
              <div className="rounded-xl bg-slate-950/80 backdrop-blur border border-slate-700/60 p-3 text-white max-w-xs text-xs space-y-1">
                <p className="font-bold text-emerald-400">Nduba Municipal Landfill</p>
                <p className="text-[11px] text-slate-300">Location: Nduba Sector, Gasabo District, Kigali</p>
                <p className="text-[11px] text-slate-400">Elevation: 1,530 m · Weighbridge Gate: Active</p>
              </div>

              <div className="rounded-xl bg-slate-950/80 backdrop-blur border border-slate-700/60 p-3 text-white text-xs space-y-1">
                <p className="font-bold text-amber-400">Live Haulage En Route</p>
                <p className="text-[11px] text-slate-300">RW 412 A (Kimironko) - 4.2 km away</p>
                <p className="text-[11px] text-slate-300">RW 307 K (Remera) - 8.1 km away</p>
              </div>
            </div>

            {/* Simulated route SVG diagram */}
            <div className="relative z-10 my-auto">
              <div className="flex items-center justify-between text-white text-xs font-bold px-8">
                <div className="text-center">
                  <div className="size-10 rounded-2xl bg-emerald-700 text-white grid place-items-center mx-auto mb-2 shadow-lg ring-4 ring-emerald-500/30">
                    <MapPin size={20} />
                  </div>
                  <p>Kigali Consolidation Hubs</p>
                  <p className="text-[10px] text-slate-400">Kimironko / Remera / Niboye</p>
                </div>

                <div className="flex-1 mx-6 flex items-center justify-center relative">
                  <div className="h-1.5 w-full bg-emerald-500/40 rounded-full" />
                  <div className="absolute flex items-center gap-1 bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full shadow-md animate-pulse">
                    <Truck size={12} />
                    <span>RN3 Haul Corridor (22.4 km)</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="size-10 rounded-2xl bg-purple-700 text-white grid place-items-center mx-auto mb-2 shadow-lg ring-4 ring-purple-500/30">
                    <PackageCheck size={20} />
                  </div>
                  <p>Nduba Landfill Gate</p>
                  <p className="text-[10px] text-slate-400">Weighbridge & Sector 2</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
              <span>Avg round-trip cycle: 84 minutes</span>
              <span>Daily gate operating hours: 06:00 - 19:30 CAT</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXCEPTIONS */}
      {activeTab === "exceptions" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                Landfill Incident & Discrepancy Log
              </h3>
              <p className="text-xs text-slate-500">Recorded weighbridge variances and turnaround delays</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
              1 Open Flag
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs">WB-849201</span>
                  <span className="rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                    Tare Weight Variance (+0.6 t)
                  </span>
                  <span className="text-[11px] text-slate-400">Vehicle RW 118 T · 07 Oct 14:10</span>
                </div>
                <p className="text-xs text-slate-600">
                  Vehicle recorded tare weight higher than standard chassis calibration due to heavy rainwater in undercarriage. Verified by weighbridge supervisor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setToast("Exception resolved and marked as approved in Nduba Landfill audit log.")
                  setTimeout(() => setToast(null), 3000)
                }}
                className="self-start sm:self-auto rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Mark Cleared
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: RECORD TRIP */}
      <Modal
        open={recordTripModalOpen}
        onClose={() => setRecordTripModalOpen(false)}
        title="Record Nduba Landfill Trip"
        subtitle="Log a new waste haulage departure to the municipal landfill"
      >
        <form onSubmit={handleRecordTripSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Weighbridge Ticket Number
              </label>
              <input
                type="text"
                required
                value={tripForm.ticketNo}
                onChange={(e) => setTripForm({ ...tripForm, ticketNo: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Vehicle Plate
              </label>
              <select
                value={tripForm.vehicle}
                onChange={(e) => {
                  const sel = vehicles.find((v) => v.plateNumber === e.target.value)
                  setTripForm({
                    ...tripForm,
                    vehicle: e.target.value,
                    driver: sel?.driver || tripForm.driver,
                  })
                }}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} ({v.model} - {v.capacityTonnes}t)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Assigned Driver
              </label>
              <input
                type="text"
                required
                value={tripForm.driver}
                onChange={(e) => setTripForm({ ...tripForm, driver: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Origin Zone
              </label>
              <select
                value={tripForm.zone}
                onChange={(e) => setTripForm({ ...tripForm, zone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Kimironko">Kimironko</option>
                <option value="Remera">Remera</option>
                <option value="Niboye">Niboye</option>
                <option value="Nyamirambo">Nyamirambo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Waste Type
              </label>
              <select
                value={tripForm.wasteType}
                onChange={(e) => setTripForm({ ...tripForm, wasteType: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="Organic">Organic</option>
                <option value="Recyclable">Recyclable</option>
                <option value="Bulky">Bulky</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Departure Time
              </label>
              <input
                type="time"
                value={tripForm.departureTime}
                onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Gross Weight (Tonnes)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                value={tripForm.grossWeightTonnes}
                onChange={(e) => setTripForm({ ...tripForm, grossWeightTonnes: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tare Weight (Tonnes)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={tripForm.tareWeightTonnes}
                onChange={(e) => setTripForm({ ...tripForm, tareWeightTonnes: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-600">Calculated Net Weight:</span>
            <span className="font-black text-emerald-800 text-sm">
              {Number(Math.max(0.1, tripForm.grossWeightTonnes - tripForm.tareWeightTonnes).toFixed(1))} Tonnes
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Initial Status
            </label>
            <select
              value={tripForm.status}
              onChange={(e) => setTripForm({ ...tripForm, status: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
            >
              <option value="En route">En route (In transit to Nduba)</option>
              <option value="Arrived">Arrived (At gate weighbridge)</option>
              <option value="Completed">Completed (Dumped & signed off)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRecordTripModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
            >
              Save Trip Record
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: CONFIRM DELIVERY */}
      <Modal
        open={Boolean(confirmDeliveryItem)}
        onClose={() => setConfirmDeliveryItem(null)}
        title="Weighbridge Delivery Confirmation"
        subtitle={`Certify arrival and discharge for ${confirmDeliveryItem?.vehicle}`}
      >
        {confirmDeliveryItem && (
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs space-y-1">
              <p className="font-bold text-emerald-900">Trip Overview</p>
              <p className="text-slate-600">
                Driver: <strong>{confirmDeliveryItem.driver}</strong> · Origin: <strong>{confirmDeliveryItem.zone}</strong>
              </p>
              <p className="text-slate-600">
                Waste: <strong>{confirmDeliveryItem.wasteType}</strong> · Departure: <strong>{confirmDeliveryItem.departureTime}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Weighbridge Certificate Ticket #
              </label>
              <input
                type="text"
                required
                value={confirmForm.ticketNo}
                onChange={(e) => setConfirmForm({ ...confirmForm, ticketNo: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Verified Net Weight (Tonnes)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={confirmForm.netWeight}
                onChange={(e) => setConfirmForm({ ...confirmForm, netWeight: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Weighbridge Inspector / Confirmed By
              </label>
              <input
                type="text"
                required
                value={confirmForm.confirmedBy}
                onChange={(e) => setConfirmForm({ ...confirmForm, confirmedBy: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDeliveryItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
              >
                Stamp & Confirm Delivery
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 3: DETAIL TICKET VIEW */}
      <Modal
        open={Boolean(detailModalItem)}
        onClose={() => setDetailModalItem(null)}
        title="Official Landfill Haulage Ticket"
        subtitle={`Ticket #${detailModalItem?.ticketNo}`}
      >
        {detailModalItem && (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">EcoRoute Kigali Waste Control</span>
                <span className="font-mono text-emerald-800 font-bold">{detailModalItem.ticketNo}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <p>Vehicle: <strong className="text-slate-900">{detailModalItem.vehicle}</strong></p>
                <p>Driver: <strong className="text-slate-900">{detailModalItem.driver}</strong></p>
                <p>Zone: <strong className="text-slate-900">{detailModalItem.zone}</strong></p>
                <p>Waste Type: <strong className="text-slate-900">{detailModalItem.wasteType}</strong></p>
                <p>Departure: <strong className="text-slate-900">{detailModalItem.departureTime}</strong></p>
                <p>Arrival: <strong className="text-slate-900">{detailModalItem.arrivalTime}</strong></p>
                <p>Gross Weight: <strong className="text-slate-900">{detailModalItem.grossWeightTonnes} t</strong></p>
                <p>Tare Weight: <strong className="text-slate-900">{detailModalItem.tareWeightTonnes} t</strong></p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Certified Net Disposal:</span>
                <span className="text-emerald-800 text-sm">{detailModalItem.netWeightTonnes} Tonnes</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <p className="font-bold text-slate-800">Weighbridge Authority Verification</p>
              <p className="text-slate-500">
                Official: {detailModalItem.confirmedBy || "Pending Weighbridge Attendant Signature"}
              </p>
              <p className="text-slate-400 text-[10px]">
                Timestamp: {detailModalItem.confirmedAt || "Awaiting Gate Receipt"}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close Ticket
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
