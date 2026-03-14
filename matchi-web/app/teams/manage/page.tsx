"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<"members" | "requests" | "settings">("members")

  const members = [
    { id: "1", name: "أحمد محمد", role: "قائد", status: "نشط", games: 24, joinDate: "2023-10-12", avatar: "أ" },
    { id: "2", name: "ياسين عمر", role: "لاعب", status: "نشط", games: 18, joinDate: "2023-11-05", avatar: "ي" },
    { id: "3", name: "صالح خالد", role: "لاعب", status: "غائب", games: 12, joinDate: "2023-11-20", avatar: "ص" },
    { id: "4", name: "محمد الحسن", role: "لاعب", status: "نشط", games: 30, joinDate: "2023-09-15", avatar: "م" },
    { id: "5", name: "سلطان علي", role: "مدير", status: "نشط", games: 5, joinDate: "2024-01-10", avatar: "س" },
  ]

  const joinRequests = [
    { id: "101", name: "عبدالله سعد", level: "متوسط", message: "أريد الانضمام لفريقكم، أنا حارس مرمى.", date: "منذ ساعتين" },
    { id: "102", name: "فيصل حمود", level: "متقدم", message: "ألعب في خط الدفاع، مستعد للمباريات القادمة.", date: "منذ يوم" },
  ]

  const tabStyle = (active: boolean) => ({
    padding: "10px 24px",
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

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        
        {/* Team Header */}
        <div className="card" style={{ padding: 24, marginBottom: 24, background: "linear-gradient(to left, var(--bg-card), var(--bg-surface))" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ 
              width: 80, height: 80, 
              borderRadius: "var(--radius-lg)", 
              background: "var(--primary)", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: 32, fontWeight: 800, color: "var(--text-inverse)" 
            }}>
              N
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>نسور انواكشوط</h1>
              <div style={{ display: "flex", gap: 15 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>👥 12 لاعب</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>🏆 3 بطولات</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>📍 نواذيبو</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary">دعوة لاعبين</button>
              <button className="btn-secondary">تعديل الفريق</button>
            </div>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", marginTop: 24, borderBottom: "1px solid var(--border)" }}>
            <button onClick={() => setActiveTab("members")} style={tabStyle(activeTab === "members")}>اللاعبين (5)</button>
            <button onClick={() => setActiveTab("requests")} style={tabStyle(activeTab === "requests")}>طلبات الانضمام (2)</button>
            <button onClick={() => setActiveTab("settings")} style={tabStyle(activeTab === "settings")}>الإعدادات</button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "members" && (
          <div className="animate-fade-in" style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>قائمة اللاعبين</h2>
              <input className="input" style={{ maxWidth: 240, padding: "6px 14px" }} placeholder="بحث عن لاعب..." />
            </div>

            {members.map(member => (
              <div key={member.id} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ 
                    width: 44, height: 44, borderRadius: "50%", 
                    background: "var(--bg-elevated)", color: "var(--primary)", 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    fontWeight: 700, border: "1px solid var(--border)" 
                  }}>
                    {member.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{member.name}</span>
                      <span className="badge badge-secondary" style={{ fontSize: 10 }}>{member.role}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                      انضم في {member.joinDate} • {member.games} مباراة
                    </div>
                  </div>
                  <div style={{ textAlign: "left", display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ 
                      fontSize: 11, fontWeight: 700, 
                      color: member.status === "نشط" ? "var(--primary)" : "var(--text-muted)" 
                    }}>
                      ● {member.status}
                    </span>
                    <button className="btn-ghost" style={{ padding: 6 }}>⋮</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="animate-fade-in" style={{ display: "grid", gap: 16 }}>
            {joinRequests.map(req => (
              <div key={req.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{req.name}</span>
                    <span className="badge badge-primary" style={{ marginRight: 8 }}>{req.level}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{req.date}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>{req.message}</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-primary" style={{ fontSize: 13, flex: 1 }}>قبول</button>
                  <button className="btn-secondary" style={{ fontSize: 13, flex: 1 }}>رفض</button>
                  <button className="btn-ghost" style={{ fontSize: 13 }}>الملف الشخصي</button>
                </div>
              </div>
            ))}
            {joinRequests.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px" }}>لا يوجد طلبات انضمام حالياً.</div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="card animate-fade-in" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>إعدادات الفريق</h2>
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>خصوصية الفريق</label>
                <select className="input">
                  <option>عام (يمكن للجميع الانضمام)</option>
                  <option>بطلب (يتطلب موافقة القائد)</option>
                  <option>خاص (بالدعوة فقط)</option>
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>قبول التحديات</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>السماح للفرق الأخرى بطلب مباريات ودية</div>
                </div>
                <div style={{ width: 44, height: 24, background: "var(--primary)", borderRadius: 12, position: "relative" }}>
                   <div style={{ width: 18, height: 18, background: "white", borderRadius: "50%", position: "absolute", left: 4, top: 3 }} />
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <button className="btn-primary">حفظ الإعدادات</button>
              </div>
            </div>
            
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <button className="btn-ghost" style={{ color: "var(--danger)" }}>حذف الفريق نهائياً</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

