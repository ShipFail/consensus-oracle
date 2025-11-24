import Link from 'next/link';
import { Home, History, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">Thoth</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm lg:gap-6 ml-auto">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>History</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
