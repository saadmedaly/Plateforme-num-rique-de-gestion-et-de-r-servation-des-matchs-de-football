"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import axios from "axios"

interface Stadium {
  id: string
  name: string
  city: string
  address: string
  rating: number
  price_per_hour: number
  surface_type: string
  size: string
  image_urls?: string[]
}

export default function Home() {
  const [featuredStadiums, setFeaturedStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get("/api/stadiums?limit=3")
        setFeaturedStadiums(response.data)
      } catch (error) {
        console.error("Error fetching stadiums:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStadiums()
  }, [])

  const steps = [
    {
      icon: "🔍",
      title: "ابحث بسهولة",
      desc: "استخدم الخريطة أو الفلاتر للعثور على أقرب ملعب متاح.",
    },
    {
      icon: "📅",
      title: "احجز بضغطة واحدة",
      desc: "اختر الوقت المناسب وقم بتأكيد الحجز فوراً عبر الإنترنت.",
    },
    {
      icon: "⚽",
      title: "استمتع باللعب",
      desc: "توجه للملعب في موعدك المحدد واستمتع بالمباراة مع أصدقائك.",
    },
  ]

  const ownerSteps = [
    {
      icon: "🏟️",
      title: "سجل ملعبك",
      desc: "أضف تفاصيل ملعبك، الصور، والأسعار في دقائق قليلة.",
    },
    {
      icon: "📊",
      title: "أدر الحجوزات",
      desc: "نظام إدارة متكامل لمتابعة المواعيد والمدفوعات والتقارير.",
    },
    {
      icon: "💰",
      title: "زد دخلك",
      desc: "صل لآلاف اللاعبين في منطقتك وحقق أقصى استفادة من ملعبك.",
    },
  ]

  const stats = [
    { value: "+500", label: "ملعب مسجل" },
    { value: "50K+", label: "لاعب نشط" },
    { value: "98%", label: "نسبة الرضا" },
    { value: "24/7", label: "دعم متواصل" },
  ]

  const footerLinks = {
    "الشركة": ["من نحن", "الوظائف", "المدونة", "اتصل بنا"],
    "الدعم": ["مركز المساعدة", "الشروط والأحكام", "سياسة الخصوصية", "الأسئلة الشائعة"],
    "المدن": ["انواكشوط", "نواذيبو", "روصو", "كيفة"],
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section style={{
        padding: "80px 24px 64px",
        maxWidth: 1280,
        margin: "0 auto",
        textAlign: "center",
      }}>
        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <span className="badge badge-primary" style={{ fontSize: 13, padding: "6px 16px" }}>
            🚀 المنصة الرياضية الأولى في موريتانيا
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          color: "var(--text-primary)",
          marginBottom: 20,
        }}>
          احجز ملعب كرة القدم المفضل لديك
          {" "}
          <span style={{ color: "var(--primary)" }}>في ثوانٍ</span>
        </h1>

        <p style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          maxWidth: 600,
          margin: "0 auto 40px",
          lineHeight: 1.7,
        }}>
          منصة سهلة وسريعة للاعبين وأصحاب الملاعب للبحث والحجز وإدارة المواعيد في مكان واحد عبر كافة المدن الموريتانية.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/stadiums" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
            احجز الآن
          </Link>
          <Link href="#how-it-works" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
            كيف يعمل؟
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          maxWidth: 800,
          margin: "64px auto 0",
        }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card" style={{ textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.03em" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED STADIUMS ===== */}
      <section style={{ padding: "64px 24px", background: "var(--bg-surface)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <h2 className="section-title">الملاعب المميزة</h2>
              <p className="section-subtitle">ملاعب مختارة بعناية لأفضل تجربة لعب في انواكشوط ونواذيبو</p>
            </div>
            <Link href="/stadiums" className="btn-ghost" style={{ color: "var(--primary)" }}>
              عرض الكل ←
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: featuredStadiums.length > 0 ? "repeat(3, 1fr)" : "1fr", gap: 20 }}>
            {loading ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>جاري التحميل...</div>
            ) : featuredStadiums.length > 0 ? (
              featuredStadiums.map((stadium) => (
                <StadiumCard key={stadium.id} stadium={stadium} />
              ))
            ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                  لا توجد ملاعب متاحة حالياً.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ padding: "64px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title" style={{ fontSize: 28 }}>كيف يعمل ملعبك؟</h2>
            <p className="section-subtitle" style={{ marginTop: 8 }}>
              سواء كنت لاعباً تبحث عن المتعة أو صاحب ملعب يسعى لإدارة أعماله، نحن هنا لخدمتك
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Players */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 40, height: 40,
                  background: "var(--primary-muted)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20
                }}>👥</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>للاعبين والمجموعات</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, minWidth: 36,
                      background: "var(--bg-elevated)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owners */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 40, height: 40,
                  background: "var(--primary-muted)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20
                }}>🏪</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>لأصحاب الملاعب</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {ownerSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      width: 36, height: 36, minWidth: 36,
                      background: "var(--bg-elevated)",
                      borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18,
                    }}>
                      {step.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{
        padding: "64px 24px",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.04em",
            marginBottom: 16,
          }}>
            جاهز لبدء مباراتك القادمة؟
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.7 }}>
            انضم إلى أكثر من 50,000 لاعب يستخدمون ملعبك يومياً لحجز أفضل الملاعب والمنشآت الرياضية في موريتانيا.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>
              أنشئ حسابك مجاناً
            </Link>
            <Link href="/stadiums" className="btn-secondary" style={{ fontSize: 15, padding: "12px 28px" }}>
              تصفح الملاعب
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        padding: "48px 24px 32px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 40,
          }}>
            {/* Brand */}
            <div>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  background: "var(--primary)",
                  borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>⚽</div>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>ملعبك</span>
              </Link>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 280 }}>
                المنصة الرائدة في موريتانيا لحجز الملاعب والمنشآت الرياضية، نهدف لجعل الرياضة متاحة للجميع.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {["X", "إن", "فـ"].map((s, i) => (
                  <button key={i} style={{
                    width: 36, height: 36,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--text-secondary)",
                    fontSize: 12, fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Lexend, sans-serif"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                  {section}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", transition: "color 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.color = "var(--text-primary)")}
                        onMouseOut={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="divider" />
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            fontSize: 13,
            color: "var(--text-muted)",
          }}>
            <span>© 2024 ملعبك (Mal'abak). جميع الحقوق محفوظة.</span>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="#" style={{ color: "var(--text-muted)" }}>الشروط والأحكام</a>
              <a href="#" style={{ color: "var(--text-muted)" }}>سياسة الخصوصية</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StadiumCard({ stadium }: { stadium: Stadium }) {
  const getStadiumImage = (id: string) => {
    const images = ['/stadium_1.png', '/stadium_2.png', '/stadium_3.png', '/stadium_4.png']
    let hash = 0
    for (let i = 0; i < id.length; i++) {
       hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % images.length
    return images[index]
  }

  return (
    <Link href={`/stadiums/${stadium.id}`} className="card" style={{ display: "block", cursor: "pointer", textDecoration: "none" }}>
      {/* Image */}
      <div style={{
        height: 180,
        backgroundImage: `url(${stadium.image_urls?.[0] || getStadiumImage(stadium.id)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid var(--border)",
        position: "relative",
      }}>
        {!stadium.image_urls?.[0] && "⚽"}
        <div style={{
          position: "absolute",
          top: 12,
          right: 12, // Switched to right for RTL
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
        }}>
          <span style={{ color: "#f59e0b", fontSize: 12 }}>★</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{stadium.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
          {stadium.name}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
          📍 {stadium.city} — {stadium.address}
        </p>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <span className="badge badge-secondary" style={{ fontSize: 11 }}>{stadium.surface_type === 'artificial_grass' ? 'عشب صناعي' : 'طبيعي'}</span>
          <span className="badge badge-secondary" style={{ fontSize: 11 }}>{stadium.size}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>{stadium.price_per_hour}</span>
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
