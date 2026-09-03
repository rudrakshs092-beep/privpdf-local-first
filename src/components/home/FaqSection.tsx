const faqs = [
  {
    question: "Are my files uploaded?",
    answer: "No. Supported tools process your files inside your browser, on your own device.",
  },
  {
    question: "Do I need an account?",
    answer: "No account, no sign-up and no database. Just open a tool and start.",
  },
  { question: "Is PrivPDF free?", answer: "Yes, the PDF tools listed here are free to use." },
  {
    question: "Does it work on mobile?",
    answer: "Yes. Every tool is built mobile-first with large, touch-friendly controls.",
  },
  {
    question: "Where are my files processed?",
    answer: "In the browser tab you are using. Nothing is stored after you close it.",
  },
];

export function FaqSection() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="section-x py-10 sm:py-14">
        <h2 className="text-xl font-bold sm:text-2xl">Frequently asked questions</h2>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="min-w-0 rounded-xl border border-border bg-background p-4 sm:p-5"
            >
              <dt className="text-[0.95rem] font-semibold">{faq.question}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
