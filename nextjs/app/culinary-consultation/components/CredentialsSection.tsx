interface Credential {
  title: string;
  text: string;
}

interface CredentialsSectionProps {
  credentialsLabel: string;
  credentialsHeading: string;
  credential1Title: string;
  credential1Text: string;
  credential2Title: string;
  credential2Text: string;
  credential3Title: string;
  credential3Text: string;
  credential4Title: string;
  credential4Text: string;
}

export default function CredentialsSection(props: CredentialsSectionProps) {
  const credentials: Credential[] = [
    { title: props.credential1Title, text: props.credential1Text },
    { title: props.credential2Title, text: props.credential2Text },
    { title: props.credential3Title, text: props.credential3Text },
    { title: props.credential4Title, text: props.credential4Text },
  ];

  return (
    <section className="py-16 md:py-20 bg-light">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((credential, index) => (
            <div key={index} className="bg-light border-2 border-primary/10 p-8 text-center hover:border-secondary hover:shadow-lg transition-all">
              <h3 className="font-bold text-xl text-primary mb-3">{credential.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{credential.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
