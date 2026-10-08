import React, { useMemo, useState } from "react"
import {
  UsersRound,
  Check,
  ReceiptText,
  Search,
  Plus,
  Upload,
  Download,
  Filter,
  Eye,
  MapPin,
  Calendar,
  MessageSquareText,
  Phone,
  Mail,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  History,
  X,
} from "lucide-react"
import { useStore, type CustomerRecord } from "./Store"
import { Modal } from "./Modal"

export function CustomersPageEnhanced() {
  const { customerList, addCustomer, importCustomers, overdueAccounts } = useStore()

  const [query, setQuery] = useState("")
  const [zoneFilter, setZoneFilter] = useState("All zones")
  const [statusFilter, setStatusFilter] = useState("All statuses")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [profileModalCustomer, setProfileModalCustomer] = useState<CustomerRecord | null>(null)
  const [profileTab, setProfileTab] = useState<"service" | "billing" | "messages">("service")
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Add customer form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    nationalId: "",
    type: "Household" as CustomerRecord["type"],
    plan: "Household Standard",
    zone: "Kimironko" as CustomerRecord["zone"],
    district: "Gasabo" as CustomerRecord["district"],
    sector: "Kimironko",
    cell: "Kibagabaga",
    village: "Amahoro",
    latitude: -1.9385,
    longitude: 30.1250,
    collectionPoint: "CP-Kimironko-01",
    route: "KG 18",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Filtering
  const filtered = useMemo(() => {
    return customerList.filter((c) => {
      const matchesQuery =
        !query ||
        `${c.name} ${c.id} ${c.phone} ${c.email || ""} ${c.village} ${c.cell} ${c.route}`
          .toLowerCase()
          .includes(query.toLowerCase())

      const matchesZone = zoneFilter === "All zones" || c.zone === zoneFilter
      const matchesStatus = statusFilter === "All statuses" || c.status === statusFilter

      return matchesQuery && matchesZone && matchesStatus
    })
  }, [customerList, query, zoneFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage])

  const activeCount = customerList.filter((c) => c.status === "Active").length
  const inactiveCount = customerList.filter((c) => c.status === "Inactive").length
  const suspendedCount = customerList.filter((c) => c.status === "Suspended").length

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleExportCsv = () => {
    const headers = [
      "Customer ID",
      "Name",
      "Phone",
      "Email",
      "Zone",
      "District",
      "Sector",
      "Cell",
      "Village",
      "Latitude",
      "Longitude",
      "Service Plan",
      "Fee (RWF)",
      "Collection Point",
      "Route",
      "Status",
    ]
    const rows = filtered.map((c) => [
      c.id,
      `"${c.name}"`,
      c.phone,
      c.email || "",
      c.zone,
      c.district,
      c.sector,
      c.cell,
      c.village,
      c.latitude,
      c.longitude,
      `"${c.plan}"`,
      c.fee,
      c.collectionPoint,
      c.route,
      c.status,
    ])
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ecoroute-customers-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!form.name.trim()) errors.name = "Customer name is required"
    if (!form.phone.trim() || !form.phone.includes("78") && !form.phone.includes("72") && !form.phone.includes("73")) {
      errors.phone = "Valid Rwandan phone number required (+250 78/72/73...)"
    }
    if (!form.village.trim()) errors.village = "Village name is required"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const fee =
      form.plan === "Company / Institution"
        ? 20000
        : form.plan === "Household Large / Shared compound"
        ? 10000
        : form.plan === "Household Standard"
        ? 6000
        : 5000

    const newCustomer = addCustomer({
      name: form.name.trim(),
      phone: form.phone.trim().startsWith("+") ? form.phone.trim() : `+250 ${form.phone.trim()}`,
      email: form.email.trim() || `${form.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      nationalId: form.nationalId.trim() || `1199${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      type: form.type,
      waste: form.type === "Company / Institution" ? "Bulky, Mixed" : form.type === "Business" ? "Commercial" : "General, Organic",
      volume: fee * 0.04,
      plan: form.plan,
      period: form.type === "Business" ? "Weekly" : "Monthly",
      fee,
      location: form.zone,
      zone: form.zone,
      district: form.district,
      sector: form.sector,
      cell: form.cell,
      village: form.village.trim(),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      collectionPoint: form.collectionPoint,
      route: form.route,
      status: "Active",
      createdDate: new Date().toISOString().slice(0, 10),
    })

    setAddModalOpen(false)
    setSuccessToast(`Customer ${newCustomer.name} (${newCustomer.id}) registered successfully!`)
    setTimeout(() => setSuccessToast(null), 4000)
    setForm({
      name: "",
      phone: "",
      email: "",
      nationalId: "",
      type: "Household",
      plan: "Household Standard",
      zone: "Kimironko",
      district: "Gasabo",
      sector: "Kimironko",
      cell: "Kibagabaga",
      village: "Amahoro",
      latitude: -1.9385,
      longitude: 30.1250,
      collectionPoint: "CP-Kimironko-01",
      route: "KG 18",
    })
    setFormErrors({})
  }

  const handleSimulatedImport = () => {
    // Generate 5 sample imported customers
    const sampleImport: CustomerRecord[] = [
      {
        id: `IMP-${Date.now().toString().slice(-4)}-1`,
        name: "Kigali Tech Innovations Hub",
        phone: "+250 788 449 011",
        email: "facilities@ktih.rw",
        nationalId: "1199080099887766",
        type: "Company / Institution",
        waste: "Recyclable, Electronic",
        volume: 850,
        plan: "Company / Institution",
        period: "Monthly",
        fee: 20000,
        location: "Remera",
        zone: "Remera",
        district: "Gasabo",
        sector: "Remera",
        cell: "Rukiri I",
        village: "Gisimenti",
        latitude: -1.9564,
        longitude: 30.1075,
        collectionPoint: "CP-Remera-01",
        route: "KG 11",
        status: "Active",
        createdDate: new Date().toISOString().slice(0, 10),
      },
      {
        id: `IMP-${Date.now().toString().slice(-4)}-2`,
        name: "Claire Mutamuliza",
        phone: "+250 788 554 990",
        email: "claire.m@gmail.com",
        nationalId: "1199580011223344",
        type: "Household",
        waste: "General, Organic",
        volume: 160,
        plan: "Household Standard",
        period: "Monthly",
        fee: 6000,
        location: "Kimironko",
        zone: "Kimironko",
        district: "Gasabo",
        sector: "Kimironko",
        cell: "Bibare",
        village: "Nyabisindu",
        latitude: -1.9390,
        longitude: 30.1260,
        collectionPoint: "CP-Kimironko-02",
        route: "KG 18",
        status: "Active",
        createdDate: new Date().toISOString().slice(0, 10),
      },
    ]

    importCustomers(sampleImport)
    setImportStatus(`Successfully parsed and imported ${sampleImport.length} records.`)
    setTimeout(() => {
      setImportModalOpen(false)
      setImportStatus(null)
      setSuccessToast(`${sampleImport.length} new customers imported to database.`)
      setTimeout(() => setSuccessToast(null), 4000)
    }, 1200)
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {successToast && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <span>{successToast}</span>
          </div>
          <button type="button" onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customers</p>
            <UsersRound size={18} className="text-emerald-700" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900">{customerList.length}</p>
          <p className="mt-1 text-xs text-slate-500">Across 4 Kigali operational zones</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Service</p>
            <Check size={18} className="text-emerald-700" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700">{activeCount}</p>
          <p className="mt-1 text-xs text-slate-500">{((activeCount / customerList.length) * 100).toFixed(1)}% service compliance</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue / Suspended</p>
            <AlertCircle size={18} className="text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700">{overdueAccounts.length} / {suspendedCount}</p>
          <p className="mt-1 text-xs text-slate-500">47 accounts in follow-up queue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inactive Accounts</p>
            <ShieldCheck size={18} className="text-slate-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-700">{inactiveCount}</p>
          <p className="mt-1 text-xs text-slate-500">Scheduled for account review</p>
        </div>
      </div>

      {/* Action Bar & Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Customer Directory ({filtered.length} matching)
            </h3>
            <p className="text-xs text-slate-500">
              View and manage customers, GPS locations, plans and collection status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Upload size={14} /> Import CSV
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm transition"
            >
              <Plus size={15} /> Add Customer
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, village..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <select
              value={zoneFilter}
              onChange={(e) => {
                setZoneFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All zones">All Zones (671 customers)</option>
              <option value="Kimironko">Kimironko Zone (186 customers)</option>
              <option value="Remera">Remera Zone (164 customers)</option>
              <option value="Niboye">Niboye Zone (172 customers)</option>
              <option value="Nyamirambo">Nyamirambo Zone (149 customers)</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white"
            >
              <option value="All statuses">All Statuses</option>
              <option value="Active">Active ({activeCount})</option>
              <option value="Inactive">Inactive ({inactiveCount})</option>
              <option value="Suspended">Suspended ({suspendedCount})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-xs">
            <thead className="bg-slate-50/80 uppercase tracking-wider text-slate-500 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-5 py-3.5">Customer & ID</th>
                <th className="px-4 py-3.5">Phone & Contact</th>
                <th className="px-4 py-3.5">Location & Village</th>
                <th className="px-4 py-3.5">GPS Pin</th>
                <th className="px-4 py-3.5">Plan & Fee</th>
                <th className="px-4 py-3.5">Route</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.id} · {c.type}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{c.phone}</div>
                      <div className="text-[11px] text-slate-400">{c.email || "No email"}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{c.village}, {c.cell}</div>
                      <div className="text-[11px] text-slate-400">{c.sector}, {c.district}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <MapPin size={11} className="text-emerald-700" />
                        {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{c.plan}</div>
                      <div className="text-[11px] font-bold text-emerald-800">
                        RWF {c.fee.toLocaleString()} / {c.period.toLowerCase()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-700">{c.route}</span>
                      <div className="text-[10px] text-slate-400">{c.collectionPoint}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : c.status === "Suspended"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileModalCustomer(c)
                          setProfileTab("service")
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm"
                      >
                        <Eye size={13} /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
          <div>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{" "}
            <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of{" "}
            <strong>{filtered.length}</strong> customers (Page {currentPage} of {totalPages})
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold hover:bg-slate-100 disabled:opacity-40"
            >
              First
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Jump buttons around current page */}
            {[
              currentPage - 1 > 0 ? currentPage - 1 : null,
              currentPage,
              currentPage + 1 <= totalPages ? currentPage + 1 : null,
            ]
              .filter(Boolean)
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p as number)}
                  className={`size-8 rounded-lg text-xs font-bold ${
                    p === currentPage
                      ? "bg-emerald-700 text-white"
                      : "border border-slate-200 bg-white hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold hover:bg-slate-100 disabled:opacity-40"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Register New Customer"
        subtitle="Complete location, service plan, GPS coordinates and collection route parameters."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Jean Romeo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-600"
              />
              {formErrors.name && (
                <p className="mt-1 text-[11px] font-semibold text-rose-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (+250) *
              </label>
              <input
                type="text"
                placeholder="+250 788 123 456"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-600"
              />
              {formErrors.phone && (
                <p className="mt-1 text-[11px] font-semibold text-rose-600">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="customer@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Customer Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-emerald-600"
              >
                <option value="Household">Household</option>
                <option value="Business">Business</option>
                <option value="Company / Institution">Company / Institution</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Location & Administrative Hierarchy
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
                <select
                  value={form.district}
                  onChange={(e) => {
                    const dist = e.target.value as any
                    const defaultZone = dist === "Gasabo" ? "Kimironko" : dist === "Kicukiro" ? "Niboye" : "Nyamirambo"
                    setForm({ ...form, district: dist, zone: defaultZone, sector: defaultZone })
                  }}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs"
                >
                  <option value="Gasabo">Gasabo</option>
                  <option value="Kicukiro">Kicukiro</option>
                  <option value="Nyarugenge">Nyarugenge</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Sector / Zone</label>
                <select
                  value={form.zone}
                  onChange={(e) => setForm({ ...form, zone: e.target.value as any, sector: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs"
                >
                  <option value="Kimironko">Kimironko</option>
                  <option value="Remera">Remera</option>
                  <option value="Niboye">Niboye</option>
                  <option value="Nyamirambo">Nyamirambo</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Cell</label>
                <input
                  type="text"
                  placeholder="Kibagabaga"
                  value={form.cell}
                  onChange={(e) => setForm({ ...form, cell: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Village *</label>
                <input
                  type="text"
                  placeholder="Amahoro"
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs"
                />
                {formErrors.village && (
                  <p className="mt-1 text-[10px] font-semibold text-rose-600">{formErrors.village}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              GPS Latitude / Longitude & Map Pin
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || -1.9385 })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 30.1250 })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            {/* Interactive GPS Pin Picker Preview */}
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-400 animate-bounce" />
                <span className="text-xs font-mono">
                  Current Map Pin: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)} ({form.zone})
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const offsets = [
                    { lat: -1.9385, lng: 30.1250 },
                    { lat: -1.9560, lng: 30.1080 },
                    { lat: -1.9720, lng: 30.0890 },
                    { lat: -1.9840, lng: 30.0480 },
                  ]
                  const pick = offsets[Math.floor(Math.random() * offsets.length)]
                  setForm({ ...form, latitude: pick.lat, longitude: pick.lng })
                }}
                className="text-[11px] font-bold text-emerald-300 hover:text-white underline"
              >
                Pick Pin On Map
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Service Plan, Route & Collection Point
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Plan</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs"
                >
                  <option value="Household Basic">Household Basic (RWF 5,000)</option>
                  <option value="Household Standard">Household Standard (RWF 6,000)</option>
                  <option value="Household Large / Shared compound">Household Large (RWF 10,000)</option>
                  <option value="Business Weekly">Business Weekly (RWF 5,000)</option>
                  <option value="Company / Institution">Company / Institution (RWF 20,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Assigned Route</label>
                <select
                  value={form.route}
                  onChange={(e) => setForm({ ...form, route: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs font-bold text-emerald-800"
                >
                  <option value="KG 18">KG 18 (Kimironko Route)</option>
                  <option value="KG 11">KG 11 (Remera Route)</option>
                  <option value="KK 15">KK 15 (Niboye Route)</option>
                  <option value="KN 07">KN 07 (Nyamirambo Route)</option>
                  <option value="KG 45">KG 45 (Nyarugunga Route)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Collection Point</label>
                <input
                  type="text"
                  placeholder="CP-Kimironko-01"
                  value={form.collectionPoint}
                  onChange={(e) => setForm({ ...form, collectionPoint: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-2.5 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
            >
              Save Customer Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Customer Profile Modal (Service history, Billing history, Messages tabs) */}
      {profileModalCustomer && (
        <Modal
          open={!!profileModalCustomer}
          onClose={() => setProfileModalCustomer(null)}
          title={`Customer Profile: ${profileModalCustomer.name}`}
          subtitle={`${profileModalCustomer.id} · ${profileModalCustomer.village}, ${profileModalCustomer.sector}, ${profileModalCustomer.district}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Customer Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-slate-50 p-3 text-xs border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Phone</span>
                <span className="font-semibold text-slate-900">{profileModalCustomer.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Plan</span>
                <span className="font-semibold text-slate-900">{profileModalCustomer.plan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Route / Point</span>
                <span className="font-semibold text-emerald-800">{profileModalCustomer.route} ({profileModalCustomer.collectionPoint})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Status</span>
                <span className="font-bold text-emerald-700">{profileModalCustomer.status}</span>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setProfileTab("service")}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  profileTab === "service"
                    ? "border-b-2 border-emerald-700 text-emerald-800"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <History size={14} /> Service History
              </button>
              <button
                type="button"
                onClick={() => setProfileTab("billing")}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  profileTab === "billing"
                    ? "border-b-2 border-emerald-700 text-emerald-800"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <CreditCard size={14} /> Billing History
              </button>
              <button
                type="button"
                onClick={() => setProfileTab("messages")}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  profileTab === "messages"
                    ? "border-b-2 border-emerald-700 text-emerald-800"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <MessageSquareText size={14} /> Messages & SMS
              </button>
            </div>

            {/* Tab 1: Service History */}
            {profileTab === "service" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 uppercase text-slate-400 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-3 py-2.5">Date & Time</th>
                        <th className="px-3 py-2.5">Driver & Vehicle</th>
                        <th className="px-3 py-2.5">Waste Type</th>
                        <th className="px-3 py-2.5">Weight</th>
                        <th className="px-3 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3 py-2.5 font-bold">08 Oct 2026, 08:45</td>
                        <td className="px-3 py-2.5">Eric Niyonzima (RW 412 A)</td>
                        <td className="px-3 py-2.5">General Household</td>
                        <td className="px-3 py-2.5 font-semibold">34 kg</td>
                        <td className="px-3 py-2.5 text-emerald-700 font-bold">Completed</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2.5 font-bold">01 Oct 2026, 09:10</td>
                        <td className="px-3 py-2.5">Eric Niyonzima (RW 412 A)</td>
                        <td className="px-3 py-2.5">General Household</td>
                        <td className="px-3 py-2.5 font-semibold">28 kg</td>
                        <td className="px-3 py-2.5 text-emerald-700 font-bold">Completed</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2.5 font-bold">24 Sep 2026, 08:30</td>
                        <td className="px-3 py-2.5">Eric Niyonzima (RW 412 A)</td>
                        <td className="px-3 py-2.5">Organic & Green</td>
                        <td className="px-3 py-2.5 font-semibold">31 kg</td>
                        <td className="px-3 py-2.5 text-emerald-700 font-bold">Completed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Billing History */}
            {profileTab === "billing" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 uppercase text-slate-400 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-3 py-2.5">Invoice / Receipt</th>
                        <th className="px-3 py-2.5">Period</th>
                        <th className="px-3 py-2.5">Amount</th>
                        <th className="px-3 py-2.5">Payment Method</th>
                        <th className="px-3 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-3 py-2.5 font-bold">RCT-4081 (INV-2026-00098)</td>
                        <td className="px-3 py-2.5">September 2026</td>
                        <td className="px-3 py-2.5 font-semibold">RWF {profileModalCustomer.fee.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-amber-700 font-semibold">MTN MoMo (MP261008.A4410)</td>
                        <td className="px-3 py-2.5 text-emerald-700 font-bold">Paid</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2.5 font-bold">INV-2026-00125</td>
                        <td className="px-3 py-2.5">October 2026</td>
                        <td className="px-3 py-2.5 font-semibold">RWF {profileModalCustomer.fee.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-slate-400">Pending</td>
                        <td className="px-3 py-2.5 text-amber-700 font-bold">Due 10 Oct</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Messages */}
            {profileTab === "messages" && (
              <div className="space-y-2">
                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>SMS: Monthly Invoice Reminder</span>
                    <span className="text-[11px] text-slate-400">06 Oct 2026, 09:15</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    "EcoRoute: Your waste collection fee of RWF {profileModalCustomer.fee.toLocaleString()} for October 2026 is due on 10 Oct. Pay via MTN MoMo (*182*8*1#) merchant code 154829."
                  </p>
                  <span className="mt-1.5 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Delivered via Pindo SMS Gateway
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>SMS: Collection Schedule Update</span>
                    <span className="text-[11px] text-slate-400">01 Oct 2026, 07:00</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    "EcoRoute: Waste collection crew on Route {profileModalCustomer.route} will arrive between 08:00 and 11:00. Please ensure bins are positioned."
                  </p>
                  <span className="mt-1.5 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Delivered
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProfileModalCustomer(null)}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Import CSV Modal */}
      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Customers from CSV"
        subtitle="Batch upload customers with addresses, GPS coordinates, plans and collection points."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-emerald-500 transition">
            <Upload size={32} className="mx-auto text-emerald-700 mb-2" />
            <p className="text-xs font-bold text-slate-900">Click to select CSV file or drag and drop</p>
            <p className="text-[11px] text-slate-400 mt-1">UTF-8 formatted CSV with headers (Name, Phone, Zone, Sector, Cell, Village, Plan)</p>
          </div>

          {importStatus ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>{importStatus}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="text-emerald-700 font-bold hover:underline"
              >
                Download CSV Sample Template
              </button>
              <button
                type="button"
                onClick={handleSimulatedImport}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 shadow-sm"
              >
                Process Sample Import
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
