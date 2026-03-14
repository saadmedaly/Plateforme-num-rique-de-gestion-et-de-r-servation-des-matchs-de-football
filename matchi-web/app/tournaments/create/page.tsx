"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Users } from "lucide-react"
import axios from "axios"

export default function CreateTournamentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    start_date: "",
    end_date: "",
    max_teams: 8,
  })

  const cities = ["نواكشوط", "نواذيبو", "روصو", "كيفة", "زويرات", "سيلبابي", "أطار"]

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.start_date || !form.end_date) {
      setError("الرجاء إدخال جميع الحقول المطلوبة")
      return
    }
    if (form.end_date < form.start_date) {
      setError("تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية")
      return
    }
    try {
      setLoading(true)
      setError("")
      await axios.post("/api/tournaments", {
        ...form,
        max_teams: Number(form.max_teams),
      }, {
        headers: { "x-user-id": (session!.user as any).id }
      })
      router.push("/tournaments")
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ أثناء إنشاء البطولة")
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
            <Link href="/tournaments" className="text-gray-700 hover:text-blue-600">البطولات</Link>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">إنشاء بطولة جديدة</h1>
          <p className="opacity-90">نظّم بطولتك وادعُ الفرق للمشاركة</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم البطولة *</label>
              <div className="relative">
                <Trophy className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="مثال: كأس نواكشوط الرمضاني"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="اكتب وصفاً مختصراً للبطولة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">اختر المدينة</option>
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    min={form.start_date || new Date().toISOString().split("T")[0]}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للفرق</label>
              <div className="relative">
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={form.max_teams}
                  onChange={(e) => setForm({ ...form, max_teams: Number(e.target.value) })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value={4}>4 فرق</option>
                  <option value={8}>8 فرق</option>
                  <option value={16}>16 فريق</option>
                  <option value={32}>32 فريق</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Link
                href="/tournaments"
                className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold transition-colors"
              >
                {loading ? "جاري الإنشاء..." : "إنشاء البطولة"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

