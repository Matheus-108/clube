import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MessageCircle } from 'lucide-react';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ModelCardProps {
  model: Model;
  onChatClick: (model: Model) => void;
}

export default function ModelCard({ model, onChatClick }: ModelCardProps) {
  const image = PlaceHolderImages.find(img => img.id === model.avatarImageId);
  const isVideo = image?.imageUrl.endsWith('.mp4');

  return (
    <Card className="overflow-hidden group transition-all duration-300 bg-[#B8001F] border-transparent rounded-lg">
      <CardContent className="p-0">
        <div className="relative aspect-[3/4]">
          {image && (
            isVideo ? (
                <video
                    src={image.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                />
            ) : (
                <Image
                  src={image.imageUrl}
                  alt={model.name}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                  unoptimized={image.imageUrl.endsWith('.gif')}
                />
            )
          )}
          
          <div className="absolute top-3 right-3">
            {model.isOnline ? (
              <div className="flex items-center gap-2 bg-black/60 rounded-full py-1 px-2">
                <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-white text-xs font-semibold">Online agora</span>
              </div>
            ) : (
               <Badge variant="secondary" className="bg-black/60 text-white/80 text-xs">{model.lastSeen}</Badge>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-headline text-2xl font-bold text-white">{model.name}</h3>
          </div>
        </div>
        <div className="p-4 flex gap-2">
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <Eye className="mr-2" />
              Ver Prévia
            </Button>
            <Button onClick={() => onChatClick(model)} className="w-full bg-whatsapp-green-light text-black hover:bg-whatsapp-green-light/90">
                <MessageCircle className="mr-2" />
                Conversar
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
