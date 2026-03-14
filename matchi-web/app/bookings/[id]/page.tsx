"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function BookingDetailsPage() {
  const [showCancelModal, setShowCancelModal] = useState(false)

  const booking = {
    id: "BK-9042",
    stadiumName: "ملعب الأساطير - فرع انواكشوط",
    address: "انواكشوط، منطقة جميرا، شارع نواذيبو",
    date: "25 مارس 2024",
    time: "18:00 - 19:00",
    duration: "60 دقيقة",
    price: 150,
    status: "confirmed",
    qrCode: "MOCK_QR",
    facilities: ["إضاءة ليلية", "باركينج", "غرف تبديل"],
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Breadcrumbs */}
        <div style={{ marginBottom: 24, fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 8 }}>
          <Link href="/dashboard" style={{ color: "var(--text-secondary)" }}>لوحة التحكم</Link>
          <span>/</span>
          <Link href="/bookings" style={{ color: "var(--text-secondary)" }}>حجوزاتي</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>حجز {booking.id}</span>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ background: "var(--bg-elevated)", padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700, marginBottom: 4 }}>رقم الحجز: {booking.id}</div>
              <h1 style={{ fontSize: 24, fontWeight: 800 }}>تفاصيل الحجز</h1>
            </div>
            <span className="badge badge-primary" style={{ padding: "8px 16px", fontSize: 14 }}>
               {booking.status === "confirmed" ? "✓ مؤكد" : "قيد المعالجة"}
            </span>
          </div>

          <div style={{ padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
              
              {/* Left Column: Info */}
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>المكان</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{booking.stadiumName}</div>
                  <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>📍 {booking.address}</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                   <div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>التاريخ</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>📅 {booking.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>الوقت والمدة</div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>⏰ {booking.time} ({booking.duration})</div>
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>المرافق المشمولة</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {booking.facilities.map(f => (
                      <span key={f} className="badge badge-secondary">{f}</span>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div style={{ fontSize: 16, fontWeight: 700 }}>إجمالي المبلغ المدفوع</div>
                   <div style={{ fontSize: 24, fontWeight: 800, color: "var(--primary)" }}>{booking.price} أوقية</div>
                </div>
              </div>

              {/* Right Column: QR & Actions */}
              <div style={{ textAlign: "center" }}>
                <div className="card shadow-sm" style={{ padding: 20, background: "white", borderRadius: "var(--radius-lg)", display: "inline-block", marginBottom: 20 }}>
                  {/* Real QR would go here */}
                  <div style={{ width: 180, height: 180, background: "#f0f0f0", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                     <div style={{ fontSize: 60 }}>📱</div>
                     <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.8)", color: "white", padding: "4px", fontSize: 10 }}>QR CODE PREVIEW</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>أبرز هذا الرمز عند وصولك للملعب لتأكيد حضورك</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button className="btn-secondary" style={{ width: "100%" }}>📅 تعديل موعد الحجز</button>
                  <button className="btn-secondary" style={{ width: "100%" }}>📄 تحميل الفاتورة (PDF)</button>
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="btn-ghost" 
                    style={{ width: "100%", color: "var(--danger)" }}
                  >
                    × إلغاء الحجز
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Location Preview */}
        <div className="card" style={{ marginTop: 24, padding: 20 }}>
           <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>موقع الملعب على الخريطة</h3>
           <div style={{ height: 240, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32 }}>📍</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 8 }}>{booking.address}</div>
                <button className="btn-ghost" style={{ fontSize: 12, marginTop: 10, color: "var(--primary)" }}>فتح في خرائط جوجل</button>
              </div>
           </div>
        </div>

      </div>

      {/* Cancel Modal Placeholder */}
      {showCancelModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card animate-fade-in" style={{ maxWidth: 400, width: "100%", padding: 32 }}>
             <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>هل أنت متأكد من الإلغاء؟</h2>
             <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
               سيتم استرداد المبلغ إلى محفظتك الإلكترونية وفقاً لسياسة الإلغاء (إلغاء قبل 24 ساعة = استرداد كامل).
             </p>
             <div style={{ display: "flex", gap: 12 }}>
               <button onClick={() => setShowCancelModal(false)} className="btn-primary" style={{ flex: 1 }}>الرجوع</button>
               <button onClick={() => setShowCancelModal(false)} className="btn-secondary" style={{ flex: 1, color: "var(--danger)" }}>نعم، إلغاء</button>
             </div>
          </div>
        </div>
      )}

    </div>
  )
}
