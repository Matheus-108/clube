import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-headline text-2xl font-bold text-accent">
          Clube HOT
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/selection">Quero Acesso</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
