import React, { useState } from "react"
import {
  UsersRound,
  ShieldCheck,
  UserPlus,
  KeyRound,
  Lock,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Search,
  Eye,
  Edit2,
  Trash2,
  Save,
  Activity,
  Laptop,
  Smartphone,
  RefreshCw,
  X,
} from "lucide-react"
import { useStore, type ActiveSession } from "./Store"
import { Modal } from "./Modal"

export function UsersAndAccessEnhanced() {
  const {
    employees,
    activeSessions,
    permissionMatrix,
    updatePermission,
    savePermissionMatrix,
    terminateSession,
    addLog,
  } = useStore()

  const [activeTab, setActiveTab] = useState<"users" | "permissions" | "sessions" | "access-log">("users")
  const [query, setQuery] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  // Users state
  const [users, setUsers] = useState([
    { id: "USR-1001", name: "System Administrator", email: "admin@ecoroute.rw", role: "Admin", department: "Executive", status: "Active" as const },
    { id: "USR-1002", name: "Diane Mukamana", email: "diane@ecoroute.rw", role: "Manager", department: "Operations Command", status: "Active" as const },
    { id: "USR-1003", name: "Claudine Uwase", email: "claudine@ecoroute.rw", role: "Finance", department: "Finance & Accounts", status: "Active" as const },
    { id: "USR-1004", name: "Eric Niyonzima", email: "eric@ecoroute.rw", role: "Employee", department: "Fleet Operations", status: "Active" as const },
    { id: "USR-1005", name: "Claude Mugenzi", email: "claude@ecoroute.rw", role: "Employee", department: "Fleet Operations", status: "Active" as const },
    { id: "USR-1006", name: "Alice Uwera", email: "alice@ecoroute.rw", role: "Employee", department: "Fleet Operations", status: "Active" as const },
    { id: "USR-1007", name: "Patrick Tuyishime", email: "patrick@ecoroute.rw", role: "Employee", department: "Fleet Operations", status: "Active" as const },
    { id: "USR-1008", name: "Jean Romeo", email: "jean.romeo@ecoroute.rw", role: "Customer", department: "Client Accounts", status: "Active" as const },
    { id: "USR-1009", name: "Patrick Habimana", email: "patrick.habimana@gmail.com", role: "Customer", department: "Client Accounts", status: "Active" as const },
    { id: "USR-1010", name: "Aline Uwase", email: "aline.uwase@yahoo.fr", role: "Customer", department: "Client Accounts", status: "Deactivated" as const },
  ])

  // Modals state
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [editUserModalItem, setEditUserModalItem] = useState<typeof users[number] | null>(null)

  // Add User Form
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "Manager",
    department: "Operations",
    status: "Active" as const,
  })

  // Access Log
  const accessLog = [
    { id: "ACC-101", user: "System Administrator", role: "Admin", action: "User authenticated", ip: "197.243.22.84", device: "Chrome · Windows", time: "08 Oct 2026, 07:30", status: "Success" },
    { id: "ACC-102", user: "Claudine Uwase", role: "Finance", action: "Payment verified", ip: "197.243.19.45", device: "Edge · Windows", time: "08 Oct 2026, 08:00", status: "Success" },
    { id: "ACC-103", user: "Eric Niyonzima", role: "Employee", action: "Mobile login", ip: "105.178.4.12", device: "Android App v2.4", time: "08 Oct 2026, 06:30", status: "Success" },
    { id: "ACC-104", user: "Unidentified Login", role: "Unknown", action: "Failed password attempt", ip: "41.186.21.90", device: "Safari · macOS", time: "07 Oct 2026, 23:14", status: "Blocked" },
    { id: "ACC-105", user: "Diane Mukamana", role: "Manager", action: "Role permission audit", ip: "197.243.24.110", device: "iPad Safari", time: "07 Oct 2026, 16:22", status: "Success" },
  ]

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserForm.name || !newUserForm.email) return

    const created = {
      id: `USR-${1011 + users.length}`,
      ...newUserForm,
    }

    setUsers([created, ...users])
    setAddUserModalOpen(false)
    setNewUserForm({ name: "", email: "", role: "Manager", department: "Operations", status: "Active" })
    setToast(`User ${created.name} (${created.role}) created successfully!`)
    setTimeout(() => setToast(null), 4000)
    addLog({
      user: "System Administrator",
      role: "Admin",
      action: "New platform user created",
      module: "Users",
      record: `${created.name} · ${created.role}`,
    })
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUserModalItem) return

    setUsers(users.map((u) => (u.id === editUserModalItem.id ? editUserModalItem : u)))
    setToast(`User ${editUserModalItem.name} updated.`)
    setTimeout(() => setToast(null), 4000)
    setEditUserModalItem(null)
  }

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Active" ? "Deactivated" : "Active"
          setToast(`User ${u.name} is now ${nextStatus}.`)
          setTimeout(() => setToast(null), 4000)
          return { ...u, status: nextStatus }
        }
        return u
      }),
    )
  }

  const handleSavePermissions = () => {
    savePermissionMatrix()
    setToast("Role-Based Permission Matrix saved successfully to system security policy!")
    setTimeout(() => setToast(null), 4000)
  }

  const handleSignOutSession = (session: ActiveSession) => {
    terminateSession(session.id)
    setToast(`Active session for ${session.user} (${session.ip}) terminated remotely.`)
    setTimeout(() => setToast(null), 4000)
  }

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email} ${u.id} ${u.role}`.toLowerCase().includes(query.toLowerCase()),
  )

  const modulesList = [
    "Dashboard",
    "Customers",
    "Collections",
    "Schedules",
    "Routes",
    "Fleet",
    "Landfill",
    "Billing",
    "Enforcement",
    "Communication",
    "Reports",
    "Settings",
  ]

  const rolesList = ["Admin", "Manager", "Finance", "Employee", "Customer"]

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

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "users" ? "bg-emerald-700 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <UsersRound size={14} className="inline mr-1.5" /> Users & Accounts ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("permissions")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "permissions" ? "bg-emerald-700 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck size={14} className="inline mr-1.5" /> Permission Matrix (RBAC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sessions")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "sessions" ? "bg-emerald-700 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Laptop size={14} className="inline mr-1.5" /> Active Sessions ({activeSessions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("access-log")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "access-log" ? "bg-emerald-700 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Activity size={14} className="inline mr-1.5" /> Access & Audit Log
          </button>
        </div>

        {activeTab === "users" && (
          <button
            type="button"
            onClick={() => setAddUserModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
          >
            <UserPlus size={15} /> Add User
          </button>
        )}
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, role..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs">
                <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">User & ID</th>
                    <th className="px-4 py-3.5">Email Address</th>
                    <th className="px-4 py-3.5">Platform Role</th>
                    <th className="px-4 py-3.5">Department</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {u.name}
                        <div className="text-[11px] font-mono text-slate-400 font-normal">{u.id}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{u.department}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-rose-50 text-rose-800 border-rose-200"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditUserModalItem(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(u.id)}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold border ${
                            u.status === "Active"
                              ? "border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100"
                              : "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100"
                          }`}
                        >
                          {u.status === "Active" ? "Deactivate" : "Reactivate"}
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

      {/* TAB 2: PERMISSION MATRIX */}
      {activeTab === "permissions" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h4>
              <p className="text-xs text-slate-500">
                Grant or restrict View, Create, Edit, and Delete privileges across system modules per role.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSavePermissions}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              <Save size={14} /> Save Permission Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 bg-slate-100/80">Module</th>
                  {rolesList.map((role) => (
                    <th key={role} className="px-4 py-3 text-center border-l border-slate-200">
                      <div>{role}</div>
                      <div className="grid grid-cols-4 gap-1 text-[9px] text-slate-400 font-normal mt-1">
                        <span>V</span><span>C</span><span>E</span><span>D</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modulesList.map((module) => (
                  <tr key={module} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-900 bg-slate-50/40">
                      {module}
                    </td>
                    {rolesList.map((role) => {
                      const perms = permissionMatrix[role]?.[module] || { view: false, create: false, edit: false, delete: false }
                      return (
                        <td key={role} className="px-4 py-2 border-l border-slate-100 text-center">
                          <div className="grid grid-cols-4 gap-1.5 place-items-center">
                            <input
                              type="checkbox"
                              checked={perms.view}
                              onChange={(e) => updatePermission(role, module, "view", e.target.checked)}
                              className="size-3.5 rounded border-slate-300 text-emerald-700"
                              title={`${role} - ${module}: View`}
                            />
                            <input
                              type="checkbox"
                              checked={perms.create}
                              onChange={(e) => updatePermission(role, module, "create", e.target.checked)}
                              className="size-3.5 rounded border-slate-300 text-emerald-700"
                              title={`${role} - ${module}: Create`}
                            />
                            <input
                              type="checkbox"
                              checked={perms.edit}
                              onChange={(e) => updatePermission(role, module, "edit", e.target.checked)}
                              className="size-3.5 rounded border-slate-300 text-emerald-700"
                              title={`${role} - ${module}: Edit`}
                            />
                            <input
                              type="checkbox"
                              checked={perms.delete}
                              onChange={(e) => updatePermission(role, module, "delete", e.target.checked)}
                              className="size-3.5 rounded border-slate-300 text-rose-600"
                              title={`${role} - ${module}: Delete`}
                            />
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Key: V = View, C = Create, E = Edit, D = Delete</span>
            <button
              type="button"
              onClick={handleSavePermissions}
              className="font-bold text-emerald-700 hover:underline"
            >
              Apply Changes Now →
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVE SESSIONS */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Active User Sessions ({activeSessions.length})</h4>
              <p className="text-xs text-slate-500">Monitor active authenticated tokens across browsers and field handhelds.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Token Heartbeats
            </span>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs">
                <thead className="bg-slate-50/80 uppercase text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">User & Role</th>
                    <th className="px-4 py-3.5">Device & Browser</th>
                    <th className="px-4 py-3.5">IP Address</th>
                    <th className="px-4 py-3.5">Location</th>
                    <th className="px-4 py-3.5">Last Active</th>
                    <th className="px-5 py-3.5 text-right">Session Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{s.user}</div>
                        <div className="text-[11px] text-slate-400">{s.role} · {s.id}</div>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{s.device}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-600">{s.ip}</td>
                      <td className="px-4 py-3.5 text-slate-600">{s.location}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                          {s.lastActive}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleSignOutSession(s)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <LogOut size={12} /> Sign Out
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

      {/* TAB 4: ACCESS LOG */}
      {activeTab === "access-log" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-base font-bold text-slate-900">Security & Authentication Audit Trail</h4>
              <p className="text-xs text-slate-500">Immutable audit log of all logins, privilege adjustments, and lockouts.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-100 rounded-xl">
              <thead className="bg-slate-50 uppercase text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Time & Date</th>
                  <th className="px-4 py-3">User & Role</th>
                  <th className="px-4 py-3">Action Event</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Device Client</th>
                  <th className="px-4 py-3 text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accessLog.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-700">{log.time}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{log.user} ({log.role})</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{log.action}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{log.ip}</td>
                    <td className="px-4 py-3 text-slate-600">{log.device}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === "Success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        open={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Add Platform User"
        subtitle="Provision access credentials and assign workspace role."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddUser} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Jean Romeo"
              value={newUserForm.name}
              onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="user@ecoroute.rw"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
            <select
              value={newUserForm.role}
              onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Finance">Finance</option>
              <option value="Employee">Employee (Driver)</option>
              <option value="Customer">Customer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              placeholder="Operations / Logistics"
              value={newUserForm.department}
              onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddUserModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              Create User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {editUserModalItem && (
        <Modal
          open={!!editUserModalItem}
          onClose={() => setEditUserModalItem(null)}
          title={`Edit User: ${editUserModalItem.name}`}
          subtitle={`User ID: ${editUserModalItem.id}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditUser} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editUserModalItem.name}
                onChange={(e) => setEditUserModalItem({ ...editUserModalItem, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={editUserModalItem.email}
                onChange={(e) => setEditUserModalItem({ ...editUserModalItem, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
              <select
                value={editUserModalItem.role}
                onChange={(e) => setEditUserModalItem({ ...editUserModalItem, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-emerald-800"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Finance">Finance</option>
                <option value="Employee">Employee</option>
                <option value="Customer">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={editUserModalItem.department}
                onChange={(e) => setEditUserModalItem({ ...editUserModalItem, department: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditUserModalItem(null)}
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
    </div>
  )
}
