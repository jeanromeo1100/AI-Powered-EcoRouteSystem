import { FormEvent, useState } from "react"
import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  CircleCheck,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  MapPin,
  Menu,
  MessageSquareText,
  WalletCards,
  Route,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react"
import type { Role } from "./App"
import { useStore } from "./Store"

type Screen = "login" | "company" | "customer" | null

type RwandaHierarchy = Record<string, Record<string, Record<string, string[]>>>

const rwandaLocations: RwandaHierarchy = {
  "Kigali City": {
    Gasabo: {
      Remera: ["Rukiri I", "Rukiri II", "Nyabisindu"],
      Kimironko: ["Bibare", "Kibagabaga", "Nyagatovu"],
      Kinyinya: ["Gacuriro", "Kagugu", "Murama"],
    },
    Kicukiro: {
      Nyarugunga: ["Kamashashi", "Nonko", "Rwimbogo"],
      Niboye: ["Gatare", "Niboye", "Nyakabanda"],
      Gahanga: ["Gasaraba", "Kagasa", "Murinja"],
    },
    Nyarugenge: {
      Nyamirambo: ["Cyivugiza", "Kivugiza", "Rugarama"],
      Nyarugenge: ["Agatare", "Biryogo", "Kiyovu"],
      Kigali: ["Kigali", "Mwendo", "Nyabugogo"],
    },
  },
  "Eastern Province": {
    Bugesera: {
      Nyamata: ["Kanazi", "Maranyundo", "Nyamata Ville"],
      Ntarama: ["Cyugaro", "Kanzenze", "Kibungo"],
    },
    Rwamagana: {
      Kigabiro: ["Cyanya", "Sibagire", "Sovu"],
      Muhazi: ["Karitutu", "Ntebe", "Nsinda"],
    },
    Kayonza: {
      Mukarange: ["Bwiza", "Kayonza", "Mukayenzi"],
      Rukara: ["Kawangire", "Rukara", "Rwimishinya"],
    },
    Nyagatare: {
      Nyagatare: ["Barija", "Bushoga", "Nyagatare"],
      Rwimiyaga: ["Gacundezi", "Rwimiyaga", "Nyarupfubire"],
    },
  },
  "Northern Province": {
    Musanze: {
      Muhoza: ["Cyabararika", "Kigombe", "Mpenge"],
      Cyuve: ["Bukinanyana", "Kabeza", "Rwebeya"],
    },
    Burera: {
      Cyanika: ["Kabyiniro", "Kagitega", "Nyagahinga"],
      Cyeru: ["Butare", "Ndongozi", "Ruyange"],
    },
    Gicumbi: {
      Byumba: ["Gacurabwenge", "Nyarutarama", "Rusambya"],
      Kageyo: ["Gihembe", "Horezo", "Kabuga"],
    },
    Rulindo: {
      Bushoki: ["Gasiza", "Kivomo", "Nyirangarama"],
      Base: ["Cyohoha", "Rwamahwa", "Taba"],
    },
  },
  "Southern Province": {
    Huye: {
      Ngoma: ["Butare", "Matyazo", "Ngoma"],
      Tumba: ["Cyarwa", "Gitwa", "Rango"],
    },
    Nyanza: {
      Busasamana: ["Kavumu", "Kibinja", "Nyanza"],
      Mukingo: ["Cyeru", "Ngwa", "Nkomero"],
    },
    Muhanga: {
      Nyamabuye: ["Gahogo", "Gifumba", "Remera"],
      Shyogwe: ["Kinini", "Mbare", "Mubuga"],
    },
    Kamonyi: {
      Runda: ["Gihara", "Ruyenzi", "Sheri"],
      Gacurabwenge: ["Gihinga", "Kigembe", "Nkingo"],
    },
  },
  "Western Province": {
    Rubavu: {
      Gisenyi: ["Amahoro", "Bugoyi", "Kivumu"],
      Rubavu: ["Byahi", "Murara", "Rukoko"],
    },
    Rusizi: {
      Kamembe: ["Cyangugu", "Gihundwe", "Kamashangi"],
      Gihundwe: ["Burunga", "Gatsiro", "Shagasha"],
    },
    Karongi: {
      Bwishyura: ["Burunga", "Kibuye", "Kiniha"],
      Rubengera: ["Gacaca", "Kibirizi", "Nyarugenge"],
    },
    Nyabihu: {
      Mukamira: ["Jaba", "Kanyove", "Mukamira"],
      Bigogwe: ["Arusha", "Basumba", "Kijote"],
    },
  },
}

const companyForArea = (province: string, sector: string) => {
  const bySector: Record<string, string> = {
    Nyarugunga: "Simate Garbage Ltd",
    Niboye: "Simate Garbage Ltd",
    Gahanga: "Simate Garbage Ltd",
    Remera: "Gasabo Green Services",
    Kimironko: "Gasabo Green Services",
    Kinyinya: "Isuku Kinyinya",
    Nyamirambo: "Nyarugenge Sanitation",
    Nyarugenge: "Nyarugenge Sanitation",
  }
  return (
    bySector[sector] ||
    (province === "Kigali City" ? "Simate Garbage Ltd" : "Isuku Iwacu Services")
  )
}

const locationAnchors = [
  {
    lat: -1.99,
    lng: 30.16,
    province: "Kigali City",
    district: "Kicukiro",
    sector: "Nyarugunga",
    cell: "Kamashashi",
  },
  {
    lat: -1.97,
    lng: 30.1,
    province: "Kigali City",
    district: "Kicukiro",
    sector: "Niboye",
    cell: "Niboye",
  },
  {
    lat: -1.96,
    lng: 30.12,
    province: "Kigali City",
    district: "Gasabo",
    sector: "Remera",
    cell: "Rukiri I",
  },
  {
    lat: -1.94,
    lng: 30.13,
    province: "Kigali City",
    district: "Gasabo",
    sector: "Kimironko",
    cell: "Bibare",
  },
  {
    lat: -1.98,
    lng: 30.04,
    province: "Kigali City",
    district: "Nyarugenge",
    sector: "Nyamirambo",
    cell: "Cyivugiza",
  },
  {
    lat: -1.5,
    lng: 29.63,
    province: "Northern Province",
    district: "Musanze",
    sector: "Muhoza",
    cell: "Mpenge",
  },
  {
    lat: -2.6,
    lng: 29.74,
    province: "Southern Province",
    district: "Huye",
    sector: "Ngoma",
    cell: "Butare",
  },
  {
    lat: -1.68,
    lng: 29.26,
    province: "Western Province",
    district: "Rubavu",
    sector: "Gisenyi",
    cell: "Amahoro",
  },
  {
    lat: -1.95,
    lng: 30.43,
    province: "Eastern Province",
    district: "Rwamagana",
    sector: "Kigabiro",
    cell: "Cyanya",
  },
]

const nearestConfiguredArea = (lat: number, lng: number) =>
  locationAnchors.reduce((nearest, area) => {
    const distance = (area.lat - lat) ** 2 + (area.lng - lng) ** 2
    const nearestDistance = (nearest.lat - lat) ** 2 + (nearest.lng - lng) ** 2
    return distance < nearestDistance ? area : nearest
  })

const authorizedAccounts: Record<string, {
  password: string
  role: Role
  name: string
  phone?: string
  category?: string
  assignment?: string
  task?: string
}> = {
  "admin@ecoroute.rw": {
    password: "admin123",
    role: "Admin",
    name: "System Administrator",
  },
  "manager@ecoroute.rw": {
    password: "manager123",
    role: "Manager",
    name: "Diane Mukamana",
  },
  "finance@ecoroute.rw": {
    password: "finance123",
    role: "Finance",
    name: "Claudine Uwase",
    phone: "+250 788 420 116",
    category: "Finance & Billing Officer",
    assignment: "Finance operations",
    task: "Manage authorized billing, payments, receipts and reconciliation",
  },
  "employee@ecoroute.rw": {
    password: "employee123",
    role: "Employee",
    name: "Eric Niyonzima",
    phone: "+250 788 304 112",
    category: "Driver",
    assignment: "RW 412 A · Team Alpha · Route KG 45",
    task: "Complete 18 assigned collection stops in Nyarugunga",
  },
  "customer@ecoroute.rw": {
    password: "customer123",
    role: "Customer",
    name: "Jean Romeo",
  },
}

const photoUrl =
  "https://images.unsplash.com/photo-1771172195097-d61aa2103b67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"

function Brand({ light = false }: { light?: boolean }) {
  return (
    <button
      className="flex items-center gap-3 text-left"
      onClick={() => window.scrollTo(0, 0)}
    >
      <span
        className={`grid size-10 place-items-center rounded-2xl ${
          light ? "bg-white text-emerald-800" : "bg-emerald-700 text-white"
        }`}
      >
        <Leaf size={20} />
      </span>
      <span>
        <span
          className={`block text-base font-bold ${
            light ? "text-white" : "text-slate-950"
          }`}
        >
          AI-Powered EcoRoute
        </span>
        <span
          className={`block text-[10px] font-semibold tracking-tight ${
            light ? "text-emerald-100" : "text-emerald-700"
          }`}
        >
          Smart Waste Collection, Route, Optimization
        </span>
      </span>
    </button>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  type?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      <input
        className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  )
}

function Progress({
  step,
  company,
}: {
  step: number
  company?: boolean
}) {
  const labels = company
    ? ["Your account", "Company details", "Verification"]
    : ["Personal details", "Location", "Confirmation"]
  return (
    <div className="mt-7 grid grid-cols-3 gap-2">
      {labels.map((label, index) => {
        const number = index + 1
        const complete = number < step
        const active = number === step
        return (
          <div
            className={`border-t-4 pt-3 ${
              number <= step ? "border-emerald-500" : "border-slate-200"
            }`}
            key={label}
          >
            <div
              className={`flex items-center gap-2 text-xs font-semibold ${
                number <= step ? "text-emerald-800" : "text-slate-400"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border ${
                  complete
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : active
                      ? "border-emerald-500 text-emerald-700"
                      : "border-slate-300"
                }`}
              >
                {complete ? <Check size={14} /> : number}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Login({
  onClose,
  onAuthorized,
  onCustomer,
}: {
  onClose: () => void
  onAuthorized: (role: Role) => void
  onCustomer: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"login" | "forgot" | "resetSent">(
    "login",
  )
  const [forgotEmail, setForgotEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  const quickLogin = (accountEmail: string) => {
    const account = authorizedAccounts[accountEmail]
    localStorage.setItem(
      "ecoroute-current-user",
      JSON.stringify({ ...account, email: accountEmail }),
    )
    onAuthorized(account.role)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    const createdAccounts = JSON.parse(
      localStorage.getItem("ecoroute-created-accounts") ?? "[]",
    ) as Array<{
      email: string
      password: string
      role: Role
      name: string
    }>
    const created = createdAccounts.find(
      (item) => item.email === normalizedEmail,
    )
    const account = authorizedAccounts[normalizedEmail] ?? created
    const companyLogin = JSON.parse(
      localStorage.getItem(`ecoroute-company-login-${normalizedEmail}`) ??
        "null",
    ) as {
      password?: string
      status?: string
      reason?: string
    } | null
    if (companyLogin && companyLogin.password === password) {
      if (companyLogin.status === "Pending")
        return setError("Your company registration is pending approval.")
      if (companyLogin.status === "Rejected")
        return setError(
          `Your registration was rejected: ${companyLogin.reason || "No reason provided"}.`,
        )
      if (companyLogin.status === "Suspended")
        return setError(
          "Your company account is suspended. Contact the administrator.",
        )
      localStorage.setItem(
        "ecoroute-current-user",
        JSON.stringify({
          role: "Manager",
          name: normalizedEmail.split("@")[0],
          email: normalizedEmail,
        }),
      )
      return onAuthorized("Manager")
    }
    if (!account || account.password !== password) {
      setError(
        "Access denied. Check your email and password or contact your administrator.",
      )
      return
    }
    localStorage.setItem(
      "ecoroute-current-user",
      JSON.stringify({ ...account, email: normalizedEmail }),
    )
    onAuthorized(account.role)
  }

  const handleForgotSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!forgotEmail) {
      setError("Please provide your account email address.")
      return
    }
    setError("")
    setViewMode("resetSent")
  }

  const handleResetPasswordSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }
    setError("")
    setPasswordSuccess(
      "Password updated successfully! You can now sign in with your new password.",
    )
    setPassword(newPassword)
    setEmail(forgotEmail)
    setViewMode("login")
  }

  return (
    <Modal onClose={onClose} width="max-w-md">
      <div className="text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-700 text-white">
          <LockKeyhole size={22} />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
          Authorized access
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {viewMode === "login"
            ? "Welcome back"
            : viewMode === "forgot"
              ? "Reset password"
              : "Create new password"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {viewMode === "login"
            ? "Sign in to the workspace assigned to your account."
            : viewMode === "forgot"
              ? "Enter your email to receive a password reset link."
              : "Link verified! Enter your new password below."}
        </p>
      </div>

      {passwordSuccess && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-900">
          {passwordSuccess}
        </div>
      )}

      {viewMode === "forgot" && (
        <form className="mt-6 space-y-4" onSubmit={handleForgotSubmit}>
          <Field
            label="Email address"
            onChange={setForgotEmail}
            placeholder="you@company.rw"
            required
            type="email"
            value={forgotEmail}
          />
          {error && (
            <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-5 text-white">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
          >
            Send reset link <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode("login")
              setError("")
            }}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Back to sign in
          </button>
        </form>
      )}

      {viewMode === "resetSent" && (
        <div className="mt-6 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs space-y-1 text-emerald-900">
            <p className="font-bold">✓ Reset link sent!</p>
            <p>
              A password reset token was dispatched to <strong>{forgotEmail}</strong>.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleResetPasswordSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                New password
              </span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="At least 8 characters"
                required
                type="password"
                value={newPassword}
              />
              <div className="mt-1 flex gap-1">
                <span
                  className={`h-1 flex-1 rounded-full ${
                    newPassword.length >= 8 ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                />
                <span
                  className={`h-1 flex-1 rounded-full ${
                    /[A-Z]/.test(newPassword) && /\d/.test(newPassword)
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
                <span
                  className={`h-1 flex-1 rounded-full ${
                    /[!@#$%^&*]/.test(newPassword)
                      ? "bg-emerald-500"
                      : "bg-slate-200"
                  }`}
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                Confirm new password
              </span>
              <input
                className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter new password"
                required
                type="password"
                value={confirmPassword}
              />
            </label>
            {error && (
              <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-5 text-white">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800"
            >
              Update password <Check size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("login")
                setError("")
              }}
              className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel and return to sign in
            </button>
          </form>
        </div>
      )}

      {viewMode === "login" && (
        <>
          <div className="mt-7">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Quick prototype access
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                ["Admin", "admin@ecoroute.rw", ShieldCheck],
                ["Manager", "manager@ecoroute.rw", Building2],
                ["Finance", "finance@ecoroute.rw", WalletCards],
                ["Customer", "customer@ecoroute.rw", UserRound],
                ["Driver", "employee@ecoroute.rw", UsersRound],
              ].map(([label, accountEmail, Icon]) => {
                const RoleIcon = Icon as typeof ShieldCheck
                return (
                  <button
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
                    key={label as string}
                    onClick={() => quickLogin(accountEmail as string)}
                    type="button"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white">
                      <RoleIcon size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-slate-900">
                        {label as string}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Enter workspace
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Or use credentials
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <form className="space-y-4" onSubmit={submit}>
            <Field
              label="Email address"
              onChange={setEmail}
              placeholder="you@company.rw"
              required
              type="email"
              value={email}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                Password
              </span>
              <span className="relative block">
                <input
                  className="w-full rounded-xl border border-slate-200 bg-[#fbfcf9] px-4 py-3 pr-12 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type={visible ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={visible ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  onClick={() => setVisible(!visible)}
                  type="button"
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email || "")
                  setViewMode("forgot")
                  setError("")
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Forgot password?
              </button>
            </div>
            {error && (
              <div className="rounded-xl bg-slate-950 px-4 py-3 text-sm leading-5 text-white">
                {error}
              </div>
            )}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:bg-emerald-800">
              Sign in securely <ArrowRight size={16} />
            </button>
          </form>
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-emerald-900">
            <strong>Prototype accounts:</strong> admin, manager, employee or
            customer
            <span className="block">Use role@ecoroute.rw · password: role123</span>
          </div>
          <p className="mt-5 text-center text-sm text-slate-500">
            New household customer?{" "}
            <button className="font-bold text-emerald-700" onClick={onCustomer}>
              Create an account
            </button>
          </p>
        </>
      )}
    </Modal>
  )
}

function Modal({
  children,
  onClose,
  width = "max-w-3xl",
}: {
  children: React.ReactNode
  onClose: () => void
  width?: string
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/40 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center py-4">
        <div
          className={`relative w-full ${width} rounded-3xl bg-white p-6 shadow-2xl sm:p-8`}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 grid size-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}

function CompanyRegistration({ onClose }: { onClose: () => void }) {
  const { registerCompany, companies } = useStore()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    type: "Waste operator" as "Waste operator" | "Municipal partner",
    license: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    street: "",
    building: "",
    description: "",
    phone: "",
    officePhone: "",
    verificationDocument: "",
  })
  const set = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value })
  const districts = form.province
    ? Object.keys(rwandaLocations[form.province] || {})
    : []
  const sectors = form.district
    ? Object.keys(rwandaLocations[form.province]?.[form.district] || {})
    : []
  const cells = form.sector
    ? rwandaLocations[form.province]?.[form.district]?.[form.sector] || []
    : []
  const strongPassword =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[a-z]/.test(form.password) &&
    /\d/.test(form.password) &&
    /[^A-Za-z0-9]/.test(form.password)
  const stepOneValid = Boolean(
    form.contact.trim() &&
      /\S+@\S+\.\S+/.test(form.email) &&
      strongPassword &&
      form.password === form.confirmPassword,
  )
  const stepTwoValid = Boolean(
    form.name.trim() &&
      form.license.trim() &&
      form.province &&
      form.district &&
      form.sector &&
      form.cell &&
      form.street.trim() &&
      form.building.trim() &&
      form.description.trim() &&
      form.phone.trim(),
  )
  const stepThreeValid = Boolean(form.verificationDocument)
  const duplicate = companies.some(
    (company) =>
      company.email.toLowerCase() === form.email.toLowerCase() ||
      company.license.toLowerCase() === form.license.toLowerCase(),
  )
  const next = () => {
    setError("")
    if (step === 1 && stepOneValid) setStep(2)
    if (step === 2 && stepTwoValid) setStep(3)
  }
  const submit = () => {
    if (!stepThreeValid || duplicate) {
      setError(
        duplicate
          ? "An account with this email or license number already exists."
          : "Upload the required verification document before submitting.",
      )
      return
    }
    registerCompany({
      name: form.name,
      type: form.type,
      license: form.license,
      contact: form.contact,
      phone: form.phone,
      email: form.email.trim().toLowerCase(),
      address: `${form.street}, ${form.cell}, ${form.sector}, ${form.district}, ${form.province}`,
      password: form.password,
      province: form.province,
      district: form.district,
      sector: form.sector,
      cell: form.cell,
      street: form.street,
      building: form.building,
      description: form.description,
      officePhone: form.officePhone,
      verificationDocument: form.verificationDocument,
    })
    setSubmitted(true)
  }
  if (submitted)
    return (
      <Modal onClose={onClose} width="max-w-lg">
        <div className="py-6 text-center">
          <CircleCheck className="mx-auto text-emerald-600" size={52} />
          <h2 className="mt-5 text-3xl font-semibold text-slate-950">
            Registration submitted
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            Registration submitted. Waiting for administrator approval.
          </p>
          <div className="mx-auto mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            The administrator will check your account details and verification
            document, then accept or reject the application.
          </div>
          <button
            className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white"
            onClick={onClose}
          >
            Return to website
          </button>
        </div>
      </Modal>
    )
  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
        Register company · Step {step} of 3
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        Create your company account
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Three steps. The administrator reviews every application before it goes
        live.
      </p>
      <Progress company step={step} />
      {step === 1 && (
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Full name
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.contact}
              onChange={(e) => set("contact", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Primary email
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Password
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Confirm password
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
            />
          </label>
          <div className="grid gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-900 sm:col-span-2 sm:grid-cols-2">
            {[
              [form.password.length >= 8, "At least 8 characters"],
              [/[A-Z]/.test(form.password), "One uppercase letter"],
              [/[a-z]/.test(form.password), "One lowercase letter"],
              [/\d/.test(form.password), "One number"],
              [/[^A-Za-z0-9]/.test(form.password), "One symbol"],
              [
                form.password.length > 0 &&
                  form.password === form.confirmPassword,
                "Passwords match",
              ],
            ].map(([ok, label]) => (
              <span className="flex items-center gap-2" key={String(label)}>
                <span
                  className={`grid size-4 place-items-center rounded-full ${
                    ok ? "bg-emerald-600 text-white" : "border border-slate-300"
                  }`}
                >
                  {ok && <Check size={11} />}
                </span>
                {String(label)}
              </span>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Business / company name
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Company type
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              <option>Waste operator</option>
              <option>Municipal partner</option>
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            License number
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.license}
              onChange={(e) => set("license", e.target.value)}
            />
          </label>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:col-span-2">
            Where is your business located?
          </p>
          <LocationSelect
            label="Province"
            value={form.province}
            options={Object.keys(rwandaLocations)}
            onChange={(value) =>
              setForm({
                ...form,
                province: value,
                district: "",
                sector: "",
                cell: "",
              })
            }
          />
          <LocationSelect
            label="District"
            value={form.district}
            options={districts}
            disabled={!form.province}
            onChange={(value) =>
              setForm({ ...form, district: value, sector: "", cell: "" })
            }
          />
          <LocationSelect
            label="Sector"
            value={form.sector}
            options={sectors}
            disabled={!form.district}
            onChange={(value) => setForm({ ...form, sector: value, cell: "" })}
          />
          <LocationSelect
            label="Cell"
            value={form.cell}
            options={cells}
            disabled={!form.sector}
            onChange={(value) => set("cell", value)}
          />
          <label className="text-xs font-bold text-slate-600">
            Street
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.street}
              onChange={(e) => set("street", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Building
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.building}
              onChange={(e) => set("building", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Description of your business
            <textarea
              className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Phone number (boss)
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Office phone (optional)
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.officePhone}
              onChange={(e) => set("officePhone", e.target.value)}
            />
          </label>
        </div>
      )}
      {step === 3 && (
        <div className="mt-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-bold">Administrator eligibility check</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload a company registration certificate or valid operating
              license. The administrator will compare it with the company,
              location, contact and license details you entered.
            </p>
          </div>
          <label className="block rounded-xl border border-dashed border-slate-300 p-5 text-sm font-bold text-slate-700">
            Verification document
            <input
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="mt-3 block w-full text-xs"
              type="file"
              onChange={(e) =>
                set("verificationDocument", e.target.files?.[0]?.name || "")
              }
            />
          </label>
          {form.verificationDocument && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
              <Check size={17} />
              {form.verificationDocument}
            </div>
          )}
          <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
            {[
              form.name,
              form.license,
              `${form.cell}, ${form.sector}, ${form.district}`,
              form.contact,
              form.email,
              form.phone,
            ].map((item) => (
              <span className="flex items-center gap-2" key={item}>
                <Check className="text-emerald-600" size={14} />
                {item}
              </span>
            ))}
          </div>
          {duplicate && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">
              An account with this email or license number already exists.
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">
          {error}
        </p>
      )}
      <div className="mt-7 flex items-center gap-3">
        {step > 1 && (
          <button
            className="px-3 py-3 text-sm font-bold text-slate-500"
            onClick={() => {
              setStep(step - 1)
              setError("")
            }}
          >
            <ChevronLeft className="mr-1 inline" size={16} />
            Back
          </button>
        )}
        <button
          className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          disabled={
            step === 1
              ? !stepOneValid
              : step === 2
                ? !stepTwoValid
                : !stepThreeValid || duplicate
          }
          onClick={() => (step < 3 ? next() : submit())}
        >
          {step < 3 ? "Continue" : "Submit for administrator review"}
          <ArrowRight size={16} />
        </button>
      </div>
    </Modal>
  )
}

function LocationSelect({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label className="text-xs font-bold text-slate-600">
      {label}
      <select
        className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm disabled:bg-slate-50 disabled:text-slate-300"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function CustomerRegistration({
  onClose,
  onComplete,
}: {
  onClose: () => void
  onComplete: () => void
}) {
  const { registerCustomer, registeredCustomers } = useStore()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [locating, setLocating] = useState(false)
  const [coordinates, setCoordinates] = useState("")
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    customerType: "Household",
    estimatedWaste: "120",
    province: "",
    district: "",
    sector: "",
    cell: "",
    address: "",
  })
  const set = (key: keyof typeof form, value: string) =>
    setForm({ ...form, [key]: value })
  const districts = form.province
    ? Object.keys(rwandaLocations[form.province] || {})
    : []
  const sectors = form.district
    ? Object.keys(rwandaLocations[form.province]?.[form.district] || {})
    : []
  const cells = form.sector
    ? rwandaLocations[form.province]?.[form.district]?.[form.sector] || []
    : []
  const stepOneValid = Boolean(
    form.name.trim() &&
      form.phone.trim() &&
      /\S+@\S+\.\S+/.test(form.email) &&
      form.password.length >= 8 &&
      form.password === form.confirmPassword &&
      Number(form.estimatedWaste) > 0,
  )
  const stepTwoValid = Boolean(
    form.province &&
      form.district &&
      form.sector &&
      form.cell &&
      form.address.trim(),
  )
  const assignedCompany = companyForArea(form.province, form.sector)
  const existingCreatedAccounts = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("ecoroute-created-accounts") || "[]",
      ) as { email: string }[]
    } catch {
      return []
    }
  })()
  const duplicate =
    registeredCustomers.some(
      (customer) => customer.email.toLowerCase() === form.email.toLowerCase(),
    ) ||
    Boolean(authorizedAccounts[form.email.toLowerCase()]) ||
    existingCreatedAccounts.some(
      (account) => account.email.toLowerCase() === form.email.toLowerCase(),
    )
  const useLocation = () => {
    setLocating(true)
    setError("")
    if (!navigator.geolocation) {
      setLocating(false)
      setError(
        "Location access is not supported by this browser. Select your location manually.",
      )
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detected = nearestConfiguredArea(
          position.coords.latitude,
          position.coords.longitude,
        )
        setCoordinates(
          `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        )
        setForm({
          ...form,
          province: detected.province,
          district: detected.district,
          sector: detected.sector,
          cell: detected.cell,
          address: form.address || "Current GPS collection point",
        })
        setLocating(false)
      },
      () => {
        setLocating(false)
        setError(
          "Location permission was not granted. Turn on location access or select Province, District, Sector and Cell manually.",
        )
      },
    )
  }
  const createAccount = () => {
    if (duplicate) {
      setError(
        "A customer account with this email already exists. Sign in instead.",
      )
      return
    }
    const customer = registerCustomer({
      name: form.name,
      phone: form.phone,
      email: form.email.trim().toLowerCase(),
      password: form.password,
      province: form.province,
      district: form.district,
      sector: form.sector,
      cell: form.cell,
      address: form.address,
      customerType: form.customerType,
      estimatedWaste: Number(form.estimatedWaste),
    })
    localStorage.setItem(
      "ecoroute-current-user",
      JSON.stringify({
        role: "Customer",
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        customerId: customer.id,
        assignment: customer.assignedCompany,
      }),
    )
    onComplete()
  }
  return (
    <Modal onClose={onClose}>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
        Customer registration · Step {step} of 3
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {step === 1
          ? "Create your account"
          : step === 2
            ? "Set your collection location"
            : "Confirm your location"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {step === 1
          ? "Enter your personal and contact details."
          : step === 2
            ? "Tell us where collections should take place, then confirm the exact area."
            : "Review your details and assigned service company before creating your account."}
      </p>
      <Progress step={step} />
      {step === 1 && (
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-slate-600 sm:col-span-2">
            Full name
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Phone number
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Email address
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Password
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Confirm password
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-slate-600">
            Customer type
            <select
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              value={form.customerType}
              onChange={(e) => set("customerType", e.target.value)}
            >
              <option>Household</option>
              <option>Business</option>
              <option>Company / Institution</option>
            </select>
          </label>
          <label className="text-xs font-bold text-slate-600">
            Estimated waste (kg per billing period)
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
              min="1"
              type="number"
              value={form.estimatedWaste}
              onChange={(e) => set("estimatedWaste", e.target.value)}
            />
          </label>
          {duplicate && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800 sm:col-span-2">
              A customer account with this email already exists.
            </p>
          )}
        </div>
      )}
      {step === 2 && (
        <div className="mt-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <LocationSelect
              label="Province"
              value={form.province}
              options={Object.keys(rwandaLocations)}
              onChange={(value) =>
                setForm({
                  ...form,
                  province: value,
                  district: "",
                  sector: "",
                  cell: "",
                })
              }
            />
            <LocationSelect
              label="District"
              value={form.district}
              options={districts}
              disabled={!form.province}
              onChange={(value) =>
                setForm({ ...form, district: value, sector: "", cell: "" })
              }
            />
            <LocationSelect
              label="Sector"
              value={form.sector}
              options={sectors}
              disabled={!form.district}
              onChange={(value) =>
                setForm({ ...form, sector: value, cell: "" })
              }
            />
            <LocationSelect
              label="Cell"
              value={form.cell}
              options={cells}
              disabled={!form.sector}
              onChange={(value) => set("cell", value)}
            />
            <label className="text-xs font-bold text-slate-600 sm:col-span-2">
              Address or street
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </label>
          </div>
          <button
            className="flex items-center gap-2 text-sm font-bold text-emerald-700 disabled:opacity-50"
            disabled={locating}
            onClick={useLocation}
          >
            <MapPin size={17} />
            {locating ? "Detecting your location…" : "Use my current location"}
          </button>
          {coordinates && (
            <p className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-900">
              Location enabled · Coordinates {coordinates}
            </p>
          )}
          <div className="relative min-h-52 overflow-hidden rounded-2xl bg-[#e6f0e5]">
            <div className="absolute inset-0 map-grid" />
            <div className="absolute left-[18%] top-[25%] h-56 w-2 rotate-45 rounded-full bg-white" />
            <div className="absolute left-1/2 top-[-15%] h-80 w-3 -rotate-[20deg] rounded-full bg-white" />
            <span className="absolute left-[48%] top-[48%] grid size-10 place-items-center rounded-full bg-emerald-700 text-white shadow-lg">
              <MapPin size={19} />
            </span>
            <span className="absolute bottom-3 left-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-800 shadow">
              {form.sector || "Select your collection area"}
            </span>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="mt-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-lg font-bold">{form.name}</p>
            <p className="mt-2 text-sm text-slate-500">
              {form.address}, {form.cell}, {form.sector}, {form.district},{" "}
              {form.province}
            </p>
            {coordinates && (
              <p className="mt-1 text-xs text-slate-400">
                Coordinates · {coordinates}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Automatically assigned service company
            </p>
            <p className="mt-2 text-xl font-bold text-emerald-950">
              {assignedCompany}
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-900">
              This active company serves your selected area. Your account,
              schedule and service requests will be connected only to this
              provider.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Customer type", form.customerType],
              ["Estimated waste", `${form.estimatedWaste} kg`],
              ["Account status", "Active after confirmation"],
            ].map(([label, value]) => (
              <div className="rounded-xl bg-slate-50 p-3" key={label}>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  {label}
                </p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
          {duplicate && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">
              This email already has an account. Return to sign in.
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">
          {error}
        </p>
      )}
      <div className="mt-7 flex items-center gap-3">
        {step > 1 && (
          <button
            className="px-3 py-3 text-sm font-bold text-slate-500"
            onClick={() => {
              setStep(step - 1)
              setError("")
            }}
          >
            <ChevronLeft className="mr-1 inline" size={16} />
            Back
          </button>
        )}
        <button
          className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
          disabled={
            step === 1
              ? !stepOneValid || duplicate
              : step === 2
                ? !stepTwoValid
                : duplicate
          }
          onClick={() => (step < 3 ? setStep(step + 1) : createAccount())}
        >
          {step < 3 ? "Continue" : "Confirm location and create account"}
          {step === 3 ? <Check size={16} /> : <ArrowRight size={16} />}
        </button>
      </div>
    </Modal>
  )
}

export default function PublicSite({
  onAuthorized,
}: {
  onAuthorized: (role: Role) => void
}) {
  const [screen, setScreen] = useState<Screen>(null)
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-[#fbfcf7] text-slate-950">
      <div className="h-1.5 bg-emerald-950" />
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#fbfcf7]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 lg:px-8">
          <Brand />
          <nav className="ml-auto hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#companies">For companies</a>
            <a href="#customers">For customers</a>
            <a href="#about">About</a>
          </nav>
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <button
              className="px-3 py-2 text-sm font-bold text-emerald-950"
              onClick={() => setScreen("login")}
            >
              Sign in
            </button>
            <button
              className="flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/10"
              onClick={() => setScreen("company")}
            >
              Register company <ArrowRight size={15} />
            </button>
          </div>
          <button
            className="ml-auto grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="border-t border-slate-200 p-5 lg:hidden">
            <div className="grid gap-2 text-sm font-semibold text-slate-700">
              <a href="#how" onClick={() => setMobileMenu(false)}>
                How it works
              </a>
              <a href="#features" onClick={() => setMobileMenu(false)}>
                Features
              </a>
              <button
                className="mt-2 rounded-xl border border-emerald-800 p-3"
                onClick={() => setScreen("login")}
              >
                Sign in
              </button>
              <button
                className="rounded-xl bg-emerald-950 p-3 text-white"
                onClick={() => setScreen("company")}
              >
                Register company
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
              <span className="h-px w-6 bg-emerald-600" /> Cleaner routes.
              Clearer operations.
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-emerald-950 sm:text-6xl lg:text-7xl">
              Smarter waste collection.{" "}
              <span className="text-emerald-600">Cleaner communities.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600">
              EcoRoute connects waste companies, field teams and customers in
              one secure platform for scheduling, route management, collection
              tracking and payments.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-950/10"
                onClick={() => setScreen("company")}
              >
                Register your company <ArrowRight size={16} />
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3.5 text-sm font-bold text-emerald-900"
                onClick={() => setScreen("customer")}
              >
                Join as a customer <UserRound size={16} />
              </button>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-slate-500">
              <div className="flex -space-x-2">
                {["AD", "MN", "EN"].map((item) => (
                  <span
                    className="grid size-8 place-items-center rounded-full border-2 border-white bg-emerald-100 text-[9px] font-bold text-emerald-800"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
              One connected workspace for every collection role
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-emerald-100 p-3 shadow-2xl shadow-emerald-950/10">
              <div className="relative h-[480px] overflow-hidden rounded-[1.4rem]">
                <img
                  alt="Recycling bin for cleaner city waste collection"
                  className="h-full w-full object-cover"
                  src={photoUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                    AI-Powered EcoRoute
                  </span>
                  <p className="mt-3 max-w-sm text-2xl sm:text-3xl font-semibold tracking-tight">
                    Smart Waste Collection, Route, Optimization
                  </p>
                  <p className="mt-3 text-xs text-emerald-100">
                    Photo by Rob Wingate on Unsplash
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-5 rounded-2xl bg-white p-4 shadow-xl sm:left-[-2rem]">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Route size={19} />
                </span>
                <div>
                  <p className="text-xs text-slate-400">Route efficiency</p>
                  <p className="font-bold text-slate-900">94% this week</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-y border-emerald-900/10 bg-[#f2f7ef]"
          id="features"
        >
          <div className="mx-auto grid max-w-7xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Centralized platform", "One source of truth", Building2],
              ["02", "Smart route management", "Plan with confidence", Route],
              [
                "03",
                "Secure role access",
                "Only assigned workspaces",
                LockKeyhole,
              ],
              [
                "04",
                "Customer connection",
                "Timely service updates",
                UsersRound,
              ],
            ].map(([number, title, text, Icon]) => {
              const FeatureIcon = Icon as typeof Building2
              return (
                <div
                  className="border-emerald-900/10 p-7 lg:border-r"
                  key={title as string}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-bold text-emerald-600">
                      {number as string}
                    </span>
                    <FeatureIcon className="text-emerald-700" size={19} />
                    <div>
                      <p className="text-sm font-bold text-emerald-950">
                        {title as string}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {text as string}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section
          className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-2 lg:px-8"
          id="how"
        >
          <div className="rounded-[2rem] bg-emerald-100 p-8">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Today’s route
                </p>
                <span className="text-xs font-bold text-emerald-600">Live</span>
              </div>
              <div className="relative mt-5 h-64 overflow-hidden rounded-xl bg-[#e7f0e3]">
                <div className="absolute inset-0 map-grid" />
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 500 260"
                >
                  <path
                    d="M30 210 C120 180 115 65 205 92 S320 225 455 48"
                    fill="none"
                    stroke="#047857"
                    strokeDasharray="8 7"
                    strokeWidth="5"
                  />
                </svg>
                {[
                  ["left-[12%] top-[68%]", "1"],
                  ["left-[38%] top-[28%]", "2"],
                  ["right-[34%] top-[60%]", "3"],
                  ["right-[8%] top-[12%]", "4"],
                ].map(([pos, no]) => (
                  <span
                    className={`absolute ${pos} grid size-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white shadow`}
                    key={no}
                  >
                    {no}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center text-sm font-bold text-slate-900">
                <span>Route 04 · 19 stops</span>
                <span className="ml-auto text-emerald-700">68%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-emerald-50">
                <div className="h-full w-2/3 rounded-full bg-emerald-700" />
              </div>
            </div>
          </div>
          <div className="self-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              How EcoRoute works
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] text-emerald-950 sm:text-5xl">
              One flow from first booking to final receipt.
            </h2>
            <div className="mt-8 divide-y divide-emerald-900/10 border-y border-emerald-900/10">
              {[
                [
                  "01",
                  "Set up your operation",
                  "Register your company, vehicles, team and service areas.",
                ],
                [
                  "02",
                  "Plan the collection",
                  "Create schedules and routes that connect locations with people.",
                ],
                [
                  "03",
                  "Keep everyone informed",
                  "Drivers update progress while customers receive timely notices.",
                ],
                [
                  "04",
                  "Close the loop",
                  "Record payment, issue a receipt and learn from reports.",
                ],
              ].map(([number, title, text]) => (
                <div className="grid grid-cols-[3rem_1fr] py-5" key={number}>
                  <span className="text-xs font-bold text-emerald-600">
                    {number}
                  </span>
                  <div>
                    <p className="font-bold text-emerald-950">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-emerald-950 px-5 py-20 text-white"
          id="companies"
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <Sparkles size={28} />
            <h2 className="mt-5 text-4xl font-semibold tracking-tight">
              Ready to modernize your collections?
            </h2>
            <p className="mt-4 max-w-2xl text-emerald-100">
              Register your organization for review, or create a household
              account to connect with your service provider.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-950"
                onClick={() => setScreen("company")}
              >
                Register company
              </button>
              <button
                className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold"
                onClick={() => setScreen("customer")}
              >
                Customer registration
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-emerald-950 px-5 pb-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <Brand light />
          <p className="text-xs text-emerald-200 sm:ml-auto">
            AUCA final-year prototype · Kigali, Rwanda
          </p>
        </div>
      </footer>

      {screen === "login" && (
        <Login
          onAuthorized={onAuthorized}
          onClose={() => setScreen(null)}
          onCustomer={() => setScreen("customer")}
        />
      )}
      {screen === "company" && (
        <CompanyRegistration onClose={() => setScreen(null)} />
      )}
      {screen === "customer" && (
        <CustomerRegistration
          onClose={() => setScreen(null)}
          onComplete={() => onAuthorized("Customer")}
        />
      )}
    </div>
  )
}
