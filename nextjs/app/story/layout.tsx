import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hành trình 10+ năm - Câu chuyện Bonu F&B | Từ thất bại đến Best Bánh Mì",
  description: "Từ bán bánh online đến nhà hàng ở trung tâm London, Manchester, và giờ là Memoire Saigon tại Wales. Hành trình 10+ năm xây dựng thương hiệu F&B với những thăng trầm và bài học quý giá.",
  keywords: "câu chuyện F&B, Uyen Nguyen, Memoire Saigon, Best Bánh Mì Manchester, hành trình kinh doanh, kinh nghiệm F&B",
  authors: [{ name: "Uyen Nguyen - Bonu F&B" }],
  openGraph: {
    type: "article",
    url: "https://bonucakes.com/story",
    title: "Hành trình 10+ năm - Câu chuyện Bonu F&B",
    description: "Từ bán bánh online đến nhà hàng ở trung tâm London, Manchester, và giờ là Memoire Saigon tại Wales. Hành trình 10+ năm xây dựng thương hiệu F&B.",
    images: [
      {
        url: "https://bonucakes.com/images/community-mindmap.webp",
        width: 1200,
        height: 630,
        alt: "Bonu F&B Journey",
      },
    ],
    siteName: "Bonu F&B",
    locale: "vi_VN",
  },
  alternates: {
    languages: {
      'vi': 'https://bonucakes.com/story',
      'en': 'https://bonucakes.com/story',
      'x-default': 'https://bonucakes.com/story',
    },
  },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
