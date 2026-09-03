import { Cpu, Download, FilePlus2 } from "lucide-react";

const steps = [
  {
    icon: FilePlus2,
    title: "Choose your file",
    description: "Select the PDF or images you want to work with.",
  },
  {
    icon: Cpu,
    title: "Process locally",
    description: "The work happens inside your browser, on your device.",
  },
  {
    icon: Download,
    title: "Download",
    description: "Save the finished file straight away.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border">
      <div className="section-x py-10 sm:py-14">
        <h2 className="text-xl font-bold sm:text-2xl">How it works</h2>
        <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5"
            >
              <span className="tool-card-icon">
                <step.icon className="size-[1.15rem]" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-[0.95rem] font-semibold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
