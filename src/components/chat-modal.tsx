'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ChatMessage = {
  id: number;
  from: 'model' | 'user';
  text?: string;
  options?: string[];
  isCheckoutButton?: boolean;
};

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
}

export default function ChatModal({ isOpen, onOpenChange, model }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ id: 1, from: 'model', text: `Oi, sou a ${model.name}, quer uma prévia exclusiva agora?` }]);
      setShowOptions(false);
      const timer = setTimeout(() => setShowOptions(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setMessages([]);
      setShowOptions(false);
    }
  }, [isOpen, model.name]);

  useEffect(() => {
    setTimeout(() => {
      const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, 100);
  }, [messages]);

  const handleOptionSelect = (option: string) => {
    setShowOptions(false);
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: option }]);

    setTimeout(() => {
      let responseText = '';
      let isCheckoutButton = false;
      if (option === 'Sim, quero ver') {
        responseText = 'Vou abrir uma prévia. Para acesso completo e chamar por vídeo, garanta seu lugar no Clube — acesso por R$49.';
        isCheckoutButton = true;
      } else if (option === 'Como funciona?') {
        responseText = 'Esse pacote dá acesso imediato a fotos e vídeos exclusivos e 1 chamada privada. Reserve seu lugar.';
      } else {
        responseText = 'O pacote completo inclui vídeos e uma chamada de vídeo privada também, é uma experiência única! Vale muito a pena.';
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'model', text: responseText, isCheckoutButton }]);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-3">
            <Avatar>
              {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint} />}
              <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Conversando com {model.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-center pt-2">
            Conversa simulada para experiência — agendamentos reais são digitais.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-72 w-full pr-4" ref={scrollAreaRef}>
            <div className="px-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.from === 'model' && (
                    <Avatar className="h-6 w-6">
                      {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint} />}
                      <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 ${message.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{message.text}</p>
                    {message.isCheckoutButton && (
                      <Button asChild size="sm" className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/checkout">Garantir Acesso</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {showOptions && (
            <div className="px-4 flex flex-col sm:flex-row gap-2">
              {['Sim, quero ver', 'Como funciona?', 'Só fotos por enquanto'].map(option => (
                <Button key={option} variant="outline" size="sm" onClick={() => handleOptionSelect(option)}>
                  {option}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
