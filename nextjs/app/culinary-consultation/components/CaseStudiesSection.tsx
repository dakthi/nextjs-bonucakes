interface CaseStudy {
  title: string;
  desc: string;
  detail: string;
  borderColor: string;
  textColor: string;
}

interface CaseStudiesSectionProps {
  caseStudiesLabel: string;
  caseStudiesHeading: string;
  caseStudy1Title: string;
  caseStudy1Desc: string;
  caseStudy1Detail: string;
  caseStudy2Title: string;
  caseStudy2Desc: string;
  caseStudy2Detail: string;
  caseStudy3Title: string;
  caseStudy3Desc: string;
  caseStudy3Detail: string;
}

export default function CaseStudiesSection(props: CaseStudiesSectionProps) {
  const caseStudies: CaseStudy[] = [
    {
      title: props.caseStudy1Title,
      desc: props.caseStudy1Desc,
      detail: props.caseStudy1Detail,
      borderColor: 'border-secondary',
      textColor: 'text-secondary',
    },
    {
      title: props.caseStudy2Title,
      desc: props.caseStudy2Desc,
      detail: props.caseStudy2Detail,
      borderColor: 'border-secondary',
      textColor: 'text-secondary',
    },
    {
      title: props.caseStudy3Title,
      desc: props.caseStudy3Desc,
      detail: props.caseStudy3Detail,
      borderColor: 'border-primary',
      textColor: 'text-primary',
    },
  ].filter(study => study.title && study.desc && study.detail);

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
            {props.caseStudiesLabel}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
            {props.caseStudiesHeading}
          </h2>
        </div>

        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  {study.title}
                </h3>
                <p className="text-muted text-lg leading-relaxed">
                  {study.desc}
                </p>
              </div>
              <div className={`bg-light p-8 border-l-4 ${study.borderColor} ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <p className={`text-base ${study.textColor} font-semibold leading-relaxed`}>
                  {study.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
