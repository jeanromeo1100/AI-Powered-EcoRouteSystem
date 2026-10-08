import React, { useMemo, useState } from "react"
import {
  FileText,
  Download,
  Calendar,
  Clock3,
  Mail,
  CheckCircle2,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
  TrendingUp,
  Table,
  Plus,
  Trash2,
  FileSpreadsheet,
  Check,
  X,
  Send,
  Eye,
} from "lucide-react"
import { useStore } from "./Store"
import { Modal } from "./Modal"

export type ReportType =
  | "Collection"
  | "Route efficiency"
  | "Billing & payments"
  | "Landfill trips"
  | "Performance"

export function ReportsEnhanced({
  role = "Manager",
}: {
  role?: string
}) {
  const {
    metrics,
    collections,
    invoices,
    payments,
    landfillTrips,
    vehicles,
    trips,
    customerList,
  } = useStore()

  const [toast, setToast] = useState<string | null>(null)

  // Report configuration
  const [selectedType, setSelectedType] = useState<ReportType>("Collection")
  const [selectedTemplate, setSelectedTemplate] = useState("Daily Operations Executive Summary")
  const [dateRange, setDateRange] = useState("Today")
  const [zoneFilter, setZoneFilter] = useState("All zones")

  // Schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleFreq, setScheduleFreq] = useState<"Daily" | "Weekly" | "Monthly">("Weekly")
  const [scheduleTime, setScheduleTime] = useState("07:00")
  const [distributionEmails, setDistributionEmails] = useState<string[]>([
    "operations@ecoroute.rw",
    "finance@ecoroute.rw",
    "director@kigalicity.gov.rw",
  ])
  const [newEmailInput, setNewEmailInput] = useState("")

  // Generated reports history
  const [reportHistory, setReportHistory] = useState([
    {
      id: "REP-2026-1008-01",
      title: "Daily Collection Summary - 08 Oct 2026",
      type: "Collection" as ReportType,
      generatedAt: "08 Oct 2026 · 11:30",
      format: "PDF",
      size: "1.8 MB",
    },
    {
      id: "REP-2026-1007-02",
      title: "Weekly MoMo & Airtel Reconciliation",
      type: "Billing & payments" as ReportType,
      generatedAt: "07 Oct 2026 · 18:00",
      format: "Excel",
      size: "2.4 MB",
    },
    {
      id: "REP-2026-1006-03",
      title: "Nduba Landfill Weighbridge Verification",
      type: "Landfill trips" as ReportType,
      generatedAt: "06 Oct 2026 · 19:45",
      format: "CSV",
      size: "820 KB",
    },
    {
      id: "REP-2026-1005-04",
      title: "AI Route Optimization & Carbon Offset",
      type: "Route efficiency" as ReportType,
      generatedAt: "05 Oct 2026 · 09:15",
      format: "PDF",
      size: "3.1 MB",
    },
  ])

  // Template gallery
  const templates = [
    {
      id: "t1",
      type: "Collection" as ReportType,
      title: "Daily Operations Executive Summary",
      desc: "Planned vs completed collections, missed pickups, driver logs by zone.",
    },
    {
      id: "t2",
      type: "Billing & payments" as ReportType,
      title: "MoMo & Airtel Revenue Breakdown",
      desc: "Daily reconciled mobile money collections, overdue accounts, collection rate.",
    },
    {
      id: "t3",
      type: "Route efficiency" as ReportType,
      title: "AI Route Optimization & Fuel Savings",
      desc: "Km saved, fuel reduction % across Kimironko, Remera, Niboye & Nyamirambo.",
    },
    {
      id: "t4",
      type: "Landfill trips" as ReportType,
      title: "Nduba Municipal Landfill Haulage Certificate",
      desc: "Weighbridge certified tonnage, gate turnaround, ticket numbers & haul records.",
    },
    {
      id: "t5",
      type: "Performance" as ReportType,
      title: "Kigali City Council Compliance Audit",
      desc: "Comprehensive multi-zone SLA scorecards, staff output, customer satisfaction.",
    },
  ]

  // Add email to distribution list
  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = newEmailInput.trim().toLowerCase()
    if (clean && !distributionEmails.includes(clean)) {
      setDistributionEmails([...distributionEmails, clean])
      setNewEmailInput("")
    }
  }

  // Remove email
  const handleRemoveEmail = (email: string) => {
    setDistributionEmails(distributionEmails.filter((e) => e !== email))
  }

  // Schedule submit
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setScheduleModalOpen(false)
    setToast(
      `Automated schedule created: ${scheduleFreq} dispatch to ${distributionEmails.length} recipients at ${scheduleTime}.`,
    )
    setTimeout(() => setToast(null), 4000)
  }

  // Export handlers
  const handleExport = (format: "PDF" | "Excel" | "CSV") => {
    const newEntry = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      title: `${selectedTemplate} (${format})`,
      type: selectedType,
      generatedAt: "Just now",
      format,
      size: format === "PDF" ? "2.1 MB" : format === "Excel" ? "1.4 MB" : "420 KB",
    }
    setReportHistory([newEntry, ...reportHistory])

    // Generate CSV content for download simulation
    let csvData = ""
    if (selectedType === "Collection") {
      csvData = [
        ["ID", "Customer", "Zone", "Driver", "Vehicle", "Status", "Date"],
        ...collections.slice(0, 30).map((c) => [c.id, c.customerName, c.zone, c.driver, c.vehicle, c.status, c.date]),
      ].map((r) => r.join(",")).join("\n")
    } else if (selectedType === "Billing & payments") {
      csvData = [
        ["Invoice ID", "Customer ID", "Period", "Plan", "Amount (RWF)", "Status"],
        ...invoices.slice(0, 30).map((i) => [i.id, i.customerId, i.period, i.plan, i.amount, i.status]),
      ].map((r) => r.join(",")).join("\n")
    } else if (selectedType === "Landfill trips") {
      csvData = [
        ["Ticket No", "Vehicle", "Driver", "Zone", "Net Tonnes", "Status"],
        ...landfillTrips.map((l) => [l.ticketNo, l.vehicle, l.driver, l.zone, l.netWeightTonnes, l.status]),
      ].map((r) => r.join(",")).join("\n")
    } else {
      csvData = [
        ["Metric", "Value", "Unit"],
        ["Collections Completed", metrics.collectionsCompletedCount, "pickups"],
        ["Total Customers", metrics.customersCount, "accounts"],
        ["Overdue Total", metrics.overdueTotal, "RWF"],
        ["Landfill Waste Hauled", metrics.landfillTonnesTotal, "tonnes"],
        ["Km Saved via AI", metrics.routeEfficiency.kmSaved, "km"],
      ].map((r) => r.join(",")).join("\n")
    }

    const mime = format === "PDF" ? "application/pdf" : format === "Excel" ? "application/vnd.ms-excel" : "text/csv"
    const ext = format === "PDF" ? "pdf" : format === "Excel" ? "xlsx" : "csv"
    const blob = new Blob([csvData], { type: mime })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `ecoroute-${selectedType.toLowerCase().replace(/\s+/g, "-")}-report.${ext}`
    link.click()

    setToast(`Export completed! Downloaded ${format} file: ${selectedTemplate}.`)
    setTimeout(() => setToast(null), 4000)
  }

  // Preview data rows
  const previewData = useMemo(() => {
    switch (selectedType) {
      case "Collection":
        return {
          headers: ["Record ID", "Customer", "Zone", "Driver", "Vehicle", "Status"],
          rows: collections.slice(0, 6).map((c) => [c.id, c.customerName, c.zone, c.driver, c.vehicle, c.status]),
          chartTitle: "Collection Completion by Zone",
          chartData: [
            { label: "Kimironko", val: 38, max: 42, sub: "90% done" },
            { label: "Remera", val: 32, max: 37, sub: "86% done" },
            { label: "Niboye", val: 31, max: 36, sub: "86% done" },
            { label: "Nyamirambo", val: 25, max: 33, sub: "76% done" },
          ],
        }
      case "Billing & payments":
        return {
          headers: ["Invoice ID", "Customer", "Plan", "Amount (RWF)", "Due Date", "Status"],
          rows: invoices.slice(0, 6).map((i) => [i.id, i.customerId, i.plan, `RWF ${i.amount.toLocaleString()}`, i.due, i.status]),
          chartTitle: "Channel Revenue Distribution",
          chartData: [
            { label: "MTN MoMo", val: 58, max: 100, sub: "58% share" },
            { label: "Airtel Money", val: 24, max: 100, sub: "24% share" },
            { label: "Bank Transfer", val: 12, max: 100, sub: "12% share" },
            { label: "Cash Staging", val: 6, max: 100, sub: "6% share" },
          ],
        }
      case "Landfill trips":
        return {
          headers: ["Ticket #", "Vehicle", "Driver", "Zone", "Net Weight", "Status"],
          rows: landfillTrips.slice(0, 6).map((l) => [l.ticketNo, l.vehicle, l.driver, l.zone, `${l.netWeightTonnes} t`, l.status]),
          chartTitle: "Tonnage Hauled by Waste Type",
          chartData: [
            { label: "General", val: 24.8, max: 30, sub: "24.8 tonnes" },
            { label: "Organic", val: 14.2, max: 30, sub: "14.2 tonnes" },
            { label: "Recyclable", val: 8.5, max: 30, sub: "8.5 tonnes" },
            { label: "Bulky", val: 3.2, max: 30, sub: "3.2 tonnes" },
          ],
        }
      case "Route efficiency":
        return {
          headers: ["Zone", "Optimized Route", "Planned Distance", "Saved (km)", "Fuel Reduction", "Status"],
          rows: [
            ["Kimironko", "KG 18 Loop", "32.4 km", "8.2 km", "19.4%", "Optimized"],
            ["Remera", "KG 11 Circuit", "28.6 km", "7.1 km", "18.2%", "Optimized"],
            ["Niboye", "KK 15 Sweep", "30.1 km", "7.6 km", "17.9%", "Optimized"],
            ["Nyamirambo", "KN 07 Hillway", "35.8 km", "8.3 km", "18.5%", "Optimized"],
          ],
          chartTitle: "Distance Saved per Sector (km)",
          chartData: [
            { label: "Kimironko", val: 8.2, max: 10, sub: "8.2 km saved" },
            { label: "Remera", val: 7.1, max: 10, sub: "7.1 km saved" },
            { label: "Niboye", val: 7.6, max: 10, sub: "7.6 km saved" },
            { label: "Nyamirambo", val: 8.3, max: 10, sub: "8.3 km saved" },
          ],
        }
      default:
        return {
          headers: ["SLA Parameter", "Target", "Actual", "Variance", "Evaluation", "Compliance"],
          rows: [
            ["Pickup On-Time Rate", "95.0%", "96.4%", "+1.4%", "Exceeds", "Compliant"],
            ["Customer Invoicing Rate", "100%", "100%", "0.0%", "On Target", "Compliant"],
            ["Landfill Weighbridge Signoff", "100%", "100%", "0.0%", "On Target", "Compliant"],
            ["Complaint Resolution < 24h", "90.0%", "92.1%", "+2.1%", "Exceeds", "Compliant"],
          ],
          chartTitle: "Operations Performance Metrics",
          chartData: [
            { label: "Collection SLA", val: 96, max: 100, sub: "96.4% on-time" },
            { label: "Fleet Uptime", val: 92, max: 100, sub: "92.5% active" },
            { label: "Billing Rate", val: 88, max: 100, sub: "88.2% paid" },
            { label: "SMS Delivery", val: 97, max: 100, sub: "97.6% delivered" },
          ],
        }
    }
  }, [selectedType, collections, invoices, landfillTrips])

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
            <FileText size={18} className="text-emerald-700" />
            <span>Operations & Financial Reports Center</span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Automated Analytics, Exports & SLA Reports
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Customizable data extracts with live charts, multi-format export (PDF, Excel, CSV), and automated recurring email dispatches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Clock3 size={15} />
            <span>Schedule Report</span>
          </button>

          <div className="inline-flex rounded-xl shadow-sm">
            <button
              type="button"
              onClick={() => handleExport("PDF")}
              className="inline-flex items-center gap-1.5 rounded-l-xl bg-emerald-800 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-900 border-r border-emerald-700"
            >
              <Download size={14} />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport("Excel")}
              className="inline-flex items-center gap-1.5 bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 border-r border-emerald-600"
            >
              <FileSpreadsheet size={14} />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center gap-1.5 rounded-r-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800"
            >
              <Table size={14} />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel: Type Selector & Filters */}
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            1. Report Category
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              const newT = e.target.value as ReportType
              setSelectedType(newT)
              const firstT = templates.find((t) => t.type === newT)
              if (firstT) setSelectedTemplate(firstT.title)
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="Collection">Collection Operations</option>
            <option value="Route efficiency">Route Efficiency & AI Savings</option>
            <option value="Billing & payments">Billing & MoMo Payments</option>
            <option value="Landfill trips">Nduba Landfill Haulage</option>
            <option value="Performance">System & SLA Performance</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            2. Template Gallery
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            {templates
              .filter((t) => t.type === selectedType)
              .map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
            <option value="Custom Configured Query">Custom Query</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            3. Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="Today">Today (08 Oct 2026)</option>
            <option value="Yesterday">Yesterday (07 Oct 2026)</option>
            <option value="This week">This Week (Week 41)</option>
            <option value="This month">This Month (October 2026)</option>
            <option value="Last 30 days">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            4. Geographic Zone
          </label>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none"
          >
            <option value="All zones">All 4 Zones (Kigali Consolidated)</option>
            <option value="Kimironko">Kimironko Zone</option>
            <option value="Remera">Remera Zone</option>
            <option value="Niboye">Niboye Zone</option>
            <option value="Nyamirambo">Nyamirambo Zone</option>
          </select>
        </div>
      </div>

      {/* Report Live Preview: Chart & Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Live Report Preview · {selectedTemplate}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reflects active filters ({dateRange} · {zoneFilter})
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Ready for Export
          </span>
        </div>

        {/* Chart Section */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart3 size={15} className="text-emerald-700" />
              {previewData.chartTitle}
            </h4>
            <span className="text-[11px] text-slate-400">Preview Visuals</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {previewData.chartData.map((item) => {
              const percent = Math.min(100, Math.round((item.val / item.max) * 100))
              return (
                <div key={item.label} className="rounded-xl bg-white p-3 border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1">
                    <span>{item.label}</span>
                    <span className="text-emerald-800">{item.sub}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
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

        {/* Table Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Table size={15} className="text-emerald-700" />
              Detailed Data Records (First 6 Rows Sample)
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  {previewData.headers.map((h, i) => (
                    <th key={i} className="px-3.5 py-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-3.5 py-2.5 ${
                          cIdx === 0
                            ? "font-mono font-bold text-slate-900"
                            : cIdx === 1
                              ? "font-semibold text-slate-900"
                              : "text-slate-600"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Generated Reports History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText size={16} className="text-emerald-700" />
              Generated Reports Archive & Distribution History
            </h3>
            <p className="text-xs text-slate-500">Previously compiled exports and recurring dispatches</p>
          </div>
          <span className="text-xs text-slate-500">{reportHistory.length} files saved</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Report ID</th>
                <th className="px-4 py-3">Report Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Generated</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">File Size</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportHistory.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{rep.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{rep.title}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {rep.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{rep.generatedAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        rep.format === "PDF"
                          ? "bg-rose-100 text-rose-800"
                          : rep.format === "Excel"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {rep.format}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{rep.size}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleExport(rep.format as any)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300"
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE REPORT MODAL */}
      <Modal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Schedule Automated Recurring Report"
        subtitle="Configure automated dispatch to email distribution list"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Report Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Frequency
              </label>
              <select
                value={scheduleFreq}
                onChange={(e) => setScheduleFreq(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="Daily">Daily (Every morning)</option>
                <option value="Weekly">Weekly (Every Monday)</option>
                <option value="Monthly">Monthly (1st of Month)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Dispatch Time
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Attachment Format
              </label>
              <select
                defaultValue="PDF"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
              >
                <option value="PDF">PDF Summary with Charts</option>
                <option value="Excel">Excel Spreadsheet (.xlsx)</option>
                <option value="CSV">Raw CSV Data</option>
              </select>
            </div>
          </div>

          {/* Distribution list */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Email Distribution List ({distributionEmails.length} active recipients)
            </label>

            <div className="flex gap-2 mb-3">
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="Enter email to add (e.g. manager@ecoroute.rw)..."
                className="flex-1 rounded-xl border border-slate-200 p-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Add Recipient
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {distributionEmails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200 shadow-sm"
                >
                  <Mail size={12} className="text-emerald-700" />
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
            >
              Save Schedule & Enable
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
