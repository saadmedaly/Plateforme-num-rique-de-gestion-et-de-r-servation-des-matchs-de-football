"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function TeamChallengesPage() {
  const [activeType, setActiveType] = useState("open")

  const challenges = [
    { id: "1", team: "صقور نواذيبو", level: "متقدم", time: "اليوم 20:00", stadium: "ملعب الأساطير", prize: "1000 نقطة" },
    { id: "2", team: "نمور الخليج", level: "متوسط", time: "غداً 19:00", stadium: "نادي الصقر", prize: "500 نقطة" },
    { id: "3", team: "فرسان انواكشوط", level: "متقدم", time: "الأحد 18:00", stadium: "ملعب الفرسان", prize: "1200 نقطة" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 className="section-title">تحديات الفرق ⚔️</h1>
            <p className="section-subtitle">ابحث عن منافس أو قم بإنشاء تحدي جديد لفريقك</p>
          </div>
          <button className="btn-primary" style={{ padding: "12px 24px" }}>+ إنشاء تحدي</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button 
            onClick={() => setActiveType("open")}
            className={activeType === "open" ? "badge badge-primary" : "badge badge-secondary"}
            style={{ padding: "8px 20px", cursor: "pointer" }}
          >
            تحديات مفتوحة
          </button>
          <button 
            onClick={() => setActiveType("my")}
            className={activeType === "my" ? "badge badge-primary" : "badge badge-secondary"}
            style={{ padding: "8px 20px", cursor: "pointer" }}
          >
            تحدياتي
          </button>
          <button 
            className="badge badge-secondary"
            style={{ padding: "8px 20px" }}
          >
            تاريخ التحديات
          </button>
        </div>

        {/* Challenges Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {challenges.map(c => (
            <div key={c.id} className="card" style={{ padding: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ 
                position: "absolute", top: 0, right: 0, 
                padding: "4px 12px", background: "var(--warning)", color: "#000", 
                fontSize: 10, fontWeight: 900, borderRadius: "0 0 0 12px" 
              }}>
                تحدي نقاط
              </div>
              
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🛡️</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>{c.team}</h3>
                  <div className="badge badge-secondary" style={{ fontSize: 10 }}>مستوى: {c.level}</div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span>⏰ {c.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span>🏟️ {c.stadium}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--primary)", fontWeight: 700 }}>
                  <span>💎 الجائزة: {c.prize}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-primary" style={{ flex: 1 }}>قبول التحدي</button>
                <button className="btn-secondary">مشاهدة الفريق</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Mock */}
        {challenges.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "60px" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚔️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>لا توجد تحديات مفتوحة حالياً</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>كن أول من يتحدى الفرق الأخرى في منطقتك!</p>
          </div>
        )}

      </div>
    </div>
  )
}

