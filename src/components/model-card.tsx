import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle } from 'lucide-react';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ModelCardProps {
  model: Model;
  onChatClick: (model: Model) => void;
}

export default function ModelCard({ model, onChatClick }: ModelCardProps) {
  const image = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  return (
    <Card className="overflow-hidden group transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          {image && (
            <Image
              src={image.imageUrl}
              alt={model.name}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          )}
          {model.isOnline && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 rounded-full p-1 pr-2">
               <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white text-xs font-semibold">Online</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-headline text-2xl font-bold text-white">{model.name}</h3>
            <Badge className="mt-1 bg-accent text-accent-foreground">
              <Heart className="w-3 h-3 mr-1" />
              Mais Quente
            </Badge>
          </div>
        </div>
        <div className="p-4 bg-card">
          <Button onClick={() => onChatClick(model)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            <MessageCircle className="mr-2" />
            Conversar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
