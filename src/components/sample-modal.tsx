'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Camera, Video, MapPin, TrendingUp, Star, ShieldCheck, MessageSquare } from 'lucide-react';
import type { Model } from '@/lib/models';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

interface SampleModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
  city: string;
  onStartChat: (model: Model) => void;
}

export default function SampleModal({ isOpen, onOpenChange, model, city, onStartChat }: SampleModalProps) {
  const [photoCount, setPhotoCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [modelImages, setModelImages] = useState<ImagePlaceholder[]>([]);
  
  useEffect(() => {
    if (isOpen && model) {
      const getModelImages = (model: Model): ImagePlaceholder[] => {
        const avatarImage = PlaceHolderImages.find(pImg => pImg.id === model.avatarImageId);
        const gifImages = (model.gifImageIds || [])
          .map(id => PlaceHolderImages.find(pImg => pImg.id === id))
          .filter((img): img is ImagePlaceholder => !!img);
        
        const allImages: ImagePlaceholder[] = [];
        if (avatarImage) {
          allImages.push(avatarImage);
        }
        allImages.push(...gifImages);

        const uniqueImages = allImages.filter((image, index, self) =>
          index === self.findIndex((t) => t.id === image.id)
        );
        
        return uniqueImages;
      };
      
      setModelImages(getModelImages(model));
      setPhotoCount(889);
      setVideoCount(107);
    } else {
        setModelImages([]);
    }
  }, [isOpen, model]);

  if (!model) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 bg-[#0C0C0C] border-none text-white overflow-hidden h-full md:h-auto md:max-h-[90vh] flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
          {/* Left Panel - Info */}
          <div className="flex flex-col p-6 md:p-8 overflow-y-auto order-2 md:order-1 bg-[#F1F1F1] text-black">
            <div className="space-y-4">
              <h2 className="font-headline text-5xl font-bold text-black/80">{model.name}</h2>
              <p className="flex items-center gap-2 text-black/60">
                <MapPin className="w-5 h-5 text-primary" />
                Perto de você em <span className="font-semibold text-black/80">{city || "sua cidade"}</span>
              </p>

              <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-white/50 backdrop-blur-sm border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                        <Camera size={28} className="text-black/50" />
                        <p className="text-4xl font-bold text-black/70">{photoCount}</p>
                        <p className="text-sm text-black/50">Fotos Exclusivas</p>
                    </CardContent>
                </Card>
                 <Card className="bg-white/50 backdrop-blur-sm border-none">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                        <Video size={28} className="text-black/50" />
                        <p className="text-4xl font-bold text-black/70">{videoCount}</p>
                        <p className="text-sm text-black/50">Vídeos Premium</p>
                    </CardContent>
                </Card>
              </div>

              <Card className="bg-[#B5CCB6]/80 border-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-800" />
                    <div>
                      <p className="font-bold text-lg text-green-800">97.5%</p>
                      <h3 className="font-semibold text-black/80">Taxa de Conversão</h3>
                    </div>
                  </div>
                  <p className="text-xs text-black/60 mt-2">Performance comprovada com alta taxa de conversão em vendas.</p>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full bg-[#30D158] hover:bg-[#28a745] text-black font-bold text-lg" onClick={() => onStartChat(model)}>
                <MessageSquare className="mr-2" />
                Conversar Agora
              </Button>
              
              <div className="text-center space-y-2 pt-2">
                 <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-black/60">Produto com alta avaliação</p>
              </div>

              <Card className="bg-white/50 backdrop-blur-sm border-none">
                <CardContent className="p-4 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-black/80">Conteúdo Validado</h3>
                    <p className="text-xs text-black/60">Testado e aprovado por especialistas</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          {/* Right Panel - Carousel */}
          <div className="relative order-1 md:order-2 h-[50vh] md:h-auto bg-black">
            {modelImages.length > 0 && (
                <Carousel className="h-full w-full">
                <CarouselContent className="h-full">
                    {modelImages.map((image) => (
                    <CarouselItem key={image.id} className="h-full">
                        <div className="relative h-full w-full">
                        {image.imageUrl.endsWith('.mp4') ? (
                            <video
                            src={image.imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="object-contain w-full h-full"
                            key={image.id}
                            />
                        ) : (
                            <Image
                            src={image.imageUrl}
                            alt={model.name}
                            fill
                            className="object-contain"
                            data-ai-hint={image.imageHint}
                            unoptimized
                            />
                        )}
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                {modelImages.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white border-none hover:bg-black/75" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white border-none hover:bg-black/75" />
                    </>
                )}
                </Carousel>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
