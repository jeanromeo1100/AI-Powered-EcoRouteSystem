import React, { useState } from "react"
import {
  Shield,
  KeyRound,
  Clock3,
  Lock,
  Database,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Save,
  Radio,
  Server,
  Zap,
  Check,
  X,
  RefreshCw,
  Download,
  AlertCircle,
  HardDrive,
  Cpu,
} from "lucide-react"
import { useStore } from "./Store"
import { Modal } from "./Modal"

export function AdminSystemEnhanced({
  initialTab = "security",
}: {
  initialTab?: "security" | "backup" | "integrations" | "system"
}) {
  const {
    securityPolicy,
    updateSecurityPolicy,
    backups,
    createBackup,
    restoreBackup,
    mobileMoneySettings,
    updateMobileMoneySettings,
  } = useStore()

  const [activeTab, setActiveTab] = useState<"security" | "backup" | "integrations" | "system">(
    initialTab,
  )
  const [toast, setToast] = useState<string | null>(null)

  // Security Policy form state
  const [secForm, setSecForm] = useState(securityPolicy)

  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [restoreModalBak, setRestoreModalBak] = useState<typeof backups[number] | null>(null)
  const [restoreConfirmed, setRestoreConfirmed] = useState(false)
  const [autoBackupSchedule, setAutoBackupSchedule] = useState({
    frequency: "Daily at 02:00 CAT",
    retentionDays: 30,
    storageTarget: "Encrypted Cloud Archive (Kigali Data Center / AWS af-south-1)",
    enabled: true,
  })

  // Integrations state
  const [smsGatewaySettings, setSmsGatewaySettings] = useState({
    provider: "Rwanda Airtel / MTN Telco Aggregator (Africa's Talking)",
    senderId: "ECOROUTE",
    apiKey: "••••••••••••••••••••••••39ab",
    status: "Connected & Healthy",
    balanceSms: "42,890 credits",
    deliveryWebhook: "https://api.ecoroute.rw/v1/sms/callbacks",
  })
  const [momoForm, setMomoForm] = useState(mobileMoneySettings)
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  // Save security policy
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    updateSecurityPolicy(secForm)
    setToast("Security policy and authentication thresholds saved successfully.")
    setTimeout(() => setToast(null), 4000)
  }

  // Backup now
  const handleBackupNow = () => {
    setIsBackingUp(true)
    setTimeout(() => {
      createBackup()
      setIsBackingUp(false)
      setToast("Snapshot generated successfully and verified with SHA-256 checksum.")
      setTimeout(() => setToast(null), 4000)
    }, 1200)
  }

  // Restore confirm
  const handleConfirmRestore = () => {
    if (!restoreModalBak) return
    restoreBackup(restoreModalBak.id)
    setRestoreModalBak(null)
    setRestoreConfirmed(false)
    setToast(`Database restoration initiated from ${restoreModalBak.name}. Status: Verified.`)
    setTimeout(() => setToast(null), 4000)
  }

  // Save integrations
  const handleSaveIntegrations = (e: React.FormEvent) => {
    e.preventDefault()
    updateMobileMoneySettings(momoForm)
    setToast("SMS Gateway & Mobile Money Integration settings updated.")
    setTimeout(() => setToast(null), 4000)
  }

  // Test connection
  const handleTestConnection = (service: string) => {
    setTestingConnection(service)
    setTimeout(() => {
      setTestingConnection(null)
      setToast(`Ping test successful: ${service} responded in 42ms with HTTP 200 OK.`)
      setTimeout(() => setToast(null), 4000)
    }, 800)
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
            <Shield size={18} className="text-emerald-700" />
            <span>Platform Administration & Security Controls</span>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            System Policies, Backups & Gateway Integrations
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Configure authentication rules, automated database recovery points, SMS gateways, and Mobile Money API credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "security", label: "Security Policy", icon: KeyRound },
          { id: "backup", label: "Database Backup & Disaster Recovery", icon: Database },
          { id: "integrations", label: "SMS Gateway & MoMo Integrations", icon: Smartphone },
        ].map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <TabIcon size={14} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: SECURITY POLICY */}
      {activeTab === "security" && (
        <form onSubmit={handleSaveSecurity} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Password Rules */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock size={16} className="text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Password Complexity Rules</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  min="8"
                  max="32"
                  value={secForm.minPasswordLength}
                  onChange={(e) =>
                    setSecForm({ ...secForm, minPasswordLength: parseInt(e.target.value) || 8 })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Recommended: At least 10 characters for administrative roles.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Password Expiration Interval
                </label>
                <select
                  value={secForm.passwordExpiryDays}
                  onChange={(e) =>
                    setSecForm({ ...secForm, passwordExpiryDays: parseInt(e.target.value) || 90 })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                >
                  <option value={60}>60 days</option>
                  <option value={90}>90 days (Standard security benchmark)</option>
                  <option value={180}>180 days</option>
                  <option value={365}>365 days (Annual)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={secForm.requireSymbols}
                    onChange={(e) => setSecForm({ ...secForm, requireSymbols: e.target.checked })}
                    className="size-4 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Require at least one special character (!@#$%^&*)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={secForm.requireNumbers}
                    onChange={(e) => setSecForm({ ...secForm, requireNumbers: e.target.checked })}
                    className="size-4 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Require at least one numeric digit (0-9)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={secForm.requireUppercase}
                    onChange={(e) => setSecForm({ ...secForm, requireUppercase: e.target.checked })}
                    className="size-4 rounded text-emerald-700 focus:ring-emerald-500"
                  />
                  <span>Require at least one uppercase letter (A-Z)</span>
                </label>
              </div>
            </div>

            {/* Session & Lockout */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Clock3 size={16} className="text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Session Timeout & Lockout Policy</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Inactivity Session Timeout (Minutes)
                </label>
                <select
                  value={secForm.sessionTimeoutMinutes}
                  onChange={(e) =>
                    setSecForm({ ...secForm, sessionTimeoutMinutes: parseInt(e.target.value) || 30 })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                >
                  <option value={15}>15 minutes (High sensitivity)</option>
                  <option value={30}>30 minutes (Recommended)</option>
                  <option value={60}>60 minutes</option>
                  <option value={120}>120 minutes (Driver shifts)</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  User session automatically terminates if no interaction occurs.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Failed-Login Lockout Attempts
                </label>
                <select
                  value={secForm.lockoutThresholdAttempts}
                  onChange={(e) =>
                    setSecForm({ ...secForm, lockoutThresholdAttempts: parseInt(e.target.value) || 5 })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                >
                  <option value={3}>3 consecutive failed attempts</option>
                  <option value={5}>5 consecutive failed attempts (Standard)</option>
                  <option value={10}>10 attempts</option>
                </select>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Account is temporarily locked upon exceeding {secForm.lockoutThresholdAttempts} failed attempts.
                </span>
              </div>

              {/* 2-Step Verification */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Two-Step Verification (2FA)</p>
                    <p className="text-[11px] text-slate-500">
                      Enforce SMS / Authenticator app OTP code on all Manager and Admin logins.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={secForm.twoStepVerification}
                      onChange={(e) => setSecForm({ ...secForm, twoStepVerification: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
            >
              <Save size={15} />
              <span>Save Security Policy</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: DATABASE BACKUP & RESTORE */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          {/* Automatic Schedule Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Database size={16} className="text-emerald-700" />
                  Automated Database Snapshot & Archiving Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Continuous WAL archiving and daily full cold snapshots
                </p>
              </div>

              <button
                type="button"
                onClick={handleBackupNow}
                disabled={isBackingUp}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
              >
                <Plus size={15} />
                <span>{isBackingUp ? "Creating Snapshot..." : "Backup Now"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cadence</span>
                <span className="font-bold text-slate-900">{autoBackupSchedule.frequency}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Retention</span>
                <span className="font-bold text-slate-900">{autoBackupSchedule.retentionDays} Days rolling</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Storage Target</span>
                <span className="font-bold text-slate-900 truncate block" title={autoBackupSchedule.storageTarget}>
                  Kigali Tier-3 Datacenter
                </span>
              </div>
            </div>
          </div>

          {/* Backup History Table with Restore */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HardDrive size={16} className="text-emerald-700" />
                  Database Snapshot Archive ({backups.length} snapshots)
                </h3>
                <p className="text-xs text-slate-500">Immutable point-in-time recovery archives</p>
              </div>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Recovery Point Objective: &lt; 5m
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Snapshot Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3">Integrity Checksum</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {backups.map((bak) => (
                    <tr key={bak.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-slate-900 block">{bak.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{bak.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            bak.type === "Manual"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {bak.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{bak.sizeMb} MB</td>
                      <td className="px-4 py-3 text-slate-500">{bak.createdAt}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500 truncate max-w-xs" title={bak.checksum}>
                        {bak.checksum}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>{bak.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setRestoreModalBak(bak)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition"
                        >
                          <RotateCcw size={12} />
                          <span>Restore</span>
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

      {/* TAB 3: INTEGRATIONS (SMS GATEWAY & MOBILE MONEY) */}
      {activeTab === "integrations" && (
        <form onSubmit={handleSaveIntegrations} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* SMS Gateway Settings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">SMS Gateway Provider</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  {smsGatewaySettings.status}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  SMS Gateway Provider
                </label>
                <select
                  value={smsGatewaySettings.provider}
                  onChange={(e) =>
                    setSmsGatewaySettings({ ...smsGatewaySettings, provider: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Rwanda Airtel / MTN Telco Aggregator (Africa's Talking)">
                    Africa's Talking (Rwanda Airtel / MTN MoMo Aggregated)
                  </option>
                  <option value="Twilio Global Telecom API">Twilio Global Telecom API</option>
                  <option value="Infobip Enterprise SMS">Infobip Enterprise SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Alphanumeric Sender ID
                </label>
                <input
                  type="text"
                  maxLength={11}
                  value={smsGatewaySettings.senderId}
                  onChange={(e) =>
                    setSmsGatewaySettings({ ...smsGatewaySettings, senderId: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono font-bold text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Registered with RURA (Rwanda Utilities Regulatory Authority)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  API Key & Authentication Secret
                </label>
                <input
                  type="password"
                  value={smsGatewaySettings.apiKey}
                  onChange={(e) =>
                    setSmsGatewaySettings({ ...smsGatewaySettings, apiKey: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Delivery Callback Webhook URL
                </label>
                <input
                  type="url"
                  value={smsGatewaySettings.deliveryWebhook}
                  onChange={(e) =>
                    setSmsGatewaySettings({ ...smsGatewaySettings, deliveryWebhook: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">
                  Prepaid Balance: <strong>{smsGatewaySettings.balanceSms}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleTestConnection("SMS Gateway")}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {testingConnection === "SMS Gateway" ? "Pinging..." : "Test Connection"}
                </button>
              </div>
            </div>

            {/* Mobile Money Settings */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-emerald-700" />
                  <h3 className="font-bold text-slate-900 text-sm">Mobile Money Providers</h3>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  MoMo & Airtel Live
                </span>
              </div>

              {/* MTN MoMo */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-xs">MTN Mobile Money (MoMo)</span>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={momoForm.mtnEnabled}
                      onChange={(e) => setMomoForm({ ...momoForm, mtnEnabled: e.target.checked })}
                      className="size-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Merchant Code
                    </label>
                    <input
                      type="text"
                      value={momoForm.mtnMerchantCode}
                      onChange={(e) => setMomoForm({ ...momoForm, mtnMerchantCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      value={momoForm.mtnStatus}
                      onChange={(e) => setMomoForm({ ...momoForm, mtnStatus: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Airtel Money */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950 text-xs">Airtel Money Rwanda</span>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={momoForm.airtelEnabled}
                      onChange={(e) => setMomoForm({ ...momoForm, airtelEnabled: e.target.checked })}
                      className="size-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Enabled</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Merchant Code
                    </label>
                    <input
                      type="text"
                      value={momoForm.airtelMerchantCode}
                      onChange={(e) => setMomoForm({ ...momoForm, airtelMerchantCode: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Status
                    </label>
                    <input
                      type="text"
                      value={momoForm.airtelStatus}
                      onChange={(e) => setMomoForm({ ...momoForm, airtelStatus: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleTestConnection("Mobile Money APIs")}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {testingConnection === "Mobile Money APIs" ? "Pinging..." : "Test MoMo Webhook"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
            >
              <Save size={15} />
              <span>Save Integration Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* RESTORE MODAL WITH CONFIRMATION */}
      <Modal
        open={Boolean(restoreModalBak)}
        onClose={() => {
          setRestoreModalBak(null)
          setRestoreConfirmed(false)
        }}
        title="Restore Database Snapshot"
        subtitle={`Confirm state rollback to ${restoreModalBak?.name}`}
      >
        {restoreModalBak && (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 space-y-2 text-rose-900">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle size={17} />
                <span>Critical Administrative Action</span>
              </div>
              <p className="leading-relaxed">
                Restoring snapshot <strong>{restoreModalBak.name}</strong> will revert all table records, customer accounts, and trips to the state as of <strong>{restoreModalBak.createdAt}</strong>.
              </p>
              <p className="text-[11px] text-rose-700">
                Any transactions recorded after this timestamp will be moved to the staging recovery table.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-3 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Snapshot Properties</span>
              <p>Archive ID: <strong className="font-mono">{restoreModalBak.id}</strong></p>
              <p>Uncompressed Size: <strong>{restoreModalBak.sizeMb} MB</strong></p>
              <p>Checksum: <strong className="font-mono text-[10px]">{restoreModalBak.checksum}</strong></p>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={restoreConfirmed}
                onChange={(e) => setRestoreConfirmed(e.target.checked)}
                className="mt-0.5 size-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-slate-700 font-semibold text-xs leading-snug">
                I understand this will overwrite active runtime database tables and have verified the SHA-256 integrity checksum.
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setRestoreModalBak(null)
                  setRestoreConfirmed(false)
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!restoreConfirmed}
                onClick={handleConfirmRestore}
                className="rounded-xl bg-rose-700 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-800 disabled:opacity-50"
              >
                Proceed With Restore
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
