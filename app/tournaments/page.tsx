"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

interface Tournament {
  id: string
  name: string
  description?: string
  start_date?: string
  end_date?: string
  max_teams?: number
  registered_teams?: number
  prize_pool?: number
  entry_fee?: number
  status: "upcoming" | "ongoing" | "completed"
  city?: string
  format?: string
}

const statusConfig = {
  upcoming: { label: "قادم", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  ongoing: { label: "جارٍ الآن", color: "var(--primary)", bg: "var(--primary-muted)" },
  completed: { label: "منتهي", color: "var(--text-muted)", bg: "var(--bg-elevated)" },
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "upcoming" | "ongoing" | "completed">("all")

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/tournaments")
        setTournaments(response.data)
      } catch (error) {
        console.error("Error fetching tournaments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  const display = tournaments.filter(t => filter === "all" || t.status === filter)

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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "40px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontSize: 14, color: "var(--primary)", fontWeight: 600, marginBottom: 10, letterSpacing: "0.05em" }}>
            🏆 البطولات والمسابقات
          </div>
          <h1 style={{
            fontSize: 36,
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
            marginBottom: 12,
          }}>
            نافس على أعلى المستويات
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 28 }}>
            شارك في بطولات حقيقية، نافس أفضل الفرق، واربح الجوائز القيّمة
          </p>
          <Link href="/tournaments/create" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
            + تنظيم بطولة جديدة
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["all", "upcoming", "ongoing", "completed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={filterStyle(filter === f)}>
              {f === "all" ? "الكل" : f === "upcoming" ? "⏳ قادمة" : f === "ongoing" ? "🟢 جارية" : "✅ منتهية"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: display.length > 0 ? "repeat(2, 1fr)" : "1fr", gap: 20 }}>
            {display.map(t => {
              const s = statusConfig[t.status]
              const spotsLeft = (t.max_teams || 0) - (t.registered_teams || 0)
              const fillPct = Math.round(((t.registered_teams || 0) / (t.max_teams || 1)) * 100)

              return (
                <div key={t.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{
                    padding: "20px 24px",
                    background: "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}>
                    <div>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                        {t.name}
                      </h3>
                      {t.city && (
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>📍 {t.city}</p>
                      )}
                    </div>
                    <span className="badge" style={{ background: s.bg, color: s.color, padding: "5px 12px", fontSize: 12 }}>
                      {s.label}
                    </span>
                  </div>

                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                      {[
                        { icon: "🗓️", label: "البداية", value: t.start_date || "—" },
                        { icon: "🎮", label: "الصيغة", value: t.format || "دوري" },
                        { icon: "💰", label: "رسوم الانضمام", value: `${t.entry_fee || 0} أوقية` },
                      ].map((item, i) => (
                        <div key={i} style={{
                          padding: "10px",
                          background: "var(--bg-elevated)",
                          borderRadius: "var(--radius-md)",
                          textAlign: "center",
                        }}>
                          <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{item.value}</div>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {t.prize_pool && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "var(--primary-muted)",
                        border: "1px solid var(--primary-border)",
                        borderRadius: "var(--radius-md)",
                        marginBottom: 16,
                      }}>
                        <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>🏅 جائزة البطولة</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)" }}>
                          {t.prize_pool.toLocaleString()} أوقية
                        </span>
                      </div>
                    )}

                    <div style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: "var(--text-secondary)" }}>
                          {t.registered_teams}/{t.max_teams} فريق مسجل
                        </span>
                        <span style={{ color: fillPct >= 90 ? "var(--danger)" : "var(--primary)", fontWeight: 700 }}>
                          {spotsLeft > 0 ? `${spotsLeft} مقعد متبقي` : "مكتمل"}
                        </span>
                      </div>
                      <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${fillPct}%`,
                          background: fillPct >= 90 ? "var(--danger)" : "var(--primary)",
                          borderRadius: "var(--radius-full)",
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <Link
                        href={`/tournaments/${t.id}`}
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: "center", padding: "10px", fontSize: 13 }}
                      >
                        عرض التفاصيل
                      </Link>
                      {t.status !== "completed" && spotsLeft > 0 && (
                        <button
                          className="btn-primary"
                          style={{ flex: 1, justifyContent: "center", padding: "10px", fontSize: 13 }}
                        >
                          {t.status === "upcoming" ? "سجّل فريقك" : "الانضمام"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {display.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              لا توجد بطولات
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
              كن أول من ينظم بطولة في منطقتك
            </p>
            <Link href="/tournaments/create" className="btn-primary">
              تنظيم بطولة جديدة
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
