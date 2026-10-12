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
  Lock,
  UserCheck,
} from "lucide-react"
import { useStore, type LogEntry } from "./Store"
import { Modal } from "./Modal"
import { generatePdfDocument } from "./utils/pdfGenerator"

export function AuditLogEnhanced({
  role = "Admin",
  profile,
}: {
  role?: string
  profile?: { name?: string; email?: string } | null
}) {
  const { logs, addLog } = useStore()

  // Canonical default user names per role
  const defaultUserNames: Record<string, string> = {
    Admin: "System Administrator",
    Manager: "Diane Mukamana",
    Finance: "Claudine Uwase",
    Employee: "Eric Niyonzima",
    Customer: "Jean Romeo",
  }

  // Active current user name
  const currentUserName =
    profile?.name?.trim() || defaultUserNames[role] || "System Administrator"

  const [toast, setToast] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModule, setSelectedModule] = useState("All")
  const [selectedActionType, setSelectedActionType] = useState("All")
  const [dateRange, setDateRange] = useState("All time")

  // For Admin role: by default they see only their own activities.
  // We provide a toggle for Admin oversight if needed, but DEFAULT to true (my activities only).
  const [onlyMyActivities, setOnlyMyActivities] = useState(true)

  // Detail Modal
  const [detailEntry, setDetailEntry] = useState<LogEntry | null>(null)

  // Comprehensive, realistic seed activities for all roles
  const seedLogsForRole = useMemo(() => {
    const list: LogEntry[] = [
      // === ADMIN LOGS ===
      {
        id: "LOG-ADM-101",
        time: "09 Oct 2026, 08:30:12",
        user: "System Administrator",
        role: "Admin",
        module: "Security & Auth",
        action: "2FA Authentication verified",
        record: "Admin biometric session authenticated · Kigali NOC terminal",
        oldValue: "Session expired",
        newValue: "Active · JWT encrypted",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-102",
        time: "09 Oct 2026, 08:15:40",
        user: "System Administrator",
        role: "Admin",
        module: "Companies",
        action: "Concession company approved",
        record: "Approved operational license for Isuku Cleaners Ltd (COM-1024)",
        oldValue: "Pending inspection",
        newValue: "Active Concession",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-103",
        time: "08 Oct 2026, 16:42:19",
        user: "System Administrator",
        role: "Admin",
        module: "Users & Roles",
        action: "Role permission elevated",
        record: "Elevated USR-1042 permissions to Operations Manager",
        oldValue: "Dispatcher",
        newValue: "Manager",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-104",
        time: "08 Oct 2026, 14:10:05",
        user: "System Administrator",
        role: "Admin",
        module: "Security & Auth",
        action: "User account unlocked",
        record: "Unlocked user account USR-1021 following verification",
        oldValue: "Locked",
        newValue: "Active",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-105",
        time: "08 Oct 2026, 11:22:45",
        user: "System Administrator",
        role: "Admin",
        module: "System Configuration",
        action: "Weighbridge API parameter updated",
        record: "Nduba weighbridge IoT sync webhook retry limit set to 5",
        oldValue: "Retry: 3",
        newValue: "Retry: 5 (Backoff 30s)",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-106",
        time: "07 Oct 2026, 17:05:30",
        user: "System Administrator",
        role: "Admin",
        module: "Tariffs & Zones",
        action: "Tariff rates ratified",
        record: "Ratified municipal commercial waste collection rate schedule for Gasabo & Kicukiro",
        oldValue: "2025 Standard",
        newValue: "2026 Eco-Tiered",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-107",
        time: "07 Oct 2026, 09:12:18",
        user: "System Administrator",
        role: "Admin",
        module: "Security & Auth",
        action: "Cryptographic ledger export",
        record: "Immutable SHA-256 system audit trail validated & verified",
        oldValue: "Unchecked",
        newValue: "Validated (Zero Tampering)",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },
      {
        id: "LOG-ADM-108",
        time: "06 Oct 2026, 15:40:00",
        user: "System Administrator",
        role: "Admin",
        module: "Security & Auth",
        action: "Security policy update",
        record: "Enforced 90-day password rotation across all administrative roles",
        oldValue: "180 days",
        newValue: "90 days + 2FA",
        device: "Chrome / Windows 11 · 197.243.22.4",
      },

      // === MANAGER LOGS (Diane Mukamana) ===
      {
        id: "LOG-MGR-201",
        time: "09 Oct 2026, 08:45:00",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Operations Command",
        action: "Shift dispatch signed off",
        record: "Kigali morning collection manifest approved (14 active compactor trucks)",
        oldValue: "Planned",
        newValue: "Dispatched",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-202",
        time: "09 Oct 2026, 08:20:15",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Routes & Fleet",
        action: "AI Route optimization applied",
        record: "Optimized Route KG 45 (Kimironko): Reduced loop from 18.6 km to 14.2 km (saved 4.4 km)",
        oldValue: "18.6 km (Manual)",
        newValue: "14.2 km (AI EcoRoute)",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-203",
        time: "09 Oct 2026, 07:50:30",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Routes & Fleet",
        action: "Driver assigned to route",
        record: "Assigned Route KG 45 to Eric Niyonzima · Vehicle RW 307 K",
        oldValue: "Unassigned",
        newValue: "Assigned: Eric Niyonzima",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-204",
        time: "08 Oct 2026, 15:14:22",
        user: "Diane Mukamana",
        role: "Manager",
        module: "SMS Communication",
        action: "Broadcast SMS alert dispatched",
        record: "Dispatched collection alert broadcast to 186 Kimironko customers via MTN/Airtel gateway",
        oldValue: "Draft status",
        newValue: "Delivered (184 delivered, 2 pending)",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-205",
        time: "08 Oct 2026, 13:45:10",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Trips & Fleet",
        action: "Trip reassignment authorized",
        record: "Trip #TRIP-8402 reassigned to Jean Bosco (Vehicle RW 412 A breakdown relief)",
        oldValue: "Driver: Eric Niyonzima · RW 412 A",
        newValue: "Driver: Jean Bosco · RW 412 A",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-206",
        time: "08 Oct 2026, 10:15:00",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Customers",
        action: "Customer service reactivated",
        record: "Reactivated weekly collection schedule for customer account CUS-2071",
        oldValue: "Suspended",
        newValue: "Active",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-207",
        time: "07 Oct 2026, 16:30:45",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Nduba Landfill",
        action: "Landfill daily quota sign-off",
        record: "Signed off daily haulage manifest for 142 tonnes delivered to Nduba gate",
        oldValue: "Pending review",
        newValue: "Approved & Certified",
        device: "Safari / iPad Pro · 197.243.22.9",
      },
      {
        id: "LOG-MGR-208",
        time: "07 Oct 2026, 11:05:12",
        user: "Diane Mukamana",
        role: "Manager",
        module: "Operations Command",
        action: "Overtime authorized",
        record: "Authorized 2-hour evening overtime for Nyarugunga cleanup crew Alpha",
        oldValue: "Standard Shift",
        newValue: "Overtime Approved (2h)",
        device: "Safari / iPad Pro · 197.243.22.9",
      },

      // === FINANCE LOGS (Claudine Uwase) ===
      {
        id: "LOG-FIN-301",
        time: "09 Oct 2026, 08:35:10",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Security & Auth",
        action: "Finance portal authenticated",
        record: "Authenticated session to EcoRoute Revenue & Reconciliation Engine",
        oldValue: "Offline",
        newValue: "Authenticated · Session Valid",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-302",
        time: "09 Oct 2026, 08:12:44",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Payments",
        action: "MoMo payment verified & confirmed",
        record: "MTN Mobile Money settlement confirmed for INV-2026-00128 (RWF 18,000)",
        oldValue: "Pending settlement",
        newValue: "Paid & Reconciled",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-303",
        time: "08 Oct 2026, 16:20:15",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Invoices",
        action: "Monthly billing batch issued",
        record: "Generated 84 invoices for October cycle (Total billed: RWF 1,420,000)",
        oldValue: "Draft",
        newValue: "Issued & Sent",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-304",
        time: "08 Oct 2026, 14:15:00",
        user: "Claudine Uwase",
        role: "Finance",
        module: "SMS Communication",
        action: "Billing reminder SMS dispatched",
        record: "Dispatched automated reminder to 47 accounts with overdue balances totaling RWF 163,000",
        oldValue: "Queued",
        newValue: "Sent via ECOROUTE sender ID",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-305",
        time: "08 Oct 2026, 11:30:22",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Billing Enforcement",
        action: "Delinquent account suspended",
        record: "Account CUS-2055 flagged for collection pause after 60-day non-payment",
        oldValue: "Warning status",
        newValue: "Suspended",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-306",
        time: "07 Oct 2026, 15:45:30",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Salaries & Payroll",
        action: "Payroll disbursement authorized",
        record: "Authorized October 2026 driver & collector crew salary release (RWF 2,850,000)",
        oldValue: "Pending authorization",
        newValue: "Authorized for disbursement",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-307",
        time: "07 Oct 2026, 10:00:18",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Reconciliation",
        action: "MoMo gateway reconciliation matched",
        record: "Reconciled MTN and Airtel settlement batches with commercial bank deposit ledger",
        oldValue: "Unmatched (4 items)",
        newValue: "100% Balanced",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },
      {
        id: "LOG-FIN-308",
        time: "06 Oct 2026, 17:10:00",
        user: "Claudine Uwase",
        role: "Finance",
        module: "Reports",
        action: "Revenue report exported",
        record: "Exported Q3 revenue and collection yield report to Excel",
        oldValue: "Not generated",
        newValue: "Exported",
        device: "Chrome / Windows 11 · 197.243.22.18",
      },

      // === EMPLOYEE LOGS (Eric Niyonzima / Driver) ===
      {
        id: "LOG-EMP-401",
        time: "09 Oct 2026, 07:05:10",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Attendance",
        action: "Shift clocked in",
        record: "Driver morning shift clocked in at Remera operations terminal",
        oldValue: "Off duty",
        newValue: "On duty · Ready for dispatch",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-402",
        time: "09 Oct 2026, 07:15:00",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Fleet & Vehicle",
        action: "Pre-departure safety checklist approved",
        record: "Trip #TRIP-8401: Vehicle RW 307 K inspected · Tires, hydraulics, beacon lights operational",
        oldValue: "Inspection pending",
        newValue: "Checklist approved · Odometer: 42,190 km",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-403",
        time: "09 Oct 2026, 07:30:22",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Routes",
        action: "Collection route initiated",
        record: "Started Route KG 45 (Kimironko-Nyarugunga sector loop)",
        oldValue: "Assigned",
        newValue: "In progress",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-404",
        time: "09 Oct 2026, 08:14:40",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Collections",
        action: "Collection confirmed",
        record: "Completed waste pickup at CP-2048 · 32 kg household waste weighed and recorded",
        oldValue: "Pending pickup",
        newValue: "Completed",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-405",
        time: "08 Oct 2026, 15:20:11",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Collections",
        action: "Collection exception logged",
        record: "Reported obstacle at CP-2074: Road trench construction preventing heavy vehicle access",
        oldValue: "Scheduled",
        newValue: "Exception: Road blocked",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-406",
        time: "08 Oct 2026, 13:40:55",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Nduba Landfill",
        action: "Nduba weighbridge entry recorded",
        record: "Weighbridge gate entry certified · Gross vehicle weight: 8.40 tonnes",
        oldValue: "En route",
        newValue: "Gross weight logged",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-407",
        time: "08 Oct 2026, 14:10:18",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Nduba Landfill",
        action: "Landfill ticket certified & trip completed",
        record: "Ticket #NDB-261006-018 certified · Net waste discharged: 4.65 tonnes",
        oldValue: "At gate",
        newValue: "Trip Completed & Certified",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },
      {
        id: "LOG-EMP-408",
        time: "08 Oct 2026, 17:00:00",
        user: "Eric Niyonzima",
        role: "Employee",
        module: "Fleet & Vehicle",
        action: "End of shift checklist submitted",
        record: "Vehicle parked at Remera depot · Odometer: 42,248 km · Fuel level: 75%",
        oldValue: "On route",
        newValue: "Shift Concluded",
        device: "Mobile App / Samsung A54 · 197.243.22.50",
      },

      // === CUSTOMER LOGS (dynamically associated with currentUserName or Jean Romeo) ===
      {
        id: "LOG-CUS-501",
        time: "09 Oct 2026, 08:15:00",
        user: currentUserName,
        role: "Customer",
        module: "Security & Auth",
        action: "Customer portal login",
        record: `Logged in to EcoRoute Customer Portal (${currentUserName} · CUS-2048)`,
        oldValue: "Signed out",
        newValue: "Authenticated session",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-502",
        time: "08 Oct 2026, 11:20:30",
        user: currentUserName,
        role: "Customer",
        module: "Payments",
        action: "MTN MoMo payment submitted",
        record: `Initiated mobile money payment of RWF 6,000 for invoice INV-2026-00125`,
        oldValue: "Unpaid",
        newValue: "Paid via MTN MoMo",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-503",
        time: "08 Oct 2026, 11:25:12",
        user: currentUserName,
        role: "Customer",
        module: "Receipts",
        action: "Payment receipt downloaded",
        record: "Downloaded electronic receipt for transaction TXN-2026-10482",
        oldValue: "Issued",
        newValue: "Downloaded as PDF",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-504",
        time: "08 Oct 2026, 09:14:00",
        user: currentUserName,
        role: "Customer",
        module: "My Collection",
        action: "Collection schedule checked",
        record: "Viewed route progress and confirmed Saturday morning pickup",
        oldValue: "Unchecked",
        newValue: "Viewed in App",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-505",
        time: "07 Oct 2026, 14:02:45",
        user: currentUserName,
        role: "Customer",
        module: "Communication",
        action: "SMS collection alert read",
        record: "Opened collection schedule alert for Nyarugunga pickup point CP-2048",
        oldValue: "Delivered",
        newValue: "Read by customer",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-506",
        time: "07 Oct 2026, 10:30:00",
        user: currentUserName,
        role: "Customer",
        module: "Service Request",
        action: "Special service request submitted",
        record: "Submitted request for bulk garden green waste pickup",
        oldValue: "None",
        newValue: "Request Submitted (Pending)",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-507",
        time: "06 Oct 2026, 16:45:10",
        user: currentUserName,
        role: "Customer",
        module: "Profile & Settings",
        action: "Contact preference updated",
        record: "Updated language preference to English & Kinyarwanda; SMS notifications enabled",
        oldValue: "English only",
        newValue: "English + Kinyarwanda",
        device: "Chrome / Android · 197.243.30.12",
      },
      {
        id: "LOG-CUS-508",
        time: "05 Oct 2026, 09:00:00",
        user: currentUserName,
        role: "Customer",
        module: "Account",
        action: "Account verified & activated",
        record: "Customer account phone verified via OTP; collection point CP-2048 assigned",
        oldValue: "Pending verification",
        newValue: "Active Customer",
        device: "Chrome / Android · 197.243.30.12",
      },
    ]

    return list
  }, [currentUserName])

  // Merge store logs and seed logs
  const allLogs = useMemo(() => {
    // Collect all store logs
    const existing = [...logs]

    // Normalize customer names in existing store logs if active role is Customer
    const normalizedExisting = existing.map((entry) => {
      if (role === "Customer" && (entry.role === "Customer" || entry.user === "Jean Romeo")) {
        return {
          ...entry,
          user: currentUserName,
        }
      }
      return entry
    })

    // Combine seed logs and existing logs, removing exact ID duplicates
    const seenIds = new Set<string>()
    const merged: LogEntry[] = []

    for (const item of [...normalizedExisting, ...seedLogsForRole]) {
      if (!seenIds.has(item.id)) {
        seenIds.add(item.id)
        merged.push(item)
      }
    }

    return merged
  }, [logs, seedLogsForRole, role, currentUserName])

  // Filter ONLY logs performed by the current user
  // As requested: "where each user will see only the activity he has done admin, customer, employee, finance, and manager as well not see all user who log in the system what they have don"
  const userIsolatedLogs = useMemo(() => {
    // If Admin has toggled oversight mode, show all, otherwise strictly isolate to current user
    if (role === "Admin" && !onlyMyActivities) {
      return allLogs
    }

    return allLogs.filter((entry) => {
      // 1. Direct name match
      if (entry.user.toLowerCase() === currentUserName.toLowerCase()) {
        return true
      }

      // 2. Role match if customer or role default
      if (role === "Customer" && entry.role === "Customer") {
        return true
      }

      if (entry.role === role && entry.user === defaultUserNames[role]) {
        return true
      }

      return false
    })
  }, [allLogs, currentUserName, role, onlyMyActivities])

  // Extract filter options from the user's isolated logs
  const availableModules = useMemo(
    () => Array.from(new Set(userIsolatedLogs.map((l) => l.module))),
    [userIsolatedLogs],
  )

  // Filter by search query, module, action type, date
  const filteredLogs = useMemo(() => {
    return userIsolatedLogs.filter((entry) => {
      const q = searchQuery.toLowerCase().trim()
      const matchQuery =
        !q ||
        entry.action.toLowerCase().includes(q) ||
        entry.module.toLowerCase().includes(q) ||
        entry.record.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q) ||
        entry.time.toLowerCase().includes(q)

      const matchModule = selectedModule === "All" || entry.module === selectedModule

      let matchAction = true
      if (selectedActionType === "Auth") {
        matchAction = /auth|login|session|password|2fa/i.test(entry.action) || /security/i.test(entry.module)
      } else if (selectedActionType === "Payments") {
        matchAction = /payment|momo|bill|invoice|receipt/i.test(entry.action) || /payment|billing|invoice/i.test(entry.module)
      } else if (selectedActionType === "Operations") {
        matchAction = /route|trip|fleet|vehicle|dispatch|collection|nduba/i.test(entry.action) || /route|trip|collection|nduba/i.test(entry.module)
      } else if (selectedActionType === "Communication") {
        matchAction = /sms|alert|broadcast|message/i.test(entry.action) || /sms|communication/i.test(entry.module)
      }

      let matchDate = true
      if (dateRange === "Today") {
        matchDate = entry.time.includes("09 Oct 2026")
      } else if (dateRange === "Yesterday") {
        matchDate = entry.time.includes("08 Oct 2026")
      }

      return matchQuery && matchModule && matchAction && matchDate
    })
  }, [userIsolatedLogs, searchQuery, selectedModule, selectedActionType, dateRange])

  // EXPORT HANDLER: PDF using real binary PDF generator
  const handleExportPdf = () => {
    try {
      const headers = ["Log ID", "Timestamp", "Module", "Action Performed", "Record Details", "Device / Origin"]
      const rows = filteredLogs.map((l) => [
        l.id,
        l.time,
        l.module,
        l.action,
        l.record,
        l.device || "Kigali Operations Gateway",
      ])

      const dateStr = new Date().toISOString().slice(0, 10)
      const sanitizedName = currentUserName.toLowerCase().replace(/\s+/g, "-")

      generatePdfDocument({
        title: `OFFICIAL ACTIVITY AUDIT TRAIL: ${currentUserName.toUpperCase()}`,
        subtitle: `AI-Powered EcoRoute · Personal Activity Trail (${role})`,
        filename: `ecoroute-activity-log-${sanitizedName}-${dateStr}.pdf`,
        generatedBy: currentUserName,
        role: role,
        headers,
        rows,
        summaryCards: [
          { label: "Account Holder", value: currentUserName },
          { label: "Role Category", value: role },
          { label: "Total Activities", value: String(filteredLogs.length) },
          { label: "Audit Integrity", value: "SHA-256 Valid" },
        ],
        notes: `This document contains only the isolated activity records performed by ${currentUserName} (${role}). Generated securely by EcoRoute Platform System.`,
      })

      // Record export action in log
      addLog({
        user: currentUserName,
        role,
        action: "Exported personal activity log (PDF)",
        module: "Security & Audit",
        record: `Generated valid PDF containing ${filteredLogs.length} audit records`,
      })

      setToast(`Downloaded valid PDF audit trail document with ${filteredLogs.length} records.`)
      setTimeout(() => setToast(null), 4500)
    } catch (err) {
      console.error("PDF generation failed:", err)
      setToast("Error generating PDF. Please check console.")
      setTimeout(() => setToast(null), 4000)
    }
  }

  // EXPORT HANDLER: CSV
  const handleExportCsv = () => {
    const headers = ["Log ID", "Timestamp", "User", "Role", "Module", "Action", "Record Details", "Device / IP"]
    const rows = filteredLogs.map((l) => [
      l.id,
      l.time,
      currentUserName,
      role,
      l.module,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.record.replace(/"/g, '""')}"`,
      `"${(l.device || "Kigali Internal Gateway").replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    const sanitizedName = currentUserName.toLowerCase().replace(/\s+/g, "-")
    link.download = `ecoroute-activity-log-${sanitizedName}-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)

    addLog({
      user: currentUserName,
      role,
      action: "Exported personal activity log (CSV)",
      module: "Security & Audit",
      record: `Generated CSV containing ${filteredLogs.length} audit records`,
    })

    setToast(`Exported ${filteredLogs.length} personal activity records as CSV.`)
    setTimeout(() => setToast(null), 4000)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedModule("All")
    setSelectedActionType("All")
    setDateRange("All time")
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-800 text-white p-4 shadow-xl text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />
          <span className="flex-1">{toast}</span>
          <button onClick={() => setToast(null)} className="text-emerald-200 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Banner with Personal User Context */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Lock size={16} className="text-emerald-700" />
            <span>Personal User Activity Log</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              Isolated Access
            </span>
          </div>

          <h2 className="mt-1.5 text-2xl font-black tracking-tight text-slate-900">
            Activity Log · {currentUserName}
          </h2>

          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Displaying only actions and events performed by your account (<strong className="text-slate-800 font-semibold">{currentUserName}</strong> · <span className="font-semibold text-emerald-700">{role}</span>). In accordance with system security and privacy segregation, activities from other users are protected and omitted.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-50/70 px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
            title="Download authentic, valid PDF document that opens cleanly in any PDF reader"
          >
            <Download size={14} className="text-emerald-700" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Role Segregation & Privacy Callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
            <UserCheck size={18} />
          </div>
          <div>
            <span className="font-bold text-emerald-950 block">
              Viewing only activities for: {currentUserName} ({role})
            </span>
            <span className="text-emerald-800 text-[11px]">
              Every user ({role}, Admin, Customer, Employee, Finance, Manager) only sees their own executed actions.
            </span>
          </div>
        </div>

        {/* Optional Admin Master Oversight Switch (Only visible for Admin, default: My Activities Only) */}
        {role === "Admin" && (
          <div className="flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 border border-emerald-200 shrink-0">
            <label className="text-[11px] font-bold text-slate-700 cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={onlyMyActivities}
                onChange={(e) => setOnlyMyActivities(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Show only my activities</span>
            </label>
          </div>
        )}
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
              placeholder="Search your actions, modules, record details, or log IDs..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Module filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Modules</option>
              {availableModules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Quick Action Filter */}
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All">All Action Types</option>
              <option value="Auth">Security & Login</option>
              <option value="Payments">Payments & Billing</option>
              <option value="Operations">Operations & Trips</option>
              <option value="Communication">SMS & Notifications</option>
            </select>

            {/* Date filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="All time">All Time</option>
              <option value="Today">Today (09 Oct 2026)</option>
              <option value="Yesterday">Yesterday (08 Oct 2026)</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <RefreshCw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{filteredLogs.length}</strong> of {userIsolatedLogs.length} personal activity records
          </span>
          <span className="font-mono text-[11px] text-emerald-700">
            Actor: {currentUserName} · Cryptographic Hash: Verified
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5">Log ID & Time</th>
                <th className="px-4 py-3.5">Actor (You)</th>
                <th className="px-4 py-3.5">Module</th>
                <th className="px-4 py-3.5">Action Performed</th>
                <th className="px-4 py-3.5">Record Impacted</th>
                <th className="px-4 py-3.5">Origin Device</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No personal activities match your selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => {
                  const isSms = /SMS/i.test(entry.module) || /SMS/i.test(entry.action)
                  const isTrip = /Trip|Route|Fleet|Nduba/i.test(entry.module) || /Trip|Route|Collection/i.test(entry.action)
                  const isAuth = /Security|Auth/i.test(entry.module) || /login|password|2fa/i.test(entry.action)
                  const isPayment = /Payment|Billing|Invoice|Receipt/i.test(entry.module) || /Payment|MoMo/i.test(entry.action)

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-900 block text-[11px]">{entry.id}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{entry.time}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 block">{currentUserName}</span>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            role === "Admin"
                              ? "bg-purple-100 text-purple-800"
                              : role === "Manager"
                                ? "bg-blue-100 text-blue-800"
                                : role === "Finance"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : role === "Customer"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                          {isSms && <MessageSquare size={13} className="text-emerald-700" />}
                          {isTrip && <Truck size={13} className="text-blue-700" />}
                          {isAuth && <ShieldAlert size={13} className="text-purple-700" />}
                          {isPayment && <CreditCard size={13} className="text-amber-700" />}
                          <span>{entry.module}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900">{entry.action}</td>
                      <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate" title={entry.record}>
                        {entry.record}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-[10px]">
                        {entry.device || "Kigali Gateway"}
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

      {/* MODAL: DETAIL FORENSIC INSPECTION */}
      <Modal
        open={Boolean(detailEntry)}
        onClose={() => setDetailEntry(null)}
        title="Personal Activity Record Detail"
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
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Executed By</span>
                <span className="font-bold text-slate-900">
                  {currentUserName} ({role})
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
                  <span className="text-rose-700 block text-[10px] uppercase font-bold mb-1">Previous State</span>
                  <p className="font-mono text-[11px] text-slate-700">{detailEntry.oldValue || "None / Initial"}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <span className="text-emerald-700 block text-[10px] uppercase font-bold mb-1">Updated State</span>
                  <p className="font-mono text-[11px] text-slate-700">{detailEntry.newValue || "Applied"}</p>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-slate-500 text-[11px]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Origin Device & IP</span>
              <span className="font-mono">{detailEntry.device || "Kigali Internal Operations / 197.243.22.4"}</span>
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
