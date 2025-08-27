import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="py-24 sm:py-32 md:py-40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Build Bulletproof Prompts
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-400 sm:text-xl md:text-2xl">
          An engineering environment to create, test, and verify high-fidelity prompts that make LLMs follow instructions to the letter.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg" className="text-base font-semibold">
            Launch Studio <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Link href="/docs">
            <Button size="lg" variant="outline" className="text-base font-semibold">
              Read Docs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
