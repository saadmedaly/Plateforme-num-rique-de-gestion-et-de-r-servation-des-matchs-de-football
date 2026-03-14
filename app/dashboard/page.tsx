"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

interface Booking {
  id: string
  stadium_name: string
  booking_date: string
  start_time: string
  duration: number
  total_price: number
  status: "confirmed" | "pending" | "cancelled" | "past"
}

interface UserStats {
  total_bookings: number
  total_spent: number
  favorite_stadium: string
  member_since: string
  rating?: string
  badges_count?: number
}

const statusConfig = {
  confirmed: { label: "مؤكد", color: "var(--primary)", bg: "var(--primary-muted)" },
  pending: { label: "بانتظار التأكيد", color: "var(--warning)", bg: "rgba(245,158,11,0.12)" },
  cancelled: { label: "ملغي", color: "var(--danger)", bg: "rgba(239,68,68,0.12)" },
  past: { label: "منتهي", color: "var(--text-muted)", bg: "var(--bg-elevated)" },
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return
    const userId = (session.user as any).id
    
    const fetch = async () => {
      try {
        const [bRes, sRes] = await Promise.all([
          axios.get(`/api/bookings?user_id=${userId}`),
          axios.get(`/api/user/stats?user_id=${userId}`),
        ])
        setBookings(bRes.data)
        setStats(sRes.data)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
        setBookings([])
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [status, session])

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  const displayStats = [
    { icon: "📅", label: "إجمالي الحجوزات", value: stats?.total_bookings ?? 0, unit: "حجز" },
    { icon: "💰", label: "إجمالي الإنفاق", value: stats?.total_spent ?? 0, unit: "أوقية" },
    { icon: "⭐", label: "متوسط التقييم", value: stats?.rating ?? "0", unit: "/5" },
    { icon: "🏆", label: "الأوسمة", value: stats?.badges_count ?? 0, unit: "وسام" },
  ]

  const quickActions = [
    { href: "/stadiums", icon: "🏟️", label: "احجز ملعباً" },
    { href: "/teams", icon: "👥", label: "فريقي" },
    { href: "/matches", icon: "⚽", label: "مباريات قريبة" },
    { href: "/tournaments", icon: "🏆", label: "البطولات" },
    { href: "/bookings", icon: "📋", label: "سجل الحجوزات" },
    { href: "/profile", icon: "👤", label: "الملف الشخصي" },
  ]

  /* Removed hardcoded upcomingBookings since we use real data from state */

  const tabStyle = (active: boolean) => ({
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    color: active ? "var(--primary)" : "var(--text-secondary)",
    borderBottom: `2px solid ${active ? "var(--primary)" : "transparent"}`,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "Lexend, sans-serif",
  })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>

        {/* Welcome Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>
              مرحباً، {session?.user?.name || "لاعب"} 👋
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              إليك ملخص نشاطك نواذيبوي
            </p>
          </div>
          <Link href="/stadiums" className="btn-primary">
            + احجز ملعباً جديداً
          </Link>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {displayStats.map((stat, i) => (
            <div key={i} className="stat-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.03em" }}>
                {stat.value}
                <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400, marginRight: 4 }}>{stat.unit}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
          {/* Bookings */}
          <div>
            <div className="card" style={{ padding: 0 }}>
              <div style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>حجوزاتي</h2>
                <Link href="/bookings" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>
                  عرض الكل ←
                </Link>
              </div>

              {/* Tabs */}
              <div style={{
                padding: "0 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                gap: 4,
              }}>
                {(["upcoming", "past", "cancelled"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
                    {tab === "upcoming" ? "القادمة" : tab === "past" ? "المنتهية" : "الملغاة"}
                  </button>
                ))}
              </div>

              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                {bookings.filter(b => {
                  if (activeTab === "upcoming") return b.status === "confirmed" || b.status === "pending";
                  if (activeTab === "past") return b.status === "past";
                  if (activeTab === "cancelled") return b.status === "cancelled";
                  return false;
                }).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}

                {bookings.filter(b => {
                  if (activeTab === "upcoming") return b.status === "confirmed" || b.status === "pending";
                  if (activeTab === "past") return b.status === "past";
                  if (activeTab === "cancelled") return b.status === "cancelled";
                  return false;
                }).length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>لا توجد حجوزات {activeTab === "upcoming" ? "قادمة" : activeTab === "past" ? "منتهية" : "ملغاة"}</p>
                    {activeTab === "upcoming" && (
                      <Link href="/stadiums" className="btn-primary" style={{ marginTop: 16, fontSize: 13, padding: "8px 20px" }}>
                        احجز الآن
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Quick Actions */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
                الإجراءات السريعة
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {quickActions.map(action => (
                  <Link
                    key={action.href}
                    href={action.href}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      padding: "12px 8px",
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-border)"
                      ;(e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                      ;(e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{action.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Badges/Achievements */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
                أوسمتي 🏆
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { icon: "⭐", label: "لاعب مميز" },
                  { icon: "🔥", label: "5 حجوزات" },
                  { icon: "🎯", label: "منتظم" },
                  { icon: "👑", label: "قائد فريق" },
                  { icon: "🤝", label: "روح رياضية" },
                ].map((badge, i) => (
                  <div key={i} style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "10px",
                    background: "var(--primary-muted)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--primary-border)",
                    flex: "1",
                    minWidth: 60,
                  }}>
                    <span style={{ fontSize: 20 }}>{badge.icon}</span>
                    <span style={{ fontSize: 10, color: "var(--primary)", fontWeight: 600, textAlign: "center" }}>
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const s = statusConfig[booking.status]
  return (
    <div className="card-elevated" style={{ padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            {(booking as any).stadiums?.name || booking.stadium_name}
          </h4>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            📅 {(booking as any).date || booking.booking_date} — ⏰ {booking.start_time}
          </p>
        </div>
        <span className="badge" style={{ background: s.bg, color: s.color, fontSize: 12 }}>
          {s.label}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>
          {booking.total_price} أوقية
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {booking.status === "confirmed" && (
            <button className="btn-ghost" style={{ fontSize: 12, padding: "4px 10px", color: "var(--danger)" }}>
              إلغاء
            </button>
          )}
          <Link href={`/bookings/${booking.id}`} className="btn-secondary" style={{ fontSize: 12, padding: "4px 12px" }}>
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  )
}

