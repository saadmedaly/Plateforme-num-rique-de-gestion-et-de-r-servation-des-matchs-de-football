"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

interface Booking {
  id: string
  stadium_name: string
  booking_date: string
  start_time: string
  end_time: string
  duration: number
  total_price: number
  status: "confirmed" | "pending" | "cancelled"
  surface_type?: string
  city?: string
}

const statusConfig = {
  confirmed: { label: "مؤكد", color: "var(--primary)", bg: "var(--primary-muted)" },
  pending: { label: "بانتظار التأكيد", color: "var(--warning)", bg: "rgba(245,158,11,0.12)" },
  cancelled: { label: "ملغي", color: "var(--danger)", bg: "rgba(239,68,68,0.12)" },
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all")
  const [cancelId, setCancelId] = useState<string | null>(null)

  useEffect(() => {
    if (status !== "authenticated") return
    axios.get("/api/bookings")
      .then(r => setBookings(r.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [status])

  const filtered = activeFilter === "all"
    ? bookings
    : bookings.filter(b => b.status === activeFilter)

  const handleCancel = async (id: string) => {
    try {
      await axios.patch(`/api/bookings/${id}`, { status: "cancelled" })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b))
    } catch { alert("حدث خطأ") }
    setCancelId(null)
  }

  const filterStyle = (active: boolean) => ({
    padding: "7px 16px",
    borderRadius: "var(--radius-full)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
    background: active ? "var(--primary-muted)" : "var(--bg-card)",
    color: active ? "var(--primary)" : "var(--text-secondary)",
    transition: "all 0.2s",
    fontFamily: "Lexend, sans-serif",
  })

  // Demo data
  const demoBookings: Booking[] = [
    { id: "1", stadium_name: "ملعب الأساطير - فرع انواكشوط", booking_date: "2024-12-20", start_time: "18:00", end_time: "19:00", duration: 1, total_price: 150, status: "confirmed", city: "انواكشوط", surface_type: "artificial_grass" },
    { id: "2", stadium_name: "نادي الصقر نواذيبوي", booking_date: "2024-12-22", start_time: "20:00", end_time: "22:00", duration: 2, total_price: 400, status: "pending", city: "نواذيبو" },
    { id: "3", stadium_name: "ملعب نواذيبو الدولي", booking_date: "2024-12-10", start_time: "16:00", end_time: "17:30", duration: 1.5, total_price: 270, status: "confirmed", city: "نواذيبو" },
    { id: "4", stadium_name: "ملعب النور", booking_date: "2024-12-05", start_time: "19:00", end_time: "20:00", duration: 1, total_price: 120, status: "cancelled", city: "أطار" },
  ]

  const displayBookings = bookings.length > 0 ? filtered : (
    activeFilter === "all" ? demoBookings :
    demoBookings.filter(b => b.status === activeFilter)
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "28px 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                سجل الحجوزات
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                جميع حجوزاتك في مكان واحد
              </p>
            </div>
            <Link href="/stadiums" className="btn-primary">
              + حجز جديد
            </Link>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            {(["all", "confirmed", "pending", "cancelled"] as const).map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} style={filterStyle(activeFilter === f)}>
                {f === "all" ? "الكل" : f === "confirmed" ? "مؤكدة" : f === "pending" ? "بانتظار التأكيد" : "ملغاة"}
                <span style={{
                  marginRight: 6,
                  background: activeFilter === f ? "rgba(32,197,106,0.2)" : "var(--bg-elevated)",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 11,
                }}>
                  {f === "all" ? demoBookings.length : demoBookings.filter(b => b.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div className="spinner" />
          </div>
        ) : displayBookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              لا توجد حجوزات
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
              لم تقم بأي حجز حتى الآن
            </p>
            <Link href="/stadiums" className="btn-primary">
              ابحث عن ملعب
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {displayBookings.map(booking => {
              const s = statusConfig[booking.status]
              return (
                <div key={booking.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "stretch" }}>
                    {/* Left accent */}
                    <div style={{
                      width: 4,
                      background: s.color,
                      minWidth: 4,
                    }} />

                    {/* Stadium preview */}
                    <div style={{
                      width: 140,
                      minWidth: 140,
                      background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      borderLeft: "1px solid var(--border)",
                    }}>
                      🏟️
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, padding: "18px 22px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
                            {booking.stadium_name}
                          </h3>
                          {booking.city && (
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                              📍 {booking.city}
                            </span>
                          )}
                        </div>
                        <span className="badge" style={{ background: s.bg, color: s.color, padding: "5px 12px" }}>
                          {s.label}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                          <span>📅</span>
                          <span>{booking.booking_date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                          <span>⏰</span>
                          <span>{booking.start_time} — {booking.end_time}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                          <span>⏳</span>
                          <span>{booking.duration} ساعة</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)" }}>
                          {booking.total_price} أوقية
                        </span>
                        <div style={{ display: "flex", gap: 8 }}>
                          {booking.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => setCancelId(booking.id)}
                                className="btn-ghost"
                                style={{ fontSize: 13, color: "var(--danger)", padding: "6px 14px" }}
                              >
                                إلغاء الحجز
                              </button>
                              <button className="btn-secondary" style={{ fontSize: 13, padding: "6px 14px" }}>
                                تعديل الموعد
                              </button>
                            </>
                          )}
                          {booking.status === "pending" && (
                            <button
                              onClick={() => setCancelId(booking.id)}
                              className="btn-ghost"
                              style={{ fontSize: 13, color: "var(--danger)", padding: "6px 14px" }}
                            >
                              إلغاء
                            </button>
                          )}
                          <button className="btn-secondary" style={{ fontSize: 13, padding: "6px 14px" }}>
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelId && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div className="card" style={{ padding: 28, width: 360, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              إلغاء الحجز
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.7 }}>
              هل أنت متأكد من إلغاء هذا الحجز؟ لن تتمكن من التراجع عن هذا الإجراء.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setCancelId(null)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: "center", padding: "10px" }}
              >
                تراجع
              </button>
              <button
                onClick={() => handleCancel(cancelId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "var(--danger)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Lexend, sans-serif",
                }}
              >
                تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

