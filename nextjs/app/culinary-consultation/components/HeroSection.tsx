interface HeroSectionProps {
  heroLabel: string;
  heroHeading: string;
  heroSubheading: string;
  heroCatchphrase: string;
  heroCta1: string;
  heroCta2: string;
}

export default function HeroSection({
  heroLabel,
  heroHeading,
  heroSubheading,
  heroCatchphrase,
  heroCta1,
  heroCta2
}: HeroSectionProps) {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-b from-primary to-primary/95 text-light">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-secondary uppercase tracking-widest text-sm mb-6 font-medium">
          {heroLabel}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {heroHeading}
        </h1>
        <p className="text-2xl md:text-3xl text-secondary font-semibold mb-6 italic">
          {heroCatchphrase}
        </p>
        <p className="text-xl md:text-2xl text-light/90 max-w-3xl mb-10">
          {heroSubheading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#b2b-services"
            className="inline-flex items-center justify-center bg-secondary text-primary px-8 py-4 font-bold text-lg hover:bg-secondary/90 transition-colors shadow-lg"
          >
            {heroCta1}
          </a>
          <a
            href="#courses"
            className="inline-flex items-center justify-center border-2 border-secondary text-secondary px-8 py-4 font-bold text-lg hover:bg-secondary/10 transition-colors"
          >
            {heroCta2}
          </a>
        </div>
      </div>
    </section>
  );
}
