interface GuaranteeSectionProps {
  guaranteeHeading: string;
  guaranteeText: string;
  guarantee1Title: string;
  guarantee1Text: string;
  guarantee2Title: string;
  guarantee2Text: string;
  guarantee3Title: string;
  guarantee3Text: string;
}

export default function GuaranteeSection(props: GuaranteeSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-primary text-light">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{props.guaranteeHeading}</h2>
        <p className="text-xl text-light/80 mb-8 max-w-2xl mx-auto">{props.guaranteeText}</p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-light/10 p-6 rounded">
            <p className="text-secondary font-bold mb-2">{props.guarantee1Title}</p>
            <p className="text-light/70 text-sm">{props.guarantee1Text}</p>
          </div>
          <div className="bg-light/10 p-6 rounded">
            <p className="text-secondary font-bold mb-2">{props.guarantee2Title}</p>
            <p className="text-light/70 text-sm">{props.guarantee2Text}</p>
          </div>
          <div className="bg-light/10 p-6 rounded">
            <p className="text-secondary font-bold mb-2">{props.guarantee3Title}</p>
            <p className="text-light/70 text-sm">{props.guarantee3Text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
