import React, { useState } from "react"
import {
  CalendarDays,
  Sparkles,
  ReceiptText,
  MessageSquareText,
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ArrowRight,
  Filter,
  RefreshCw,
  TrendingUp,
  MapPin,
  Server,
  Database,
  Smartphone,
  ShieldCheck,
  Users,
  Activity,
  Layers,
} from "lucide-react"
import { useStore } from "./Store"

export function WorkflowStepper({
  onPage,
  role,
}: {
  onPage: (page: string) => void
  role: string
}) {
  const { metrics } = useStore()

  const steps = [
    {
      id: "step-1",
      number: "1",
      title: "Waste Collection",
      status: "In progress" as const,
      statusLabel: "In progress",
      statusBadgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      count: `${metrics.collectionsCompletedCount}/${metrics.collectionsTodayCount} done`,
      subtext: `${metrics.collectionsInProgressCount} in progress · ${metrics.collectionsPendingMissedCount} pending`,
      targetPage: role === "Manager" ? "Collections" : "Zones / Collection Parameters",
      icon: CalendarDays,
    },
    {
      id: "step-2",
      number: "2",
      title: "Route Optimization",
      status: "Done" as const,
      statusLabel: "Done",
      statusBadgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      count: "4 zones optimized",
      subtext: `${metrics.routeEfficiency.kmSaved} km saved (${metrics.routeEfficiency.fuelSavedPercent}%)`,
      targetPage: role === "Manager" ? "Routes & AI EcoRoute" : "Zones / Collection Parameters",
      icon: Sparkles,
    },
    {
      id: "step-3",
      number: "3",
      title: "Billing",
      status: "In progress" as const,
      statusLabel: "In progress",
      statusBadgeClass: "bg-amber-100 text-amber-800 border-amber-200",
      count: `${metrics.overdueCount} overdue`,
      subtext: `RWF ${metrics.overdueTotal.toLocaleString()} pending follow-up`,
      targetPage: role === "Manager" ? "Payments & Billing" : "Reports",
      icon: ReceiptText,
    },
    {
      id: "step-4",
      number: "4",
      title: "SMS Communication",
      status: "Done" as const,
      statusLabel: "Done",
      statusBadgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
      count: `${metrics.smsSummary.sent} sent today`,
      subtext: `${metrics.smsSummary.delivered} delivered · ${metrics.smsSummary.failed} failed`,
      targetPage: "Communication",
      icon: MessageSquareText,
    },
    {
      id: "step-5",
      number: "5",
      title: "Vehicle/Trip Tracking",
      status: "In progress" as const,
      statusLabel: "In progress",
      statusBadgeClass: "bg-blue-100 text-blue-800 border-blue-200",
      count: "4 on route / 8 fleet",
      subtext: "GPS live updates active",
      targetPage: role === "Manager" ? "Live Tracking" : "System Configuration",
      icon: Truck,
    },
    {
      id: "step-6",
      number: "6",
      title: "Nduba Landfill",
      status: "In progress" as const,
      statusLabel: "In progress",
      statusBadgeClass: "bg-purple-100 text-purple-800 border-purple-200",
      count: `${metrics.landfillTripsCount} trips today`,
      subtext: `${metrics.landfillTonnesTotal} tonnes verified`,
      targetPage: role === "Manager" ? "Nduba Landfill" : "Reports",
      icon: PackageCheck,
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">
              Operations Workflow Pipeline
            </h3>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              Kigali Daily Operations
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            End-to-end urban waste flow: Waste Collection → Route Optimization → Billing → SMS Communication → Vehicle/Trip Tracking → Nduba Landfill.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-full bg-emerald-500" /> Done
          </span>
          <span className="inline-flex items-center gap-1 ml-2">
            <span className="size-2 rounded-full bg-blue-500" /> In progress
          </span>
          <span className="inline-flex items-center gap-1 ml-2">
            <span className="size-2 rounded-full bg-amber-500" /> Pending
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-4">
        {steps.map((step) => {
          const StepIcon = step.icon
          return (
            <div
              key={step.id}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-emerald-200 group"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-emerald-700 text-white text-xs font-bold">
                    {step.number}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${step.statusBadgeClass}`}
                  >
                    {step.statusLabel}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <StepIcon size={16} className="text-emerald-700 shrink-0" />
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {step.title}
                  </p>
                </div>

                <p className="mt-2 text-sm font-extrabold text-slate-900">
                  {step.count}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                  {step.subtext}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onPage(step.targetPage)}
                className="mt-3.5 inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-white border border-slate-200 py-1.5 px-3 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
              >
                <span>Go to page</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type DashboardFilters = {
  dateRange: string
  zone: string
  vehicle: string
  status: string
}

export function DashboardFilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: DashboardFilters
  onChange: (key: keyof DashboardFilters, value: string) => void
  onReset: () => void
}) {
  const isFiltered =
    filters.dateRange !== "Today" ||
    filters.zone !== "All zones" ||
    filters.vehicle !== "All vehicles" ||
    filters.status !== "All statuses"

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Filter size={15} className="text-emerald-700" />
          <span>Interactive Operations Filter</span>
          <span className="text-[11px] font-normal lowercase text-slate-400">
            (updates KPIs and charts in real-time)
          </span>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <RefreshCw size={12} />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => onChange("dateRange", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
          >
            <option value="Today">Today (08 Oct 2026)</option>
            <option value="Yesterday">Yesterday (07 Oct 2026)</option>
            <option value="This week">This Week (Week 41)</option>
            <option value="This month">This Month (October 2026)</option>
            <option value="Custom">Custom Date Range</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Collection Zone
          </label>
          <select
            value={filters.zone}
            onChange={(e) => onChange("zone", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
          >
            <option value="All zones">All 4 Zones</option>
            <option value="Kimironko">Kimironko Zone (Gasabo)</option>
            <option value="Remera">Remera Zone (Gasabo)</option>
            <option value="Niboye">Niboye Zone (Kicukiro)</option>
            <option value="Nyamirambo">Nyamirambo Zone (Nyarugenge)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Fleet Vehicle
          </label>
          <select
            value={filters.vehicle}
            onChange={(e) => onChange("vehicle", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
          >
            <option value="All vehicles">All 8 Vehicles</option>
            <option value="RW 412 A">RW 412 A (Kimironko Compactor)</option>
            <option value="RW 307 K">RW 307 K (Remera Fuso)</option>
            <option value="RW 118 T">RW 118 T (Niboye Hino)</option>
            <option value="RW 922 D">RW 922 D (Nyamirambo NPR)</option>
            <option value="RW 551 C">RW 551 C (Atego 10T)</option>
            <option value="RW 684 M">RW 684 M (FSR Tipper)</option>
            <option value="RW 719 P">RW 719 P (FAW Tiger)</option>
            <option value="RW 833 B">RW 833 B (Dongfeng)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Collection Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
          >
            <option value="All statuses">All Statuses</option>
            <option value="Completed">Completed Only (126)</option>
            <option value="In progress">In Progress Only (8)</option>
            <option value="Pending">Pending / Missed (14)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export function PlannedVsCompletedBarChart({
  zoneFilter,
}: {
  zoneFilter?: string
}) {
  const zoneData = [
    { name: "Kimironko", planned: 42, completed: 36, inProgress: 2, pending: 4, rate: 85.7 },
    { name: "Remera", planned: 38, completed: 33, inProgress: 2, pending: 3, rate: 86.8 },
    { name: "Niboye", planned: 36, completed: 31, inProgress: 2, pending: 3, rate: 86.1 },
    { name: "Nyamirambo", planned: 32, completed: 26, inProgress: 2, pending: 4, rate: 81.3 },
  ]

  const filteredData =
    zoneFilter && zoneFilter !== "All zones"
      ? zoneData.filter((z) => z.name === zoneFilter)
      : zoneData

  const maxVal = Math.max(...zoneData.map((d) => d.planned))

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Collections Performance
          </p>
          <h4 className="text-base font-bold text-slate-900">
            Planned vs Completed by Zone
          </h4>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-emerald-600" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-slate-200" /> Planned Target
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {filteredData.map((item) => {
          const completedPct = (item.completed / maxVal) * 100
          const plannedPct = (item.planned / maxVal) * 100

          return (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{item.name}</span>
                <span className="text-slate-500">
                  <strong className="text-emerald-700">{item.completed}</strong> / {item.planned} collections ({item.rate}%)
                </span>
              </div>
              <div className="relative h-6 rounded-xl bg-slate-100 overflow-hidden p-0.5">
                <div
                  className="absolute inset-y-0.5 left-0.5 rounded-lg bg-slate-300 opacity-60"
                  style={{ width: `${plannedPct}%` }}
                />
                <div
                  className="absolute inset-y-0.5 left-0.5 rounded-lg bg-emerald-600 transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-sm"
                  style={{ width: `${completedPct}%` }}
                >
                  {item.completed}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Total Today: <strong>148 Planned</strong></span>
        <span>Completed: <strong className="text-emerald-700">126 Completed (85.1%)</strong></span>
        <span>Remaining: <strong className="text-blue-700">8 In progress</strong> · <strong className="text-amber-700">14 Pending/Missed</strong></span>
      </div>
    </div>
  )
}

export function PaymentsPerDayLineChart() {
  const points = [
    { day: "Thu 02", amount: 1420000, label: "1.42M" },
    { day: "Fri 03", amount: 1580000, label: "1.58M" },
    { day: "Sat 04", amount: 1290000, label: "1.29M" },
    { day: "Sun 05", amount: 1710000, label: "1.71M" },
    { day: "Mon 06", amount: 1640000, label: "1.64M" },
    { day: "Tue 07", amount: 1510000, label: "1.51M" },
    { day: "Wed 08", amount: 1840000, label: "1.84M" },
  ]

  const maxVal = 2000000
  const minVal = 1000000
  const range = maxVal - minVal

  const coords = points.map((p, idx) => {
    const x = 30 + idx * 75
    const y = 140 - ((p.amount - minVal) / range) * 110
    return { ...p, x, y }
  })

  const pathD = coords.reduce(
    (acc, curr, idx) =>
      idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`,
    "",
  )

  const areaD = `${pathD} L ${coords[coords.length - 1].x} 150 L ${coords[0].x} 150 Z`

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Revenue Trend
          </p>
          <h4 className="text-base font-bold text-slate-900">
            Payments Received per Day
          </h4>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-emerald-700">+14.2% vs last week</p>
          <p className="text-[11px] text-slate-400">7-day rolling view</p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 520 175" className="w-full h-40">
          <defs>
            <linearGradient id="payGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="25" y1="30" x2="495" y2="30" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="25" y1="85" x2="495" y2="85" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="25" y1="140" x2="495" y2="140" stroke="#f1f5f9" strokeWidth="1" />

          {/* Area fill */}
          <path d={areaD} fill="url(#payGradient)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {coords.map((pt, idx) => (
            <g key={pt.day}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={idx === coords.length - 1 ? 5 : 4}
                fill={idx === coords.length - 1 ? "#047857" : "#10b981"}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={pt.x}
                y={pt.y - 9}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#0f172a"
              >
                {pt.label}
              </text>
              <text
                x={pt.x}
                y={162}
                textAnchor="middle"
                fontSize="10"
                fontWeight="500"
                fill="#64748b"
              >
                {pt.day}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Today's Total: <strong className="text-emerald-800">RWF 1,840,000</strong> (126 txns)</span>
        <span>MTN MoMo + Airtel Money dominant</span>
      </div>
    </div>
  )
}

export function PaymentMethodsPieChart() {
  const methods = [
    { name: "MTN MoMo", amount: 1020000, count: 70, pct: 55.4, color: "#f59e0b", border: "border-amber-400" },
    { name: "Airtel Money", amount: 540000, count: 37, pct: 29.3, color: "#ef4444", border: "border-red-400" },
    { name: "Cash", amount: 160000, count: 12, pct: 8.7, color: "#10b981", border: "border-emerald-400" },
    { name: "Bank Transfer", amount: 120000, count: 7, pct: 6.5, color: "#3b82f6", border: "border-blue-400" },
  ]

  const totalAmount = 1840000

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Channels Breakdown
        </p>
        <h4 className="text-base font-bold text-slate-900">
          Payments by Provider / Method
        </h4>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative size-36 shrink-0">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            {/* SVG Donut circles */}
            {/* MTN 55.4% */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeDasharray="55.4 44.6"
              strokeDashoffset="0"
            />
            {/* Airtel 29.3% */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="29.3 70.7"
              strokeDashoffset="-55.4"
            />
            {/* Cash 8.7% */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="8.7 91.3"
              strokeDashoffset="-84.7"
            />
            {/* Bank 6.5% */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="6.5 93.5"
              strokeDashoffset="-93.4"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400">Total</span>
            <span className="text-xs font-bold text-slate-900">1.84M</span>
            <span className="text-[9px] text-slate-500">RWF</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="flex-1 w-full space-y-2">
          {methods.map((m) => (
            <div key={m.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                <span className="font-semibold text-slate-700">{m.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">RWF {m.amount.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 ml-1.5 font-medium">({m.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
        <span>Total transactions: <strong>126 confirmed</strong></span>
        <span>Mobile money share: <strong className="text-emerald-700">84.7%</strong></span>
      </div>
    </div>
  )
}

export function OperationsKPIsAndMap({
  onPage,
  filters,
}: {
  onPage?: (page: string) => void
  filters?: DashboardFilters
}) {
  const { metrics, vehicles } = useStore()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 3 cards: Route Efficiency, SMS Summary, Landfill Trips */}
      <div className="space-y-3 lg:col-span-1">
        {/* Card 1: Route Efficiency */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Route Efficiency
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {metrics.routeEfficiency.kmSaved} km saved
              </p>
              <p className="mt-0.5 text-xs text-emerald-700 font-semibold">
                +{metrics.routeEfficiency.fuelSavedPercent}% fuel reduction via AI routing
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles size={20} />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Based on dynamic Kigali stop re-sequencing across 4 active collection zones.
          </p>
        </div>

        {/* Card 2: SMS Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                SMS Communication
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {metrics.smsSummary.sent} sent
              </p>
              <p className="mt-0.5 text-xs text-emerald-700 font-semibold">
                {metrics.smsSummary.delivered} delivered · {metrics.smsSummary.failed} failed (98.0%)
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
              <MessageSquareText size={20} />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Delivery confirmation alerts, pickup reminders, and billing receipts dispatched.
          </p>
        </div>

        {/* Card 3: Landfill Trips */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nduba Landfill Hauls
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {metrics.landfillTripsCount} trips
              </p>
              <p className="mt-0.5 text-xs text-purple-700 font-semibold">
                {metrics.landfillTonnesTotal} tonnes verified at weighbridge
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-purple-50 text-purple-700">
              <PackageCheck size={20} />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Automated ticket matching WBG-2026-9471 to WBG-2026-9482 at Nduba scale.
          </p>
        </div>
      </div>

      {/* Small live operations map */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-emerald-700" />
            <h4 className="text-base font-bold text-slate-900">
              Live Operations Map (Kigali City)
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-emerald-800">4 Trucks Active</span>
          </div>
        </div>

        {/* Interactive mini SVG Map representation */}
        <div className="relative flex-1 min-h-[220px] rounded-2xl bg-slate-900 p-4 overflow-hidden border border-slate-800 flex flex-col justify-between">
          <svg className="absolute inset-0 size-full opacity-35" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Kigali road grid stylized */}
            <path d="M10,20 Q50,40 90,20" stroke="#334155" strokeWidth="1" fill="none" />
            <path d="M20,90 Q50,60 80,90" stroke="#334155" strokeWidth="1" fill="none" />
            <path d="M30,10 L30,90" stroke="#334155" strokeWidth="1" fill="none" />
            <path d="M70,10 L70,90" stroke="#334155" strokeWidth="1" fill="none" />
            <path d="M50,15 L50,85" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          </svg>

          {/* Map Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-lg bg-slate-800/90 px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-slate-700">
              Kigali Metropolitan Waste Zone
            </span>
            <span className="rounded-lg bg-purple-900/80 px-2.5 py-1 text-[11px] font-bold text-purple-200 border border-purple-700">
              Destination: Nduba Landfill (Gasabo)
            </span>
          </div>

          {/* Zones & Trucks visual markers */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto">
            <div className="rounded-xl bg-slate-800/90 p-2 border border-emerald-500/40">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Kimironko</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">RW 412 A (On route)</p>
              <p className="text-[9px] text-slate-400">36/42 collections</p>
            </div>

            <div className="rounded-xl bg-slate-800/90 p-2 border border-emerald-500/40">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Remera</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">RW 307 K (On route)</p>
              <p className="text-[9px] text-slate-400">33/38 collections</p>
            </div>

            <div className="rounded-xl bg-slate-800/90 p-2 border border-emerald-500/40">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Niboye</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">RW 118 T (On route)</p>
              <p className="text-[9px] text-slate-400">31/36 collections</p>
            </div>

            <div className="rounded-xl bg-slate-800/90 p-2 border border-emerald-500/40">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Nyamirambo</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">RW 922 D (On route)</p>
              <p className="text-[9px] text-slate-400">26/32 collections</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span>Live telemetry synced via GPS OBD-II</span>
            {onPage && (
              <button
                type="button"
                onClick={() => onPage("Live Tracking")}
                className="font-bold text-emerald-400 hover:text-emerald-300"
              >
                Expand full map →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdminSystemHealthPanel({
  onViewSessions,
}: {
  onViewSessions?: () => void
}) {
  const { activeSessions } = useStore()
  const [refreshed, setRefreshed] = useState(false)

  const services = [
    { name: "Web Application", status: "Online", latency: "24 ms", uptime: "99.98%", icon: Server, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { name: "PostgreSQL Database", status: "Online", latency: "14 ms", uptime: "99.99%", icon: Database, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { name: "SMS Gateway (Pindo RW)", status: "Online", latency: "88 ms", uptime: "99.2%", icon: Smartphone, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { name: "MTN MoMo OpenAPI", status: "Online", latency: "112 ms", uptime: "99.8%", icon: Smartphone, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { name: "Airtel Money API", status: "Degraded", latency: "280 ms", uptime: "97.4%", icon: Smartphone, color: "text-amber-700 bg-amber-50 border-amber-200" },
  ]

  const handleRefresh = () => {
    setRefreshed(true)
    setTimeout(() => setRefreshed(false), 800)
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            System Reliability
          </p>
          <h4 className="text-base font-bold text-slate-900">
            Platform Health & Integrations
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw size={13} className={refreshed ? "animate-spin text-emerald-700" : ""} />
            <span>Check status</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {services.map((svc) => {
          const SvcIcon = svc.icon
          const isDegraded = svc.status === "Degraded"
          return (
            <div
              key={svc.name}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <SvcIcon size={16} className="text-slate-600" />
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${svc.color}`}
                >
                  <span className={`size-1.5 rounded-full ${isDegraded ? "bg-amber-500 animate-pulse" : "bg-emerald-600"}`} />
                  {svc.status}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">{svc.name}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Latency: {svc.latency}</span>
                <span>Uptime: {svc.uptime}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Users size={16} className="text-emerald-700" />
          <span>
            Active sessions: <strong className="text-slate-900">{activeSessions.length} users active</strong> (Web, Mobile & Field tablets)
          </span>
        </div>
        {onViewSessions && (
          <button
            type="button"
            onClick={onViewSessions}
            className="font-bold text-emerald-700 hover:text-emerald-900 self-start sm:self-auto"
          >
            Manage active sessions →
          </button>
        )}
      </div>
    </div>
  )
}
