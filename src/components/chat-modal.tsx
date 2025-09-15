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
  checkoutLink?: string;
};

type ChatChoice = {
    texto: string;
    respostaUsuario: string;
    proxima: ({ modelo: string; delay: number; cta?: undefined; } | { modelo: string; cta: { texto: string; link: string; }; delay?: undefined; })[];
};

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
}

export default function ChatModal({ isOpen, onOpenChange, model }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ChatChoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatFlowHasStarted = useRef(false);

  const checkoutLink = "https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468";

  const getChatFlow = (modelName: string) => [
    {
      modelo: `Oi 😘 eu sou a ${modelName}, vi que você tá online agora...`,
      delay: 1500
    },
    {
      modelo: "Quer que eu te mostre uma prévia exclusiva só sua? 🔥",
      delay: 2000,
      escolhas: [
        {
          texto: "Sim, claro 😏",
          respostaUsuario: "Sim, claro 😏",
          proxima: [
            {
              modelo: "Adoro quem é direto assim 😈",
              delay: 1200
            },
            {
              modelo: `Dentro do Clube do Sexo eu libero fotos, vídeos íntimos e a gente pode conversar muito mais em privado comigo, ${modelName} 😏`,
              delay: 1500
            },
            {
              modelo: "Quer liberar seu acesso agora?",
              cta: {
                texto: "👉 Entrar no Clube Agora",
                link: checkoutLink
              }
            }
          ]
        },
        {
          texto: "Me conta mais",
          respostaUsuario: "Me conta mais",
          proxima: [
            {
              modelo: `É simples: no Clube você encontra fotos secretas, vídeos quentes e pode falar comigo, ${modelName}, em privado 😏`,
              delay: 1500
            },
            {
              modelo: "E eu tô online agora, esperando por você...",
              delay: 1200
            },
            {
              modelo: "Quer liberar seu acesso agora?",
              cta: {
                texto: "👉 Entrar no Clube Agora",
                link: checkoutLink
              }
            }
          ]
        },
        {
          texto: "Só fotos por enquanto",
          respostaUsuario: "Só fotos por enquanto",
          proxima: [
            {
              modelo: "Hmmm tímido 😌 adoro isso.",
              delay: 1200
            },
            {
              modelo: `Tenho um pack exclusivo só pros membros... nada de conteúdo solto por aí 👀 Quer ver o meu, ${modelName}?`,
              delay: 1500
            },
            {
              modelo: "Quer que eu te mostre agora?",
              cta: {
                texto: "👉 Ver prévia exclusiva",
                link: checkoutLink
              }
            }
          ]
        }
      ]
    }
  ];
  
  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: prev.length + 1 }]);
    if (message.from === 'model' && audioRef.current) {
        audioRef.current.play().catch(console.error);
    }
  }

  const runFlow = (flow: any[], currentDelay = 0) => {
      flow.forEach((step, index) => {
          const stepDelay = currentDelay + (step.delay || 0);
          setTimeout(() => {
              setIsTyping(true);
          }, stepDelay - 500);

          setTimeout(() => {
              setIsTyping(false);
              if (step.modelo) {
                addMessage({
                    from: 'model',
                    text: step.modelo,
                    isCheckoutButton: !!step.cta,
                    checkoutLink: step.cta?.link
                });
              }
              if (step.escolhas) {
                  setCurrentOptions(step.escolhas);
              }
          }, stepDelay);
      });
      return currentDelay + flow.reduce((acc, step) => acc + (step.delay || 0), 0);
  }

  useEffect(() => {
    if (isOpen && !chatFlowHasStarted.current) {
      chatFlowHasStarted.current = true;
      setMessages([]);
      setCurrentOptions([]);
      setIsTyping(true);
      const flow = getChatFlow(model.name);
      runFlow(flow);
    } else if (!isOpen) {
      chatFlowHasStarted.current = false; // Reset on close
    }
  }, [isOpen, model.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleOptionSelect = (option: ChatChoice) => {
    setCurrentOptions([]);
    addMessage({ from: 'user', text: option.respostaUsuario });
    setIsTyping(true);
    runFlow(option.proxima, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="whatsapp-modal p-0 gap-0">
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
                        {message.from === 'model' && (<div className="w-6"></div>)}
                        <div
                            className={cn(
                            'max-w-[80%] rounded-lg px-3 py-2 shadow-sm',
                            message.from === 'user'
                                ? 'bg-white'
                                : 'bg-whatsapp-message-out'
                            )}
                        >
                            <p className="text-sm text-gray-800" style={{whiteSpace: 'pre-wrap'}}>{message.text}</p>
                            {message.isCheckoutButton && message.checkoutLink && (
                            <Button asChild size="sm" className="mt-2 w-full bg-vibrant-red text-white font-bold hover:bg-red-500">
                                <Link href={message.checkoutLink}>Entrar no Clube Agora 🔥</Link>
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

            {currentOptions.length > 0 && (
                <div className="mt-4 space-y-2 animate-fade-in">
                    {currentOptions.map((option, index) => (
                        <button key={index} onClick={() => handleOptionSelect(option)} className="w-full text-left bg-white rounded-full p-3 shadow-sm flex items-center hover:bg-gray-100 transition-colors">
                            <span className="flex-1 text-primary text-sm">{option.texto}</span>
                            <Send size={16} className="text-primary/70 mr-2"/>
                        </button>
                    ))}
                </div>
            )}
        </div>
        
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
