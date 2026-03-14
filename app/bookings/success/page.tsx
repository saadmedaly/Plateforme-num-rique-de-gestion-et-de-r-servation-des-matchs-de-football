"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function BookingSuccessPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        
        <div className="card animate-fade-in" style={{ maxWidth: 500, width: "100%", padding: 48, textAlign: "center" }}>
          
          {/* Animated Success Icon Placeholder */}
          <div style={{ 
            width: 100, height: 100, 
            background: "var(--primary-muted)", 
            color: "var(--primary)", 
            borderRadius: "50%", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: 48, 
            margin: "0 auto 32px",
            boxShadow: "0 0 30px rgba(32, 197, 106, 0.2)"
          }}>
            ✓
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>تم الحجز بنجاح! 🎉</h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
            تم استلام طلب الحجز الخاص بك وتأكيده. يمكنك الآن التوجه للملعب في الموعد المحدد.
          </p>

          <div className="card" style={{ background: "var(--bg-elevated)", padding: 20, marginBottom: 32, textAlign: "right" }}>
             <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>ملخص الحجز</div>
             <div style={{ fontWeight: 700, fontSize: 16 }}>ملعب الأساطير - فرع انواكشوط</div>
             <div style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 4 }}>التاريخ: 25 مارس 2024</div>
             <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>الوقت: 18:00 - 19:00</div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
             <Link href="/bookings/BK-9042" className="btn-primary" style={{ padding: 14 }}>عرض تفاصيل الحجز (QR Code)</Link>
             <Link href="/dashboard" className="btn-secondary" style={{ padding: 14 }}>العودة للرئيسية</Link>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 32 }}>
            تم إرسال نسخة من الفاتورة إلى بريدك الإلكتروني.
          </p>

        </div>
      </div>
    </div>
  )
}

