"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Trophy, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react"
import axios from "axios"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      city: "",
      password: "",
      confirmPassword: "",
      role: "player" as "player" | "team_owner" | "stadium_owner"
    }
  })

  const password = watch("password")

  const onSubmit = async (data: any) => {
    try {
      setError("")
      setLoading(true)

      const response = await axios.post("/api/auth/register", {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        phone: data.phone,
        city: data.city,
        role: data.role
      })

      if (response.status === 201) {
        router.push("/login?registered=true")
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "حدث خطأ غير متوقع")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <Trophy className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">Matchi</span>
          </Link>
          <p className="text-gray-600">انضم إلى مجتمع كرة القدم الأكبر</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">إنشاء حساب جديد</h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("full_name", { 
                    required: "الاسم مطلوب",
                    minLength: {
                      value: 2,
                      message: "الاسم يجب أن يكون حرفين على الأقل"
                    }
                  })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="محمد ولد أحمد"
                />
              </div>
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register("email", { 
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "عنوان بريد إلكتروني غير صالح"
                    }
                  })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="+222 XX XX XX XX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدينة
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register("city")}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="نواكشوط"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحساب
              </label>
              <select
                {...register("role")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="player">لاعب</option>
                <option value="team_owner">صاحب فريق</option>
                <option value="stadium_owner">صاحب ملعب</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "كلمة المرور مطلوبة",
                    minLength: {
                      value: 6,
                      message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                    }
                  })}
                  className="w-full pr-10 pl-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("confirmPassword", { 
                    required: "تأكيد كلمة المرور مطلوب",
                    validate: value => value === password || "كلمات المرور غير متطابقة"
                  })}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="terms"
                required
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600"
              />
              <label htmlFor="terms" className="mr-2 text-sm text-gray-600">
                أوافق على{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">الشروط والأحكام</Link>
                {" "}و{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

