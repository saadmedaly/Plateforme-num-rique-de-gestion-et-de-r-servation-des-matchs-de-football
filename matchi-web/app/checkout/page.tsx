"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const bookingSummary = {
    stadium: "ملعب الأساطير - فرع انواكشوط",
    date: "25 مارس 2024",
    time: "18:00 - 19:00",
    price: 150,
    fee: 5,
    total: 155,
  }

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/bookings/success")
    }, 2000)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32, textAlign: "center" }}>إتمام الدفع</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 32 }}>
          
          {/* Left Column: Payment Methods */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>اختر طريقة الدفع</h2>
              
              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { id: "card", label: "بطاقة ائتمان / مدى", icon: "💳" },
                  { id: "wallet", label: "محفظتي (الرصيد: 250 أوقية)", icon: "👛" },
                  { id: "apple", label: "Apple Pay", icon: "🍎" },
                  { id: "stc", label: "stc pay", icon: "📱" },
                ].map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      padding: "16px 20px",
                      borderRadius: "var(--radius-md)",
                      background: paymentMethod === method.id ? "var(--primary-muted)" : "var(--bg-elevated)",
                      border: `2px solid ${paymentMethod === method.id ? "var(--primary)" : "var(--border)"}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontSize: 24 }}>{method.icon}</div>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{method.label}</div>
                    <div style={{ 
                      width: 20, height: 20, borderRadius: "50%", 
                      border: `2px solid ${paymentMethod === method.id ? "var(--primary)" : "var(--text-muted)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {paymentMethod === method.id && <div style={{ width: 10, height: 10, background: "var(--primary)", borderRadius: "50%" }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="card animate-fade-in" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>بيانات البطاقة</h3>
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>رقم البطاقة</label>
                    <input className="input" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>تاريخ الانتهاء</label>
                      <input className="input" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>CVC</label>
                      <input className="input" placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary */}
          <div style={{ position: "sticky", top: 100 }}>
            <div className="card" style={{ padding: 24, background: "var(--bg-surface)" }}>
               <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>ملخص الحجز</h2>
               
               <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{bookingSummary.stadium}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>📅 {bookingSummary.date}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>⏰ {bookingSummary.time}</div>
               </div>

               <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                     <span style={{ color: "var(--text-secondary)" }}>قيمة الحجز</span>
                     <span>{bookingSummary.price} أوقية</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                     <span style={{ color: "var(--text-secondary)" }}>رسوم الخدمة</span>
                     <span>{bookingSummary.fee} أوقية</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, marginTop: 8, paddingTop: 16, borderTop: "2px dashed var(--border)" }}>
                     <span>الإجمالي</span>
                     <span style={{ color: "var(--primary)" }}>{bookingSummary.total} أوقية</span>
                  </div>
               </div>

               <button 
                 onClick={handlePayment}
                 disabled={isProcessing}
                 className="btn-primary" 
                 style={{ width: "100%", padding: "16px", fontSize: 16, fontWeight: 800 }}
               >
                 {isProcessing ? "جاري المعالجة..." : "دفع وتأكيد الحجز"}
               </button>

               <div style={{ textAlign: "center", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🛡️</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>دفع آمن ومشفر 100%</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

