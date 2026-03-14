"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"

export default function WalletPage() {
  const transactions = [
    { id: "TX-101", title: "حجز ملعب الأساطير", amount: -150, date: "24 مارس 2024", type: "debit" },
    { id: "TX-102", title: "إيداع من بطاقة مدى", amount: 300, date: "22 مارس 2024", type: "credit" },
    { id: "TX-103", title: "استرداد حجز ملغي", amount: 120, date: "20 مارس 2024", type: "credit" },
    { id: "TX-104", title: "جائزة بطولة رمضان", amount: 500, date: "15 مارس 2024", type: "credit" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        
        {/* Wallet Balance Card */}
        <div className="card" style={{ padding: 40, marginBottom: 32, background: "linear-gradient(135deg, var(--primary) 0%, #17a356 100%)", textAlign: "center", color: "#000" }}>
           <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.8, marginBottom: 8 }}>الرصيد الحالي</div>
           <div style={{ fontSize: 48, fontWeight: 900, marginBottom: 24 }}>770.00 أوقية</div>
           <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
             <button className="btn-secondary" style={{ background: "rgba(0,0,0,0.8)", color: "white", border: "none", padding: "12px 24px" }}>+ شحن رصيد</button>
             <button className="btn-secondary" style={{ background: "rgba(255,255,255,0.2)", color: "#000", border: "1px solid rgba(0,0,0,0.1)", padding: "12px 24px" }}>سحب الرصيد</button>
           </div>
        </div>

        {/* Transaction History */}
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>سجل العمليات</h2>
        <div className="card" style={{ padding: 0 }}>
          {transactions.map((tx, i) => (
            <div 
              key={tx.id} 
              style={{ 
                padding: "20px 24px", 
                borderBottom: i === transactions.length - 1 ? "none" : "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{tx.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{tx.date} • {tx.id}</div>
              </div>
              <div style={{ 
                fontSize: 18, 
                fontWeight: 800, 
                color: tx.type === "credit" ? "var(--primary)" : "var(--danger)" 
              }}>
                {tx.type === "credit" ? "+" : "-"}{Math.abs(tx.amount)} أوقية
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
           <button className="btn-ghost" style={{ fontSize: 13 }}>مشاهدة كافة العمليات</button>
        </div>

      </div>
    </div>
  )
}

