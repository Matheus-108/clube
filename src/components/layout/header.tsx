'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';

export default function Header() {
  const checkoutLink = "https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468";

  const handleCheckoutClick = () => {
    window.location.href = checkoutLink;
  };
  
  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-40 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="https://i.imgur.com/GcVA01N.png"
            alt="Clube HOT Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Button onClick={handleCheckoutClick} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Quero Acesso
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
