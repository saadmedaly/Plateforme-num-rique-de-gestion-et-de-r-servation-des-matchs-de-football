"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: "1", type: "booking", title: "تم تأكيد حجزك بنجاح", message: "تم تأكيد حجزك في ملعب الأساطير اليوم الساعة 18:00.", time: "منذ 10 دقائق", unread: true },
    { id: "2", type: "team", title: "طلب انضمام جديد", message: "يريد عبدالله سعد الانضمام إلى فريق نسور انواكشوط.", time: "منذ ساعة", unread: true },
    { id: "3", type: "match", title: "مباراة قريبة منك", message: "هناك مباراة 5 ضد 5 تبدأ قريباً في ملعب قريب منك.", time: "منذ 3 ساعات", unread: false },
    { id: "4", type: "system", title: "تحديث جديد للنطام", message: "قمنا بإضافة ميزة مقارنة الفرق الجديدة، جربها الآن!", time: "منذ يوم", unread: false },
    { id: "5", type: "payment", title: "استرداد نقدي", message: "تم إضافة 25 أوقية إلى محفظتك نتيجة إلغاء حجز سابق.", time: "منذ يومين", unread: false },
  ])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const iconMap: Record<string, string> = {
    booking: "📅",
    team: "👥",
    match: "⚽",
    system: "⚙️",
    payment: "💰"
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>الإشعارات</h1>
          <button onClick={markAllRead} className="btn-ghost" style={{ fontSize: 13, color: "var(--primary)" }}>تمييز الكل كمقروء</button>
        </div>

        <div className="card" style={{ padding: 0 }}>
          {notifications.map((n, i) => (
            <div 
              key={n.id}
              style={{
                padding: "20px 24px",
                borderBottom: i === notifications.length - 1 ? "none" : "1px solid var(--border)",
                background: n.unread ? "rgba(32, 197, 106, 0.03)" : "transparent",
                display: "flex",
                gap: 16,
                position: "relative",
                transition: "background 0.2s"
              }}
            >
              <div style={{ 
                width: 48, height: 48, borderRadius: "50%", 
                background: "var(--bg-elevated)", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                fontSize: 20, flexShrink: 0 
              }}>
                {iconMap[n.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: n.unread ? "var(--text-primary)" : "var(--text-secondary)" }}>{n.title}</h3>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{n.message}</p>
              </div>
              {n.unread && (
                <div style={{ 
                  width: 8, height: 8, background: "var(--primary)", 
                  borderRadius: "50%", position: "absolute", left: 16, top: 40,
                  boxShadow: "0 0 10px var(--primary)"
                }} />
              )}
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>لا توجد إشعارات</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>ستظهر الإشعارات الخاصة بحجوزاتك وفريقك هنا.</p>
          </div>
        )}

      </div>
    </div>
  )
}

