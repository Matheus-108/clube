'use client';

import { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { X, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import PaymentPopup from './payment-popup';

type Message = {
  id: number;
  from: 'model' | 'user';
  content: string;
  type: 'text' | 'cta';
  ctaLink?: string;
  ctaText?: string;
};

type QuickReply = {
  text: string;
  response: string;
  next: any[];
};

type ChatStep = {
  model: string;
  delay: number;
  choices?: QuickReply[];
  cta?: {
    text: string;
    link: string;
  };
};

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
}

const CHECKOUT_URL = "https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468";

export default function ChatModal({ isOpen, onOpenChange, model }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaymentPopupOpen, setPaymentPopupOpen] = useState(false);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatFlowHasStarted = useRef(false);

  const getChatFlow = (modelName: string): ChatStep[] => [
    {
      model: `Oi 😘 eu sou a ${modelName}, vi que você tá online agora...`,
      delay: 1500
    },
    {
      model: "Quer que eu te mostre uma prévia exclusiva só sua? 🔥",
      choices: [
        {
          text: "Sim, claro 😏",
          response: "Sim, claro 😏",
          next: [
            {
              model: "Adoro quem é direto assim 😈",
              delay: 1200
            },
            {
              model: `Dentro do Clube do Sexo eu libero fotos, vídeos íntimos e a gente pode conversar muito mais em privado comigo, ${modelName} 😏`,
              delay: 1500
            },
            {
              model: "Quer liberar seu acesso agora?",
              cta: {
                text: "👉 Entrar no Clube Agora",
                link: CHECKOUT_URL
              }
            }
          ]
        },
        {
          text: "Me conta mais",
          response: "Me conta mais",
          next: [
            {
              model: `É simples: no Clube você encontra fotos secretas, vídeos quentes e pode falar comigo, ${modelName}, em privado 😏`,
              delay: 1500
            },
            {
              model: "E eu tô online agora, esperando por você...",
              delay: 1200
            },
            {
              model: "Quer liberar seu acesso agora?",
              cta: {
                text: "👉 Entrar no Clube Agora",
                link: CHECKOUT_URL
              }
            }
          ]
        },
        {
          text: "Só fotos por enquanto",
          response: "Só fotos por enquanto",
          next: [
            {
              model: "Hmmm tímido 😌 adoro isso.",
              delay: 1200
            },
            {
              model: `Tenho um pack exclusivo só pros membros... nada de conteúdo solto por aí 👀 Quer ver o meu, ${modelName}?`,
              delay: 1500
            },
            {
              model: "Quer que eu te mostre agora?",
              cta: {
                text: "👉 Ver prévia exclusiva",
                link: CHECKOUT_URL
              }
            }
          ]
        }
      ]
    }
  ];

  const chatFlow = getChatFlow(model.name);
  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: prev.length }]);
    if (message.from === 'model' && !isMuted && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [isMuted]);

  const sendModelMessages = useCallback(async (steps: ChatStep[]) => {
    for (const step of steps) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, step.delay || 1000));
      setIsTyping(false);

      if (step.model) {
        addMessage({
          from: 'model',
          content: step.model,
          type: step.cta ? 'cta' : 'text',
          ctaText: step.cta?.text,
          ctaLink: step.cta?.link,
        });
      }

      if (step.choices) {
        setQuickReplies(step.choices);
      }
    }
  }, [addMessage]);

  const startChat = useCallback(() => {
    chatFlowHasStarted.current = true;
    setMessages([]);
    setQuickReplies([]);
    sendModelMessages(chatFlow);
  }, [sendModelMessages, chatFlow]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      if (!chatFlowHasStarted.current) {
        startChat();
      }
      timer = setTimeout(() => {
        setPaymentPopupOpen(true);
      }, 5000); // 5 seconds
    } else {
        chatFlowHasStarted.current = false;
        setPaymentPopupOpen(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen, startChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOptionSelect = (option: QuickReply) => {
    addMessage({ from: 'user', content: option.response, type: 'text' });
    setQuickReplies([]);
    sendModelMessages(option.next);
  };

  const handleCheckoutClick = (link: string) => {
    window.location.href = link;
  };
  

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="whatsapp-modal p-0 gap-0">
          <header className="bg-whatsapp-green-dark p-3 flex items-center gap-3 shadow-md z-10">
            <Avatar>
              {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint} />}
              <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-white">{model.name}</p>
              <p className="text-xs text-whatsapp-green-light">online</p>
            </div>
             <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
            <button onClick={() => onOpenChange(false)} className="text-white/80 hover:text-white transition-colors">
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
                            <p className="text-sm text-gray-800" style={{whiteSpace: 'pre-wrap'}}>{message.content}</p>
                            {message.type === 'cta' && message.ctaLink && (
                              <Button 
                                  onClick={() => handleCheckoutClick(message.ctaLink!)}
                                  size="sm" 
                                  className="mt-2 w-full bg-vibrant-red text-white font-bold hover:bg-red-500">
                                  {message.ctaText || 'Acessar'}
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
            
            {quickReplies.length > 0 && !isTyping && (
              <div className="mt-4 space-y-2 animate-fade-in">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(reply)}
                    className="w-full text-left bg-white rounded-full p-3 shadow-sm flex items-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex-1 text-primary text-sm font-medium text-center">{reply.text}</span>
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
          <audio ref={audioRef} src="/notification.mp3" preload="auto" />
          <PaymentPopup 
            isOpen={isPaymentPopupOpen} 
            onClose={() => setPaymentPopupOpen(false)} 
            modelName={model.name} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
