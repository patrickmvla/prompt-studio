import Link from 'next/link';
import { ToyBrick } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI setup

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0A0A0A]/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <ToyBrick className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-xl text-gray-50">Prompt Studio</span>
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link href="#features" className="text-gray-400 hover:text-gray-100 transition-colors">
            Features
          </Link>
          <Link href="/docs" className="text-gray-400 hover:text-gray-100 transition-colors">
            Docs
          </Link>
          <Link href="/blog" className="text-gray-400 hover:text-gray-100 transition-colors">
            Blog
          </Link>
        </nav>
        <div className="flex items-center">
           <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
