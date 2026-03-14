"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"info" | "badges" | "stats">("info")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  const badges = [
    { icon: "⭐", title: "لاعب مميز", desc: "أكمل 10 حجوزات", earned: true },
    { icon: "🔥", title: "متحمس", desc: "حجز 5 أسابيع متتالية", earned: true },
    { icon: "🎯", title: "دقيق المواعيد", desc: "لم يتأخر أبداً", earned: true },
    { icon: "👑", title: "قائد الفريق", desc: "أنشأ فريقاً", earned: true },
    { icon: "🤝", title: "روح رياضية", desc: "10 تقييمات إيجابية", earned: true },
    { icon: "🏆", title: "بطل", desc: "فاز ببطولة", earned: false },
    { icon: "💫", title: "نجم الشبكة", desc: "25 حجزاً مكتملاً", earned: false },
    { icon: "🌟", title: "أسطورة", desc: "100 حجز مكتمل", earned: false },
  ]

  const stats = [
    { icon: "📅", label: "إجمالي الحجوزات", value: 12 },
    { icon: "⚽", label: "المباريات", value: 24 },
    { icon: "🏆", label: "البطولات", value: 3 },
    { icon: "👥", label: "الفرق", value: 2 },
    { icon: "🏟️", label: "الملاعب المختلفة", value: 8 },
    { icon: "⏰", label: "ساعات اللعب", value: 36 },
  ]

  const tabStyle = (active: boolean) => ({
    padding: "8px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: active ? "var(--primary)" : "var(--text-secondary)",
    borderBottom: `2px solid ${active ? "var(--primary)" : "transparent"}`,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "Lexend, sans-serif",
  })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* Profile Header */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div style={{
              width: 90, height: 90,
              background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              color: "#000",
              border: "3px solid var(--primary-border)",
              flexShrink: 0,
            }}>
              {session?.user?.name?.[0] || "م"}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 4 }}>
                {session?.user?.name || "لاعب"}
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
                {session?.user?.email || "player@malabak.com"}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="badge badge-primary">⭐ لاعب مميز</span>
                <span className="badge badge-secondary">👥 فريقين</span>
                <span className="badge badge-secondary">📍 انواكشوط</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" style={{ fontSize: 13 }}>تعديل الملف</button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-ghost"
                style={{ fontSize: 13, color: "var(--danger)" }}
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 0, marginTop: 24, borderBottom: "1px solid var(--border)" }}>
            {(["info", "badges", "stats"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
                {tab === "info" ? "المعلومات" : tab === "badges" ? "🏅 الأوسمة" : "📊 الإحصائيات"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
        {activeTab === "info" && (
          <div className="animate-fade-in">
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 20 }}>
                المعلومات الشخصية
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { label: "الاسم الكامل", value: session?.user?.name || "—" },
                  { label: "البريد الإلكتروني", value: session?.user?.email || "—" },
                  { label: "المدينة", value: "انواكشوط" },
                  { label: "الجنسية", value: "موريتاني" },
                  { label: "تاريخ الانضمام", value: "يناير 2024" },
                  { label: "الوضع", value: "نشط" },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                      {field.label}
                    </label>
                    <div style={{
                      padding: "10px 14px",
                      background: "var(--bg-input)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      fontSize: 14,
                      color: "var(--text-primary)",
                    }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <button className="btn-primary" style={{ fontSize: 14 }}>حفظ التغييرات</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="animate-fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {badges.map((badge, i) => (
                <div key={i} className="card" style={{
                  padding: 20, textAlign: "center",
                  opacity: badge.earned ? 1 : 0.4,
                  borderColor: badge.earned ? "var(--primary-border)" : "var(--border)",
                  background: badge.earned ? "var(--primary-muted)" : "var(--bg-card)",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{badge.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: badge.earned ? "var(--primary)" : "var(--text-primary)", marginBottom: 4 }}>
                    {badge.title}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>{badge.desc}</div>
                  {badge.earned && (
                    <div style={{ marginTop: 8 }}>
                      <span className="badge badge-primary" style={{ fontSize: 10 }}>✓ محقق</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24, textAlign: "center", marginTop: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                شارك أوسمتك 🏆
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
                أظهر انجازاتك رياضية لأصدقائك
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn-primary" style={{ fontSize: 13 }}>مشاركة الملف الشخصي</button>
                <button className="btn-secondary" style={{ fontSize: 13 }}>نسخ الرابط</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="animate-fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {stats.map((stat, i) => (
                <div key={i} className="stat-card" style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{stat.icon}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.03em" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

