'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface FloatingBubbleProps {
  model: Model;
  onClick: () => void;
}

export default function FloatingBubble({ model, onClick }: FloatingBubbleProps) {
  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 rounded-full w-16 h-16 shadow-2xl cursor-pointer animate-bounce-in group"
      aria-label={`Reabrir chat com ${model.name}`}
    >
      <Avatar className="w-full h-full border-4 border-[#B8001F]">
        {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint} />}
        <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
      </span>
      <div className="absolute bottom-0 right-14 w-48 p-2 bg-black text-white rounded-lg text-sm text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-y-1/2">
        <p className="font-bold">{model.name} está te esperando!</p>
        <p className="text-xs">Clique para conversar.</p>
      </div>
    </button>
  );
}
