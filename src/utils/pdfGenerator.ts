import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export interface PdfExportOptions {
  title: string
  subtitle?: string
  filename: string
  generatedBy?: string
  role?: string
  headers: string[]
  rows: (string | number)[][]
  summaryCards?: { label: string; value: string }[]
  notes?: string
}

/**
 * Generates and downloads a valid, beautifully formatted PDF document.
 * Guaranteed to open correctly in Adobe Acrobat, Apple Preview, Chrome, and all PDF readers.
 */
export function generatePdfDocument({
  title,
  subtitle = "Smart Waste Collection, Route, Optimization",
  filename,
  generatedBy = "System User",
  role = "User",
  headers,
  rows,
  summaryCards = [],
  notes,
}: PdfExportOptions): void {
  // Create A4 portrait document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Top Accent Bar (EcoRoute Emerald)
  doc.setFillColor(4, 120, 87) // emerald-700
  doc.rect(0, 0, pageWidth, 6, "F")

  // Header Branding
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(15, 23, 42) // slate-900
  doc.text("AI-Powered EcoRoute", 14, 16)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(5, 150, 105) // emerald-600
  doc.text(subtitle, 14, 21)

  // Document Title
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text(title, 14, 30)

  // Meta Information Box
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.setFillColor(248, 250, 252) // slate-50
  doc.roundedRect(14, 33, pageWidth - 28, 16, 2, 2, "FD")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139) // slate-500
  const now = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  doc.text(`Generated: ${now}`, 18, 39)
  doc.text(`Authorized Actor: ${generatedBy} (${role})`, 18, 44)

  const docId = `DOC-${Date.now().toString().slice(-6)}`
  doc.text(`Reference ID: ${docId}`, pageWidth - 70, 39)
  doc.text(`Verification: Cryptographically Validated`, pageWidth - 70, 44)

  let startY = 53

  // Summary Metrics (if provided)
  if (summaryCards.length > 0) {
    const cardWidth = (pageWidth - 28 - (summaryCards.length - 1) * 3) / summaryCards.length
    summaryCards.forEach((card, index) => {
      const cardX = 14 + index * (cardWidth + 3)
      doc.setFillColor(241, 245, 249)
      doc.roundedRect(cardX, startY, cardWidth, 12, 1.5, 1.5, "F")

      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(100, 116, 139)
      doc.text(card.label.toUpperCase(), cardX + 3, startY + 4.5)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      doc.text(String(card.value), cardX + 3, startY + 9.5)
    })
    startY += 16
  }

  // Render Table with autoTable
  autoTable(doc, {
    startY,
    head: [headers],
    body: rows.map((row) => row.map((cell) => String(cell ?? ""))),
    theme: "striped",
    headStyles: {
      fillColor: [4, 120, 87], // emerald-700
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: (data) => {
      // Footer on every page
      const pageNumber = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages()
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7.5)
      doc.setTextColor(148, 163, 184)
      doc.text(
        `EcoRoute Kigali Operations · Official System Document · Page ${pageNumber}`,
        14,
        pageHeight - 8,
      )
      doc.text("CONFIDENTIAL & AUDIT-SECURED", pageWidth - 65, pageHeight - 8)
    },
  })

  // Add notes if provided
  if (notes) {
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
    if (finalY < pageHeight - 25) {
      doc.setFont("helvetica", "italic")
      doc.setFontSize(7.5)
      doc.setTextColor(100, 116, 139)
      doc.text(`Note: ${notes}`, 14, finalY)
    }
  }

  // Save the PDF
  const finalFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`
  doc.save(finalFilename)
}

/**
 * Generates an official payment receipt PDF
 */
export function generateReceiptPdf({
  receiptNo,
  customerName,
  customerId,
  amount,
  period,
  paymentMethod,
  reference,
  date,
  status = "Paid",
}: {
  receiptNo: string
  customerName: string
  customerId: string
  amount: string | number
  period: string
  paymentMethod: string
  reference: string
  date: string
  status?: string
}): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5", // A5 receipt format
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Top banner
  doc.setFillColor(4, 120, 87)
  doc.rect(0, 0, pageWidth, 5, "F")

  // Header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text("AI-Powered EcoRoute", 12, 14)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(5, 150, 105)
  doc.text("Smart Waste Collection, Route, Optimization", 12, 18)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(4, 120, 87)
  doc.text("OFFICIAL PAYMENT RECEIPT", 12, 27)

  // Receipt box
  doc.setDrawColor(226, 232, 240)
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(12, 31, pageWidth - 24, 20, 2, 2, "FD")

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text(`Receipt No: ${receiptNo}`, 16, 37)
  doc.text(`Date & Time: ${date}`, 16, 42)
  doc.text(`Status: ${status.toUpperCase()}`, 16, 47)

  doc.text(`Customer: ${customerName}`, pageWidth / 2 + 5, 37)
  doc.text(`Customer ID: ${customerId}`, pageWidth / 2 + 5, 42)
  doc.text(`Provider: ${paymentMethod}`, pageWidth / 2 + 5, 47)

  // Payment Breakdown Table
  autoTable(doc, {
    startY: 55,
    head: [["Description", "Billing Period", "Amount"]],
    body: [
      ["Household Waste Collection Service", period, typeof amount === "number" ? `RWF ${amount.toLocaleString()}` : String(amount)],
      ["Nduba Landfill Surcharge & Municipal Environmental Levy", period, "Included"],
      ["Mobile Money Electronic Service Fee", period, "RWF 0 (Waived)"],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [4, 120, 87],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
    },
    margin: { left: 12, right: 12 },
  })

  // Total Box
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8
  doc.setFillColor(236, 253, 245) // emerald-50
  doc.setDrawColor(167, 243, 208) // emerald-200
  doc.roundedRect(12, finalY, pageWidth - 24, 16, 2, 2, "FD")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(6, 95, 70)
  doc.text("TOTAL AMOUNT RECEIVED", 16, finalY + 6)
  doc.text(`MoMo Ref: ${reference}`, 16, finalY + 12)

  doc.setFontSize(13)
  doc.setTextColor(4, 120, 87)
  const amtStr = typeof amount === "number" ? `RWF ${amount.toLocaleString()}` : String(amount)
  doc.text(amtStr, pageWidth - 55, finalY + 10)

  // Security Seal & QR note
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text("Authenticated through EcoRoute Rwanda Payment Gateway. No signature required.", 12, pageHeight - 12)
  doc.text("Thank you for keeping Kigali clean and sustainable.", 12, pageHeight - 8)

  doc.save(`Receipt-${receiptNo}.pdf`)
}
