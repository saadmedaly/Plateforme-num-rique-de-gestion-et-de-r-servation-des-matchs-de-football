# دليل التشغيل السريع - Matchi

## الخطوات الأساسية لبدء المشروع

### 1️⃣ إعداد Supabase (5 دقائق)

#### أ. إنشاء مشروع Supabase
1. اذهب إلى https://supabase.com
2. سجل حساب جديد أو سجل دخولك
3. اضغط "New Project"
4. اختر:
   - Organization: (اختر منظمتك أو أنشئ جديدة)
   - Name: matchi
   - Database Password: (احفظ كلمة المرور في مكان آمن)
   - Region: اختر الأقرب لك

#### ب. إعداد قاعدة البيانات
1. بعد إنشاء المشروع، اذهب إلى **SQL Editor** من القائمة الجانبي
2. اضغط **New Query**
3. انسخ الكود بالكامل من ملف `supabase/schema.sql`
4. الصق الكود في المحرر
5. اضغط **Run** لتنفيذ الكود

✅ تم إنشاء جميع الجداول بنجاح!

#### ج. الحصول على مفاتيح API
1. اذهب إلى **Settings** → **API**
2. انسخ القيم التالية:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (مخفي، اضغط على العين لإظهاره)

### 2️⃣ إعداد متغيرات البيئة (دقيقتان)

#### أ. إنشاء ملف .env.local
```bash
cd matchi-web
cp .env.local.example .env.local
```

#### ب. تحديث المتغيرات
افتح ملف `.env.local` واستبدل القيم:

```env
# Supabase - الصق القيم من الخطوة السابقة
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# NextAuth - توليد سر جديد
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# OAuth - اختياري، يمكن تركه فارغ حالياً
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Stripe - اختياري للتطوير
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

### 3️⃣ تثبيت وتشغيل المشروع (3 دقائق)

```bash
# تثبيت المكتبات
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح المتصفح: http://localhost:3000

🎉 **مبروك! الموقع يعمل الآن!**

### 4️⃣ اختبار الموقع

#### إنشاء حساب تجريبي
1. اضغط على "إنشاء حساب"
2. املأ البيانات:
   - الاسم: أحمد محمد
   - البريد: test@example.com
   - الهاتف: +966501234567
   - المدينة: الرياض
   - كلمة المرور: Test123456
3. اضغط "إنشاء حساب"

#### تسجيل الدخول
1. اذهب لصفحة تسجيل الدخول
2. استخدم البيانات التي أدخلتها
3. ستدخل إلى لوحة التحكم

### 5️⃣ إضافة بيانات تجريبية (اختياري)

لتجربة الموقع ببيانات حقيقية، يمكنك إضافة ملاعب تجريبية:

اذهب إلى **Supabase** → **Table Editor** → **stadiums** → **Insert Row**

أضف ملعب كمثال:
```json
{
  "name": "ملعب الأمل الرياضي",
  "description": "ملعب كرة قدم متكامل المواصفات",
  "city": "الرياض",
  "address": "شارع الملك فهد، حي العليا",
  "price_per_hour": 150,
  "surface_type": "artificial_grass",
  "size": "7v7",
  "capacity": 20,
  "rating": 4.5,
  "is_active": true,
  "facilities": {
    "parking": true,
    "changing_rooms": true,
    "lighting": true,
    "showers": true,
    "wifi": true
  }
}
```

## 🔧 حل المشاكل الشائعة

### مشكلة: خطأ في الاتصال بقاعدة البيانات
**الحل:** تأكد من صحة `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### مشكلة: خطأ في المصادقة
**الحل:** تأكد من وجود `NEXTAUTH_SECRET` وتوليده بشكل صحيح

### مشكلة: الصفحة لا تظهر
**الحل:** 
1. تأكد من تشغيل `npm run dev`
2. افتح http://localhost:3000 مباشرة
3. امسح ذاكرة التخزين المؤقت للمتصفح

### مشكلة: خطأ في TypeScript
**الحل:** شغل `npm run build` لمعرفة الأخطاء بالتفصيل

## 📱 الصفحات المتاحة

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | الصفحة الرئيسية للموقع |
| تسجيل الدخول | `/login` | صفحة تسجيل الدخول |
| إنشاء حساب | `/register` | صفحة إنشاء حساب جديد |
| الملاعب | `/stadiums` | قائمة الملاعب |
| تفاصيل الملعب | `/stadiums/[id]` | عرض وحجز ملعب معين |
| لوحة التحكم | `/dashboard` | لوحة تحكم المستخدم |
| الفرق | `/teams` | قائمة الفرق |
| البطولات | `/tournaments` | قائمة البطولات |

## 🚀 الخطوات التالية

بعد تشغيل المشروع بنجاح:

1. **تفعيل OAuth** (Google/Facebook Login)
   - اذهب إلى Google Cloud Console / Facebook Developers
   - احصل على Client ID و Client Secret
   - أضفها إلى `.env.local`

2. **إضافة بوابة دفع**
   - اشترك في Stripe
   - أضف مفاتيح Stripe إلى `.env.local`
   - طوّر صفحة الدفع

3. **تطوير ميزات إضافية**
   - نظام الإشعارات
   - تقييم الملاعب
   - إدارة البطولات
   - لوحة تحكم المسؤول

## 💡 نصائح للتطوير

- استخدم `npm run dev` للتطوير
- استخدم `npm run build` للتأكد من عدم وجود أخطاء قبل النشر
- احتفظ بنسخة احتياطية من ملف `.env.local`
- راقب Console المتصفح للأخطاء
- استخدم Supabase Dashboard لمراقبة قاعدة البيانات

## 📞 الدعم

واجهتك مشكلة؟ 
- راجع ملف README.md للتفاصيل الكاملة
- تحقق من Console المتصفح
- راجع سجلات Supabase

---

**جاهز للانطلاق! 🚀**
