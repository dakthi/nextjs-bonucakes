interface BusinessModel {
  name: string;
  cost: string;
  breakeven: string;
  benefits: string;
  timeline: string;
}

interface BusinessModelsSectionProps {
  modelsLabel: string;
  modelsHeading: string;
  modelsSubheading: string;
  tableModel: string;
  tableCost: string;
  tableBreakeven: string;
  tableBenefits: string;
  tableTimeline: string;
  model1Name: string;
  model1Cost: string;
  model1Breakeven: string;
  model1Benefits: string;
  model1Timeline: string;
  model2Name: string;
  model2Cost: string;
  model2Breakeven: string;
  model2Benefits: string;
  model2Timeline: string;
  model3Name: string;
  model3Cost: string;
  model3Breakeven: string;
  model3Benefits: string;
  model3Timeline: string;
}

export default function BusinessModelsSection(props: BusinessModelsSectionProps) {
  const models: BusinessModel[] = [
    {
      name: props.model1Name,
      cost: props.model1Cost,
      breakeven: props.model1Breakeven,
      benefits: props.model1Benefits,
      timeline: props.model1Timeline,
    },
    {
      name: props.model2Name,
      cost: props.model2Cost,
      breakeven: props.model2Breakeven,
      benefits: props.model2Benefits,
      timeline: props.model2Timeline,
    },
    {
      name: props.model3Name,
      cost: props.model3Cost,
      breakeven: props.model3Breakeven,
      benefits: props.model3Benefits,
      timeline: props.model3Timeline,
    },
  ];

  return (
    <section id="business-models" className="py-12 md:py-16 bg-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-secondary uppercase tracking-widest text-sm mb-4 font-medium">
            {props.modelsLabel}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {props.modelsHeading}
          </h2>
          <p className="text-muted max-w-2xl mx-auto">{props.modelsSubheading}</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-light">
                <th className="px-6 py-4 text-left font-bold w-1/6">{props.tableModel}</th>
                <th className="px-6 py-4 text-left font-bold w-1/8">{props.tableCost}</th>
                <th className="px-6 py-4 text-left font-bold w-1/12">{props.tableTimeline}</th>
                <th className="px-6 py-4 text-left font-bold w-1/2">{props.tableBenefits}</th>
                <th className="px-6 py-4 text-left font-bold w-1/6">{props.tableBreakeven}</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, index) => (
                <tr
                  key={index}
                  className={`border-b border-primary/10 ${
                    index % 2 === 0 ? 'bg-light/50' : 'bg-light'
                  } hover:bg-light transition-colors`}
                >
                  <td className="px-6 py-4 font-bold text-primary">{model.name}</td>
                  <td className="px-6 py-4 text-muted">{model.cost}</td>
                  <td className="px-6 py-4 text-muted">{model.timeline}</td>
                  <td className="px-6 py-4 text-muted text-sm">
                    <div className="space-y-1">
                      {model.benefits.split('•').filter(b => b.trim()).map((benefit, idx) => (
                        <div key={idx}>• {benefit.trim()}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{model.breakeven}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {models.map((model, index) => (
            <div key={index} className="bg-light p-6 border-2 border-primary/10">
              <h3 className="text-xl font-bold text-primary mb-4">{model.name}</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-bold text-primary">{props.tableCost}:</span>
                  <span className="text-muted ml-2">{model.cost}</span>
                </div>
                <div>
                  <span className="font-bold text-primary">{props.tableTimeline}:</span>
                  <span className="text-muted ml-2">{model.timeline}</span>
                </div>
                <div>
                  <span className="font-bold text-primary block mb-2">{props.tableBenefits}:</span>
                  <div className="space-y-1 text-muted text-sm">
                    {model.benefits.split('•').filter(b => b.trim()).map((benefit, idx) => (
                      <div key={idx}>• {benefit.trim()}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-primary">{props.tableBreakeven}:</span>
                  <span className="text-muted ml-2">{model.breakeven}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
