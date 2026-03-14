"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/stadiums", label: "الملاعب" },
    { href: "/matches", label: "البحث عن مباريات" },
    { href: "/teams", label: "الفرق" },
    { href: "/tournaments", label: "البطولات" },
  ]

  return (
    <nav style={{
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              background: "var(--primary)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>
              ⚽
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              ملعبك
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="nav-links-desktop">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: pathname === link.href ? "var(--primary)" : "var(--text-secondary)",
                  background: pathname === link.href ? "var(--primary-muted)" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {session ? (
              <>
                <Link href="/dashboard" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 14px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}>
                  <span style={{
                    width: 28, height: 28,
                    background: "var(--primary)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#000"
                  }}>
                    {session.user?.name?.[0] || "م"}
                  </span>
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  padding: "6px 14px",
                  borderRadius: "var(--radius-md)",
                  transition: "all 0.2s"
                }}>
                  تسجيل الدخول
                </Link>
                <Link href="/signup" className="btn-primary" style={{ fontSize: 13 }}>
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
