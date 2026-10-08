import React, { useMemo, useState } from "react"
import {
  CreditCard,
  ReceiptText,
  ShieldAlert,
  Smartphone,
  Settings,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Search,
  Filter,
  ArrowRight,
  Send,
  UserCheck,
  PauseCircle,
  FileText,
  Save,
  Link2,
  X,
  ChevronRight,
  MessageSquare,
  History,
} from "lucide-react"
import { useStore, type OverdueAccount } from "./Store"
import { Modal } from "./Modal"

export function FinanceBillingEnhanced({
  initialTab = "billing",
}: {
  initialTab?: "billing" | "enforcement" | "config" | "momo" | "reconciliation"
}) {
  const {
    invoices,
    payments,
    overdueAccounts,
    billingConfig,
    updateBillingConfig,
    mobileMoneySettings,
    updateMobileMoneySettings,
    updateEnforcementAccount,
    bulkEnforcementAction,
    reconciliation,
    matchPaymentManually,
    metrics,
    payInvoice,
  } = useStore()

  const [activeTab, setActiveTab] = useState<"billing" | "enforcement" | "config" | "momo" | "reconciliation">(initialTab)
  const [toast, setToast] = useState<string | null>(null)

  // Billing Tab state
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("All")
  const [invoiceQuery, setInvoiceQuery] = useState("")

  // Billing Config Form state
  const [configForm, setConfigForm] = useState(billingConfig)

  // Mobile Money Settings Form state
  const [momoForm, setMomoForm] = useState(mobileMoneySettings)

  // Enforcement state
  const [enforcementFilter, setEnforcementFilter] = useState<"All" | "Unpaid" | "Overdue" | "Partially paid">("Overdue")
  const [selectedEnforcementIds, setSelectedEnforcementIds] = useState<string[]>([])
  const [enforcementDrawerAccount, setEnforcementDrawerAccount] = useState<OverdueAccount | null>(null)
  const [enforcementActionModal, setEnforcementActionModal] = useState<{
    account: OverdueAccount
    action: string
  } | null>(null)
  const [actionNote, setActionNote] = useState("")

  // Reconciliation state
  const [matchModalTxn, setMatchModalTxn] = useState<typeof reconciliation[number] | null>(null)
  const [selectedInvoiceForMatch, setSelectedInvoiceForMatch] = useState("INV-2026-00125")

  // Billing History Customer Modal
  const [customerBillingModal, setCustomerBillingModal] = useState<string | null>(null)

  // Format currency
  const money = (val: number) => `RWF ${val.toLocaleString()}`

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesStatus =
        invoiceStatusFilter === "All" ||
        inv.status.toLowerCase() === invoiceStatusFilter.toLowerCase()
      const matchesQuery =
        !invoiceQuery ||
        `${inv.id} ${inv.customerId} ${inv.period} ${inv.plan}`
          .toLowerCase()
          .includes(invoiceQuery.toLowerCase())
      return matchesStatus && matchesQuery
    })
  }, [invoices, invoiceStatusFilter, invoiceQuery])

  // Filtered enforcement follow-up queue
  const filteredEnforcement = useMemo(() => {
    return overdueAccounts.filter((acc) => {
      if (enforcementFilter === "Overdue") return true
      if (enforcementFilter === "Unpaid") return acc.status !== "Resolved"
      if (enforcementFilter === "Partially paid") return acc.amount < 4000
      return true
    })
  }, [overdueAccounts, enforcementFilter])

  const toggleSelectEnforcement = (id: string) => {
    setSelectedEnforcementIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const selectAllEnforcement = () => {
    if (selectedEnforcementIds.length === filteredEnforcement.length) {
      setSelectedEnforcementIds([])
    } else {
      setSelectedEnforcementIds(filteredEnforcement.map((a) => a.id))
    }
  }

  const handleExecuteBulkEnforcement = (action: string) => {
    bulkEnforcementAction(selectedEnforcementIds, action)
    setToast(`${action} dispatched for ${selectedEnforcementIds.length} overdue accounts.`)
    setTimeout(() => setToast(null), 4000)
    setSelectedEnforcementIds([])
  }

  const handleSingleEnforcementAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!enforcementActionModal) return

    const { account, action } = enforcementActionModal
    const nextStage =
      action === "Send warning"
        ? "Warning"
        : action === "Suspend"
        ? "Suspended"
        : action === "Send reminder"
        ? "Reminder"
        : account.stage

    updateEnforcementAccount(account.id, action, actionNote, nextStage)
    setToast(`Action “${action}” recorded for ${account.customerName}.`)
    setTimeout(() => setToast(null), 4000)
    setEnforcementActionModal(null)
    setActionNote("")
  }

  const handleSaveBillingConfig = (e: React.FormEvent) => {
    e.preventDefault()
    updateBillingConfig(configForm)
    setToast("Billing tariff plans and grace periods saved successfully!")
    setTimeout(() => setToast(null), 4000)
  }

  const handleSaveMomoSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateMobileMoneySettings(momoForm)
    setToast("MTN MoMo and Airtel Money provider credentials updated!")
    setTimeout(() => setToast(null), 4000)
  }

  const handleMatchManual = (e: React.FormEvent) => {
    e.preventDefault()
    if (!matchModalTxn) return

    matchPaymentManually(matchModalTxn.id, selectedInvoiceForMatch)
    setToast(`Transaction ${matchModalTxn.id} reconciled with ${selectedInvoiceForMatch}!`)
    setTimeout(() => setToast(null), 4000)
    setMatchModalTxn(null)
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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("billing")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "billing"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <CreditCard size={14} className="inline mr-1.5" /> Payments & Invoicing
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("enforcement")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "enforcement"
              ? "bg-amber-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ShieldAlert size={14} className="inline mr-1.5" /> Billing Enforcement ({overdueAccounts.length} Overdue)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reconciliation")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "reconciliation"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <RefreshCw size={14} className="inline mr-1.5" /> Payment Reconciliation
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("config")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "config"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Settings size={14} className="inline mr-1.5" /> Billing Configuration
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("momo")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "momo"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Smartphone size={14} className="inline mr-1.5" /> Mobile Money Settings
        </button>
      </div>

      {/* TAB 1: PAYMENTS & INVOICING */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Revenue</p>
              <p className="mt-2 text-2xl font-black text-slate-900">{money(metrics.revenueToday)}</p>
              <p className="mt-1 text-xs text-slate-500">126 verified transactions</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue Invoices</p>
              <p className="mt-2 text-2xl font-black text-amber-700">{money(metrics.overdueTotal)}</p>
              <p className="mt-1 text-xs text-slate-500">{metrics.overdueCount} accounts need follow-up</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">MTN MoMo Share</p>
              <p className="mt-2 text-2xl font-black text-slate-900">RWF 1,020,000</p>
              <p className="mt-1 text-xs text-slate-500">55.4% of total volume</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Airtel Money Share</p>
              <p className="mt-2 text-2xl font-black text-slate-900">RWF 540,000</p>
              <p className="mt-1 text-xs text-slate-500">29.3% of total volume</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
              <span>Status:</span>
              {["All", "Paid", "Unpaid", "Partially paid", "Overdue"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setInvoiceStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    invoiceStatusFilter.toLowerCase() === st.toLowerCase()
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoice or customer..."
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">Invoice ID</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Period</th>
                    <th className="px-4 py-3.5">Plan</th>
                    <th className="px-4 py-3.5">Amount</th>
                    <th className="px-4 py-3.5">Due Date</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-bold font-mono text-slate-900">{inv.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{inv.customerId}</td>
                      <td className="px-4 py-3.5 text-slate-600">{inv.period}</td>
                      <td className="px-4 py-3.5 text-slate-700">{inv.plan}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{money(inv.amount)}</td>
                      <td className="px-4 py-3.5 text-slate-600">{inv.due}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            inv.status === "Paid"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : inv.status === "Overdue"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setCustomerBillingModal(inv.customerId)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
                        >
                          Billing History →
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

      {/* TAB 2: BILLING ENFORCEMENT */}
      {activeTab === "enforcement" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert size={22} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Billing Enforcement Queue ({overdueAccounts.length} Accounts = RWF {metrics.overdueTotal.toLocaleString()})
                </h4>
                <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                  5-day grace period → Automated SMS reminder → Day 15 formal warning → Day 30 pickup suspension. Actions are recorded in enforcement history and audit trail.
                </p>
              </div>
            </div>
          </div>

          {/* Bulk actions bar if items are selected */}
          {selectedEnforcementIds.length > 0 && (
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-5 py-3 text-white text-xs shadow-md animate-in fade-in">
              <span className="font-bold">{selectedEnforcementIds.length} overdue accounts selected</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExecuteBulkEnforcement("Send reminder")}
                  className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 font-bold text-white"
                >
                  Send Reminder SMS
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteBulkEnforcement("Send warning")}
                  className="rounded-lg bg-amber-700 hover:bg-amber-600 px-3 py-1.5 font-bold text-white"
                >
                  Send Warning SMS
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteBulkEnforcement("Escalate to Manager")}
                  className="rounded-lg bg-rose-700 hover:bg-rose-600 px-3 py-1.5 font-bold text-white"
                >
                  Escalate to Manager
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnforcementIds([])}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Queue Filter:</span>
              {(["All", "Overdue", "Unpaid", "Partially paid"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setEnforcementFilter(filter)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    enforcementFilter === filter ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <span className="text-slate-500 font-medium">
              Total Overdue: <strong className="text-amber-700">RWF {metrics.overdueTotal.toLocaleString()}</strong>
            </span>
          </div>

          {/* Enforcement Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-xs">
                <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={selectedEnforcementIds.length === filteredEnforcement.length}
                        onChange={selectAllEnforcement}
                        className="rounded border-slate-300 text-amber-700"
                      />
                    </th>
                    <th className="px-4 py-3.5">Customer & Zone</th>
                    <th className="px-4 py-3.5">Overdue Amount</th>
                    <th className="px-4 py-3.5">Days Overdue</th>
                    <th className="px-4 py-3.5">Stage</th>
                    <th className="px-4 py-3.5">Assigned To</th>
                    <th className="px-4 py-3.5">Due Date</th>
                    <th className="px-4 py-3.5">Last Action</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnforcement.map((row) => {
                    const isChecked = selectedEnforcementIds.includes(row.id)
                    return (
                      <tr key={row.id} className={isChecked ? "bg-amber-50/40" : "hover:bg-slate-50/60 transition"}>
                        <td className="px-5 py-3.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectEnforcement(row.id)}
                            className="rounded border-slate-300 text-amber-700"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => setEnforcementDrawerAccount(row)}
                            className="font-bold text-slate-900 hover:text-emerald-700 text-left"
                          >
                            {row.customerName}
                          </button>
                          <div className="text-[11px] text-slate-400">{row.customerId} · {row.zone}</div>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-amber-900">{money(row.amount)}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800">{row.daysOverdue} days</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.stage === "Suspended"
                                ? "bg-rose-100 text-rose-800"
                                : row.stage === "Warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {row.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-slate-700">{row.assignedTo}</td>
                        <td className="px-4 py-3.5 text-slate-600">{row.dueDate}</td>
                        <td className="px-4 py-3.5 text-[11px] text-slate-500">{row.lastAction}</td>
                        <td className="px-5 py-3.5 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setEnforcementActionModal({ account: row, action: "Send reminder" })}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            Reminder
                          </button>
                          <button
                            type="button"
                            onClick={() => setEnforcementActionModal({ account: row, action: "Send warning" })}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100"
                          >
                            Warning
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT RECONCILIATION */}
      {activeTab === "reconciliation" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">Payment Reconciliation Engine</h4>
                <p className="text-xs text-slate-500">
                  Compare gateway transactions against system invoices. Match unmatched transfers manually.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Automated MoMo Webhook Sync Active
              </span>
            </div>

            <div className="overflow-x-auto pt-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Txn ID & Ref</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Customer / Origin</th>
                    <th className="px-4 py-3">Paired Invoice</th>
                    <th className="px-4 py-3">Reconciliation Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reconciliation.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{r.ref}</div>
                        <div className="text-[10px] font-mono text-slate-400">{r.id} · {r.date}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{r.provider}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{money(r.amount)}</td>
                      <td className="px-4 py-3 text-slate-800">{r.customer}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800">{r.invoice}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            r.status === "Matched"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : r.status === "Unmatched"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status === "Unmatched" && (
                          <button
                            type="button"
                            onClick={() => setMatchModalTxn(r)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 text-white px-2.5 py-1 text-xs font-bold hover:bg-emerald-800"
                          >
                            <Link2 size={12} /> Match Manually
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

      {/* TAB 4: BILLING CONFIGURATION */}
      {activeTab === "config" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Billing Policy & Plan Tariffs</h4>
              <p className="text-xs text-slate-500">Configure collection tariff rates per service category and monthly billing cycle.</p>
            </div>
          </div>

          <form onSubmit={handleSaveBillingConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Household Basic Tariff (RWF / Mo)</label>
                <input
                  type="number"
                  value={configForm.feeBasic}
                  onChange={(e) => setConfigForm({ ...configForm, feeBasic: parseInt(e.target.value) || 5000 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Household Standard Tariff (RWF / Mo)</label>
                <input
                  type="number"
                  value={configForm.feeStandard}
                  onChange={(e) => setConfigForm({ ...configForm, feeStandard: parseInt(e.target.value) || 6000 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Household Large / Shared Compound</label>
                <input
                  type="number"
                  value={configForm.feeLarge}
                  onChange={(e) => setConfigForm({ ...configForm, feeLarge: parseInt(e.target.value) || 10000 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Business Weekly Plan (RWF / Wk)</label>
                <input
                  type="number"
                  value={configForm.feeBusiness}
                  onChange={(e) => setConfigForm({ ...configForm, feeBusiness: parseInt(e.target.value) || 5000 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Institution (RWF / Mo)</label>
                <input
                  type="number"
                  value={configForm.feeInstitution}
                  onChange={(e) => setConfigForm({ ...configForm, feeInstitution: parseInt(e.target.value) || 20000 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Due Day of Month</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={configForm.dueDay}
                  onChange={(e) => setConfigForm({ ...configForm, dueDay: parseInt(e.target.value) || 10 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Late Fee Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={configForm.lateFeePercent}
                  onChange={(e) => setConfigForm({ ...configForm, lateFeePercent: parseFloat(e.target.value) || 5 })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                <Save size={14} /> Save Tariff Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: MOBILE MONEY SETTINGS */}
      {activeTab === "momo" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Mobile Money Gateway Settings</h4>
              <p className="text-xs text-slate-500">Configure MTN Mobile Money and Airtel Money automated collection channels.</p>
            </div>
          </div>

          <form onSubmit={handleSaveMomoSettings} className="space-y-5">
            {/* MTN MoMo Card */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone size={16} className="text-amber-600" /> MTN Mobile Money (Rwanda)
                </span>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={momoForm.mtnEnabled}
                    onChange={(e) => setMomoForm({ ...momoForm, mtnEnabled: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span>Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Merchant Code</label>
                  <input
                    type="text"
                    value={momoForm.mtnMerchantCode}
                    onChange={(e) => setMomoForm({ ...momoForm, mtnMerchantCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">API Status</label>
                  <input
                    type="text"
                    value={momoForm.mtnStatus}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold bg-white text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Airtel Money Card */}
            <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <Smartphone size={16} className="text-red-600" /> Airtel Money (Rwanda)
                </span>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={momoForm.airtelEnabled}
                    onChange={(e) => setMomoForm({ ...momoForm, airtelEnabled: e.target.checked })}
                    className="rounded border-slate-300 text-red-600"
                  />
                  <span>Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Merchant Code</label>
                  <input
                    type="text"
                    value={momoForm.airtelMerchantCode}
                    onChange={(e) => setMomoForm({ ...momoForm, airtelMerchantCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">API Status</label>
                  <input
                    type="text"
                    value={momoForm.airtelStatus}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold bg-white text-emerald-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                <Save size={14} /> Save Gateway Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Enforcement Single Action Modal */}
      {enforcementActionModal && (
        <Modal
          open={!!enforcementActionModal}
          onClose={() => setEnforcementActionModal(null)}
          title={`Enforcement Action: ${enforcementActionModal.action}`}
          subtitle={`Customer: ${enforcementActionModal.account.customerName} (${enforcementActionModal.account.customerId})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSingleEnforcementAction} className="space-y-3.5">
            <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
              <span className="font-bold text-slate-800">Outstanding: </span>
              <strong className="text-amber-800">{money(enforcementActionModal.account.amount)}</strong>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Days Overdue: {enforcementActionModal.account.daysOverdue} days · Invoice: {enforcementActionModal.account.invoiceId}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Action Note & Follow-up Log</label>
              <textarea
                rows={2}
                placeholder="Log conversation with customer, promised date, or reason..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEnforcementActionModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                Confirm Action
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Manual Reconciliation Modal */}
      {matchModalTxn && (
        <Modal
          open={!!matchModalTxn}
          onClose={() => setMatchModalTxn(null)}
          title="Manual Payment Reconciliation"
          subtitle={`Transaction: ${matchModalTxn.ref} (${money(matchModalTxn.amount)})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleMatchManual} className="space-y-3.5">
            <p className="text-xs text-slate-600">
              Pair this received {matchModalTxn.provider} transaction with an open customer invoice.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Open Invoice</label>
              <select
                value={selectedInvoiceForMatch}
                onChange={(e) => setSelectedInvoiceForMatch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
              >
                {invoices.filter((inv) => inv.status !== "Paid").map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} – {inv.customerId} ({money(inv.amount)} - {inv.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMatchModalTxn(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                Link & Reconcile
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
