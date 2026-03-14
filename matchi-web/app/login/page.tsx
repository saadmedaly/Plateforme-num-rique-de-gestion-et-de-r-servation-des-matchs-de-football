"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.")
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password
      })

      if (result?.error) {
        setError("فشل تسجيل الدخول: البريد الإلكتروني أو كلمة المرور غير صحيحة")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("حدث خطأ ما أثناء تسجيل الدخول")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-base)" }}>
      
      {/* Visual Side */}
      <div style={{ flex: 1, background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80') center/cover", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 60, color: "white" }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 16 }}>ملعبك المفضل بضغطة زر.</h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 500, lineHeight: 1.6 }}>انضم لأكبر تجمع لمحبي كرة القدم في المنطقة، احجز، العب، ونافس.</p>
      </div>

      {/* Form Side */}
      <div style={{ width: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, borderLeft: "1px solid var(--border)" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚽</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>تسجيل الدخول</h2>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>أهلاً بك مجدداً في ملعبك</p>
            {success && (
              <div style={{ marginTop: 16, padding: "10px", background: "rgba(0, 255, 0, 0.1)", color: "#10b981", borderRadius: "var(--radius-md)", fontSize: 13 }}>
                {success}
              </div>
            )}
            {error && (
              <div style={{ marginTop: 16, padding: "10px", background: "rgba(255, 0, 0, 0.1)", color: "var(--danger)", borderRadius: "var(--radius-md)", fontSize: 13 }}>
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: 20 }}>
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
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                 <label style={{ fontSize: 13, fontWeight: 700 }}>كلمة المرور</label>
                 <Link href="#" style={{ fontSize: 12, color: "var(--primary)" }}>نسيت كلمة المرور؟</Link>
              </div>
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

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 16, marginTop: 10 }}>
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>

          <div style={{ margin: "32px 0", textAlign: "center", position: "relative" }}>
             <hr style={{ border: "none", borderTop: "1px solid var(--border)" }} />
             <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "var(--bg-base)", padding: "0 16px", fontSize: 12, color: "var(--text-muted)" }}>أو عن طريق</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
             <button className="btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
                G <span>جوجل</span>
             </button>
             <button className="btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13 }}>
                A <span>آبل</span>
             </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 40, fontSize: 14, color: "var(--text-secondary)" }}>
            ليس لديك حساب؟ <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 700 }}>سجل الآن</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

