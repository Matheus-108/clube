'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Camera, Video, MapPin, TrendingUp, Star, ShieldCheck, MessageSquare } from 'lucide-react';
import type { Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const modelImages = model.gifImageIds.map(id => PlaceHolderImages.find(img => img.id === id)).filter(Boolean);
  if (modelImages.length === 0) {
      const avatarImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);
      if (avatarImage) modelImages.push(avatarImage);
  }

  useEffect(() => {
    if (isOpen) {
      setPhotoCount(Math.floor(Math.random() * (900 - 500 + 1)) + 500);
      setVideoCount(Math.floor(Math.random() * (150 - 50 + 1)) + 50);
    }
  }, [isOpen]);

  const InfoCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => (
    <Card className="bg-background/10 border-white/20 text-white">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
        {icon}
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-white/80">{title}</p>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 bg-background/90 backdrop-blur-sm border-none text-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh] md:h-auto">
          {/* Left Panel */}
          <div className="flex flex-col p-6 md:p-8 overflow-y-auto order-2 md:order-1">
            <div className="space-y-4">
              <h2 className="font-headline text-4xl font-bold">{model.name}</h2>
              <p className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5 text-primary" />
                Perto de você em <span className="font-semibold text-white">{city || "sua cidade"}</span>
              </p>

              <div className="grid grid-cols-2 gap-4">
                <InfoCard icon={<Camera size={24} />} title="Fotos Exclusivas" value={photoCount} />
                <InfoCard icon={<Video size={24} />} title="Vídeos Premium" value={videoCount} />
              </div>

              <Card className="bg-green-900/40 border-green-500/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="font-bold text-lg text-green-400">97.5%</p>
                      <h3 className="font-semibold">Taxa de Conversão</h3>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mt-2">Performance comprovada com alta taxa de conversão em vendas.</p>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-black font-bold text-lg" onClick={() => onStartChat(model)}>
                <MessageSquare className="mr-2" />
                Conversar Agora
              </Button>
              
              <div className="text-center space-y-2">
                 <div className="flex justify-center items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-white/80">Produto com alta avaliação</p>
              </div>

              <Card className="bg-background/10 border-white/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Conteúdo Validado</h3>
                    <p className="text-xs text-white/70">Testado e aprovado por especialistas</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          {/* Right Panel - Carousel */}
          <div className="relative order-1 md:order-2">
            <Carousel className="h-full w-full">
              <CarouselContent className="h-full">
                {modelImages.map((image) => (
                  image &&
                  <CarouselItem key={image.id} className="h-full">
                    <div className="relative h-full w-full">
                       <Image
                        src={image.imageUrl}
                        alt={model.name}
                        fill
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white border-none hover:bg-black/75" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white border-none hover:bg-black/75" />
            </Carousel>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
