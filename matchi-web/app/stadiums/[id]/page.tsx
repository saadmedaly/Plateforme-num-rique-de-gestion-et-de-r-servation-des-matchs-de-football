"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
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
  review_count?: number
  description?: string
  image_urls: string[]
  facilities: any
  owner_name?: string
  phone?: string
}

const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"]
const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
]

export default function StadiumDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [stadium, setStadium] = useState<Stadium | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState(1)
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "location">("info")
  const [bookingLoading, setBookingLoading] = useState(false)

  const getStadiumImage = (id: string) => {
    const images = ['/stadium_1.png', '/stadium_2.png', '/stadium_3.png', '/stadium_4.png']
    let hash = 0
    for (let i = 0; i < (id || "").length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % images.length
    return images[index]
  }

  useEffect(() => {
    const fetchStadium = async () => {
      try {
        const response = await axios.get(`/api/stadiums/${params.id}`)
        setStadium(response.data)
      } catch {
        setStadium(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStadium()
  }, [params.id])

  const handleBook = async () => {
    if (!session) { router.push("/login"); return }
    if (!selectedTime) { alert("يرجى اختيار وقت الحجز"); return }
    
    setBookingLoading(true)
    try {
      const date = dates[selectedDate].toISOString().split('T')[0]
      const startTimeParts = selectedTime.split(':')
      const startHour = parseInt(startTimeParts[0])
      const startMinute = parseInt(startTimeParts[1])
      
      const endDate = new Date(`2000-01-01T${selectedTime}:00`)
      endDate.setMinutes(endDate.getMinutes() + duration * 60)
      const endTime = endDate.toTimeString().split(' ')[0].substring(0, 5)

      await axios.post("/api/bookings", {
        stadium_id: params.id,
        date,
        start_time: selectedTime,
        end_time: endTime,
        total_price: (stadium?.price_per_hour || 150) * duration,
      }, {
        headers: { "x-user-id": (session.user as any).id }
      })
      alert("تم الحجز بنجاح!")
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Booking error:", err.response?.data || err.message)
      alert(err.response?.data?.error || "حدث خطأ في الحجز")
    } finally {
      setBookingLoading(false)
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

  const facilities = stadium?.facilities || {
    lighting: true,
    parking: true,
    changing_rooms: true,
    cafeteria: false,
    showers: true,
    equipment: false,
  }

  const facilityList = [
    { key: "lighting", label: "إضاءة", icon: "💡" },
    { key: "parking", label: "مواقف", icon: "🅿️" },
    { key: "changing_rooms", label: "غرف تغيير", icon: "🚪" },
    { key: "cafeteria", label: "كافيتيريا", icon: "☕" },
    { key: "showers", label: "دشش", icon: "🚿" },
    { key: "equipment", label: "معدات", icon: "⚽" },
  ]

  const reviews = [
    { name: "أحمد محمد", rating: 5, date: "منذ أسبوع", comment: "ملعب ممتاز ونظيف جداً، الموظفون محترفون والأرضية في حالة رائعة." },
    { name: "خالد سعيد", rating: 4, date: "منذ أسبوعين", comment: "تجربة جيدة بشكل عام، الأسعار مناسبة والموقع ممتاز." },
    { name: "سلطان العمري", rating: 5, date: "منذ شهر", comment: "أفضل ملعب في المنطقة! سأعود بالتأكيد." },
  ]

  // Get dates for next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  const tabStyle = (active: boolean) => ({
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: active ? "var(--primary)" : "var(--text-secondary)",
    borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "Lexend, sans-serif",
  })

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* Back */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px" }}>
        <Link href="/stadiums" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          color: "var(--text-secondary)",
          fontWeight: 500,
        }}>
          ← العودة للملاعب
        </Link>
      </div>

      {/* Image Gallery */}
      <div style={{
        height: 360,
        backgroundImage: `url(${stadium?.image_urls?.[0] || getStadiumImage(stadium?.id || "")})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
      }}>
        {!stadium?.image_urls?.[0] && !stadium?.id && "🏟️"}
        <div style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          padding: "8px 16px",
          borderRadius: "var(--radius-md)",
          color: "white",
          fontSize: 12,
          fontWeight: 600
        }}>
          عرض جميع الصور (1/5)
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px", display: "flex", gap: 28 }}>

        {/* Left: Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name & Rating */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
                {stadium?.name || "ملعب الأساطير - فرع انواكشوط"}
              </h1>
              <button style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "8px 14px",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: 16,
                fontFamily: "Lexend, sans-serif",
              }}>♥</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#f59e0b", fontSize: 14 }}>★★★★★</span>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>
                  {stadium?.rating || 4.9}
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  ({stadium?.review_count || 328} تقييم)
                </span>
              </div>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                📍 {stadium?.city || "انواكشوط"} — {stadium?.address || "شارع الشيخ زايد"}
              </span>
            </div>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            <span className="badge badge-primary">
              {stadium?.surface_type === "artificial_grass" ? "عشب صناعي" :
               stadium?.surface_type === "natural_grass" ? "عشب طبيعي" : "داخلي"}
            </span>
            <span className="badge badge-secondary">
              {stadium?.size || "7 ضد 7"}
            </span>
            <span className="badge badge-secondary">📞 متاح الآن</span>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 24, display: "flex", gap: 0 }}>
            {(["info", "reviews", "location"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(activeTab === tab)}>
                {tab === "info" ? "معلومات" : tab === "reviews" ? "التقييمات" : "الموقع"}
              </button>
            ))}
          </div>

          {/* Tab: Info */}
          {activeTab === "info" && (
            <div className="animate-fade-in">
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 28 }}>
                {stadium?.description || "ملعب عشب صناعي متكامل مع إضاءة ليلية ومواقف سيارات مجانية. يوفر الملعب تجربة لعب استثنائية مع أحدث التجهيزات وأفضل خدمات الاستقبال."}
              </p>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                المرافق والخدمات
              </h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 28,
              }}>
                {facilityList.map(fac => (
                  <div key={fac.key} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    opacity: facilities[fac.key] ? 1 : 0.4,
                  }}>
                    <span style={{ fontSize: 18 }}>{fac.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{fac.label}</span>
                    {facilities[fac.key] && (
                      <span style={{ fontSize: 12, color: "var(--primary)", marginRight: "auto" }}>✓</span>
                    )}
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
                أوقات العمل
              </h3>
              <div className="card-elevated" style={{ padding: 16, marginBottom: 20 }}>
                {["السبت - الخميس", "الجمعة"].map((day, i) => (
                  <div key={day} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: i === 0 ? "1px solid var(--border)" : "none",
                    fontSize: 14,
                  }}>
                    <span style={{ color: "var(--text-secondary)" }}>{day}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                      {i === 0 ? "06:00 - 00:00" : "14:00 - 00:00"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Reviews */}
          {activeTab === "reviews" && (
            <div className="animate-fade-in">
              <div style={{ display: "flex", gap: 20, marginBottom: 28, alignItems: "center" }}>
                <div style={{
                  width: 100, height: 100,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>{stadium?.rating || 4.9}</span>
                  <span style={{ fontSize: 18, color: "#f59e0b" }}>★★★★★</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>328 تقييم</span>
                </div>
                <div style={{ flex: 1 }}>
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", width: 8 }}>{star}</span>
                      <span style={{ color: "#f59e0b", fontSize: 11 }}>★</span>
                      <div style={{
                        flex: 1, height: 6,
                        background: "var(--bg-elevated)",
                        borderRadius: "var(--radius-full)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : 2}%`,
                          background: "var(--primary)",
                          borderRadius: "var(--radius-full)",
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", width: 24 }}>
                        {star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : 2}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {reviews.map((review, i) => (
                  <div key={i} className="card" style={{ padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 36, height: 36,
                          background: "var(--primary-muted)",
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, fontWeight: 700, color: "var(--primary)"
                        }}>
                          {review.name[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{review.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{review.date}</div>
                        </div>
                      </div>
                      <span style={{ color: "#f59e0b", fontSize: 13 }}>{"★".repeat(review.rating)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Location */}
          {activeTab === "location" && (
            <div className="animate-fade-in">
              <div style={{
                height: 280,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                fontSize: 48,
              }}>
                🗺️
                <div style={{ marginRight: 16, textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>الخريطة التفاعلية</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{stadium?.address || "انواكشوط، موريتانيا"}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Panel */}
        <div style={{ width: 320, minWidth: 320 }}>
          <div className="card" style={{ padding: 24, position: "sticky", top: 80 }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "var(--primary)" }}>
                {stadium?.price_per_hour || 150}
              </span>
              <span style={{ fontSize: 14, color: "var(--text-muted)", marginRight: 6 }}>أوقية/ساعة</span>
            </div>

            <hr className="divider" style={{ marginBottom: 20 }} />

            {/* Date Selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                📅 اختر التاريخ
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {dates.map((date, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(i)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${selectedDate === i ? "var(--primary)" : "var(--border)"}`,
                      background: selectedDate === i ? "var(--primary-muted)" : "var(--bg-input)",
                      color: selectedDate === i ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "Lexend, sans-serif",
                      textAlign: "center",
                      minWidth: 56,
                    }}
                  >
                    <div>{DAYS[(date.getDay() + 6) % 7].slice(0, 3)}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "inherit", marginTop: 2 }}>
                      {date.getDate()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                ⏰ اختر الوقت
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                {TIME_SLOTS.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: "7px 4px",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${selectedTime === time ? "var(--primary)" : "var(--border)"}`,
                      background: selectedTime === time ? "var(--primary-muted)" : "var(--bg-input)",
                      color: selectedTime === time ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "Lexend, sans-serif",
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
                ⏳ المدة
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 1.5, 2, 2.5, 3].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1,
                      padding: "7px 4px",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${duration === d ? "var(--primary)" : "var(--border)"}`,
                      background: duration === d ? "var(--primary-muted)" : "var(--bg-input)",
                      color: duration === d ? "var(--primary)" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "Lexend, sans-serif",
                    }}
                  >
                    {d}س
                  </button>
                ))}
              </div>
            </div>

            <hr className="divider" style={{ marginBottom: 16 }} />

            {/* Price Breakdown */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  {stadium?.price_per_hour || 150} أوقية × {duration} ساعة
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {(stadium?.price_per_hour || 150) * duration} أوقية
                </span>
              </div>
              <hr className="divider" style={{ margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
                <span style={{ color: "var(--text-primary)" }}>الإجمالي</span>
                <span style={{ color: "var(--primary)" }}>
                  {(stadium?.price_per_hour || 150) * duration} أوقية
                </span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={handleBook}
              disabled={bookingLoading}
              style={{ width: "100%", padding: "14px", fontSize: 15, justifyContent: "center" }}
            >
              {bookingLoading ? "جاري الحجز..." : "تأكيد الحجز"}
            </button>

            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>
              لا رسوم إضافية • إلغاء مجاني قبل 24 ساعة
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
