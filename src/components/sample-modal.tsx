'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import Link from 'next/link';

interface SampleModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SampleModal({ isOpen, onOpenChange }: SampleModalProps) {
  const image = PlaceHolderImages.find(img => img.id === 'sample-video');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0">
        <div className="relative aspect-video">
          {image && (
            <Image
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover rounded-t-lg"
              data-ai-hint={image.imageHint}
            />
          )}
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white p-4 bg-black/50 rounded-lg">
                <h3 className="font-headline text-2xl">Acesso Completo</h3>
                <p>Veja este e outros vídeos exclusivos.</p>
                <Button asChild size="lg" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/checkout">Garantir Acesso VIP</Link>
                </Button>
            </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
