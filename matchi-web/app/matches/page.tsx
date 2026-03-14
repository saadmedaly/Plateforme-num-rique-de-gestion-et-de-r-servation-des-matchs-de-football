"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

const levelColors: Record<string, { color: string; bg: string }> = {
  "مبتدئ": { color: "var(--primary)", bg: "var(--primary-muted)" },
  "متوسط": { color: "var(--warning)", bg: "rgba(245,158,11,0.12)" },
  "متقدم": { color: "var(--danger)", bg: "rgba(239,68,68,0.12)" },
  "للجميع": { color: "var(--info)", bg: "rgba(59,130,246,0.12)" },
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState("")
  const [matchType, setMatchType] = useState("")
  const [level, setLevel] = useState("")

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/matches")
        setMatches(response.data)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const filtered = matches.filter(m => {
    const mCity = m.stadium?.city || ""
    const mType = m.type || ""
    const mLevel = m.level || "للجميع"

    if (city && mCity !== city) return false
    if (matchType && mType !== matchType) return false
    if (level && mLevel !== level) return false
    return true
  })

  const filterStyle = (active: boolean) => ({
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    fontSize: 12,
    fontWeight: 600,
    border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
    background: active ? "var(--primary-muted)" : "var(--bg-card)",
    color: active ? "var(--primary)" : "var(--text-secondary)",
    cursor: "pointer",
    fontFamily: "Lexend, sans-serif",
    transition: "all 0.2s",
  })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "28px 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                البحث عن مباريات قريبة
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                انضم لمباريات تحدث الآن أو في الأيام القادمة
              </p>
            </div>
            <Link href="/matches/create" className="btn-primary">
              + نشر مباراة
            </Link>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>📍</span>
              {["انواكشوط", "نواذيبو", "أطار"].map(c => (
                <button key={c} style={filterStyle(city === c)} onClick={() => setCity(city === c ? "" : c)}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ width: 1, background: "var(--border)", margin: "0 4px" }} />
            {["5 ضد 5", "7 ضد 7", "11 ضد 11"].map(t => (
              <button key={t} style={filterStyle(matchType === t)} onClick={() => setMatchType(matchType === t ? "" : t)}>
                {t}
              </button>
            ))}
            <div style={{ width: 1, background: "var(--border)", margin: "0 4px" }} />
            {["مبتدئ", "متوسط", "متقدم", "للجميع"].map(l => (
              <button key={l} style={filterStyle(level === l)} onClick={() => setLevel(level === l ? "" : l)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div className="spinner" />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>⚽</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                لا توجد مباريات
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                لا توجد مباريات بهذه المعايير، جرب تعديل الفلاتر أو أنشئ مباراة جديدة
              </p>
              <Link href="/matches/create" className="btn-primary">
                نشر مباراة جديدة
              </Link>
            </div>
          ) : filtered.map(match => {
            const mLevel = match.level || "للجميع"
            const lv = levelColors[mLevel] || { color: "var(--text-secondary)", bg: "var(--bg-elevated)" }
            const totalPlayers = match.total_players || 10
            const spots = match.spots_available || 0
            const fillPct = Math.round(((totalPlayers - spots) / totalPlayers) * 100)
            const mStadium = match.stadium?.name || "ملعب غير معروف"
            const mCity = match.stadium?.city || "غير محدد"
            const mDate = new Date(match.date).toLocaleDateString('ar-MA', { weekday: 'long' })
            const mTime = match.start_time?.substring(0, 5) || "00:00"

            return (
              <div key={match.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                  <div style={{
                    minWidth: 100,
                    background: "var(--bg-elevated)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 16px",
                    borderLeft: "1px solid var(--border)",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--primary)", fontWeight: 700, marginBottom: 4 }}>
                      {mDate}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      {mTime}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>⚽ {match.type || "5 ضد 5"}</div>
                  </div>

                  <div style={{ flex: 1, padding: "18px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>
                          {mStadium}
                        </h3>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                          📍 {mCity}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="badge" style={{ background: lv.bg, color: lv.color, fontSize: 12 }}>
                          {mLevel}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        👤 المنظم: {match.organizer?.full_name || "لاعب"}
                      </span>
                      <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        💰 {match.price || 0} أوقية/لاعب
                      </span>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                        <span style={{ color: "var(--text-muted)" }}>
                          {totalPlayers - spots} من {totalPlayers} لاعب انضموا
                        </span>
                        <span style={{ color: spots <= 3 ? "var(--danger)" : "var(--primary)", fontWeight: 700 }}>
                          {spots} مقعد متبقٍ
                        </span>
                      </div>
                      <div style={{ height: 5, background: "var(--bg-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${fillPct}%`,
                          background: spots <= 3 ? "var(--danger)" : "var(--primary)",
                          borderRadius: "var(--radius-full)",
                        }} />
                      </div>
                    </div>
                  </div>

                  <div style={{
                    minWidth: 140,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 16px",
                    borderRight: "1px solid var(--border)",
                    gap: 10,
                  }}>
                    <Link href={`/matches/${match.id}`} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 14 }}>
                      انضم الآن
                    </Link>
                    <Link href={`/matches/${match.id}`} className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
