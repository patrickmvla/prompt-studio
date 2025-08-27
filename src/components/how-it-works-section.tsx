const steps = [
  {
    number: "01",
    title: "Build",
    description:
      "Use the structured editor to clearly define instructions, add strict constraints, and provide examples.",
  },
  {
    number: "02",
    title: "Test",
    description:
      "Define adversarial test cases or upload a CSV to challenge your prompt from every angle.",
  },
  {
    number: "03",
    title: "Verify",
    description:
      "Run tests to get a strictness score and semantic analysis. Compare versions to find the optimal prompt.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            A Simple, Powerful Workflow
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Build, test, and verify in minutes, not hours.
          </p>
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
            <svg width="100%" height="2">
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="#4A5568"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>
          {steps.map((step) => (
            <div
              key={step.number}
              className="text-center relative bg-[#0A0A0A] px-4"
            >
              <div className="flex items-center justify-center mx-auto h-16 w-16 rounded-full bg-gray-900 border-2 border-indigo-500 text-2xl font-bold text-indigo-400">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-base text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
