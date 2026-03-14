"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Shield, MapPin, Users } from "lucide-react"
import axios from "axios"

export default function CreateTeamPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", city: "" })

  const cities = ["نواكشوط", "نواذيبو", "روصو", "كيفة", "زويرات", "سيلبابي", "أطار"]

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.city) {
      setError("الرجاء إدخال جميع البيانات")
      return
    }
    try {
      setLoading(true)
      setError("")
      await axios.post("/api/teams", form, {
        headers: { "x-user-id": (session!.user as any).id }
      })
      router.push("/teams")
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إنشاء الفريق")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Matchi</span>
            </Link>
            <Link href="/teams" className="text-gray-700 hover:text-blue-600">الفرق</Link>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">إنشاء فريق جديد</h1>
          <p className="opacity-90">أنشئ فريقك وابدأ رحلتك في المنافسة</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الفريق *
              </label>
              <div className="relative">
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="مثال: نسور نواكشوط"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة *
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">اختر المدينة</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Link
                href="/teams"
                className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold transition-colors"
              >
                {loading ? "جاري الإنشاء..." : "إنشاء الفريق"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

