import React, { useState } from "react"
import {
  CalendarDays,
  Clock3,
  CalendarPlus,
  Plus,
  Check,
  Truck,
  RotateCcw,
  CheckCircle2,
  Calendar,
  X,
  AlertTriangle,
  UsersRound,
  Filter,
} from "lucide-react"
import { useStore } from "./Store"
import { Modal } from "./Modal"

export type ScheduleItem = {
  id: string
  day: string
  zone: string
  district: string
  sector: string
  cell: string
  village: string
  time: string
  frequency: string
  daysSelected: string[]
  wasteType: string
  vehicle: string
  driver: string
  team: string
  stops: number
  status: "Planned" | "Active" | "Completed" | "Missed"
}

export function CollectionScheduleEnhanced() {
  const { vehicles } = useStore()

  const [viewMode, setViewMode] = useState<"calendar" | "timetable">("calendar")
  const [calendarView, setCalendarView] = useState<"month" | "week">("month")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [addScheduleOpen, setAddScheduleOpen] = useState(false)
  const [bulkActionModal, setBulkActionModal] = useState<"reschedule" | "assign" | "cancel" | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Schedules state
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "SCH-01",
      day: "Monday",
      zone: "Kimironko",
      district: "Gasabo",
      sector: "Kimironko",
      cell: "Bibare",
      village: "Kibagabaga",
      time: "07:00 – 10:00",
      frequency: "Weekly",
      daysSelected: ["Mon"],
      wasteType: "General",
      vehicle: "RW 412 A",
      driver: "Eric Niyonzima",
      team: "Team Alpha",
      stops: 42,
      status: "Completed" as const,
    },
    {
      id: "SCH-02",
      day: "Tuesday",
      zone: "Remera",
      district: "Gasabo",
      sector: "Remera",
      cell: "Rukiri II",
      village: "Gisimenti",
      time: "07:30 – 11:30",
      frequency: "Weekly",
      daysSelected: ["Tue"],
      wasteType: "General",
      vehicle: "RW 307 K",
      driver: "Claude Mugenzi",
      team: "Team Delta",
      stops: 38,
      status: "Completed" as const,
    },
    {
      id: "SCH-03",
      day: "Wednesday",
      zone: "Niboye",
      district: "Kicukiro",
      sector: "Niboye",
      cell: "Gatare",
      village: "Indatwa",
      time: "08:00 – 12:00",
      frequency: "Weekly",
      daysSelected: ["Wed"],
      wasteType: "General, Organic",
      vehicle: "RW 118 T",
      driver: "Alice Uwera",
      team: "Team Bravo",
      stops: 36,
      status: "Active" as const,
    },
    {
      id: "SCH-04",
      day: "Thursday",
      zone: "Nyamirambo",
      district: "Nyarugenge",
      sector: "Nyamirambo",
      cell: "Rugarama",
      village: "Cosmos",
      time: "07:00 – 11:00",
      frequency: "Weekly",
      daysSelected: ["Thu"],
      wasteType: "General, Recyclable",
      vehicle: "RW 922 D",
      driver: "Patrick Tuyishime",
      team: "Team Echo",
      stops: 32,
      status: "Planned" as const,
    },
    {
      id: "SCH-05",
      day: "Friday",
      zone: "Kimironko",
      district: "Gasabo",
      sector: "Kimironko",
      cell: "Kibagabaga",
      village: "Nyabisindu",
      time: "13:00 – 16:30",
      frequency: "Weekly",
      daysSelected: ["Fri"],
      wasteType: "Commercial / Bulky",
      vehicle: "RW 551 C",
      driver: "Emmanuel Karemera",
      team: "Team Kivu",
      stops: 28,
      status: "Planned" as const,
    },
    {
      id: "SCH-06",
      day: "Saturday",
      zone: "Remera",
      district: "Gasabo",
      sector: "Remera",
      cell: "Nyabisindu",
      village: "Amahoro",
      time: "08:00 – 13:00",
      frequency: "Weekly",
      daysSelected: ["Sat"],
      wasteType: "Organic",
      vehicle: "RW 684 M",
      driver: "Aline Mukamana",
      team: "Team Ubumwe",
      stops: 30,
      status: "Planned" as const,
    },
  ])

  // New schedule form state
  const [form, setForm] = useState({
    frequency: "Weekly",
    daysSelected: ["Mon", "Thu"],
    time: "07:30 – 11:00",
    wasteType: "General",
    zone: "Kimironko",
    district: "Gasabo",
    sector: "Kimironko",
    cell: "Bibare",
    village: "Amahoro",
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    team: "Team Alpha",
    stops: 35,
    status: "Planned" as const,
  })

  // Bulk action params
  const [bulkVehicle, setBulkVehicle] = useState("RW 551 C")
  const [bulkTime, setBulkTime] = useState("08:00 – 11:30")

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const selectAll = () => {
    if (selectedIds.length === schedules.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(schedules.map((s) => s.id))
    }
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSch = {
      id: `SCH-${String(schedules.length + 1).padStart(2, "0")}`,
      day: form.daysSelected[0] ? getFullDay(form.daysSelected[0]) : "Monday",
      ...form,
    }
    setSchedules([...schedules, newSch])
    setAddScheduleOpen(false)
    setToast(`New collection schedule created for ${newSch.zone} (${newSch.frequency})!`)
    setTimeout(() => setToast(null), 4000)
  }

  const handleBulkActionExecute = () => {
    if (bulkActionModal === "cancel") {
      setSchedules((prev) =>
        prev.map((s) =>
          selectedIds.includes(s.id) ? { ...s, status: "Missed" as const } : s,
        ),
      )
      setToast(`${selectedIds.length} schedules cancelled.`)
    } else if (bulkActionModal === "assign") {
      const vObj = vehicles.find((v) => v.plateNumber === bulkVehicle)
      setSchedules((prev) =>
        prev.map((s) =>
          selectedIds.includes(s.id)
            ? { ...s, vehicle: bulkVehicle, driver: vObj?.driver || s.driver }
            : s,
        ),
      )
      setToast(`${selectedIds.length} schedules reassigned to ${bulkVehicle}.`)
    } else if (bulkActionModal === "reschedule") {
      setSchedules((prev) =>
        prev.map((s) =>
          selectedIds.includes(s.id) ? { ...s, time: bulkTime } : s,
        ),
      )
      setToast(`${selectedIds.length} schedules rescheduled to ${bulkTime}.`)
    }

    setBulkActionModal(null)
    setSelectedIds([])
    setTimeout(() => setToast(null), 4000)
  }

  const getFullDay = (short: string) => {
    const map: Record<string, string> = {
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
      Sun: "Sunday",
    }
    return map[short] || short
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">
              Master Collection Schedules & Calendar
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Periodic collection timetables, vehicle routing days, and calendar dispatcher.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "calendar" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Calendar View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timetable")}
              className={`rounded-lg px-3 py-1.5 transition ${
                viewMode === "timetable" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Timetable List
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAddScheduleOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
          >
            <Plus size={15} /> Create Schedule
          </button>
        </div>
      </div>

      {/* Bulk actions bar if items are selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-3 text-white text-xs shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedIds.length} schedules selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBulkActionModal("reschedule")}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-bold text-emerald-400"
            >
              Reschedule
            </button>
            <button
              type="button"
              onClick={() => setBulkActionModal("assign")}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-bold text-blue-400"
            >
              Assign Vehicle
            </button>
            <button
              type="button"
              onClick={() => setBulkActionModal("cancel")}
              className="rounded-lg bg-rose-900/60 hover:bg-rose-900 px-3 py-1.5 font-bold text-rose-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Calendar side */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">October 2026</span>
                <span className="text-xs text-slate-400">Week 41</span>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCalendarView("month")}
                  className={`px-2.5 py-1 rounded-md ${calendarView === "month" ? "bg-white font-bold text-slate-900 shadow-xs" : "text-slate-600"}`}
                >
                  Month
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarView("week")}
                  className={`px-2.5 py-1 rounded-md ${calendarView === "week" ? "bg-white font-bold text-slate-900 shadow-xs" : "text-slate-600"}`}
                >
                  Week
                </button>
              </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="py-1.5 font-bold text-slate-400 uppercase text-[10px]">
                  {day}
                </div>
              ))}

              {/* Day cells (October 2026 starts on Thursday Oct 1) */}
              {[...Array(3).fill(null), ...Array(31).fill(0).map((_, i) => i + 1)].map((dayNum, idx) => {
                const isToday = dayNum === 8
                const hasSchedules = dayNum && [5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17].includes(dayNum)

                return (
                  <div
                    key={idx}
                    className={`min-h-[64px] rounded-xl border p-1 text-left flex flex-col justify-between transition ${
                      !dayNum
                        ? "border-transparent bg-transparent"
                        : isToday
                        ? "border-emerald-500 bg-emerald-50/50"
                        : "border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    {dayNum && (
                      <>
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className={isToday ? "text-emerald-700" : "text-slate-700"}>{dayNum}</span>
                          {isToday && (
                            <span className="text-[9px] font-bold bg-emerald-600 text-white px-1 rounded">Today</span>
                          )}
                        </div>

                        {hasSchedules && (
                          <div className="space-y-0.5 mt-1">
                            <span className="block truncate text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">
                              {dayNum % 2 === 0 ? "KG 18 Kimironko" : "KK 15 Niboye"}
                            </span>
                            {dayNum % 3 === 0 && (
                              <span className="block truncate text-[9px] font-bold bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                                KG 11 Remera
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Beside timetable quick list */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Weekly Timetable Summary
            </h4>
            <div className="space-y-2.5">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 text-xs space-y-1 hover:bg-white hover:shadow-xs transition"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900">{sch.day} · {sch.zone}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sch.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : sch.status === "Active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {sch.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1">
                    <Clock3 size={11} className="text-emerald-700" />
                    <span>{sch.time}</span>
                    <span className="text-slate-300">·</span>
                    <span>{sch.stops} stops</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Vehicle: <strong>{sch.vehicle}</strong> ({sch.driver})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TIMETABLE LIST VIEW */}
      {viewMode === "timetable" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-xs">
              <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-100 font-bold">
                <tr>
                  <th className="px-5 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === schedules.length}
                      onChange={selectAll}
                      className="rounded border-slate-300 text-emerald-700"
                    />
                  </th>
                  <th className="px-4 py-3.5">Schedule ID & Day</th>
                  <th className="px-4 py-3.5">Zone & Sector</th>
                  <th className="px-4 py-3.5">Time Window</th>
                  <th className="px-4 py-3.5">Frequency & Days</th>
                  <th className="px-4 py-3.5">Vehicle & Driver</th>
                  <th className="px-4 py-3.5">Waste Type</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules.map((s) => {
                  const isChecked = selectedIds.includes(s.id)
                  return (
                    <tr key={s.id} className={isChecked ? "bg-emerald-50/40" : "hover:bg-slate-50/60"}>
                      <td className="px-5 py-3.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(s.id)}
                          className="rounded border-slate-300 text-emerald-700"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{s.day}</div>
                        <div className="text-[11px] font-mono text-slate-400">{s.id}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800">{s.zone}</div>
                        <div className="text-[11px] text-slate-400">{s.cell}, {s.village}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        {s.time}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-800">{s.frequency}</span>
                        <div className="text-[11px] text-slate-500">{s.daysSelected.join(", ")}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-800">{s.vehicle}</span>
                        <div className="text-[11px] text-slate-500">{s.driver}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        {s.wasteType}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            s.status === "Completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : s.status === "Active"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : s.status === "Missed"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      <Modal
        open={addScheduleOpen}
        onClose={() => setAddScheduleOpen(false)}
        title="Create Collection Schedule"
        subtitle="Configure frequency, day of week, collection window and waste category."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Frequency *</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              >
                <option value="One-time">One-time Pickup</option>
                <option value="Daily">Daily Schedule</option>
                <option value="Weekly">Weekly (Standard)</option>
                <option value="Monthly">Monthly Cycle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
              <input
                type="text"
                placeholder="07:00 – 10:30"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Days of Week</label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                const active = form.daysSelected.includes(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        daysSelected: active
                          ? form.daysSelected.filter((d) => d !== day)
                          : [...form.daysSelected, day],
                      })
                    }}
                    className={`size-8 rounded-lg text-xs font-bold transition ${
                      active ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Collection Type</label>
              <select
                value={form.wasteType}
                onChange={(e) => setForm({ ...form, wasteType: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              >
                <option value="General">General Municipal Waste</option>
                <option value="Organic">Organic & Green Compost</option>
                <option value="Recyclable">Recyclable (Plastic, Glass, Metal)</option>
                <option value="Bulky">Bulky / Construction Debris</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              >
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Zone</label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              >
                <option value="Kimironko">Kimironko (Gasabo)</option>
                <option value="Remera">Remera (Gasabo)</option>
                <option value="Niboye">Niboye (Kicukiro)</option>
                <option value="Nyamirambo">Nyamirambo (Nyarugenge)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign Vehicle</label>
              <select
                value={form.vehicle}
                onChange={(e) => {
                  const v = vehicles.find((item) => item.plateNumber === e.target.value)
                  setForm({ ...form, vehicle: e.target.value, driver: v?.driver || form.driver })
                }}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} ({v.driver})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddScheduleOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Action Modals */}
      {bulkActionModal && (
        <Modal
          open={!!bulkActionModal}
          onClose={() => setBulkActionModal(null)}
          title={`Bulk Action: ${bulkActionModal.toUpperCase()}`}
          subtitle={`Applying change to ${selectedIds.length} selected schedule items.`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            {bulkActionModal === "reschedule" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Collection Time Window</label>
                <input
                  type="text"
                  value={bulkTime}
                  onChange={(e) => setBulkTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>
            )}

            {bulkActionModal === "assign" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Reassigned Vehicle</label>
                <select
                  value={bulkVehicle}
                  onChange={(e) => setBulkVehicle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.plateNumber}>
                      {v.plateNumber} ({v.model} - {v.driver})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {bulkActionModal === "cancel" && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-semibold">
                Are you sure you want to cancel {selectedIds.length} selected schedules? Status will be updated to Missed.
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBulkActionModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleBulkActionExecute}
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                Confirm Bulk Action
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
