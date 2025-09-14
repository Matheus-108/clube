'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const gifIds = ['gif-preview-1', 'gif-preview-2', 'gif-preview-3'];
const gifs = gifIds.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);

export default function GifPreview() {
  return (
    <div className="mt-8 max-w-lg mx-auto">
      <div className="grid grid-cols-3 gap-2 md:gap-4 opacity-50">
        {gifs.map((gif, index) => (
          gif &&
          <div key={gif.id} className="relative aspect-[3/4] overflow-hidden rounded-md">
            <Image
              src={gif.imageUrl}
              alt={gif.description}
              fill
              unoptimized
              className="object-cover"
              data-ai-hint={gif.imageHint}
              priority={index < 3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
