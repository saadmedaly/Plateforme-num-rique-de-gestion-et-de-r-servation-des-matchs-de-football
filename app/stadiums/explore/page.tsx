"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Link from "next/link"

const stadiums = [
  { id: "1", name: "ملعب الأساطير", lat: "25.2048", lng: "55.2708", price: 150, rating: 4.8, type: "5 ضد 5", distance: "0.8 كم" },
  { id: "2", name: "نادي الصقر", lat: "25.2200", lng: "55.2900", price: 200, rating: 4.5, type: "7 ضد 7", distance: "1.2 كم" },
  { id: "3", name: "صالة النور", lat: "25.2300", lng: "55.2600", price: 120, rating: 4.2, type: "5 ضد 5", distance: "2.5 كم" },
  { id: "4", name: "ملعب الفرسان", lat: "25.1900", lng: "55.2500", price: 300, rating: 4.9, type: "11 ضد 11", distance: "3.1 كم" },
]

export default function MapExplorePage() {
  const [selected, setSelected] = useState(stadiums[0])
  const [search, setSearch] = useState("")

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-base)" }}>
      <Navbar />
      
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        
        {/* Sidebar */}
        <div style={{ 
          width: 380, 
          background: "var(--bg-surface)", 
          borderLeft: "1px solid var(--border)", 
          display: "flex", 
          flexDirection: "column",
          zIndex: 10,
          boxShadow: "10px 0 30px rgba(0,0,0,0.3)"
        }}>
          <div style={{ padding: "24px 20px" }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>استكشف الملاعب القريبة</h1>
            <div style={{ position: "relative" }}>
              <input 
                className="input" 
                placeholder="ابحث عن ملعب أو منطقة..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingRight: 40 }}
              />
              <span style={{ position: "absolute", right: 14, top: 10 }}>🔍</span>
            </div>
            
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="badge badge-primary">كل الملاعب</button>
              <button className="badge badge-secondary">المفضلة</button>
              <button className="badge badge-secondary">الأعلى تقييماً</button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 20px" }}>
            <div style={{ display: "grid", gap: 12 }}>
              {stadiums.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelected(s)}
                  className="card" 
                  style={{ 
                    padding: 16, 
                    cursor: "pointer",
                    borderColor: selected.id === s.id ? "var(--primary)" : "var(--border)",
                    background: selected.id === s.id ? "var(--primary-muted)" : "var(--bg-card)",
                    transform: selected.id === s.id ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</h3>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{s.price} أوقية</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", display: "flex", gap: 10 }}>
                    <span>⭐ {s.rating}</span>
                    <span>⚽ {s.type}</span>
                    <span>📍 {s.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map View Placeholder */}
        <div style={{ flex: 1, position: "relative", background: "#1a1a1a", overflow: "hidden" }}>
          {/* Mock Map Background (Using a dark gradient & pattern to simulate a map) */}
          <div style={{ 
            position: "absolute", inset: 0, 
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            backgroundPosition: "-2px -2px"
          }} />
          
          {/* Map Markers */}
          {stadiums.map(s => (
            <div 
              key={s.id}
              onClick={() => setSelected(s)}
              style={{
                position: "absolute",
                left: `${(parseFloat(s.lng) - 55.24) * 8000}px`,
                top: `${(25.24 - parseFloat(s.lat)) * 6000}px`,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            >
              <div style={{
                background: selected.id === s.id ? "var(--primary)" : "var(--bg-elevated)",
                color: selected.id === s.id ? "var(--text-inverse)" : "var(--text-primary)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                fontSize: 13,
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                border: "2px solid var(--border-strong)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transform: selected.id === s.id ? "scale(1.1) translateY(-10px)" : "scale(1)",
              }}>
                ⚽ <span>{s.price} أوقية</span>
              </div>
              <div style={{
                width: 2, height: 10,
                background: selected.id === s.id ? "var(--primary)" : "var(--border-strong)",
                margin: "0 auto",
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
              }} />
            </div>
          ))}

          {/* Floating Action Buttons on Map */}
          <div style={{ position: "absolute", left: 20, top: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-secondary" style={{ width: 44, height: 44, padding: 0, borderRadius: "50%", fontSize: 18 }}>+</button>
            <button className="btn-secondary" style={{ width: 44, height: 44, padding: 0, borderRadius: "50%", fontSize: 18 }}>-</button>
            <button className="btn-secondary" style={{ width: 44, height: 44, padding: 0, borderRadius: "50%", fontSize: 18 }}>📍</button>
          </div>

          {/* Selected Stadium Info Card (Overlay) */}
          {selected && (
            <div className="animate-fade-in" style={{ 
              position: "absolute", 
              bottom: 30, 
              left: "50%", 
              transform: "translateX(-50%)",
              width: 400,
              zIndex: 20
            }}>
              <div className="card shadow-lg" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--primary-border)" }}>
                <div style={{ height: 120, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>
                   🏟️
                </div>
                <div style={{ padding: 20, background: "var(--bg-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800 }}>{selected.name}</h2>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>يبعد عنك {selected.distance} • مفتوح الآن</p>
                    </div>
                    <div style={{ textAlign: "left" }}>
                       <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>{selected.price} أوقية</div>
                       <div style={{ fontSize: 11, color: "var(--text-muted)" }}>للساعة</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Link href={`/stadiums/${selected.id}`} className="btn-primary" style={{ flex: 1 }}>حجز الآن</Link>
                    <Link href={`/stadiums/${selected.id}`} className="btn-secondary">التفاصيل</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

