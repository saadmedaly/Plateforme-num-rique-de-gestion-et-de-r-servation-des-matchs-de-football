"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Trophy, Users, MapPin, Shield, ChevronRight, Star, History, Calendar } from "lucide-react"
import axios from "axios"

interface TeamMember {
  user_id: string
  role: string
  joined_at: string
  users: { full_name: string; city: string } | null
}

interface Team {
  id: string
  name: string
  city: string
  logo_url: string | null
  wins: number
  losses: number
  draws: number
  ranking: number
  created_at: string
  team_members: TeamMember[]
}

export default function TeamDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`/api/teams/${params.id}`)
      const teamData = res.data
      setTeam(teamData)
      
      if (session?.user && (session.user as any).id) {
        const userId = (session.user as any).id
        const isUserMember = teamData.team_members?.some((m: any) => m.user_id === userId)
        setIsMember(isUserMember)
      }
    } catch (err: any) {
      if (err.response?.status === 404) setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [params.id, session])

  const handleJoin = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    
    try {
      setJoining(true)
      await axios.post(`/api/teams/${params.id}/join`, {}, {
        headers: { "x-user-id": (session.user as any).id }
      })
      alert("تم الانضمام للفريق بنجاح!")
      fetchTeam()
    } catch (err: any) {
      alert(err.response?.data?.error || "حدث خطأ أثناء الانضمام")
    } finally {
      setJoining(false)
    }
  }

  const roleLabel: Record<string, string> = {
    captain: "قائد",
    vice_captain: "نائب القائد",
    member: "لاعب",
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="spinner" />
      </div>
    </div>
  )

  if (notFound || !team) return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} dir="rtl">
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>الفريق غير موجود</h1>
        <Link href="/teams" className="btn-primary" style={{ textDecoration: "none" }}>العودة للفرق</Link>
      </div>
    </div>
  )

  const totalGames = team.wins + team.losses + team.draws

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }} dir="rtl">
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {/* Back link */}
        <Link href="/teams" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", textDecoration: "none", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          <ChevronRight size={16} style={{ rotate: "180deg" }} /> العودة لقائمة الفرق
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
          {/* Left Column: Team Card */}
          <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                margin: "0 auto 20px", 
                borderRadius: "var(--radius-full)", 
                background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)"
              }}>
                {team.logo_url ? (
                  <img src={team.logo_url} alt={team.name} style={{ width: "100%", height: "100%", borderRadius: "var(--radius-full)", objectFit: "cover" }} />
                ) : (
                  <Shield size={60} color="white" />
                )}
              </div>
              
              <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{team.name}</h1>
              
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ background: "#f59e0b20", color: "#f59e0b", padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <Trophy size={14} /> التصنيف #{team.ranking}
                </div>
              </div>

              <div style={{ display: "grid", gap: 12, textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 15 }}>
                  <MapPin size={18} /> {team.city || "نواكشوط"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 15 }}>
                  <Calendar size={18} /> انضم في {new Date(team.created_at).toLocaleDateString("ar-SA")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)", fontSize: 15 }}>
                  <Users size={18} /> {team.team_members?.length || 0} لاعب مسجل
                </div>
              </div>

              <div style={{ marginTop: 32 }}>
                <button 
                  className={isMember ? "btn-secondary" : "btn-primary"} 
                  disabled={joining || isMember}
                  onClick={handleJoin}
                  style={{ width: "100%", padding: 14 }}
                >
                  {isMember ? "أنت عضو في هذا الفريق ✅" : joining ? "جاري الانضمام..." : "طلب انضمام للفريق"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Members */}
          <div style={{ display: "grid", gap: 24 }}>
            {/* Stats Card */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <History /> إحصائيات الفريق
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div style={{ background: "var(--bg-elevated)", padding: 20, borderRadius: "var(--radius-lg)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{totalGames}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>إجمالي المباريات</div>
                </div>
                <div style={{ background: "#22c55e15", padding: 20, borderRadius: "var(--radius-lg)", textAlign: "center", border: "1px solid #22c55e30" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#22c55e", marginBottom: 4 }}>{team.wins}</div>
                  <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>فوز</div>
                </div>
                <div style={{ background: "#ef444415", padding: 20, borderRadius: "var(--radius-lg)", textAlign: "center", border: "1px solid #ef444430" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#ef4444", marginBottom: 4 }}>{team.losses}</div>
                  <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>خسارة</div>
                </div>
                <div style={{ background: "var(--bg-elevated)", padding: 20, borderRadius: "var(--radius-lg)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-secondary)", marginBottom: 4 }}>{team.draws}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>تعادل</div>
                </div>
              </div>

              {totalGames > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14, fontWeight: 600 }}>
                    <span style={{ color: "var(--text-secondary)" }}>نسبة الفوز</span>
                    <span style={{ color: "#22c55e" }}>{Math.round((team.wins / totalGames) * 100)}%</span>
                  </div>
                  <div style={{ height: 12, background: "var(--bg-elevated)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #4ade80)", width: `${(team.wins / totalGames) * 100}%`, borderRadius: 6 }} />
                  </div>
                </div>
              )}
            </div>

            {/* Members Card */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <Users /> أعضاء الفريق ({team.team_members?.length || 0})
              </h2>
              
              {!team.team_members || team.team_members.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                  <Users size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                  <p>لا يوجد لاعبون مسجلون حالياً في هذا الفريق</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {team.team_members.map((member) => (
                    <div key={member.user_id} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: 16, 
                      background: "var(--bg-elevated)", 
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ 
                          width: 44, 
                          height: 44, 
                          background: "var(--bg-card)", 
                          borderRadius: "var(--radius-full)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "var(--primary)"
                        }}>
                          {member.users?.full_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{member.users?.full_name || "لاعب مجهول"}</div>
                          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{member.users?.city || "غير محدد"}</div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        padding: "4px 12px", 
                        borderRadius: "var(--radius-full)", 
                        fontSize: 11, 
                        fontWeight: 800, 
                        letterSpacing: "0.05em",
                        background: member.role === "captain" ? "#f59e0b20" : member.role === "vice_captain" ? "#3b82f620" : "var(--bg-card)",
                        color: member.role === "captain" ? "#f59e0b" : member.role === "vice_captain" ? "#3b82f6" : "var(--text-secondary)",
                        border: `1px solid ${member.role === "captain" ? "#f59e0b30" : member.role === "vice_captain" ? "#3b82f630" : "var(--border)"}`
                      }}>
                        {roleLabel[member.role]?.toUpperCase() || "لاعب"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
