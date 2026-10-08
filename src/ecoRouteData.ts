export type CustomerRecord = {
  id: string
  name: string
  phone: string
  email: string
  nationalId: string
  type: "Household" | "Business" | "Company / Institution"
  waste: string
  volume: number
  plan: string
  period: "Monthly" | "Weekly"
  fee: number
  location: string
  zone: "Kimironko" | "Remera" | "Niboye" | "Nyamirambo"
  district: "Gasabo" | "Kicukiro" | "Nyarugenge"
  sector: string
  cell: string
  village: string
  latitude: number
  longitude: number
  collectionPoint: string
  route: string
  status: "Active" | "Inactive" | "Suspended"
  createdDate: string
}

export type CollectionRecord = {
  id: string
  customerId: string
  customerName: string
  zone: "Kimironko" | "Remera" | "Niboye" | "Nyamirambo"
  district: string
  route: string
  driver: string
  vehicle: string
  date: string
  timeSlot: string
  completedAt?: string
  status: "Completed" | "In progress" | "Pending" | "Missed"
  wasteType: "General" | "Organic" | "Recyclable" | "Bulky"
  weightKg?: number
  address: string
  missedReason?: string
  notes?: string
}

export type OverdueAccount = {
  id: string
  customerId: string
  customerName: string
  zone: "Kimironko" | "Remera" | "Niboye" | "Nyamirambo"
  invoiceId: string
  amount: number
  daysOverdue: number
  stage: "Grace period" | "Reminder" | "Warning" | "Suspended" | "Legal"
  status: "Open" | "Contacted" | "Promised to pay" | "Resolved"
  assignedTo: string
  dueDate: string
  lastAction: string
  notes?: string
}

export type Vehicle = {
  id: string
  plateNumber: string
  model: string
  capacityTonnes: number
  wasteType: string
  driver: string
  status: "Available" | "On route" | "In maintenance" | "Deactivated"
  currentRoute: string
  lastServiceDate: string
  assignmentHistory: Array<{
    date: string
    route: string
    driver: string
    action: string
  }>
}

export type TripRecord = {
  id: string
  vehicle: string
  driver: string
  route: string
  zone: string
  startTime: string
  endTime?: string
  distanceKm: number
  durationMins: number
  status: "In progress" | "Completed" | "Cancelled"
  timeline: Array<{
    time: string
    event: string
    location: string
  }>
  exception?: {
    type: "Breakdown" | "Accident" | "Road blocked" | "Delay"
    reportedBy: string
    time: string
    details: string
    status: "Investigating" | "Resolved"
  }
}

export type LandfillTrip = {
  id: string
  ticketNo: string
  vehicle: string
  driver: string
  wasteType: "General" | "Organic" | "Recyclable" | "Bulky" | "Mixed"
  departureTime: string
  arrivalTime: string
  grossWeightTonnes: number
  tareWeightTonnes: number
  netWeightTonnes: number
  status: "En route" | "Arrived" | "Completed"
  confirmedBy?: string
  confirmedAt?: string
  zone: string
  destination: string
  notes?: string
}

export type ScheduledSms = {
  id: string
  recipientGroup: "One customer" | "Zone" | "Route" | "All overdue" | "All drivers" | "All customers"
  targetName: string
  scheduledDate: string
  scheduledTime: string
  messageText: string
  status: "Scheduled" | "Sent" | "Delivered" | "Failed" | "Cancelled"
  recipientsCount: number
  createdBy: string
  createdAt: string
}

export type ActiveSession = {
  id: string
  user: string
  role: string
  device: string
  ip: string
  location: string
  lastActive: string
  loginTime: string
}

// Generate the 671 customers deterministically across the 4 zones
// Kimironko: 186 | Remera: 164 | Niboye: 172 | Nyamirambo: 149
const firstNames = [
  "Jean", "Patrick", "Aline", "Diane", "Eric", "Claudine", "Claude", "Alice", "Emmanuel", "Rose",
  "David", "Grace", "Paul", "Bella", "Marie", "Francois", "Chantal", "Innocent", "Solange", "Olivier",
  "Vestine", "Theogene", "Anatole", "Clementine", "Placide", "Nathalie", "Fabrice", "Jeannette", "Gaspard", "Josiane",
]

const lastNames = [
  "Romeo", "Habimana", "Uwase", "Mukamana", "Niyonzima", "Uwera", "Mugenzi", "Karemera", "Rukundo", "Tuyishime",
  "Ndayisenga", "Keza", "Kayitesi", "Uwamahoro", "Mugabo", "Hakizimana", "Nshimiyimana", "Bizimungu", "Kwizera", "Mutabazi",
  "Ngabo", "Rutayisire", "Gasana", "Twagirayezu", "Murenzi", "Nsengiyumva", "Sebahire", "Iradukunda", "Manzi", "Shimwa",
]

const zoneConfig = {
  Kimironko: {
    district: "Gasabo" as const,
    sector: "Kimironko",
    cells: ["Kibagabaga", "Bibare", "Nyagatovu"],
    villages: ["Kibagabaga", "Rwesero", "Amahoro", "Nyabisindu", "Kamatamu", "Urumuri", "Inyange"],
    route: "KG 18",
    count: 186,
    latBase: -1.9385,
    lngBase: 30.1250,
  },
  Remera: {
    district: "Gasabo" as const,
    sector: "Remera",
    cells: ["Rukiri I", "Rukiri II", "Nyabisindu"],
    villages: ["Gisimenti", "Amahoro", "Rukiri Center", "Kora", "Rugando", "Gishushu"],
    route: "KG 11",
    count: 164,
    latBase: -1.9560,
    lngBase: 30.1080,
  },
  Niboye: {
    district: "Kicukiro" as const,
    sector: "Niboye",
    cells: ["Gatare", "Niboye", "Kigabiro"],
    villages: ["Gatare Center", "Indatwa", "Ubumwe", "Kigabiro", "Gikondo Border", "Sonatubes"],
    route: "KK 15",
    count: 172,
    latBase: -1.9720,
    lngBase: 30.0890,
  },
  Nyamirambo: {
    district: "Nyarugenge" as const,
    sector: "Nyamirambo",
    cells: ["Rugarama", "Mumena", "Cyivugiza"],
    villages: ["Cosmos", "Tapis Rouge", "Biryogo", "Mumena North", "Cyivugiza Hills", "Mageragere View"],
    route: "KN 07",
    count: 149,
    latBase: -1.9840,
    lngBase: 30.0480,
  },
}

export function generateAllCustomers(): CustomerRecord[] {
  const result: CustomerRecord[] = [
    {
      id: "CUS-2048",
      name: "Jean Romeo",
      phone: "+250 788 123 456",
      email: "jean.romeo@ecoroute.rw",
      nationalId: "1199080012345678",
      type: "Household",
      waste: "General, Organic",
      volume: 180,
      plan: "Household Standard",
      period: "Monthly",
      fee: 6000,
      location: "Niboye",
      zone: "Niboye",
      district: "Kicukiro",
      sector: "Niboye",
      cell: "Gatare",
      village: "Indatwa",
      latitude: -1.9715,
      longitude: 30.0895,
      collectionPoint: "CP-Niboye-01",
      route: "KK 15",
      status: "Active",
      createdDate: "2026-01-15",
    },
    {
      id: "CUS-2051",
      name: "Patrick Habimana",
      phone: "+250 788 201 440",
      email: "patrick.habimana@gmail.com",
      nationalId: "1198880023456789",
      type: "Household",
      waste: "General",
      volume: 90,
      plan: "Household Basic",
      period: "Monthly",
      fee: 5000,
      location: "Remera",
      zone: "Remera",
      district: "Gasabo",
      sector: "Remera",
      cell: "Rukiri II",
      village: "Gisimenti",
      latitude: -1.9568,
      longitude: 30.1072,
      collectionPoint: "CP-Remera-04",
      route: "KG 11",
      status: "Active",
      createdDate: "2026-02-01",
    },
    {
      id: "CUS-2055",
      name: "Aline Uwase",
      phone: "+250 788 404 100",
      email: "aline.uwase@yahoo.fr",
      nationalId: "1199570034567890",
      type: "Household",
      waste: "General, Organic",
      volume: 410,
      plan: "Household Large / Shared compound",
      period: "Monthly",
      fee: 10000,
      location: "Niboye",
      zone: "Niboye",
      district: "Kicukiro",
      sector: "Niboye",
      cell: "Niboye",
      village: "Sonatubes",
      latitude: -1.9732,
      longitude: 30.0912,
      collectionPoint: "CP-Niboye-02",
      route: "KK 15",
      status: "Suspended",
      createdDate: "2026-02-14",
    },
    {
      id: "CUS-2060",
      name: "Kimironko Market",
      phone: "+250 788 883 200",
      email: "market.office@kimironko.rw",
      nationalId: "1198580045678901",
      type: "Business",
      waste: "Commercial",
      volume: 130,
      plan: "Business Weekly",
      period: "Weekly",
      fee: 5000,
      location: "Kimironko",
      zone: "Kimironko",
      district: "Gasabo",
      sector: "Kimironko",
      cell: "Bibare",
      village: "Nyabisindu",
      latitude: -1.9392,
      longitude: 30.1265,
      collectionPoint: "CP-Kimironko-01",
      route: "KG 18",
      status: "Active",
      createdDate: "2026-01-20",
    },
    {
      id: "CUS-2064",
      name: "Green Hills Residence",
      phone: "+250 788 551 090",
      email: "admin@greenhills.rw",
      nationalId: "1198080056789012",
      type: "Company / Institution",
      waste: "Bulky, Mixed",
      volume: 1250,
      plan: "Company / Institution",
      period: "Monthly",
      fee: 20000,
      location: "Nyamirambo",
      zone: "Nyamirambo",
      district: "Nyarugenge",
      sector: "Nyamirambo",
      cell: "Rugarama",
      village: "Cosmos",
      latitude: -1.9845,
      longitude: 30.0495,
      collectionPoint: "CP-Nyamirambo-03",
      route: "KN 07",
      status: "Active",
      createdDate: "2026-01-10",
    },
  ]

  const seededIds = new Set(result.map((c) => c.id))
  const seededByZone: Record<keyof typeof zoneConfig, number> = {
    Kimironko: 1, // CUS-2060
    Remera: 1,    // CUS-2051
    Niboye: 2,    // CUS-2048, CUS-2055
    Nyamirambo: 1,// CUS-2064
  }

  let idCounter = 2065

  for (const [zoneKey, config] of Object.entries(zoneConfig)) {
    const targetCount = config.count
    const currentCount = seededByZone[zoneKey as keyof typeof zoneConfig]
    const needed = targetCount - currentCount

    for (let i = 0; i < needed; i++) {
      const id = `CUS-${idCounter++}`
      const fn = firstNames[(i * 3 + zoneKey.length) % firstNames.length]
      const ln = lastNames[(i * 7 + idCounter) % lastNames.length]
      const name = `${fn} ${ln}`
      const cell = config.cells[i % config.cells.length]
      const village = config.villages[(i + 2) % config.villages.length]

      // Determine customer plan & type
      const isBusiness = i % 14 === 0
      const isInst = i % 31 === 0
      const plan = isInst
        ? "Company / Institution"
        : isBusiness
        ? "Business Weekly"
        : i % 4 === 0
        ? "Household Large / Shared compound"
        : i % 2 === 0
        ? "Household Standard"
        : "Household Basic"

      const fee =
        plan === "Company / Institution"
          ? 20000
          : plan === "Household Large / Shared compound"
          ? 10000
          : plan === "Household Standard"
          ? 6000
          : 5000

      const type = isInst
        ? ("Company / Institution" as const)
        : isBusiness
        ? ("Business" as const)
        : ("Household" as const)

      const status =
        i % 45 === 0
          ? ("Suspended" as const)
          : i % 21 === 0
          ? ("Inactive" as const)
          : ("Active" as const)

      // Perturb latitude and longitude slightly
      const latOffset = ((i % 25) - 12) * 0.0006
      const lngOffset = (((i * 3) % 25) - 12) * 0.0007

      result.push({
        id,
        name,
        phone: `+250 788 ${String(100000 + ((idCounter * 97) % 900000)).slice(0, 6)}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i % 5 === 0 ? i : ""}@gmail.com`,
        nationalId: `1199${String(100000000000 + i * 137).slice(0, 12)}`,
        type,
        waste: isInst ? "Bulky, Mixed" : isBusiness ? "Commercial" : "General, Organic",
        volume: fee * 0.04,
        plan,
        period: isBusiness ? "Weekly" : "Monthly",
        fee,
        location: zoneKey,
        zone: zoneKey as "Kimironko" | "Remera" | "Niboye" | "Nyamirambo",
        district: config.district,
        sector: config.sector,
        cell,
        village,
        latitude: Number((config.latBase + latOffset).toFixed(5)),
        longitude: Number((config.lngBase + lngOffset).toFixed(5)),
        collectionPoint: `CP-${zoneKey}-${String((i % 6) + 1).padStart(2, "0")}`,
        route: config.route,
        status,
        createdDate: `2026-0${(i % 8) + 1}-1${(i % 9)}`,
      })
    }
  }

  return result
}

// 148 Collections Today: 126 completed, 8 in progress, 14 pending/missed (10 pending, 4 missed)
// Kimironko: 42 (36 completed, 2 in progress, 3 pending, 1 missed)
// Remera: 38 (33 completed, 2 in progress, 2 pending, 1 missed)
// Niboye: 36 (31 completed, 2 in progress, 2 pending, 1 missed)
// Nyamirambo: 32 (26 completed, 2 in progress, 3 pending, 1 missed)
export function generateTodayCollections(allCustomers: CustomerRecord[]): CollectionRecord[] {
  const collections: CollectionRecord[] = []
  const today = new Date().toISOString().slice(0, 10)

  const zonePlans: Array<{
    zone: "Kimironko" | "Remera" | "Niboye" | "Nyamirambo"
    completed: number
    inProgress: number
    pending: number
    missed: number
    driver: string
    vehicle: string
    route: string
    district: string
  }> = [
    {
      zone: "Kimironko",
      completed: 36,
      inProgress: 2,
      pending: 3,
      missed: 1,
      driver: "Eric Niyonzima",
      vehicle: "RW 412 A",
      route: "KG 18",
      district: "Gasabo",
    },
    {
      zone: "Remera",
      completed: 33,
      inProgress: 2,
      pending: 2,
      missed: 1,
      driver: "Claude Mugenzi",
      vehicle: "RW 307 K",
      route: "KG 11",
      district: "Gasabo",
    },
    {
      zone: "Niboye",
      completed: 31,
      inProgress: 2,
      pending: 2,
      missed: 1,
      driver: "Alice Uwera",
      vehicle: "RW 118 T",
      route: "KK 15",
      district: "Kicukiro",
    },
    {
      zone: "Nyamirambo",
      completed: 26,
      inProgress: 2,
      pending: 3,
      missed: 1,
      driver: "Patrick Tuyishime",
      vehicle: "RW 922 D",
      route: "KN 07",
      district: "Nyarugenge",
    },
  ]

  let collectionSeq = 101

  zonePlans.forEach((zp) => {
    const zoneCustomers = allCustomers.filter((c) => c.zone === zp.zone)
    let cIdx = 0

    // 1. Completed
    for (let i = 0; i < zp.completed; i++) {
      const cust = zoneCustomers[cIdx % zoneCustomers.length]
      cIdx++
      const hour = 7 + Math.floor(i / 8)
      const minute = ((i * 7) % 60).toString().padStart(2, "0")
      collections.push({
        id: `COL-261008-${collectionSeq++}`,
        customerId: cust.id,
        customerName: cust.name,
        zone: zp.zone,
        district: zp.district,
        route: zp.route,
        driver: zp.driver,
        vehicle: zp.vehicle,
        date: today,
        timeSlot: `${String(hour).padStart(2, "0")}:00 – ${String(hour + 1).padStart(2, "0")}:00`,
        completedAt: `${String(hour).padStart(2, "0")}:${minute}`,
        status: "Completed",
        wasteType: i % 4 === 0 ? "Organic" : i % 5 === 0 ? "Recyclable" : "General",
        weightKg: 28 + (i % 24),
        address: `${cust.village}, ${cust.cell}, ${cust.sector}`,
        notes: "Collection completed and signed off.",
      })
    }

    // 2. In progress
    for (let i = 0; i < zp.inProgress; i++) {
      const cust = zoneCustomers[cIdx % zoneCustomers.length]
      cIdx++
      collections.push({
        id: `COL-261008-${collectionSeq++}`,
        customerId: cust.id,
        customerName: cust.name,
        zone: zp.zone,
        district: zp.district,
        route: zp.route,
        driver: zp.driver,
        vehicle: zp.vehicle,
        date: today,
        timeSlot: "11:00 – 12:00",
        status: "In progress",
        wasteType: "General",
        address: `${cust.village}, ${cust.cell}, ${cust.sector}`,
        notes: "Crew currently on site at collection point.",
      })
    }

    // 3. Pending
    for (let i = 0; i < zp.pending; i++) {
      const cust = zoneCustomers[cIdx % zoneCustomers.length]
      cIdx++
      collections.push({
        id: `COL-261008-${collectionSeq++}`,
        customerId: cust.id,
        customerName: cust.name,
        zone: zp.zone,
        district: zp.district,
        route: zp.route,
        driver: zp.driver,
        vehicle: zp.vehicle,
        date: today,
        timeSlot: "14:00 – 16:00",
        status: "Pending",
        wasteType: i % 2 === 0 ? "General" : "Recyclable",
        address: `${cust.village}, ${cust.cell}, ${cust.sector}`,
        notes: "Queued for afternoon schedule window.",
      })
    }

    // 4. Missed
    for (let i = 0; i < zp.missed; i++) {
      const cust = zoneCustomers[cIdx % zoneCustomers.length]
      cIdx++
      const reasons = [
        "Gate locked / Resident away",
        "Narrow access blocked by road construction",
        "Bin not presented at designated collection point",
        "Heavy rain soil blockage in unpaved lane",
      ]
      collections.push({
        id: `COL-261008-${collectionSeq++}`,
        customerId: cust.id,
        customerName: cust.name,
        zone: zp.zone,
        district: zp.district,
        route: zp.route,
        driver: zp.driver,
        vehicle: zp.vehicle,
        date: today,
        timeSlot: "08:30 – 09:30",
        status: "Missed",
        wasteType: "General",
        address: `${cust.village}, ${cust.cell}, ${cust.sector}`,
        missedReason: reasons[(collections.length + i) % reasons.length],
        notes: "Driver flagged exception in mobile app. Rescheduling required.",
      })
    }
  })

  return collections
}

// 47 Overdue Accounts = EXACTLY RWF 163,000!
// 10 accounts of 5,000 = 50,000
// 12 accounts of 4,000 = 48,000
// 15 accounts of 3,000 = 45,000
// 10 accounts of 2,000 = 20,000
// Sum: 50,000 + 48,000 + 45,000 + 20,000 = 163,000
// Total count = 10 + 12 + 15 + 10 = 47 accounts
export function generateOverdueAccounts(allCustomers: CustomerRecord[]): OverdueAccount[] {
  const accounts: OverdueAccount[] = []
  const amounts = [
    ...Array(10).fill(5000),
    ...Array(12).fill(4000),
    ...Array(15).fill(3000),
    ...Array(10).fill(2000),
  ]

  const stages: Array<OverdueAccount["stage"]> = [
    "Grace period", "Reminder", "Warning", "Suspended", "Legal"
  ]
  const statuses: Array<OverdueAccount["status"]> = [
    "Open", "Contacted", "Promised to pay", "Open" as const
  ]
  const collectors = ["Claudine Uwase", "Eric Niyonzima", "Diane Mukamana", "System Automation"]

  amounts.forEach((amount, index) => {
    const cust = allCustomers[index % allCustomers.length]
    const daysOverdue = 5 + ((index * 3) % 40)
    const stage = daysOverdue > 30 ? "Suspended" : daysOverdue > 15 ? "Warning" : daysOverdue > 5 ? "Reminder" : "Grace period"
    const status = statuses[index % statuses.length]

    accounts.push({
      id: `OD-${String(index + 1).padStart(3, "0")}`,
      customerId: cust.id,
      customerName: cust.name,
      zone: cust.zone,
      invoiceId: `INV-2026-${String(9000 + index)}`,
      amount,
      daysOverdue,
      stage,
      status,
      assignedTo: collectors[index % collectors.length],
      dueDate: `2026-09-${String((index % 25) + 1).padStart(2, "0")}`,
      lastAction: stage === "Suspended" ? "Suspension SMS sent" : stage === "Warning" ? "Day 15 warning SMS sent" : "Day 5 reminder sent",
      notes: "Auto-synced with MoMo billing gateway.",
    })
  })

  return accounts
}

// 8 Operational Fleet Vehicles
export const initialFleetVehicles: Vehicle[] = [
  {
    id: "VEH-01",
    plateNumber: "RW 412 A",
    model: "Isuzu Forward Compactor (7.5 Tonnes)",
    capacityTonnes: 7.5,
    wasteType: "General / Mixed",
    driver: "Eric Niyonzima",
    status: "On route",
    currentRoute: "KG 18 – Kimironko",
    lastServiceDate: "2026-09-18",
    assignmentHistory: [
      { date: "2026-10-08", route: "KG 18", driver: "Eric Niyonzima", action: "Assigned active shift" },
      { date: "2026-10-07", route: "KG 18", driver: "Eric Niyonzima", action: "Shift completed (28.4 km)" },
    ],
  },
  {
    id: "VEH-02",
    plateNumber: "RW 307 K",
    model: "Mitsubishi Fuso Fighter (6.0 Tonnes)",
    capacityTonnes: 6.0,
    wasteType: "General / Organic",
    driver: "Claude Mugenzi",
    status: "On route",
    currentRoute: "KG 11 – Remera",
    lastServiceDate: "2026-09-24",
    assignmentHistory: [
      { date: "2026-10-08", route: "KG 11", driver: "Claude Mugenzi", action: "Assigned active shift" },
    ],
  },
  {
    id: "VEH-03",
    plateNumber: "RW 118 T",
    model: "Hino 500 Series (8.0 Tonnes)",
    capacityTonnes: 8.0,
    wasteType: "General / Bulky",
    driver: "Alice Uwera",
    status: "On route",
    currentRoute: "KK 15 – Niboye",
    lastServiceDate: "2026-09-12",
    assignmentHistory: [
      { date: "2026-10-08", route: "KK 15", driver: "Alice Uwera", action: "Assigned active shift" },
    ],
  },
  {
    id: "VEH-04",
    plateNumber: "RW 922 D",
    model: "Isuzu NPR Compactor (5.0 Tonnes)",
    capacityTonnes: 5.0,
    wasteType: "General / Recyclable",
    driver: "Patrick Tuyishime",
    status: "On route",
    currentRoute: "KN 07 – Nyamirambo",
    lastServiceDate: "2026-09-28",
    assignmentHistory: [
      { date: "2026-10-08", route: "KN 07", driver: "Patrick Tuyishime", action: "Assigned active shift" },
    ],
  },
  {
    id: "VEH-05",
    plateNumber: "RW 551 C",
    model: "Mercedes-Benz Atego (10.0 Tonnes)",
    capacityTonnes: 10.0,
    wasteType: "Commercial / Bulky",
    driver: "Emmanuel Karemera",
    status: "Available",
    currentRoute: "Unassigned (Standby)",
    lastServiceDate: "2026-10-02",
    assignmentHistory: [
      { date: "2026-10-06", route: "KG 45", driver: "Emmanuel Karemera", action: "Completed industrial route" },
    ],
  },
  {
    id: "VEH-06",
    plateNumber: "RW 684 M",
    model: "Isuzu FSR Tipper (6.5 Tonnes)",
    capacityTonnes: 6.5,
    wasteType: "Organic / Green Waste",
    driver: "Aline Mukamana",
    status: "Available",
    currentRoute: "Unassigned (Standby)",
    lastServiceDate: "2026-09-30",
    assignmentHistory: [
      { date: "2026-10-07", route: "KK 22", driver: "Aline Mukamana", action: "Completed collection" },
    ],
  },
  {
    id: "VEH-07",
    plateNumber: "RW 719 P",
    model: "FAW Tiger V (7.0 Tonnes)",
    capacityTonnes: 7.0,
    wasteType: "General Waste",
    driver: "Jean Bosco",
    status: "In maintenance",
    currentRoute: "Gikondo Central Workshop (Hydraulic overhaul)",
    lastServiceDate: "2026-10-05",
    assignmentHistory: [
      { date: "2026-10-05", route: "Workshop", driver: "Jean Bosco", action: "Brought in for scheduled maintenance" },
    ],
  },
  {
    id: "VEH-08",
    plateNumber: "RW 833 B",
    model: "Dongfeng Heavy Compactor (8.5 Tonnes)",
    capacityTonnes: 8.5,
    wasteType: "Institution / Bulky",
    driver: "Keza Bella",
    status: "Available",
    currentRoute: "Unassigned (Reserve)",
    lastServiceDate: "2026-09-15",
    assignmentHistory: [
      { date: "2026-10-06", route: "KN 09", driver: "Keza Bella", action: "Night shift completed" },
    ],
  },
]

// 12 Nduba Landfill Trips Today totaling 84.5 Tonnes
export const initialLandfillTrips: LandfillTrip[] = [
  {
    id: "NDB-261008-01",
    ticketNo: "WBG-2026-9471",
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    wasteType: "General",
    departureTime: "08:15",
    arrivalTime: "08:52",
    grossWeightTonnes: 14.8,
    tareWeightTonnes: 7.6,
    netWeightTonnes: 7.2,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Mugabo",
    confirmedAt: "08:55",
    zone: "Kimironko",
    destination: "Nduba Cell 4 Disposal Point",
  },
  {
    id: "NDB-261008-02",
    ticketNo: "WBG-2026-9472",
    vehicle: "RW 307 K",
    driver: "Claude Mugenzi",
    wasteType: "Organic",
    departureTime: "08:30",
    arrivalTime: "09:08",
    grossWeightTonnes: 12.4,
    tareWeightTonnes: 6.5,
    netWeightTonnes: 5.9,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Mugabo",
    confirmedAt: "09:12",
    zone: "Remera",
    destination: "Nduba Cell 2 Composting Trench",
  },
  {
    id: "NDB-261008-03",
    ticketNo: "WBG-2026-9473",
    vehicle: "RW 118 T",
    driver: "Alice Uwera",
    wasteType: "General",
    departureTime: "09:00",
    arrivalTime: "09:44",
    grossWeightTonnes: 15.9,
    tareWeightTonnes: 8.1,
    netWeightTonnes: 7.8,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Uwera",
    confirmedAt: "09:48",
    zone: "Niboye",
    destination: "Nduba Cell 3 Compaction Zone",
  },
  {
    id: "NDB-261008-04",
    ticketNo: "WBG-2026-9474",
    vehicle: "RW 922 D",
    driver: "Patrick Tuyishime",
    wasteType: "Mixed",
    departureTime: "09:30",
    arrivalTime: "10:15",
    grossWeightTonnes: 10.8,
    tareWeightTonnes: 5.9,
    netWeightTonnes: 4.9,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Uwera",
    confirmedAt: "10:18",
    zone: "Nyamirambo",
    destination: "Nduba Cell 4 Disposal Point",
  },
  {
    id: "NDB-261008-05",
    ticketNo: "WBG-2026-9475",
    vehicle: "RW 551 C",
    driver: "Emmanuel Karemera",
    wasteType: "Bulky",
    departureTime: "10:00",
    arrivalTime: "10:42",
    grossWeightTonnes: 19.8,
    tareWeightTonnes: 10.2,
    netWeightTonnes: 9.6,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Mugabo",
    confirmedAt: "10:45",
    zone: "Commercial",
    destination: "Nduba Heavy Machinery Sector",
  },
  {
    id: "NDB-261008-06",
    ticketNo: "WBG-2026-9476",
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    wasteType: "General",
    departureTime: "10:40",
    arrivalTime: "11:18",
    grossWeightTonnes: 14.7,
    tareWeightTonnes: 7.6,
    netWeightTonnes: 7.1,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Mugabo",
    confirmedAt: "11:22",
    zone: "Kimironko",
    destination: "Nduba Cell 4 Disposal Point",
  },
  {
    id: "NDB-261008-07",
    ticketNo: "WBG-2026-9477",
    vehicle: "RW 307 K",
    driver: "Claude Mugenzi",
    wasteType: "General",
    departureTime: "11:15",
    arrivalTime: "11:53",
    grossWeightTonnes: 12.3,
    tareWeightTonnes: 6.5,
    netWeightTonnes: 5.8,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Uwera",
    confirmedAt: "11:58",
    zone: "Remera",
    destination: "Nduba Cell 3 Compaction Zone",
  },
  {
    id: "NDB-261008-08",
    ticketNo: "WBG-2026-9478",
    vehicle: "RW 118 T",
    driver: "Alice Uwera",
    wasteType: "General",
    departureTime: "11:45",
    arrivalTime: "12:28",
    grossWeightTonnes: 15.8,
    tareWeightTonnes: 8.1,
    netWeightTonnes: 7.7,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Uwera",
    confirmedAt: "12:32",
    zone: "Niboye",
    destination: "Nduba Cell 4 Disposal Point",
  },
  {
    id: "NDB-261008-09",
    ticketNo: "WBG-2026-9479",
    vehicle: "RW 684 M",
    driver: "Aline Mukamana",
    wasteType: "Organic",
    departureTime: "12:30",
    arrivalTime: "13:12",
    grossWeightTonnes: 13.0,
    tareWeightTonnes: 6.6,
    netWeightTonnes: 6.4,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Mugabo",
    confirmedAt: "13:15",
    zone: "Gasabo",
    destination: "Nduba Cell 2 Composting Trench",
  },
  {
    id: "NDB-261008-10",
    ticketNo: "WBG-2026-9480",
    vehicle: "RW 922 D",
    driver: "Patrick Tuyishime",
    wasteType: "Mixed",
    departureTime: "13:00",
    arrivalTime: "13:45",
    grossWeightTonnes: 11.0,
    tareWeightTonnes: 5.9,
    netWeightTonnes: 5.1,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Mugabo",
    confirmedAt: "13:50",
    zone: "Nyamirambo",
    destination: "Nduba Cell 4 Disposal Point",
  },
  {
    id: "NDB-261008-11",
    ticketNo: "WBG-2026-9481",
    vehicle: "RW 412 A",
    driver: "Eric Niyonzima",
    wasteType: "General",
    departureTime: "14:10",
    arrivalTime: "14:50",
    grossWeightTonnes: 15.1,
    tareWeightTonnes: 7.6,
    netWeightTonnes: 7.5,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Uwera",
    confirmedAt: "14:55",
    zone: "Kimironko",
    destination: "Nduba Cell 3 Compaction Zone",
  },
  {
    id: "NDB-261008-12",
    ticketNo: "WBG-2026-9482",
    vehicle: "RW 307 K",
    driver: "Claude Mugenzi",
    wasteType: "General",
    departureTime: "14:35",
    arrivalTime: "15:20",
    grossWeightTonnes: 16.0,
    tareWeightTonnes: 6.5,
    netWeightTonnes: 9.5,
    status: "Completed",
    confirmedBy: "Nduba Weighbridge Officer Uwera",
    confirmedAt: "15:24",
    zone: "Remera",
    destination: "Nduba Cell 4 Disposal Point",
  },
]
// Net weight sum: 7.2+5.9+7.8+4.9+9.6+7.1+5.8+7.7+6.4+5.1+7.5+9.5 = 84.5 Tonnes!
// Total trips: 12!

export const turnByTurnDirections = [
  {
    step: 1,
    maneuver: "depart",
    instruction: "Depart EcoRoute Kimironko Depot heading North on KG 18 Ave",
    distance: "350 m",
    time: "2 mins",
    icon: "straight",
  },
  {
    step: 2,
    maneuver: "turn-right",
    instruction: "Turn right onto KG 45 St toward Kibagabaga Health Center",
    distance: "1.2 km",
    time: "4 mins",
    icon: "right",
  },
  {
    step: 3,
    maneuver: "stop",
    instruction: "Collection Stop 1: CP-Kimironko-01 (Kibagabaga Cell Offices, 12 bins)",
    distance: "0 m",
    time: "8 mins",
    icon: "stop",
  },
  {
    step: 4,
    maneuver: "turn-left",
    instruction: "Turn left onto KG 202 St toward Nyabisindu Commercial Hub",
    distance: "850 m",
    time: "3 mins",
    icon: "left",
  },
  {
    step: 5,
    maneuver: "stop",
    instruction: "Collection Stop 2: CP-Kimironko-03 (Nyabisindu Market Loop, 16 bins)",
    distance: "0 m",
    time: "10 mins",
    icon: "stop",
  },
  {
    step: 6,
    maneuver: "straight",
    instruction: "Continue straight through roundabout toward Remera Express Highway",
    distance: "2.1 km",
    time: "5 mins",
    icon: "straight",
  },
  {
    step: 7,
    maneuver: "turn-right",
    instruction: "Turn right onto Nduba Landfill Link Highway (RN 3 Access Road)",
    distance: "8.4 km",
    time: "16 mins",
    icon: "right",
  },
  {
    step: 8,
    maneuver: "destination",
    instruction: "Arrive at Nduba Landfill Weighbridge Scale 1 (Ticket Verification)",
    distance: "150 m",
    time: "1 min",
    icon: "flag",
  },
]

export const initialActiveSessions: ActiveSession[] = [
  { id: "SESS-101", user: "System Administrator", role: "Admin", device: "Chrome 128 · Windows 11", ip: "197.243.22.84", location: "Kigali, Rwanda", lastActive: "Just now", loginTime: "07:30" },
  { id: "SESS-102", user: "Diane Mukamana", role: "Manager", device: "Safari 17 · iPadOS", ip: "197.243.24.110", location: "Kigali, Rwanda", lastActive: "2 min ago", loginTime: "06:45" },
  { id: "SESS-103", user: "Claudine Uwase", role: "Finance", device: "Edge 126 · Windows 10", ip: "197.243.19.45", location: "Kigali, Rwanda", lastActive: "Just now", loginTime: "08:00" },
  { id: "SESS-104", user: "Eric Niyonzima", role: "Employee / Driver", device: "EcoRoute Driver App · Android 14", ip: "105.178.4.12", location: "Kimironko, Kigali", lastActive: "Just now", loginTime: "06:30" },
  { id: "SESS-105", user: "Claude Mugenzi", role: "Employee / Driver", device: "EcoRoute Driver App · Android 13", ip: "105.178.6.88", location: "Remera, Kigali", lastActive: "4 min ago", loginTime: "06:35" },
  { id: "SESS-106", user: "Alice Uwera", role: "Employee / Driver", device: "EcoRoute Driver App · Android 14", ip: "105.178.11.201", location: "Niboye, Kigali", lastActive: "1 min ago", loginTime: "06:40" },
  { id: "SESS-107", user: "Patrick Tuyishime", role: "Employee / Driver", device: "EcoRoute Driver App · Android 12", ip: "105.178.8.53", location: "Nyamirambo, Kigali", lastActive: "Just now", loginTime: "06:45" },
  { id: "SESS-108", user: "Jean Romeo", role: "Customer", device: "Chrome Mobile · Android", ip: "197.243.30.12", location: "Kigali, Rwanda", lastActive: "5 min ago", loginTime: "08:15" },
  { id: "SESS-109", user: "Emmanuel Karemera", role: "Employee / Driver", device: "EcoRoute Driver App · Android 14", ip: "105.178.9.14", location: "Kigali, Rwanda", lastActive: "12 min ago", loginTime: "07:15" },
  { id: "SESS-110", user: "Aline Mukamana", role: "Employee / Driver", device: "EcoRoute Driver App · Android 13", ip: "105.178.3.92", location: "Kigali, Rwanda", lastActive: "18 min ago", loginTime: "07:20" },
  { id: "SESS-111", user: "Nduba Weighbridge In-charge", role: "Operations Staff", device: "Firefox 125 · Ubuntu", ip: "197.243.15.8", location: "Nduba Landfill Site", lastActive: "Just now", loginTime: "07:00" },
  { id: "SESS-112", user: "Keza Bella", role: "Employee / Driver", device: "EcoRoute Driver App · Android 14", ip: "105.178.10.45", location: "Kigali, Rwanda", lastActive: "22 min ago", loginTime: "07:10" },
  { id: "SESS-113", user: "Gasabo District Inspector", role: "Municipal Partner", device: "Chrome 127 · macOS", ip: "197.243.20.7", location: "Gasabo District Office", lastActive: "8 min ago", loginTime: "08:20" },
  { id: "SESS-114", user: "Patrick Habimana", role: "Customer", device: "Safari 17 · iOS", ip: "197.243.29.98", location: "Kigali, Rwanda", lastActive: "15 min ago", loginTime: "08:35" },
]

export const initialPermissionMatrix: Record<string, Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean }>> = {
  Admin: {
    Dashboard: { view: true, create: true, edit: true, delete: true },
    Customers: { view: true, create: true, edit: true, delete: true },
    Collections: { view: true, create: true, edit: true, delete: true },
    Schedules: { view: true, create: true, edit: true, delete: true },
    Routes: { view: true, create: true, edit: true, delete: true },
    Fleet: { view: true, create: true, edit: true, delete: true },
    Landfill: { view: true, create: true, edit: true, delete: true },
    Billing: { view: true, create: true, edit: true, delete: true },
    Enforcement: { view: true, create: true, edit: true, delete: true },
    Communication: { view: true, create: true, edit: true, delete: true },
    Reports: { view: true, create: true, edit: true, delete: true },
    Settings: { view: true, create: true, edit: true, delete: true },
  },
  Manager: {
    Dashboard: { view: true, create: true, edit: true, delete: false },
    Customers: { view: true, create: true, edit: true, delete: false },
    Collections: { view: true, create: true, edit: true, delete: true },
    Schedules: { view: true, create: true, edit: true, delete: true },
    Routes: { view: true, create: true, edit: true, delete: true },
    Fleet: { view: true, create: true, edit: true, delete: false },
    Landfill: { view: true, create: true, edit: true, delete: false },
    Billing: { view: true, create: true, edit: true, delete: false },
    Enforcement: { view: true, create: true, edit: true, delete: false },
    Communication: { view: true, create: true, edit: true, delete: false },
    Reports: { view: true, create: true, edit: false, delete: false },
    Settings: { view: true, create: false, edit: false, delete: false },
  },
  Finance: {
    Dashboard: { view: true, create: false, edit: false, delete: false },
    Customers: { view: true, create: false, edit: false, delete: false },
    Collections: { view: true, create: false, edit: false, delete: false },
    Schedules: { view: true, create: false, edit: false, delete: false },
    Routes: { view: true, create: false, edit: false, delete: false },
    Fleet: { view: false, create: false, edit: false, delete: false },
    Landfill: { view: true, create: false, edit: false, delete: false },
    Billing: { view: true, create: true, edit: true, delete: true },
    Enforcement: { view: true, create: true, edit: true, delete: false },
    Communication: { view: true, create: true, edit: true, delete: false },
    Reports: { view: true, create: true, edit: true, delete: false },
    Settings: { view: false, create: false, edit: false, delete: false },
  },
  Employee: {
    Dashboard: { view: true, create: false, edit: false, delete: false },
    Customers: { view: true, create: false, edit: false, delete: false },
    Collections: { view: true, create: false, edit: true, delete: false },
    Schedules: { view: true, create: false, edit: false, delete: false },
    Routes: { view: true, create: false, edit: false, delete: false },
    Fleet: { view: true, create: false, edit: false, delete: false },
    Landfill: { view: true, create: true, edit: false, delete: false },
    Billing: { view: false, create: false, edit: false, delete: false },
    Enforcement: { view: false, create: false, edit: false, delete: false },
    Communication: { view: true, create: false, edit: false, delete: false },
    Reports: { view: false, create: false, edit: false, delete: false },
    Settings: { view: false, create: false, edit: false, delete: false },
  },
  Customer: {
    Dashboard: { view: true, create: false, edit: false, delete: false },
    Customers: { view: false, create: false, edit: false, delete: false },
    Collections: { view: true, create: false, edit: false, delete: false },
    Schedules: { view: true, create: false, edit: false, delete: false },
    Routes: { view: false, create: false, edit: false, delete: false },
    Fleet: { view: false, create: false, edit: false, delete: false },
    Landfill: { view: false, create: false, edit: false, delete: false },
    Billing: { view: true, create: true, edit: false, delete: false },
    Enforcement: { view: false, create: false, edit: false, delete: false },
    Communication: { view: true, create: true, edit: false, delete: false },
    Reports: { view: false, create: false, edit: false, delete: false },
    Settings: { view: false, create: false, edit: false, delete: false },
  },
}

export const initialSecurityPolicy = {
  minPasswordLength: 10,
  requireUppercase: true,
  requireNumbers: true,
  requireSymbols: true,
  passwordExpiryDays: 90,
  sessionTimeoutMinutes: 15,
  lockoutThresholdAttempts: 5,
  twoStepVerification: true,
  ipWhitelisting: false,
}

export const initialDatabaseBackups = [
  { id: "BAK-261008-01", name: "automated_daily_snapshot_20261008_0200.sql.gz", sizeMb: 24.8, checksum: "sha256:7f4a...890d", createdAt: "08 Oct 2026, 02:00", type: "Automatic", status: "Healthy" },
  { id: "BAK-261007-01", name: "automated_daily_snapshot_20261007_0200.sql.gz", sizeMb: 24.2, checksum: "sha256:4b1e...221f", createdAt: "07 Oct 2026, 02:00", type: "Automatic", status: "Healthy" },
  { id: "BAK-261006-01", name: "automated_daily_snapshot_20261006_0200.sql.gz", sizeMb: 23.9, checksum: "sha256:9c33...884a", createdAt: "06 Oct 2026, 02:00", type: "Automatic", status: "Healthy" },
  { id: "BAK-261005-PRE", name: "manual_pre_migration_backup_20261005_1645.sql.gz", sizeMb: 23.7, checksum: "sha256:1a8d...67ef", createdAt: "05 Oct 2026, 16:45", type: "Manual", status: "Healthy" },
]

export const initialScheduledSmsList: ScheduledSms[] = [
  {
    id: "SMS-SCH-01",
    recipientGroup: "Zone",
    targetName: "Kimironko Zone Customers",
    scheduledDate: "2026-10-09",
    scheduledTime: "07:00",
    messageText: "EcoRoute Reminder: Tomorrow morning is collection day in Kimironko. Please place waste bins outside before 07:00.",
    status: "Scheduled",
    recipientsCount: 186,
    createdBy: "Diane Mukamana",
    createdAt: "08 Oct 2026, 09:30",
  },
  {
    id: "SMS-SCH-02",
    recipientGroup: "All overdue",
    targetName: "47 Overdue Accounts",
    scheduledDate: "2026-10-09",
    scheduledTime: "09:00",
    messageText: "EcoRoute Notice: Your waste collection bill is overdue. Pay via MTN MoMo (*182*8*1#) or Airtel Money to avoid pickup suspension.",
    status: "Scheduled",
    recipientsCount: 47,
    createdBy: "Claudine Uwase",
    createdAt: "08 Oct 2026, 10:15",
  },
  {
    id: "SMS-SCH-03",
    recipientGroup: "All drivers",
    targetName: "All Fleet Drivers (8)",
    scheduledDate: "2026-10-09",
    scheduledTime: "06:00",
    messageText: "Operations Bulletin: Mandatory vehicle pre-trip inspection at Gikondo Depot at 06:15 before rolling out.",
    status: "Scheduled",
    recipientsCount: 8,
    createdBy: "Diane Mukamana",
    createdAt: "08 Oct 2026, 11:00",
  },
]

export const initialReconciliationTransactions = [
  { id: "TXN-MOMO-9812", provider: "MTN MoMo", ref: "MP261008.0812.A4410", amount: 6000, customer: "Jean Romeo (CUS-2048)", invoice: "INV-2026-00098", date: "08 Oct 2026, 08:12", status: "Matched" },
  { id: "TXN-AIRTEL-4102", provider: "Airtel Money", ref: "AM-261008-7712", amount: 10000, customer: "Aline Uwase (CUS-2055)", invoice: "INV-2026-00128", date: "08 Oct 2026, 08:44", status: "Matched" },
  { id: "TXN-MOMO-9819", provider: "MTN MoMo", ref: "MP261008.0933.A9901", amount: 5000, customer: "Unidentified (0788331190)", invoice: "Unassigned", date: "08 Oct 2026, 09:33", status: "Unmatched" },
  { id: "TXN-BNK-3021", provider: "Bank of Kigali", ref: "BK-TX-881290", amount: 20000, customer: "Green Hills Residence (CUS-2064)", invoice: "INV-2026-00130", date: "08 Oct 2026, 10:05", status: "Matched" },
  { id: "TXN-MOMO-9825", provider: "MTN MoMo", ref: "MP261008.0812.A4410", amount: 6000, customer: "Duplicate Callback Received", invoice: "INV-2026-00098", date: "08 Oct 2026, 08:14", status: "Duplicate" },
]
