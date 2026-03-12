interface FAQSectionProps {
  faqLabel: string;
  faqHeading: string;
  currentLang: 'vi' | 'en';
}

export default function FAQSection({ faqLabel, faqHeading, currentLang }: FAQSectionProps) {
  const faqs = currentLang === 'vi' ? [
    {
      question: 'Chi phí dịch vụ như thế nào?',
      answer: (
        <>
          <p className="mb-3">Đây không chỉ là một công thức. Đây là kết quả của:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>10+ năm kinh nghiệm trong ngành F&B</li>
            <li>Hàng trăm lần test và điều chỉnh công thức</li>
            <li>Đào tạo tại Le Cordon Bleu và làm việc tại khách sạn 5 sao</li>
            <li>Công thức được tối ưu riêng cho nguyên liệu địa phương của bạn</li>
            <li>Hỗ trợ video call đến khi bạn thành công</li>
          </ul>
          <p className="mt-3">
            Chi phí sẽ phụ thuộc vào món bạn chọn và mức độ tùy chỉnh. Liên hệ trực tiếp để được báo giá chi tiết.
          </p>
        </>
      ),
    },
    {
      question: 'Nếu Bo ở xa (Mỹ, Úc, Châu Âu) thì sao?',
      answer: 'Không vấn đề gì! Bo đã làm việc với khách hàng từ Na Uy, Pháp, Mỹ, và nhiều nơi khác. Quy trình của Bo được thiết kế để phù hợp với nguyên liệu ở bất kỳ đâu.',
    },
    {
      question: 'Bo có thể học nhiều món cùng lúc không?',
      answer: 'Có thể! Nếu bạn muốn học combo set, Bo sẽ có giá ưu đãi. Liên hệ trực tiếp để Bo tư vấn gói phù hợp nhất.',
    },
  ] : [
    {
      question: 'What are the service costs?',
      answer: (
        <>
          <p className="mb-3">This is not just a recipe. This is the result of:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>10+ years of experience in F&B industry</li>
            <li>Hundreds of recipe tests and adjustments</li>
            <li>Trained at Le Cordon Bleu and worked at 5-star hotels</li>
            <li>Recipes optimized specifically for your local ingredients</li>
            <li>Video call support until you succeed</li>
          </ul>
          <p className="mt-3">
            Cost depends on the dish you choose and customization level. Contact directly for detailed pricing.
          </p>
        </>
      ),
    },
    {
      question: 'What if Bo is far away (US, Australia, Europe)?',
      answer: 'No problem at all! Bo has worked with clients from Norway, France, USA, and many other places. Bo\'s process is designed to adapt to ingredients anywhere.',
    },
    {
      question: 'Can I learn multiple dishes at once?',
      answer: 'Absolutely! If you want to learn combo sets, Bo will offer special pricing. Contact directly for recommendations.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
            {faqLabel}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{faqHeading}</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-light border border-primary/10 group">
              <summary className="p-5 cursor-pointer flex justify-between items-center font-semibold text-primary hover:bg-light/50 transition-colors">
                <span>{faq.question}</span>
                <span className="text-secondary transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-5 text-muted">
                {typeof faq.answer === 'string' ? faq.answer : faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
