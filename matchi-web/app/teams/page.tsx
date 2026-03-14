"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

interface Team {
  id: string
  name: string
  description?: string
  city?: string
  member_count?: number
  wins?: number
  losses?: number
  draws?: number
  points?: number
  logo_url?: string
}

export default function TeamsPage() {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "my">("all")

  useEffect(() => {
    axios.get("/api/teams")
      .then(r => setTeams(r.data))
      .catch(() => setTeams([]))
      .finally(() => setLoading(false))
  }, [])

  const displayTeams = teams.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const tabStyle = (active: boolean) => ({
    padding: "8px 20px",
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

      {/* Header */}
      <div style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border)",
        padding: "28px 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                الفرق والمجموعات
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                انضم لفريق أو أنشئ فريقك الخاص
              </p>
            </div>
            <Link href="/teams/create" className="btn-primary">
              + إنشاء فريق
            </Link>
          </div>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 460 }}>
            <span style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 15, color: "var(--text-muted)"
            }}>🔍</span>
            <input
              className="input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الفريق أو المدينة..."
              style={{ paddingRight: 44, height: 44 }}
            />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 20, borderBottom: "1px solid var(--border)" }}>
            <button style={tabStyle(activeTab === "all")} onClick={() => setActiveTab("all")}>
              جميع الفرق
            </button>
            {session && (
              <button style={tabStyle(activeTab === "my")} onClick={() => setActiveTab("my")}>
                فرقي
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {displayTeams.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
            {displayTeams.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>👥</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  لا توجد فرق
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
                  لم يتم العثور على فرق مطابقة
                </p>
                <Link href="/teams/create" className="btn-primary">
                  أنشئ أول فريق
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TeamCard({ team }: { team: Team }) {
  const total = (team.wins || 0) + (team.losses || 0) + (team.draws || 0)
  const winRate = total > 0 ? Math.round(((team.wins || 0) / total) * 100) : 0

  return (
    <Link href={`/teams/${team.id}`} className="card" style={{ display: "block", padding: 0, cursor: "pointer" }}>
      {/* Team banner */}
      <div style={{
        height: 80,
        background: "linear-gradient(135deg, var(--bg-elevated) 0%, #1a2a3a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 40,
        borderBottom: "1px solid var(--border)",
        position: "relative",
      }}>
        🛡️
        {team.points && team.points >= 25 && (
          <div style={{
            position: "absolute",
            top: 10,
            left: 12,
            background: "var(--primary-muted)",
            border: "1px solid var(--primary-border)",
            borderRadius: "var(--radius-full)",
            padding: "2px 8px",
            fontSize: 11,
            color: "var(--primary)",
            fontWeight: 700,
          }}>
            🏆 متصدر
          </div>
        )}
      </div>

      <div style={{ padding: "18px 20px" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
          {team.name}
        </h3>
        {team.city && (
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>
            📍 {team.city}
          </p>
        )}

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
          marginBottom: 16,
          padding: "12px",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius-md)",
          textAlign: "center",
        }}>
          {[
            { label: "ف", value: team.wins || 0, color: "var(--primary)" },
            { label: "ت", value: team.draws || 0, color: "var(--warning)" },
            { label: "خ", value: team.losses || 0, color: "var(--danger)" },
            { label: "نقاط", value: team.points || 0, color: "var(--text-primary)" },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Win Rate Bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
            <span style={{ color: "var(--text-muted)" }}>نسبة الفوز</span>
            <span style={{ color: "var(--primary)", fontWeight: 700 }}>{winRate}%</span>
          </div>
          <div style={{ height: 5, background: "var(--bg-elevated)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${winRate}%`,
              background: "var(--primary)",
              borderRadius: "var(--radius-full)",
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
            👥 {team.member_count || 0} لاعب
          </span>
          <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>
            انضم للفريق ←
          </span>
        </div>
      </div>
    </Link>
  )
}

