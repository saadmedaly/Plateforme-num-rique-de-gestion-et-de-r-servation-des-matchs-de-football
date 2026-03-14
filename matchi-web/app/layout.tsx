import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ملعبك - احجز ملعب كرة القدم المفضل لديك",
  description: "منصة سهلة وسريعة للاعبين وأصحاب الملاعب للبحث والحجز وإدارة المواعيد في مكان واحد",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={lexend.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}



