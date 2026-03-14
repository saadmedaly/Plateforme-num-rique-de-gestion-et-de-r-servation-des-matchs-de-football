"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import axios from "axios"

interface Match {
  id: string
  stadium?: {
    name: string
    city: string
  }
  stadium_id: string
  date: string
  start_time: string
  end_time: string
  organizer?: {
    full_name: string
    avatar_url?: string
  }
  type: string
  level: string
  price: number
  spots_available: number
  total_players: number
  players?: any[]
}

export default function MatchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`/api/matches/${params.id}`)
        setMatch(response.data)
        // Check if user is already in the match
        if ((session?.user as any)?.id && response.data.players) {
           setIsJoined(response.data.players.some((p: any) => p.user_id === (session.user as any).id))
        }
      } catch (error) {
        console.error("Match detail error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [params.id, session])

  const handleJoin = async () => {
    if (!session) { router.push("/login"); return }
    setJoining(true)
    try {
      await axios.post(`/api/matches/${params.id}/join`, {}, {
        headers: { "x-user-id": (session!.user as any).id }
      })
      setIsJoined(true)
      // Refresh match data
      const response = await axios.get(`/api/matches/${params.id}`)
      setMatch(response.data)
    } catch (err: any) {
      alert(err.response?.data?.error || "حدث خطأ في الانضمام")
    } finally {
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <h3>المباراة غير موجودة</h3>
          <Link href="/matches" className="btn-primary" style={{ marginTop: 20 }}>العودة للمباريات</Link>
        </div>
      </div>
    )
  }

  // Placeholder for players if empty
  const players = match.players || [
    { name: match.organizer?.full_name || "المنظم", role: "المنظم", avatar: (match.organizer?.full_name || "م")[0] }
  ]
  const spotsLeft = match.spots_available || (match.total_players - players.length)

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
          
          {/* Main Content */}
          <div>
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>مباراة {match.type} • {match.level}</h1>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>بواسطة <span style={{ color: "var(--primary)", fontWeight: 700 }}>{match.organizer?.full_name}</span></p>
                </div>
                <div className="badge badge-primary">مفتوحة</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                   <div style={{ fontSize: 24 }}>🏟️</div>
                   <div>
                     <div style={{ fontSize: 12, color: "var(--text-muted)" }}>الملعب</div>
                     <div style={{ fontSize: 15, fontWeight: 700 }}>{match.stadium?.name}</div>
                     <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>📍 {match.stadium?.city}</div>
                   </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                   <div style={{ fontSize: 24 }}>⏰</div>
                   <div>
                     <div style={{ fontSize: 12, color: "var(--text-muted)" }}>الوقت</div>
                     <div style={{ fontSize: 15, fontWeight: 700 }}>{match.date}</div>
                     <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{match.start_time.substring(0, 5)} - {match.end_time.substring(0, 5)}</div>
                   </div>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>اللاعبون المنضمون ({players.length}/{match.total_players})</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {players.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{p.avatar || p.name?.[0] || '?' }</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name || p.full_name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{p.role || "لاعب"}</div>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, spotsLeft) }).map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: "1px dashed var(--border)", borderRadius: "var(--radius-md)", opacity: 0.5 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "transparent", border: "1px dashed var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontSize: 16 }}>?</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>شاغر</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat/Comments Section */}
            <div className="card" style={{ padding: 24 }}>
               <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>الدردشة</h3>
               <div style={{ height: 160, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
                 لا توجد رسائل بعد. ابدأ المحادثة مع اللاعبين الآخرين!
               </div>
               <div style={{ display: "flex", gap: 10 }}>
                 <input className="input" placeholder="اكتب رسالة..." style={{ flex: 1 }} />
                 <button className="btn-primary">إرسال</button>
               </div>
            </div>
          </div>

          {/* Sidebar Action */}
          <div style={{ position: "sticky", top: 100 }}>
            <div className="card" style={{ padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>رسوم اللعب</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)", marginBottom: 8 }}>{match.price} أوقية</div>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 24 }}>السعر للفرد الواحد شامل الملعب والماء</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {!isJoined ? (
                  <button 
                    onClick={handleJoin} 
                    disabled={joining || spotsLeft === 0} 
                    className="btn-primary" 
                    style={{ width: "100%", padding: 14, fontSize: 16 }}
                  >
                    {joining ? "جاري الانضمام..." : spotsLeft === 0 ? "المباراة مكتملة" : "انضم للمباراة"}
                  </button>
                ) : (
                  <div style={{ padding: 14, background: "var(--primary-muted)", color: "var(--primary)", fontWeight: 700, borderRadius: "var(--radius-md)" }}>✓ أنت منضم لهذه المباراة</div>
                )}
                <button className="btn-secondary" style={{ width: "100%", padding: 14 }}>دعوة صديق</button>
                <Link href={`/stadiums/${match.stadium_id}`} className="btn-ghost" style={{ fontSize: 13 }}>عرض تفاصيل الملعب</Link>
              </div>

              <div style={{ marginTop: 24, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)", textAlign: "right" }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>معلومات المنظم</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                   <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{match.organizer?.full_name?.[0]}</div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontSize: 13, fontWeight: 600 }}>{match.organizer?.full_name}</div>
                     <div style={{ fontSize: 11, color: "var(--warning)" }}>⭐ 4.9 (24 تقييم)</div>
                   </div>
                   <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 11 }}>مراسلة</button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
