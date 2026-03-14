# Matchi - Football Match Booking Platform

منصة متكاملة لحجز ملاعب كرة القدم وتنظيم المباريات والبطولات

## 🚀 التقنيات المستخدمة

### Frontend
- **Next.js 15** - React Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Validation
- **Axios** - HTTP client
- **Lucide Icons** - Icons

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL, Auth, Storage)
- **NextAuth.js** - Authentication
- **bcryptjs** - Password hashing

## 📋 المتطلبات

قبل البدء، تأكد من توفر:

- Node.js 18+ 
- npm أو yarn
- حساب Supabase

## 🛠️ التثبيت والإعداد

### 1. تثبيت المكتبات

```bash
cd matchi-web
npm install
```

### 2. إعداد Supabase

1. قم بإنشاء مشروع جديد على [Supabase](https://supabase.com)
2. اذهب إلى SQL Editor في لوحة تحكم Supabase
3. انسخ محتويات ملف `supabase/schema.sql` وشغله لإنشاء الجداول

### 3. إعداد متغيرات البيئة

انسخ ملف `.env.local.example` إلى `.env.local`:

```bash
cp .env.local.example .env.local
```

ثم قم بتحديث القيم التالية:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration
NEXTAUTH_SECRET=generate-a-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Payment Gateway (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. توليد NEXTAUTH_SECRET

يمكنك توليد سر آمن باستخدام:

```bash
openssl rand -base64 32
```

أو استخدم أي أداة توليد عشوائية أخرى.

### 5. تشغيل المشروع

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح

## 📁 هيكل المشروع

```
matchi-web/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── bookings/     # Bookings management
│   │   ├── stadiums/     # Stadiums management
│   │   └── teams/        # Teams management
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── stadiums/         # Stadiums pages
│   ├── teams/            # Teams pages
│   ├── tournaments/      # Tournaments pages
│   └── page.tsx          # Homepage
├── lib/
│   └── supabase.ts       # Supabase client
├── supabase/
│   └── schema.sql        # Database schema
└── .env.local            # Environment variables
```

## 🔑 الميزات الرئيسية

### 1. نظام المصادقة
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- الدعم الاجتماعي (Google, Facebook)
- إدارة الصلاحيات (لاعب، صاحب فريق، صاحب ملعب، مدير)

### 2. حجز الملاعب
- بحث متقدم حسب المدينة، السعر، النوع
- عرض تفاصيل الملعب والمرافق
- نظام حجز مع اختيار التاريخ والوقت
- دفع إلكتروني آمن

### 3. إدارة الفرق
- إنشاء وإدارة الفرق
- إضافة لاعبين للفريق
- متابعة إحصائيات الفريق

### 4. البطولات
- إنشاء بطولات جديدة
- تسجيل الفرق في البطولات
- متابعة جداول المباريات والنتائج

### 5. لوحة التحكم
- عرض الحجوزات القادمة
- سجل المباريات
- إحصائيات شخصية
- إجراءات سريعة

## 🗄️ قاعدة البيانات

الجداول الرئيسية:

- **users** - معلومات المستخدمين
- **stadiums** - بيانات الملاعب
- **bookings** - الحجوزات
- **teams** - الفرق الرياضية
- **team_members** - أعضاء الفرق
- **matches** - المباريات
- **tournaments** - البطولات
- **reviews** - التقييمات
- **notifications** - الإشعارات

## 🎨 التصميم

الموقع مصمم بـ:
- دعم كامل للغة العربية (RTL)
- تصميم متجاوب مع جميع الأجهزة
- ألوان عصرية وجذابة
- تجربة مستخدم سلسة

## 📱 الصفحات المطورة

1. **الصفحة الرئيسية** - Landing page مع مميزات الموقع
2. **تسجيل الدخول/إنشاء حساب** - صفحات المصادقة
3. **الملاعب** - قائمة الملاعب مع فلاتر بحث متقدمة
4. **تفاصيل الملعب** - عرض معلومات الملعب والحجز
5. **لوحة التحكم** - Dashboard للمستخدمين
6. **الفرق** - إدارة الفرق
7. **البطولات** - عرض وإنشاء البطولات

## 🔜 الخطوات القادمة

لتشغيل المشروع بشكل كامل، تحتاج إلى:

1. ✅ إعداد Supabase وتشغيل Schema
2. ✅ تحديث متغيرات البيئة
3. ⏳ تفعيل OAuth Providers (اختياري)
4. ⏳ دمج بوابة الدفع Stripe
5. ⏳ إضافة صفحات إضافية (Profile، Settings)
6. ⏳ تطوير نظام الإشعارات
7. ⏳ إضافة اختبارات

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📞 التواصل

للأسئلة أو الاستفسارات:
- Email: info@matchi.com

## 📄 الرخصة

هذا المشروع مرخص بموجب رخصة MIT.

---

**Matchi** - منصتك الأولى لحجز ملاعب كرة القدم ⚽
