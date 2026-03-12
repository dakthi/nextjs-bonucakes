'use client';

import { useState } from 'react';

interface B2BService {
  title: string;
  desc: string;
  items: string[];
}

interface B2BServicesSectionProps {
  b2bLabel: string;
  b2bHeading: string;
  service1Title: string;
  service1Desc: string;
  service1Items: string[];
  service2Title: string;
  service2Desc: string;
  service2Items: string[];
  service3Title: string;
  service3Desc: string;
  service3Items: string[];
  service4Title: string;
  service4Desc: string;
  service4Items: string[];
  service5Title: string;
  service5Desc: string;
  service5Items: string[];
  b2bPricing: string;
  b2bPricingNote: string;
  b2bCta: string;
}

export default function B2BServicesSection(props: B2BServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const services: B2BService[] = [
    {
      title: props.service1Title,
      desc: props.service1Desc,
      items: props.service1Items,
    },
    {
      title: props.service2Title,
      desc: props.service2Desc,
      items: props.service2Items,
    },
    {
      title: props.service3Title,
      desc: props.service3Desc,
      items: props.service3Items,
    },
    {
      title: props.service4Title,
      desc: props.service4Desc,
      items: props.service4Items,
    },
    {
      title: props.service5Title,
      desc: props.service5Desc,
      items: props.service5Items,
    },
  ];

  return (
    <section id="b2b-services" className="py-16 md:py-24 bg-light">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
            {props.b2bLabel}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {props.b2bHeading}
          </h2>
        </div>

        {/* Side-by-side Accordion */}
        <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[350px,1fr] gap-8 mb-12">
          {/* Left: Steps */}
          <div className="space-y-3">
            {services.map((service, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-4 p-4 text-left border-2 transition-all ${
                  activeIndex === index
                    ? 'bg-secondary border-secondary text-primary shadow-lg'
                    : 'bg-light border-primary/10 text-primary hover:border-secondary'
                }`}
              >
                {/* Step Number */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                  activeIndex === index
                    ? 'bg-primary text-secondary'
                    : 'bg-primary/10 text-primary'
                }`}>
                  {index + 1}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm lg:text-base leading-tight">
                    {service.title}
                  </h3>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Details */}
          <div className="bg-light border-2 border-primary/10 p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              {services[activeIndex].title}
            </h3>
            <p className="text-muted mb-6 leading-relaxed">
              {services[activeIndex].desc}
            </p>
            <ul className="space-y-3">
              {services[activeIndex].items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-secondary mr-3 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="bg-primary text-light p-8 md:p-10 text-center max-w-3xl mx-auto">
          <p className="text-3xl md:text-4xl font-bold text-secondary mb-3">{props.b2bPricing}</p>
          <p className="text-light/80 mb-6">{props.b2bPricingNote}</p>
          <a
            href="https://www.facebook.com/profile.php?id=100009102362568"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-secondary text-primary px-10 py-4 font-bold text-lg hover:bg-secondary/90 transition-colors"
          >
            {props.b2bCta}
          </a>
        </div>
      </div>
    </section>
  );
}
