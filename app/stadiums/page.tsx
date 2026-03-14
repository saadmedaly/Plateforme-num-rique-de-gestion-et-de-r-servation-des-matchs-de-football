"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

interface Stadium {
  id: string
  name: string
  city: string
  address: string
  price_per_hour: number
  surface_type: string
  size: string
  rating: number
  image_urls: string[]
  facilities: any
}

const surfaceLabels: Record<string, string> = {
  natural_grass: "عشب طبيعي",
  artificial_grass: "عشب صناعي",
  indoor: "داخلي",
}

const sizeLabels: Record<string, string> = {
  "5v5": "5 ضد 5",
  "7v7": "7 ضد 7",
  "11v11": "11 ضد 11",
}

export default function StadiumsPage() {
  const { data: session } = useSession()
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedSurface, setSelectedSurface] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedCity) params.append("city", selectedCity)
        if (selectedSurface) params.append("surface_type", selectedSurface)
        if (selectedSize) params.append("size", selectedSize)
        const response = await axios.get(`/api/stadiums?${params.toString()}`)
        setStadiums(response.data)
      } catch (error) {
        console.error("Error:", error)
        // Demo data
        setStadiums([])
      } finally {
        setLoading(false)
      }
    }
    fetchStadiums()
  }, [selectedCity, selectedSurface, selectedSize])

  const filteredStadiums = stadiums.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = s.price_per_hour >= priceRange[0] && s.price_per_hour <= priceRange[1]
    return matchesSearch && matchesPrice
  })

  const cities = ["انواكشوط", "نواذيبو", "روصو", "كيفة", "الزويرات", "أطار"]
  const surfaces = [
    { value: "natural_grass", label: "عشب طبيعي" },
    { value: "artificial_grass", label: "عشب صناعي" },
    { value: "indoor", label: "داخلي" },
  ]
  const sizes = [
    { value: "5v5", label: "5 ضد 5" },
    { value: "7v7", label: "7 ضد 7" },
    { value: "11v11", label: "11 ضد 11" },
  ]

  const filterBtnStyle = (active: boolean) => ({
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    fontSize: 13,
    fontWeight: 500,
    border: active ? "1px solid var(--primary)" : "1px solid var(--border)",
    background: active ? "var(--primary-muted)" : "var(--bg-card)",
    color: active ? "var(--primary)" : "var(--text-secondary)",
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
        padding: "32px 24px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: 8 }}>
            البحث عن ملاعب
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
            اكتشف أفضل الملاعب القريبة منك
          </p>

          {/* Search Bar */}
          <div style={{ position: "relative", maxWidth: 600 }}>
            <span style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "var(--text-muted)"
            }}>🔍</span>
            <input
              type="text"
              className="input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث باسم الملعب أو المنطقة..."
              style={{ paddingRight: 44, paddingLeft: 14, height: 48, fontSize: 15 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px", display: "flex", gap: 24 }}>

        {/* Sidebar Filters */}
        <aside style={{ width: 280, minWidth: 280 }}>
          <div className="card" style={{ padding: 20, position: "sticky", top: 80 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>🎚️ التصفية</h2>
              <button
                onClick={() => { setSelectedCity(""); setSelectedSurface(""); setSelectedSize(""); setPriceRange([0, 500]); }}
                className="btn-ghost"
                style={{ fontSize: 12, color: "var(--primary)", padding: "4px 8px" }}
              >
                مسح الكل
              </button>
            </div>

            <hr className="divider" style={{ marginBottom: 20 }} />

            {/* City */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                المدينة
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button style={filterBtnStyle(selectedCity === "")} onClick={() => setSelectedCity("")}>الكل</button>
                {cities.map(city => (
                  <button key={city} style={filterBtnStyle(selectedCity === city)} onClick={() => setSelectedCity(city)}>
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 20 }} />

            {/* Surface */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                نوع الأرضية
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {surfaces.map(s => (
                  <label key={s.value} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    color: selectedSurface === s.value ? "var(--primary)" : "var(--text-primary)",
                  }}>
                    <input
                      type="radio"
                      name="surface"
                      checked={selectedSurface === s.value}
                      onChange={() => setSelectedSurface(s.value)}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 20 }} />

            {/* Size */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                حجم الملعب
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sizes.map(s => (
                  <label key={s.value} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    color: selectedSize === s.value ? "var(--primary)" : "var(--text-primary)",
                  }}>
                    <input
                      type="radio"
                      name="size"
                      checked={selectedSize === s.value}
                      onChange={() => setSelectedSize(s.value)}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 20 }} />

            {/* Price */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                الحد الأقصى للسعر
              </label>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>0 أوقية</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>{priceRange[1]} أوقية</span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                value={priceRange[1]}
                onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                style={{ width: "100%", accentColor: "var(--primary)" }}
              />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div style={{ flex: 1 }}>
          {/* Sort & View Controls */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              {loading ? "جاري التحميل..." : `${filteredStadiums.length} ملعب متاح`}
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="input"
                style={{ width: "auto", padding: "6px 12px", fontSize: 13 }}
              >
                <option value="rating">الأعلى تقييماً</option>
                <option value="price_asc">السعر: من الأقل</option>
                <option value="price_desc">السعر: من الأعلى</option>
                <option value="nearest">الأقرب</option>
              </select>

              <button
                onClick={() => setViewMode("grid")}
                style={{
                  padding: "7px 10px",
                  background: viewMode === "grid" ? "var(--primary-muted)" : "var(--bg-card)",
                  border: `1px solid ${viewMode === "grid" ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  color: viewMode === "grid" ? "var(--primary)" : "var(--text-muted)",
                  fontFamily: "Lexend, sans-serif",
                  fontSize: 14,
                }}
              >⊞</button>
              <button
                onClick={() => setViewMode("list")}
                style={{
                  padding: "7px 10px",
                  background: viewMode === "list" ? "var(--primary-muted)" : "var(--bg-card)",
                  border: `1px solid ${viewMode === "list" ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  color: viewMode === "list" ? "var(--primary)" : "var(--text-muted)",
                  fontFamily: "Lexend, sans-serif",
                  fontSize: 14,
                }}
              >☰</button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
              <div className="spinner" />
            </div>
          ) : filteredStadiums.length === 0 ? (
            <EmptyState searchTerm={searchTerm} />
          ) : (
            <div style={{
              display: viewMode === "grid" ? "grid" : "flex",
              gridTemplateColumns: viewMode === "grid" ? "repeat(2, 1fr)" : undefined,
              flexDirection: viewMode === "list" ? "column" : undefined,
              gap: 16,
            }}>
              {filteredStadiums.map(stadium => (
                <StadiumResultCard key={stadium.id} stadium={stadium} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StadiumResultCard({ stadium, viewMode }: { stadium: Stadium; viewMode: "grid" | "list" }) {
  const getStadiumImage = (id: string) => {
    const images = ['/stadium_1.png', '/stadium_2.png', '/stadium_3.png', '/stadium_4.png']
    // Stable random based on ID
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % images.length
    return images[index]
  }

  return (
    <Link href={`/stadiums/${stadium.id}`} className="card" style={{
      display: viewMode === "list" ? "flex" : "block",
      cursor: "pointer",
    }}>
      {/* Image */}
      <div style={{
        height: viewMode === "grid" ? 180 : 140,
        width: viewMode === "list" ? 220 : "100%",
        minWidth: viewMode === "list" ? 220 : undefined,
        backgroundImage: `url(${stadium.image_urls?.[0] || getStadiumImage(stadium.id)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: viewMode === "grid" ? "1px solid var(--border)" : "none",
        borderLeft: viewMode === "list" ? "1px solid var(--border)" : "none",
        position: "relative",
      }}>
        {!stadium.image_urls?.[0] && "🏟️"}
        <div style={{
          position: "absolute",
          top: 10,
          left: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          padding: "4px 8px",
          borderRadius: "var(--radius-full)",
        }}>
          <span style={{ color: "#f59e0b", fontSize: 11 }}>★</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{stadium.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px", flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
          {stadium.name}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
          📍 {stadium.city} — {stadium.address}
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          <span className="badge badge-secondary" style={{ fontSize: 11 }}>
            {surfaceLabels[stadium.surface_type] || stadium.surface_type}
          </span>
          <span className="badge badge-secondary" style={{ fontSize: 11 }}>
            {sizeLabels[stadium.size] || stadium.size}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>
              {stadium.price_per_hour}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4 }}>أوقية/ساعة</span>
          </div>
          <span className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
            احجز الآن
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
        لا توجد نتائج
      </h3>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 320, lineHeight: 1.7 }}>
        {searchTerm
          ? `لم يتم العثور على ملاعب تطابق "${searchTerm}"`
          : "لا توجد ملاعب متاحة بهذه المعايير، جرب تعديل الفلاتر"}
      </p>
    </div>
  )
}

