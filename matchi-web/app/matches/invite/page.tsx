"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function InviteFriendsPage() {
  const [invited, setInvited] = useState<string[]>([])
  
  const friends = [
    { id: "1", name: "محمد الحسن", level: "متقدم", status: "online" },
    { id: "2", name: "ياسين عمر", level: "متوسط", status: "offline" },
    { id: "3", name: "أحمد محمد", level: "متقدم", status: "online" },
    { id: "4", name: "سلطان علي", level: "مبتدئ", status: "online" },
    { id: "5", name: "صالح خالد", level: "متوسط", status: "offline" },
  ]

  const toggleInvite = (id: string) => {
    setInvited(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px" }}>
        
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>دعوة أصدقاء للمباراة</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>مباراة اليوم: ملعب الأساطير • 18:00</p>
        </div>

        {/* Share Link Card */}
        <div className="card" style={{ padding: 24, marginBottom: 32, background: "rgba(32, 197, 106, 0.05)", border: "1px dashed var(--primary)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>رابط الدعوة السريع</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <input 
              readOnly 
              className="input" 
              value="https://malabak.app/matches/invite/m8X2kL" 
              style={{ background: "var(--bg-elevated)", cursor: "default" }}
            />
            <button className="btn-primary">نسخ</button>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>شارك هذا الرابط مع أصدقائك عبر الواتساب أو تيليجرام.</p>
        </div>

        {/* Friends List */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>أصدقائك</h3>
          </div>
          
          <div style={{ padding: "8px 0" }}>
            {friends.map((friend, i) => (
              <div 
                key={friend.id}
                style={{
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  borderBottom: i === friends.length - 1 ? "none" : "1px solid var(--border)"
                }}
              >
                <div style={{ position: "relative" }}>
                   <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚽</div>
                   <div style={{ 
                     width: 12, height: 12, borderRadius: "50%", 
                     background: friend.status === "online" ? "var(--primary)" : "var(--text-muted)",
                     position: "absolute", bottom: 0, right: 0, border: "2px solid var(--bg-card)"
                   }} />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 700, fontSize: 15 }}>{friend.name}</div>
                   <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>المستوى: {friend.level}</div>
                </div>
                <button 
                  onClick={() => toggleInvite(friend.id)}
                  className={invited.includes(friend.id) ? "btn-secondary" : "btn-primary"}
                  style={{ padding: "6px 16px", fontSize: 12 }}
                >
                  {invited.includes(friend.id) ? "تم الإرسال" : "دعوة"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" style={{ width: "100%", padding: "14px" }}>إرسال الدعوات المحددة ({invited.length})</button>
        </div>

      </div>
    </div>
  )
}

