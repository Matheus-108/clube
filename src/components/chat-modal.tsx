'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatMessage = {
  id: number;
  from: 'model' | 'user';
  text: string;
  isCheckoutButton?: boolean;
};

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
}

const initialOptions = ['Sim, quero ver', 'Como funciona?', 'Só fotos por enquanto'];

export default function ChatModal({ isOpen, onOpenChange, model }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setIsTyping(true);
      
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setMessages([{ id: 1, from: 'model', text: `Oi, sou a ${model.name}, quer uma prévia exclusiva agora?` }]);
        if (audioRef.current) {
            audioRef.current.play().catch(console.error);
        }
        
        const optionsTimer = setTimeout(() => {
          setShowOptions(true);
        }, 1000);
        
        return () => clearTimeout(optionsTimer);

      }, 2000);

      return () => clearTimeout(typingTimer);
    } else {
      setMessages([]);
      setShowOptions(false);
      setIsTyping(false);
    }
  }, [isOpen, model.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleOptionSelect = (option: string) => {
    setShowOptions(false);
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: option }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
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
      
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }

    }, 2500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="whatsapp-modal p-0 gap-0">
        {/* Header */}
        <header className="bg-whatsapp-green-dark p-3 flex items-center gap-3 shadow-md z-10">
           <Avatar>
              {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint} />}
              <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="font-bold text-white">{model.name}</p>
                <p className="text-xs text-whatsapp-green-light">online agora</p>
            </div>
          <button onClick={() => onOpenChange(false)} className="text-white">
            <X size={24} />
          </button>
        </header>
        
        {/* Chat Area */}
        <div className="bg-whatsapp-bg flex-1 overflow-y-auto p-4 flex flex-col">
            <div className="flex-1 space-y-3">
              {messages.map((message, index) => (
                <Fragment key={message.id}>
                    {index === 0 && (
                         <div className="text-center my-2">
                            <span className="bg-[#E1F2FB] text-gray-600 text-xs rounded-md px-2 py-1">HOJE</span>
                        </div>
                    )}
                    <div
                    className={cn(
                        'flex items-end gap-2 animate-slide-in',
                        message.from === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    >
                    {message.from === 'model' && (
                        <div className="w-6"></div>
                    )}
                    <div
                        className={cn(
                        'max-w-[80%] rounded-lg px-3 py-2 shadow-sm',
                        message.from === 'user'
                            ? 'bg-white'
                            : 'bg-whatsapp-message-out'
                        )}
                    >
                        <p className="text-sm text-gray-800">{message.text}</p>
                        {message.isCheckoutButton && (
                        <Button asChild size="sm" className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                            <Link href="/checkout">Garantir Acesso</Link>
                        </Button>
                        )}
                    </div>
                    </div>
                </Fragment>
              ))}
               {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-whatsapp-message-out rounded-lg px-4 py-3 shadow-sm animate-slide-in">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
                )}
              <div ref={messagesEndRef} />
            </div>

            {/* Response options */}
            {showOptions && (
                <div className="mt-4 space-y-2 animate-fade-in">
                    {initialOptions.map(option => (
                        <button key={option} onClick={() => handleOptionSelect(option)} className="w-full text-left bg-white rounded-full p-3 shadow-sm flex items-center hover:bg-gray-100 transition-colors">
                            <span className="flex-1 text-primary text-sm">{option}</span>
                            <Send size={16} className="text-primary/70 mr-2"/>
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        {/* Footer */}
        <footer className="bg-whatsapp-bg text-center py-2">
          <p className="text-xs text-gray-500">
            Conversa simulada para experiência — agendamentos reais são digitais.
          </p>
        </footer>
        <audio ref={audioRef} src="/notification.mp3" preload="auto"></audio>
      </DialogContent>
    </Dialog>
  );
}
