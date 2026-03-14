"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function AddStadiumPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    pricePerHour: "",
    type: "5 ضد 5",
    surface: "عشب صناعي",
    facilities: [] as string[],
    openingTime: "08:00",
    closingTime: "00:00",
  })

  const facilitiesList = ["غرف تبديل", "باركينج", "كافتيريا", "إضاءة ليلية", "دش استجمام", "مصلى", "تكييف (للملاعب المغلقة)"]

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      router.push("/owner/dashboard")
    }, 1500)
  }

  const inputGroupStyle = { marginBottom: 20 }
  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, flex: s === 3 ? "none" : 1 }}>
              <div style={{
                width: 32, height: 32,
                borderRadius: "50%",
                background: step >= s ? "var(--primary)" : "var(--bg-elevated)",
                color: step >= s ? "var(--text-inverse)" : "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14,
                border: step === s ? "4px solid var(--primary-border)" : "none",
                transition: "all 0.3s"
              }}>
                {s}
              </div>
              {s < 3 && <div style={{ height: 2, flex: 1, background: step > s ? "var(--primary)" : "var(--border)", transition: "all 0.3s" }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>المعلومات الأساسية</h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>ابدأ بإدخال التفاصيل الأساسية للملعب الخاص بك</p>
                
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>اسم الملعب</label>
                  <input 
                    className="input" 
                    placeholder="مثال: ملعب الأساطير الذهبي" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>المدينة</label>
                    <select 
                      className="input" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      required
                    >
                      <option value="">اختر المدينة</option>
                      <option value="انواكشوط">انواكشوط</option>
                      <option value="نواذيبو">نواذيبو</option>
                      <option value="جدة">جدة</option>
                      <option value="أطار">أطار</option>
                    </select>
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>نوع الملعب</label>
                    <select 
                      className="input" 
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option>5 ضد 5</option>
                      <option>7 ضد 7</option>
                      <option>9 ضد 9</option>
                      <option>11 ضد 11</option>
                    </select>
                  </div>
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>العنوان بالتفصيل</label>
                  <input 
                    className="input" 
                    placeholder="الحي، الشارع، المعالم القريبة" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>وصف الملعب</label>
                  <textarea 
                    className="input" 
                    rows={4} 
                    placeholder="تحدث عن جودة العشب، المرافق المميزة، أو أي شروط خاصة..."
                    style={{ resize: "none" }}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                  <button type="button" onClick={() => setStep(2)} className="btn-primary" style={{ padding: "12px 32px" }}>
                    التالي
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>المرافق والأسعار</h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>حدد مميزات ملعبك وسعر الحجز للساعة الواحدة</p>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>سعر الحجز للساعة (أوقية)</label>
                  <input 
                    type="number" 
                    className="input" 
                    placeholder="مثال: 150" 
                    value={formData.pricePerHour}
                    onChange={e => setFormData({...formData, pricePerHour: e.target.value})}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>المرافق المتوفرة</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {facilitiesList.map(f => (
                      <div 
                        key={f} 
                        onClick={() => toggleFacility(f)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "var(--radius-md)",
                          background: formData.facilities.includes(f) ? "var(--primary-muted)" : "var(--bg-input)",
                          border: `1px solid ${formData.facilities.includes(f) ? "var(--primary)" : "var(--border)"}`,
                          color: formData.facilities.includes(f) ? "var(--primary)" : "var(--text-secondary)",
                          fontSize: 13,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 8
                        }}
                      >
                        <div style={{
                          width: 16, height: 16,
                          borderRadius: 4,
                          border: `1px solid ${formData.facilities.includes(f) ? "var(--primary)" : "var(--text-muted)"}`,
                          background: formData.facilities.includes(f) ? "var(--primary)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: "var(--text-inverse)"
                        }}>
                          {formData.facilities.includes(f) && "✓"}
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                   <div style={inputGroupStyle}>
                    <label style={labelStyle}>وقت الافتتاح</label>
                    <input 
                      type="time" 
                      className="input" 
                      value={formData.openingTime}
                      onChange={e => setFormData({...formData, openingTime: e.target.value})}
                    />
                  </div>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>وقت الإغلاق</label>
                    <input 
                      type="time" 
                      className="input" 
                      value={formData.closingTime}
                      onChange={e => setFormData({...formData, closingTime: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    السابق
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="btn-primary" style={{ padding: "12px 32px" }}>
                    التالي
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>الصور واللمسات الأخيرة</h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>أضف صور الملعب للتأكد من موافقتها لشروط الموقع</p>

                <div style={{ 
                  border: "2px dashed var(--border)", 
                  borderRadius: "var(--radius-lg)", 
                  padding: "40px", 
                  textAlign: "center",
                  marginBottom: 24,
                  background: "rgba(255,255,255,0.01)"
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>اسحب الصور هنا أو اضغط للتحميل</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>يُفضل صور بدقة عالية لا تقل عن 1200x800 بكسل</p>
                  <button type="button" className="btn-secondary" style={{ marginTop: 16, fontSize: 12 }}>اختيار الصور</button>
                </div>

                <div className="card" style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderStyle: "dashed" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 18 }}>📝</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                      بإضافة هذا الملعب، أنت أوافق على <span style={{ color: "var(--primary)", fontWeight: 600 }}>شروط الملاك</span> في تطبيق ملعبك.
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary" style={{ padding: "12px 24px" }}>
                    السابق
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: "12px 40px" }} disabled={loading}>
                    {loading ? <div className="spinner" style={{ width: 18, height: 18 }} /> : "إضافة الملعب الآن"}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

