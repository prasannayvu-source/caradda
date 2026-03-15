from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from app.services.billing_service import get_bill_by_id


# ── Colour palette matching the CAR ADDA design system ──────────────
NAVY   = colors.HexColor("#0F172A")
NAVY800= colors.HexColor("#1E293B")
GOLD   = colors.HexColor("#FACC15")
RED    = colors.HexColor("#EF4444")
WHITE  = colors.HexColor("#F8FAFC")
MUTED  = colors.HexColor("#94A3B8")
SUCCESS= colors.HexColor("#22C55E")


def generate_invoice_pdf(bill_id: str) -> bytes:
    bill = get_bill_by_id(bill_id)
    if not bill:
        raise ValueError("Bill not found")

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()

    # ── Custom styles ────────────────────────────────────────────────
    title_style = ParagraphStyle("title", parent=styles["Normal"],
                                  fontSize=22, fontName="Helvetica-Bold",
                                  textColor=WHITE, alignment=TA_LEFT)
    subtitle_style = ParagraphStyle("subtitle", parent=styles["Normal"],
                                     fontSize=10, fontName="Helvetica",
                                     textColor=MUTED, alignment=TA_LEFT)
    label_style = ParagraphStyle("label", parent=styles["Normal"],
                                  fontSize=8, fontName="Helvetica",
                                  textColor=MUTED)
    value_style = ParagraphStyle("value", parent=styles["Normal"],
                                  fontSize=10, fontName="Helvetica-Bold",
                                  textColor=WHITE)
    section_style = ParagraphStyle("section", parent=styles["Normal"],
                                    fontSize=9, fontName="Helvetica-Bold",
                                    textColor=MUTED, spaceAfter=6)
    footer_style = ParagraphStyle("footer", parent=styles["Normal"],
                                   fontSize=8, fontName="Helvetica",
                                   textColor=MUTED, alignment=TA_CENTER)
    total_style = ParagraphStyle("total", parent=styles["Normal"],
                                  fontSize=16, fontName="Helvetica-Bold",
                                  textColor=GOLD, alignment=TA_RIGHT)

    # ── Document background function ─────────────────────────────────
    def draw_bg(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, 0, A4[0], A4[1], fill=True, stroke=False)
        # Header band
        canvas.setFillColor(NAVY800)
        canvas.rect(0, A4[1] - 55 * mm, A4[0], 55 * mm, fill=True, stroke=False)
        # Gold accent strip under header
        canvas.setFillColor(RED)
        canvas.rect(0, A4[1] - 56 * mm, A4[0], 1 * mm, fill=True, stroke=False)
        canvas.restoreState()

    # ── Content elements ─────────────────────────────────────────────
    elements = []

    # — Header: Brand + Invoice label ——————————
    customer = bill.get("customers") or {}
    vehicle = bill.get("vehicles") or {}
    bill_date = bill.get("created_at", "")[:10]
    formatted_date = datetime.strptime(bill_date, "%Y-%m-%d").strftime("%d %b %Y") if bill_date else "—"

    header_data = [
        [
            Paragraph("CAR ADDA", title_style),
            Paragraph(f"<b>INVOICE</b>", ParagraphStyle(
                "inv", fontSize=18, fontName="Helvetica-Bold",
                textColor=GOLD, alignment=TA_RIGHT)),
        ],
        [
            Paragraph("Automotive Services & Management", subtitle_style),
            Paragraph(
                f"<font color='#94A3B8'>Bill No: </font>"
                f"<font color='#FACC15'><b>{bill['bill_number']}</b></font>",
                ParagraphStyle("billno", fontSize=10, fontName="Helvetica",
                               textColor=WHITE, alignment=TA_RIGHT)
            ),
        ],
    ]
    header_table = Table(header_data, colWidths=[100 * mm, 70 * mm])
    header_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 8 * mm))

    # — Customer + Date info block ——————————
    info_data = [
        [
            Paragraph("BILLED TO", label_style),
            Paragraph("DATE", label_style),
            Paragraph("PAYMENT", label_style),
        ],
        [
            Paragraph(customer.get("name", "—"), value_style),
            Paragraph(formatted_date, value_style),
            Paragraph((bill.get("payment_method") or "—").upper(), value_style),
        ],
        [
            Paragraph(customer.get("phone", "—"), subtitle_style),
            Paragraph("", subtitle_style),
            Paragraph(
                "<font color='#22C55E'>PAID</font>"
                if bill.get("payment_status") == "paid"
                else "<font color='#F97316'>PENDING</font>",
                ParagraphStyle("stat", fontSize=9, fontName="Helvetica-Bold",
                               textColor=WHITE)
            ),
        ],
    ]
    if vehicle.get("car_number"):
        info_data.append([
            Paragraph(f"Vehicle: {vehicle['car_number'].upper()}", subtitle_style),
            Paragraph("", subtitle_style),
            Paragraph("", subtitle_style),
        ])

    info_table = Table(info_data, colWidths=[75 * mm, 45 * mm, 50 * mm])
    info_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("BOX", (0, 0), (-1, -1), 0.5, NAVY800),
        ("BACKGROUND", (0, 0), (-1, -1), NAVY800),
        ("ROUNDEDCORNERS", [6]),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (2, 0), 10),
        ("BOTTOMPADDING", (2, -1), (2, -1), 10),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 8 * mm))

    # — Services table ——————————————
    elements.append(Paragraph("SERVICES", section_style))

    item_header = ["Service / Description", "Qty", "Unit Price", "Total"]
    item_rows = [item_header]
    for it in (bill.get("items") or []):
        name = it.get("service_name") or it.get("description") or "Service"
        qty = it.get("quantity", 1)
        uprice = float(it.get("unit_price", 0))
        ltotal = float(it.get("line_total") or (qty * uprice))
        item_rows.append([
            name,
            str(qty),
            f"₹{uprice:,.2f}",
            f"₹{ltotal:,.2f}",
        ])

    items_table = Table(
        item_rows,
        colWidths=[90 * mm, 15 * mm, 32 * mm, 33 * mm]
    )
    items_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), NAVY800),
        ("TEXTCOLOR", (0, 0), (-1, 0), MUTED),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("ALIGN", (0, 0), (0, 0), "LEFT"),
        ("ALIGN", (1, 0), (-1, 0), "RIGHT"),
        # Data rows
        ("BACKGROUND", (0, 1), (-1, -1), NAVY),
        ("TEXTCOLOR", (0, 1), (-1, -1), WHITE),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("ALIGN", (0, 1), (0, -1), "LEFT"),
        ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
        ("FONTNAME", (-1, 1), (-1, -1), "Helvetica-Bold"),
        # Grid
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, RED),
        ("LINEBELOW", (0, 1), (-1, -2), 0.3, NAVY800),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (0, -1), 12),
        ("RIGHTPADDING", (-1, 0), (-1, -1), 12),
    ]))
    elements.append(items_table)
    elements.append(Spacer(1, 6 * mm))

    # — Totals block ——————————————————
    subtotal = float(bill.get("subtotal", 0))
    discount = float(bill.get("discount", 0))
    total = float(bill.get("total_amount", 0))

    totals_data = [
        ["Subtotal", f"₹{subtotal:,.2f}"],
    ]
    if discount > 0:
        totals_data.append(["Discount", f"- ₹{discount:,.2f}"])

    totals_table = Table(totals_data, colWidths=[130 * mm, 40 * mm])
    totals_table.setStyle(TableStyle([
        ("TEXTCOLOR", (0, 0), (-1, -1), MUTED),
        ("TEXTCOLOR", (1, 0), (-1, -1), WHITE),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(totals_table)

    elements.append(HRFlowable(width="100%", thickness=0.5, color=NAVY800, spaceAfter=4))

    elements.append(
        Paragraph(f"TOTAL  ₹{total:,.2f}", total_style)
    )
    elements.append(Spacer(1, 12 * mm))

    # — Footer ———————————————————————
    elements.append(HRFlowable(width="100%", thickness=0.5, color=NAVY800, spaceAfter=8))
    elements.append(Paragraph(
        "Thank you for choosing CAR ADDA • Automotive Excellence",
        footer_style
    ))
    elements.append(Paragraph(
        "For queries contact us at your nearest CAR ADDA outlet.",
        footer_style
    ))

    doc.build(elements, onFirstPage=draw_bg, onLaterPages=draw_bg)
    return buffer.getvalue()
