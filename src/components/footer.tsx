import Link from "next/link";
import { ToyBrick } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <ToyBrick className="h-5 w-5 text-indigo-400" />
            <span className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Prompt Studio. All rights
              reserved.
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="https://x.com/patrickmvla"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="https://github.com/patrickmvla"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
