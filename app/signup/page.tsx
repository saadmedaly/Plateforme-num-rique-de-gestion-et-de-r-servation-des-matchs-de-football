"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [role, setRole] = useState<"player" | "stadium_owner">("player")
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await axios.post("/api/auth/register", {
        email: formData.email,
        password: formData.password,
        full_name: `${formData.name} ${formData.lastname}`,
        role: role === "player" ? "player" : "stadium_owner"
      })
      
      router.push("/login?registered=true")
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-base)" }}>
      
      {/* Visual Side */}
      <div style={{ flex: 1, background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1510129841884-247d827e02a1?auto=format&fit=crop&q=80') center/cover", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 60, color: "white" }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>ابدأ رحلتك رياضية اليوم.</h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 500, lineHeight: 1.6 }}>سجل الآن لتتمكن من حجز الملاعب، الانضمام للفرق المشاركة في بطولات حصرية.</p>
      </div>

      {/* Form Side */}
      <div style={{ width: 550, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, borderLeft: "1px solid var(--border)" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>إنشاء حساب جديد</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>اكتشف الملاعب والفرق من حولك</p>
            {error && (
              <div style={{ 
                marginTop: 16, 
                padding: "10px", 
                background: "rgba(255, 0, 0, 0.1)", 
                color: "var(--danger)", 
                borderRadius: "var(--radius-md)",
                fontSize: 13
              }}>
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSignup} style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>الاسم</label>
                <input 
                  className="input" 
                  name="name"
                  placeholder="الاسم" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>الكنية</label>
                <input 
                  className="input" 
                  name="lastname"
                  placeholder="الكنية" 
                  required 
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>البريد الإلكتروني</label>
              <input 
                className="input" 
                name="email"
                type="email" 
                placeholder="example@mail.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>نوع الحساب</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setRole("player")}
                  style={{ 
                    border: role === "player" ? "2px solid var(--primary)" : "1px solid var(--border)", 
                    color: role === "player" ? "var(--primary)" : "var(--text-primary)" 
                  }}
                >
                  👤 لاعب
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setRole("stadium_owner")}
                  style={{ 
                    border: role === "stadium_owner" ? "2px solid var(--primary)" : "1px solid var(--border)", 
                    color: role === "stadium_owner" ? "var(--primary)" : "var(--text-primary)" 
                  }}
                >
                  🏟️ مالك ملعب
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>كلمة المرور</label>
              <input 
                className="input" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
               بالتوقيع، أنت توافق على <Link href="#" style={{ color: "var(--primary)" }}>شروط الخدمة</Link> و <Link href="#" style={{ color: "var(--primary)" }}>سياسة الخصوصية</Link>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 16, marginTop: 8 }}>
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: "var(--text-secondary)" }}>
            لديك حساب بالفعل؟ <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>سجل دخولك</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

