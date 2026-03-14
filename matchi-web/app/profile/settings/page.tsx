"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  const sectionStyle = { marginBottom: 32 }
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>الإعدادات</h1>

        <div className="card" style={{ padding: 40 }}>
          
          {/* Profile Section */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>الملف الشخصي</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
               <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg-elevated)", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>👨</div>
               <button className="btn-secondary" style={{ fontSize: 12 }}>تغيير الصورة</button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
               <div>
                 <label style={labelStyle}>الاسم كامل</label>
                 <input className="input" defaultValue="سعد ميلود" />
               </div>
               <div>
                 <label style={labelStyle}>اسم المستخدم</label>
                 <input className="input" defaultValue="@saad_m" />
               </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>السيرة الذاتية (Bio)</label>
              <textarea className="input" rows={3} defaultValue="أحب كرة القدم وألعب في مركز الهجوم." />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "32px 0" }} />

          {/* Preferences */}
          <div style={sectionStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>التفضيلات</h2>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
               <div>
                 <div style={{ fontWeight: 600 }}>إشعارات التطبيق</div>
                 <div style={{ fontSize: 12, color: "var(--text-muted)" }}>استقبال إشعارات الحجوزات والمباريات</div>
               </div>
               <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ width: 24, height: 24, accentColor: "var(--primary)" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <div>
                 <div style={{ fontWeight: 600 }}>الوضع الداكن</div>
                 <div style={{ fontSize: 12, color: "var(--text-muted)" }}>استخدام المظهر الداكن في كامل التطبيق</div>
               </div>
               <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} style={{ width: 24, height: 24, accentColor: "var(--primary)" }} />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "32px 0" }} />

          {/* Account Actions */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: "var(--danger)" }}>إدارة الحساب</h2>
            <div style={{ display: "flex", gap: 12 }}>
               <button className="btn-secondary">تغيير كلمة المرور</button>
               <button className="btn-ghost" style={{ color: "var(--danger)" }}>حذف الحساب</button>
            </div>
          </div>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }}>
             <button className="btn-primary" style={{ padding: "12px 40px" }}>حفظ كافة التغييرات</button>
          </div>

        </div>

      </div>
    </div>
  )
}

