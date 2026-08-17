const steps = [
  { number: "01", title: "Choose a tool", description: "Pick the PDF task you need to get done." },
  { number: "02", title: "Process your PDF", description: "Set your options and run the tool." },
  { number: "03", title: "Download your result", description: "Save the finished file to your device." },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border">
      <div className="section-x py-16 sm:py-20">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">Simple by design.</h2>
        </header>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="min-w-0 border-t border-border-strong pt-5">
              <span className="font-display text-sm font-bold text-primary-strong">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-sm text-muted-foreground">
          Where technically possible, processing happens directly in your browser.
        </p>
      </div>
    </section>
  );
}
