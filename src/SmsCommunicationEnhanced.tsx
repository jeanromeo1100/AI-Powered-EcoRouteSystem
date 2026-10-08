import React, { useState } from "react"
import {
  MessageSquareText,
  Clock3,
  Send,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
} from "lucide-react"
import { useStore, type ScheduledSms } from "./Store"
import { Modal } from "./Modal"

export function SmsCommunicationEnhanced() {
  const { messages, sendMessage, scheduledSms, scheduleSms, cancelScheduledSms, metrics } = useStore()

  const [activeTab, setActiveTab] = useState<"log" | "scheduled">("log")
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Form state
  const [dispatchMode, setDispatchMode] = useState<"now" | "later">("now")
  const [recipientGroup, setRecipientGroup] = useState<ScheduledSms["recipientGroup"]>("Zone")
  const [targetName, setTargetName] = useState("Kimironko Zone Customers")
  const [messageTitle, setMessageTitle] = useState("Waste Collection Notice")
  const [messageText, setMessageText] = useState("")
  const [schedDate, setSchedDate] = useState("2026-10-09")
  const [schedTime, setSchedTime] = useState("07:00")

  const templates = [
    { title: "Pickup Reminder", text: "EcoRoute Reminder: Tomorrow is waste collection day in your sector. Please place bins outside before 07:00." },
    { title: "Overdue Notice", text: "EcoRoute Alert: Your waste collection invoice is overdue. Pay via MTN MoMo (*182*8*1# code 154829) to avoid service disruption." },
    { title: "Route Delay Notice", text: "EcoRoute Bulletin: Collection truck on your route is experiencing minor delays due to road maintenance. Expect arrival within 45 mins." },
    { title: "Landfill Closure Notice", text: "Notice to Fleet: Nduba Landfill scale 2 undergoing brief inspection. Direct incoming trucks to weighbridge 1." },
  ]

  const handleApplyTemplate = (tmpl: typeof templates[number]) => {
    setMessageTitle(tmpl.title)
    setMessageText(tmpl.text)
  }

  const handleSendOrSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    if (dispatchMode === "now") {
      sendMessage({
        audience: recipientGroup === "One customer" ? "Customer" : "Location customers",
        target: targetName,
        title: messageTitle || "EcoRoute SMS Alert",
        text: messageText,
        channel: "SMS",
      })
      setToast(`SMS broadcast dispatched to ${targetName} via Pindo Gateway!`)
    } else {
      scheduleSms({
        recipientGroup,
        targetName,
        scheduledDate: schedDate,
        scheduledTime: schedTime,
        messageText,
        recipientsCount: recipientGroup === "All customers" ? 671 : recipientGroup === "All overdue" ? 47 : recipientGroup === "All drivers" ? 8 : 186,
        createdBy: "Diane Mukamana",
      })
      setToast(`SMS broadcast scheduled for ${schedDate} at ${schedTime}!`)
    }

    setModalOpen(false)
    setMessageText("")
    setTimeout(() => setToast(null), 4000)
  }

  const smsList = messages.filter((m) => m.channel === "SMS" || m.channel === "App + SMS")

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

      {/* Header and KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Dispatched</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{metrics.smsSummary.sent}</p>
          <p className="mt-1 text-xs text-slate-500">Today across Kigali users</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivered Successfully</p>
          <p className="mt-2 text-2xl font-black text-emerald-700">{metrics.smsSummary.delivered}</p>
          <p className="mt-1 text-xs text-slate-500">98.0% carrier delivery rate</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Failed / Retrying</p>
          <p className="mt-2 text-2xl font-black text-rose-700">{metrics.smsSummary.failed}</p>
          <p className="mt-1 text-xs text-slate-500">Auto-retry in progress</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Queue</p>
          <p className="mt-2 text-2xl font-black text-blue-700">{scheduledSms.filter((s) => s.status === "Scheduled").length}</p>
          <p className="mt-1 text-xs text-slate-500">Pending automated release</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("log")}
            className={`rounded-lg px-4 py-2 transition ${
              activeTab === "log" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dispatched SMS Log ({smsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scheduled")}
            className={`rounded-lg px-4 py-2 transition ${
              activeTab === "scheduled" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Scheduled Broadcasts ({scheduledSms.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
        >
          <Send size={14} /> Send / Schedule SMS
        </button>
      </div>

      {/* TAB 1: DISPATCHED SMS LOG */}
      {activeTab === "log" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-xs">
              <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Title & Message Text</th>
                  <th className="px-4 py-3.5">Audience Target</th>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Channel</th>
                  <th className="px-4 py-3.5 text-right">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {smsList.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 max-w-md">
                      <div className="font-bold text-slate-900">{msg.title}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{msg.text}</p>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {msg.audience || "All customers"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{msg.time}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {msg.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <Check size={11} /> Delivered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULED SMS QUEUE */}
      {activeTab === "scheduled" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs">
              <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Broadcast ID & Group</th>
                  <th className="px-4 py-3.5">Message Content</th>
                  <th className="px-4 py-3.5">Scheduled Release</th>
                  <th className="px-4 py-3.5">Recipients</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduledSms.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {s.targetName}
                      <div className="text-[11px] text-slate-400 font-normal">{s.id} · {s.recipientGroup}</div>
                    </td>
                    <td className="px-4 py-3.5 max-w-sm">
                      <p className="text-[11px] text-slate-700 leading-relaxed">{s.messageText}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {s.scheduledDate} at {s.scheduledTime}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {s.recipientsCount} recipients
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          s.status === "Scheduled"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : s.status === "Cancelled"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {s.status === "Scheduled" && (
                        <button
                          type="button"
                          onClick={() => {
                            cancelScheduledSms(s.id)
                            setToast(`Scheduled SMS ${s.id} cancelled.`)
                            setTimeout(() => setToast(null), 4000)
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <X size={12} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Send / Schedule SMS Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Compose SMS Communication"
        subtitle="Broadcast via official SMS gateway (Pindo RW / Sender ID: ECOROUTE)."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSendOrSchedule} className="space-y-4">
          {/* Dispatch timing mode toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDispatchMode("now")}
              className={`flex-1 rounded-lg py-2 transition ${
                dispatchMode === "now" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600"
              }`}
            >
              Send Immediately
            </button>
            <button
              type="button"
              onClick={() => setDispatchMode("later")}
              className={`flex-1 rounded-lg py-2 transition ${
                dispatchMode === "later" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600"
              }`}
            >
              Schedule for Later
            </button>
          </div>

          {dispatchMode === "later" && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Schedule Date *</label>
                <input
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Schedule Time *</label>
                <input
                  type="time"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>
            </div>
          )}

          {/* Recipient Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Group *</label>
              <select
                value={recipientGroup}
                onChange={(e) => {
                  const grp = e.target.value as ScheduledSms["recipientGroup"]
                  setRecipientGroup(grp)
                  if (grp === "Zone") setTargetName("Kimironko Zone Customers")
                  else if (grp === "Route") setTargetName("Route KG 18 Kimironko")
                  else if (grp === "All overdue") setTargetName("47 Overdue Accounts")
                  else if (grp === "All drivers") setTargetName("All 8 Fleet Drivers")
                  else if (grp === "All customers") setTargetName("All 671 Registered Customers")
                  else setTargetName("Jean Romeo (CUS-2048)")
                }}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
              >
                <option value="One customer">One customer</option>
                <option value="Zone">By Zone</option>
                <option value="Route">By Route</option>
                <option value="All overdue">All Overdue Accounts (47)</option>
                <option value="All drivers">All Drivers (8)</option>
                <option value="All customers">All Customers (671)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Name</label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Quick template chips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Insert Message Template
            </label>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.title}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300"
                >
                  {tmpl.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title and Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Title</label>
            <input
              type="text"
              value={messageTitle}
              onChange={(e) => setMessageTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>SMS Body *</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {messageText.length} chars · {Math.ceil(messageText.length / 160) || 1} SMS part(s)
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Type message text here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-emerald-600"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              {dispatchMode === "now" ? "Send Now" : "Schedule Broadcast"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
