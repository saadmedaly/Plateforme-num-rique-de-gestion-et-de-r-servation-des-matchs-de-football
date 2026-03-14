"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function OwnerDashboard() {
  const { data: session } = useSession()

  const stats = [
    { label: "إجمالي الحجوزات", value: "154", change: "+12%", trend: "up", icon: "📊" },
    { label: "الدخل (أوقية)", value: "12,450", change: "+8%", trend: "up", icon: "💰" },
    { label: "الملاعب النشطة", value: "3", change: "0%", trend: "neutral", icon: "🏟️" },
    { label: "تقييم الملاعب", value: "4.8", change: "+0.2", trend: "up", icon: "⭐" },
  ]

  const recentBookings = [
    { id: "1", user: "أحمد علي", stadium: "ملعب الأساطير (1)", time: "18:00 - 19:00", date: "اليوم", price: 150, status: "confirmed" },
    { id: "2", user: "سارة محمد", stadium: "صالة النور", time: "20:00 - 21:00", date: "اليوم", price: 200, status: "pending" },
    { id: "3", user: "خالد فهد", stadium: "ملعب الأساطير (2)", time: "17:00 - 18:00", date: "غداً", price: 150, status: "confirmed" },
    { id: "4", user: "نورة سعد", stadium: "ملعب الأساطير (1)", time: "21:00 - 22:00", date: "اليوم", price: 150, status: "cancelled" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 className="section-title" style={{ fontSize: 28 }}>لوحة تحكم الملّاك</h1>
            <p className="section-subtitle">إدارة ملاعبك، حجوزاتك، وتقارير الدخل</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-secondary">تصدير التقارير</button>
            <Link href="/owner/stadiums/add" className="btn-primary">
              + إضافة ملعب جديد
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          {stats.map((stat, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{stat.icon}</span>
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 700, 
                  color: stat.trend === "up" ? "var(--primary)" : stat.trend === "down" ? "var(--danger)" : "var(--text-muted)",
                  background: stat.trend === "up" ? "var(--primary-muted)" : stat.trend === "down" ? "rgba(239,68,68,0.1)" : "var(--bg-elevated)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)"
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          
          {/* Recent Bookings */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>آخر الحجوزات</h2>
              <Link href="/owner/bookings" style={{ fontSize: 14, color: "var(--primary)", fontWeight: 600 }}>عرض الكل</Link>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    <th style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>المستخدم</th>
                    <th style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>الملعب</th>
                    <th style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>الوقت</th>
                    <th style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>القيمة</th>
                    <th style={{ padding: "14px 24px", fontSize: 13, color: "var(--text-muted)" }}>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{booking.user}</div>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: 14 }}>{booking.stadium}</td>
                      <td style={{ padding: "16px 24px", fontSize: 14 }}>
                        <div style={{ color: "var(--text-primary)" }}>{booking.time}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{booking.date}</div>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: 14, fontWeight: 700 }}>{booking.price} أوقية</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span className={`badge badge-${
                          booking.status === "confirmed" ? "primary" : 
                          booking.status === "pending" ? "warning" : "danger"
                        }`} style={{ fontSize: 11 }}>
                          {booking.status === "confirmed" ? "مؤكد" : 
                           booking.status === "pending" ? "قيد الانتظار" : "ملغي"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions & Tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="card" style={{ padding: 24, background: "linear-gradient(135deg, var(--bg-card) 0%, var(--bg-surface) 100%)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>إجراءات سريعة</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="btn-secondary" style={{ justifyContent: "flex-start", width: "100%" }}>📅 تعديل جدول المواعيد</button>
                <button className="btn-secondary" style={{ justifyContent: "flex-start", width: "100%" }}>🎁 إنشاء كود خصم</button>
                <button className="btn-secondary" style={{ justifyContent: "flex-start", width: "100%" }}>📷 تحديث صور الملاعب</button>
                <button className="btn-secondary" style={{ justifyContent: "flex-start", width: "100%" }}>💬 الرد على التقييمات</button>
              </div>
            </div>

            <div className="card" style={{ padding: 24, border: "1px dashed var(--primary-border)", background: "var(--primary-muted)" }}>
              <div style={{ fontSize: 20, marginBottom: 12 }}>💡</div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", marginBottom: 8 }}>نصيحة لزيادة الحجوزات</h4>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                الملاعب التي تمتلك أكثر من 5 صور بجودة عالية تحصل على حجوزات أكثر بنسبة 40%. تأكد من إضافة صور لمرافق الملعب.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

