"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function TournamentDetailPage() {
  const [activeTab, setActiveTab] = useState("bracket")

  const tournament = {
    name: "كأس الأبطال الرمضاني",
    organizer: "بلدية نواذيبو",
    status: "جاري",
    startDate: "15 مارس 2024",
    prizeType: "كأس + مكافأة مالية",
    prizeValue: "10,000 أوقية",
    teamsCount: 16,
    currentRound: "ربع النهائي",
  }

  const bracket = [
    { match: "ربع النهائي 1", t1: "نسور انواكشوط", t2: "صقور نواذيبو", score1: "3", score2: "1", status: "completed" },
    { match: "ربع النهائي 2", t1: "نمور الخليج", t2: "فرسان انواكشوط", score1: "0", score2: "2", status: "completed" },
    { match: "ربع النهائي 3", t1: "نادي الوحدة", t2: "شباب الميناء", score1: "-", score2: "-", status: "upcoming" },
    { match: "ربع النهائي 4", t1: "الزعيم", t2: "نادي العروبة", score1: "-", score2: "-", status: "upcoming" },
  ]

  const tabStyle = (active: boolean) => ({
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 600,
    color: active ? "var(--primary)" : "var(--text-secondary)",
    borderBottom: `2px solid ${active ? "var(--primary)" : "transparent"}`,
    background: "transparent",
    border: "none",
    cursor: "pointer"
  })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Tournament Hero */}
        <div className="card" style={{ padding: 40, marginBottom: 32, background: "linear-gradient(45deg, #111, #1a2234)", textAlign: "center", position: "relative", overflow: "hidden" }}>
           <div style={{ position: "absolute", top: 20, right: 20 }}>
             <span className="badge badge-primary">مباشر الآن 🔴</span>
           </div>
           <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
           <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>{tournament.name}</h1>
           <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 24 }}>بتنظيم {tournament.organizer}</p>
           
           <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
             <div style={{ textAlign: "center" }}>
               <div style={{ fontSize: 13, color: "var(--text-muted)" }}>الجائزة</div>
               <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>{tournament.prizeValue}</div>
             </div>
             <div style={{ textAlign: "center" }}>
               <div style={{ fontSize: 13, color: "var(--text-muted)" }}>الفرق</div>
               <div style={{ fontSize: 18, fontWeight: 800 }}>{tournament.teamsCount} فريق</div>
             </div>
             <div style={{ textAlign: "center" }}>
               <div style={{ fontSize: 13, color: "var(--text-muted)" }}>الجولة الحالية</div>
               <div style={{ fontSize: 18, fontWeight: 800 }}>{tournament.currentRound}</div>
             </div>
           </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 32 }}>
          <button onClick={() => setActiveTab("bracket")} style={tabStyle(activeTab === "bracket")}>جدول المباريات (Bracket)</button>
          <button onClick={() => setActiveTab("teams")} style={tabStyle(activeTab === "teams")}>الفرق المشاركة</button>
          <button onClick={() => setActiveTab("rules")} style={tabStyle(activeTab === "rules")}>القوانين والجوائز</button>
        </div>

        {/* Content */}
        {activeTab === "bracket" && (
          <div className="animate-fade-in" style={{ display: "grid", gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>مرحلة {tournament.currentRound}</h2>
            {bracket.map((m, i) => (
              <div key={i} className="card" style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 0.5fr 1fr", alignItems: "center", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
                   <span style={{ fontWeight: 700 }}>{m.t1}</span>
                   <div style={{ width: 32, height: 32, background: "var(--bg-elevated)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>🛡️</div>
                </div>
                
                <div>
                   <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 8 }}>{m.score1} - {m.score2}</div>
                   <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{m.status === "completed" ? "انتهت" : "قريباً"}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-start" }}>
                   <div style={{ width: 32, height: 32, background: "var(--bg-elevated)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>⚔️</div>
                   <span style={{ fontWeight: 700 }}>{m.t2}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "rules" && (
          <div className="card animate-fade-in" style={{ padding: 32 }}>
             <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>قوانين البطولة</h2>
             <ul style={{ paddingRight: 20, lineHeight: 1.8, color: "var(--text-secondary)", fontSize: 14 }}>
               <li>الالتزام بالروح رياضية والزي المناسب.</li>
               <li>مدة المباراة 40 دقيقة (20 لكل شوط).</li>
               <li>في حال التعادل في الأدوار الإقصائية يتم التوجه لركلات الترجيح مباشرة.</li>
               <li>يُسمح بتسجيل 8 لاعبين كحد أقصى لكل فريق.</li>
             </ul>
             <div style={{ marginTop: 32, padding: 20, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>توزيع الجوائز</h3>
                <p style={{ fontSize: 13 }}>المركز الأول: {tournament.prizeValue} + كأس البطولة</p>
                <p style={{ fontSize: 13 }}>المركز الثاني: 3,000 أوقية + ميداليات فضية</p>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
