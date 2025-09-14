import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HeroSection() {
  const heroImageIds = ['hero-1', 'hero-2', 'hero-3', 'hero-4', 'hero-5', 'hero-6'];
  const heroImages = heroImageIds.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 opacity-20 blur-sm">
        {heroImages.map((image, index) => (
          image &&
          <div key={image.id} className="relative h-full w-full">
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover"
              priority={index < 3}
              data-ai-hint={image.imageHint}
            />
          </div>
        ))}
      </div>
      <div className="relative container mx-auto px-4 py-24 sm:py-32 lg:py-40 text-center flex flex-col items-center">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary tracking-tight">
          Entre no Clube do Sexo — encontros, vídeos e chamadas privadas num só lugar.
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl text-foreground/80">
          Preview em GIFs. Escolha, pague e agende sua chamada privada.
        </p>
        <Button asChild size="lg" className="mt-10 bg-accent text-accent-foreground hover:bg-accent/90 text-lg font-bold shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/selection">Quero Acesso</Link>
        </Button>
      </div>
    </section>
  );
}
