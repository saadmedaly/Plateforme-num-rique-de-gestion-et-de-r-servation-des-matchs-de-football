"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Trophy, Calendar, Clock, MapPin, Shield } from "lucide-react"
import axios from "axios"

interface Stadium {
  id: string
  name: string
  city: string
}
interface Team {
  id: string
  name: string
}

export default function CreateMatchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    stadium_id: "",
    home_team_id: "",
    away_team_id: "",
    date: "",
    start_time: "",
    end_time: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    fetchData()
  }, [status])

  const fetchData = async () => {
    try {
      const [s, t] = await Promise.all([
        axios.get("/api/stadiums"),
        axios.get("/api/teams"),
      ])
      setStadiums(s.data)
      setTeams(t.data)
    } catch (err) {
      console.error("Fetch data error:", err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.stadium_id || !form.date || !form.start_time || !form.end_time) {
      setError("الرجاء إدخال جميع الحقول المطلوبة")
      return
    }
    try {
      setLoading(true)
      setError("")
      await axios.post("/api/matches", {
        stadium_id: form.stadium_id,
        home_team_id: form.home_team_id || null,
        away_team_id: form.away_team_id || null,
        date: form.date,
        start_time: form.start_time,
        end_time: form.end_time,
      }, {
        headers: { "x-user-id": (session?.user as any).id }
      })
      router.push("/matches")
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إنشاء المباراة")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || dataLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <Link href="/matches" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            ← العودة للمباريات
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em" }}>إنشاء مباراة جديدة</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>قم بتنظيم مباراة وادعُ أصدقاءك للعب</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div style={{ background: "#ef444420", color: "#ef4444", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 24, fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>الملعب المختار *</label>
              <select
                className="input"
                style={{ height: 48, fontSize: 15 }}
                value={form.stadium_id}
                onChange={(e) => setForm({ ...form, stadium_id: e.target.value })}
                required
              >
                <option value="">اختر الملعب</option>
                {stadiums.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.city}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>الفريق المضيف (اختياري)</label>
                <select
                  className="input"
                  style={{ height: 48, fontSize: 15 }}
                  value={form.home_team_id}
                  onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}
                >
                  <option value="">لا يوجد فريق</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>الفريق الضيف (اختياري)</label>
                <select
                  className="input"
                  style={{ height: 48, fontSize: 15 }}
                  value={form.away_team_id}
                  onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}
                >
                  <option value="">لا يوجد فريق</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="divider" />

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>تاريخ المباراة *</label>
                <input
                  type="date"
                  className="input"
                  style={{ height: 48, fontSize: 15 }}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>البداية *</label>
                <input
                  type="time"
                  className="input"
                  style={{ height: 48, fontSize: 15 }}
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>النهاية *</label>
                <input
                  type="time"
                  className="input"
                  style={{ height: 48, fontSize: 15 }}
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <Link href="/matches" className="btn-secondary" style={{ flex: 1, padding: 14 }}>إلغاء</Link>
              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary" 
                style={{ flex: 2, padding: 14, fontSize: 16 }}
              >
                {loading ? "جاري إنشاء المباراة..." : "إنشاء المباراة الآن ⚽"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
