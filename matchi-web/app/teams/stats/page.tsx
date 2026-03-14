"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function TeamStatsPage() {
  const [timeRange, setTimeRange] = useState("3_months")

  const teamData = {
    matchesPlayed: 48,
    wins: 32,
    draws: 8,
    losses: 8,
    goalsScored: 124,
    goalsConceded: 56,
    cleanSheets: 15,
    winRate: "66.7%",
  }

  const topScorers = [
    { name: "أحمد محمد", goals: 28, assists: 12, rating: 8.9 },
    { name: "ياسين عمر", goals: 22, assists: 15, rating: 8.5 },
    { name: "محمد الحسن", goals: 18, assists: 8, rating: 7.8 },
    { name: "صالح خالد", goals: 12, assists: 5, rating: 7.2 },
  ]

  const recentPerformance = [
    { result: "W", score: "3-1", opponent: "صقور جدة", date: "منذ 3 أيام" },
    { result: "W", score: "2-0", opponent: "نمور الخليج", date: "منذ أسبوع" },
    { result: "D", score: "2-2", opponent: "انواكشوط ستارز", date: "منذ أسبوعين" },
    { result: "L", score: "0-1", opponent: "فرسان نواذيبو", date: "منذ 3 أسابيع" },
    { result: "W", score: "4-2", opponent: "نادي أطار", date: "منذ شهر" },
  ]

  const progressStyle = (pct: number, color: string) => ({
    height: 8,
    width: "100%",
    background: "var(--bg-elevated)",
    borderRadius: "var(--radius-full)",
    overflow: "hidden",
    marginTop: 8,
    position: "relative" as const
  })

  const fillStyle = (pct: number, color: string) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: "var(--radius-full)",
  })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, background: "var(--primary)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#000" }}>N</div>
              <h1 className="section-title">إحصائيات "نسور انواكشوط"</h1>
            </div>
            <p className="section-subtitle">تحليل الأداء الفردي والجماعي للفريق</p>
          </div>
          <select 
            className="input" 
            style={{ width: "auto", minWidth: 160 }}
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
          >
            <option value="all">كل الأوقات</option>
            <option value="this_year">هذا العام</option>
            <option value="3_months">آخر 3 أشهر</option>
            <option value="1_month">آخر شهر</option>
          </select>
        </div>

        {/* Overview Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>المباريات</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>{teamData.matchesPlayed}</div>
            <div style={{ fontSize: 11, color: "var(--primary)", marginTop: 4 }}>+4 هذا الشهر</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>نسبة الفوز</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>{teamData.winRate}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>أعلى من المتوسّط</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>الأهداف المسجلة</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>{teamData.goalsScored}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>2.58 هدف/مباراة</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>نظافة الشباك</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)" }}>{teamData.cleanSheets}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>31% من المباريات</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
          
          {/* Performance & Win/Loss/Draw */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>نتائج المباريات</h3>
              <div style={{ display: "flex", height: 24, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ width: "66%", background: "var(--primary)" }} title="Wins" />
                <div style={{ width: "17%", background: "var(--warning)" }} title="Draws" />
                <div style={{ width: "17%", background: "var(--danger)" }} title="Losses" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>{teamData.wins}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>فوز</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--warning)" }}>{teamData.draws}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>تعادل</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--danger)" }}>{teamData.losses}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>خسارة</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>الأداء الأخير</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {recentPerformance.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ 
                      width: 28, height: 28, borderRadius: 6, 
                      background: p.result === "W" ? "var(--primary)" : p.result === "D" ? "var(--warning)" : "var(--danger)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#000", fontWeight: 800, fontSize: 13
                    }}>
                      {p.result}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.opponent}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.date}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{p.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Players Table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>أبرز اللاعبين</h3>
            </div>
            <div style={{ padding: 24 }}>
              {topScorers.map((player, i) => (
                <div key={i} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚽</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700 }}>{player.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{player.goals} هدف • {player.assists} تمريرة</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "left" }}>
                       <div style={{ fontSize: 12, color: "var(--text-muted)" }}>التقييم</div>
                       <div style={{ fontSize: 16, fontWeight: 800, color: "var(--warning)" }}>{player.rating}</div>
                    </div>
                  </div>
                  <div style={progressStyle(player.rating * 10, "var(--primary)")}>
                    <div style={fillStyle(player.rating * 10, i === 0 ? "var(--primary)" : "var(--primary-dark)")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Comparison CTA */}
        <div className="card" style={{ marginTop: 32, padding: 32, background: "linear-gradient(45deg, var(--bg-card) 0%, #1a2234 100%)", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>قارن أداء فريقك مع الفرق الأخرى ⚔️</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto 24px" }}>
            اكتشف نقاط القوة والضعف في فريقك مقارنة بأفضل الفرق في منطقتك. احصل على تقارير مفصلة للمواجهات المباشرة.
          </p>
          <button className="btn-primary" style={{ padding: "12px 32px" }}>بدء المقارنة</button>
        </div>

      </div>
    </div>
  )
}

