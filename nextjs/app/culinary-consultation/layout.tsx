import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tư vấn công thức độc quyền - Uyên Nguyễn | Bonu F&B',
  description: 'Dịch vụ tư vấn công thức ẩm thực cao cấp. Công thức được test và tối ưu cho nguyên liệu địa phương. Cam kết thành công ngay lần đầu hoặc hoàn tiền.',
  keywords: 'tư vấn công thức, công thức ẩm thực, menu nhà hàng, tư vấn F&B, công thức độc quyền',
  authors: [{ name: 'Uyen Nguyen - Bonu F&B' }],
  openGraph: {
    type: 'website',
    url: 'https://bonucakes.com/culinary-consultation',
    title: 'Tư vấn công thức độc quyền - Uyên Nguyễn',
    description: 'Dịch vụ tư vấn công thức ẩm thực cao cấp. Công thức được test và tối ưu cho nguyên liệu địa phương.',
    images: [
      {
        url: 'https://bonucakes.com/images/community-mindmap.webp',
        width: 1200,
        height: 630,
        alt: 'Bonu F&B Culinary Consultation',
      },
    ],
    siteName: 'Bonu F&B',
    locale: 'vi_VN',
  },
  alternates: {
    canonical: 'https://bonucakes.com/culinary-consultation',
    languages: {
      'vi': 'https://bonucakes.com/culinary-consultation',
      'en': 'https://bonucakes.com/culinary-consultation',
      'x-default': 'https://bonucakes.com/culinary-consultation',
    },
  },
};

export default function CulinaryConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
