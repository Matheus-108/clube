import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, PlayCircle } from 'lucide-react';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ModelCardProps {
  model: Model;
  onChatClick: (model: Model) => void;
  onSampleClick: (model: Model) => void;
}

export default function ModelCard({ model, onChatClick, onSampleClick }: ModelCardProps) {
  const image = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          {image && (
            <Image
              src={image.imageUrl}
              alt={model.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={image.imageHint}
            />
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
        <div className="p-4 bg-card grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => onSampleClick(model)}>
            <PlayCircle className="mr-2" />
            Ver Amostra
          </Button>
          <Button onClick={() => onChatClick(model)} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <MessageCircle className="mr-2" />
            Conversar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
