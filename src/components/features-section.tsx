import { BotMessageSquare, CheckCircle2, Cpu, FileText, GitCompareArrows, Scale } from 'lucide-react';

const features = [
  {
    icon: <FileText className="h-8 w-8 text-indigo-400" />,
    title: 'Structured Editor',
    description: 'Go beyond simple text boxes with dedicated sections for instructions, constraints, and examples.',
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-indigo-400" />,
    title: 'Strictness Tester',
    description: 'Run your prompts against adversarial test cases to calculate a verifiable strictness score.',
  },
  {
    icon: <Cpu className="h-8 w-8 text-indigo-400" />,
    title: 'Groq-Powered Speed',
    description: 'Iterate faster than ever. Get near-instant feedback for your prompt changes with the Llama3 model on Groq.',
  },
  {
    icon: <BotMessageSquare className="h-8 w-8 text-indigo-400" />,
    title: 'Semantic Analysis',
    description: 'Powered by Jina AI, ensure outputs match intent, not just keywords, for truly robust testing.',
  },
  {
    icon: <GitCompareArrows className="h-8 w-8 text-indigo-400" />,
    title: 'History & Comparison',
    description: 'Track every tweak. Compare prompt versions side-by-side to see what changes actually improve results.',
  },
  {
    icon: <Scale className="h-8 w-8 text-indigo-400" />,
    title: 'Cost & Token Estimator',
    description: 'Stay in control. Get real-time token counts and cost estimates before you run a single test.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#101010]">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything You Need to Engineer Reliable Prompts</h2>
          <p className="mt-4 text-lg text-gray-400">A professional toolkit for professional results.</p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="p-8 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-800">
                {feature.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
