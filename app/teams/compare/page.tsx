"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function TeamComparisonPage() {
  const [team1, setTeam1] = useState("نسور انواكشوط")
  const [team2, setTeam2] = useState("صقور نواذيبو")

  const stats = [
    { label: "المباريات المكتملة", t1: 48, t2: 42 },
    { label: "نسبة الفوز", t1: "66.7%", t2: "71.4%" },
    { label: "الأهداف / مباراة", t1: 2.5, t2: 2.8 },
    { label: "نظافة الشباك", t1: 15, t2: 12 },
    { label: "البطولات", t1: 3, t2: 5 },
    { label: "عدد اللاعبين", t1: 12, t2: 10 },
  ]

  const lastMatches = [
    { date: "منذ شهر", result1: "W", result2: "L", score: "3-1" },
    { date: "منذ 3 أشهر", result1: "D", result2: "D", score: "2-2" },
    { date: "منذ 6 أشهر", result1: "L", result2: "W", score: "0-2" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="section-title">مقارنة أداء الفرق</h1>
          <p className="section-subtitle">تحليل المواجهات المباشرة والنتائج التاريخية</p>
        </div>

        {/* Comparison Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.2fr 1fr", alignItems: "center", gap: 20, marginBottom: 40 }}>
          
          {/* Team 1 */}
          <div className="card" style={{ padding: 32, textAlign: "center", position: "relative" }}>
             <div style={{ width: 80, height: 80, margin: "0 auto 16px", background: "var(--primary)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#000" }}>N</div>
             <h2 style={{ fontSize: 20, fontWeight: 800 }}>{team1}</h2>
             <div className="badge badge-primary" style={{ marginTop: 8 }}>المستوى: محترف</div>
          </div>

          <div style={{ fontSize: 32, fontWeight: 900, color: "var(--text-muted)", textAlign: "center" }}>VS</div>

          {/* Team 2 */}
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
             <div style={{ width: 80, height: 80, margin: "0 auto 16px", background: "var(--warning)", borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#000" }}>S</div>
             <h2 style={{ fontSize: 20, fontWeight: 800 }}>{team2}</h2>
             <div className="badge badge-warning" style={{ marginTop: 8, color: "#000" }}>المستوى: محترف</div>
          </div>
        </div>

        {/* Stats Comparison Table */}
        <div className="card" style={{ padding: 0, marginBottom: 40 }}>
           <div style={{ padding: 24, borderBottom: "1px solid var(--border)", textAlign: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>الإحصائيات المقارنة</h3>
           </div>
           <div style={{ padding: "8px 0" }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ 
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", 
                  padding: "16px 24px", 
                  borderBottom: i === stats.length - 1 ? "none" : "1px solid var(--border)",
                  alignItems: "center"
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>{stat.t1}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", fontWeight: 600 }}>{stat.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", textAlign: "left" }}>{stat.t2}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Head to Head */}
        <div className="card" style={{ padding: 24, marginBottom: 40 }}>
           <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, textAlign: "center" }}>تاريخ المواجهات المباشرة</h3>
           <div style={{ display: "grid", gap: 12 }}>
              {lastMatches.map((match, i) => (
                <div key={i} style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between", 
                  padding: "12px 20px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                     <span style={{ fontWeight: 800, color: match.result1 === "W" ? "var(--primary)" : "var(--text-muted)", width: 20 }}>{match.result1}</span>
                     <span style={{ fontSize: 13 }}>تاريخ: {match.date}</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 4 }}>{match.score}</div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                     <span style={{ fontWeight: 800, color: match.result2 === "W" ? "var(--primary)" : "var(--text-muted)" }}>{match.result2}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Action CTA */}
        <div className="card" style={{ padding: 32, textAlign: "center", border: "1px solid var(--primary-border)", background: "var(--primary-muted)" }}>
           <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>هل أنت مستعد للتحدي؟ ⚽</h3>
           <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
             احجز ملعباً الآن وقم بدعوة الفريق الآخر لمباراة ودية تنافسية. سيتم تسجيل النتائج تلقائياً في إحصائيات الفريقين.
           </p>
           <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-primary" style={{ padding: "12px 32px" }}>حجز ملعب للمباراة</button>
              <button className="btn-secondary">إرسال دعوة تحدي</button>
           </div>
        </div>

      </div>
    </div>
  )
}

