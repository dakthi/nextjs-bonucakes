import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito-sans",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bonucakes - Xây dựng sự nghiệp F&B bền vững",
  description: "Xây dựng sự nghiệp F&B từ chuyên môn độc lập, tự chủ, bền vững. Bài học thật từ 10+ năm kinh nghiệm: từ thất bại đến Best Bánh Mì in Manchester.",
  keywords: "Bonucakes, F&B business, kinh doanh F&B, tư vấn nhà hàng, khóa học F&B, Uyen Nguyen, Memoire Saigon, Best Bánh Mì Manchester",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={nunitoSans.variable} suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N2YKRZNC4F"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N2YKRZNC4F');
            `,
          }}
        />
      </head>
      <body className="antialiased bg-cream">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
