'use client';

import { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { X, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import PaymentPopup from './payment-popup';
import Image from 'next/image';

type Message = {
  id: number;
  from: 'model' | 'user';
  content: string;
  type: 'text' | 'cta' | 'image';
  ctaLink?: string;
  ctaText?: string;
  imageUrl?: string;
  imageHint?: string;
};

type QuickReply = {
  text: string;
  response: string;
  next: ChatStep[];
};

type ActionButton = {
    text: string;
    action: 'scrollToCheckout';
}

type ChatStep = {
  model?: string;
  delay: number;
  choices?: QuickReply[];
  actionButton?: ActionButton;
  image?: {
      id: string;
  }
};

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
  onScrollToCheckout: () => void;
}

export default function ChatModal({ isOpen, onOpenChange, model, onScrollToCheckout }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [actionButton, setActionButton] = useState<ActionButton | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPaymentPopupOpen, setPaymentPopupOpen] = useState(false);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatFlowHasStarted = useRef(false);
  
  const conversationContinuation = (modelName: string): ChatStep[] => [
    {
        model: `Vou te explicar como funciona o CLUBE, é novidade tá, chegou agora na sua cidade, É simples: no Clube você encontra fotos secretas, vídeos quentes e pode falar comigo, ${modelName}, em privado, podemos até marcar um presencial rs 😏`,
        delay: 3000
    },
    {
        model: "E eu tô online agora, esperando por você, olha só como já to...",
        delay: 2500
    },
    {
        image: { id: "chat-gif-1" },
        delay: 2000,
    },
    {
        model: "Agora me diz se vale a pena conhecer nosso CLUBE hahahah olha o que o pessoal la dentro ta marcando já 😏",
        delay: 3000,
    },
    {
        image: { id: "chat-img-1" },
        delay: 1500,
    },
    {
        image: { id: "chat-img-2" },
        delay: 2000,
    },
    {
        model: "E amor, assim que as meninas te adicionarem no grupinho, eu vou te chamar pessoalmente no privado pra te mandar um presentinho de Boas-Vindas🤭🔥 Já to molhada aqui",
        delay: 3500,
    },
    {
        image: { id: "chat-img-3" },
        delay: 2000,
    },
    {
        model: "Quer liberar seu acesso agora?",
        delay: 1500,
    },
    {
        delay: 500,
        actionButton: {
            text: "Entrar no CLUBE",
            action: 'scrollToCheckout',
        }
    }
  ];

  const getChatFlow = (modelName: string): ChatStep[] => [
    {
      model: `Oi amor 😘 eu sou a ${modelName}, acabei de entrar e vou ficar online até daqui a pouco...`,
      delay: 2000
    },
    {
      model: "E eu sei porque esta aqui 🔥 posso te enviar uma previa minha?",
      delay: 2500,
      choices: [
        {
          text: "Sim, claro 😏",
          response: "Sim, claro 😏",
          next: conversationContinuation(modelName)
        },
        {
          text: "Me conta mais",
          response: "Me conta mais",
          next: conversationContinuation(modelName)
        },
        {
          text: "Só fotos por enquanto",
          response: "Só fotos por enquanto",
          next: conversationContinuation(modelName)
        }
      ]
    }
  ];

  const chatFlow = getChatFlow(model.name);
  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: prev.length }]);
    if (message.from === 'model' && message.type === 'text' && !isMuted && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [isMuted]);

  const sendModelMessages = useCallback(async (steps: ChatStep[]) => {
    for (const step of steps) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, (step.delay || 1000) / 2)); // Typing time
      setIsTyping(false);
      await new Promise(resolve => setTimeout(resolve, (step.delay || 1000) / 2)); // Pause after typing

      if (step.model) {
        addMessage({
          from: 'model',
          content: step.model,
          type: 'text',
        });
      }
      
      if (step.image) {
          const imgData = PlaceHolderImages.find(p => p.id === step.image!.id);
          if (imgData) {
            addMessage({
                from: 'model',
                content: '',
                type: 'image',
                imageUrl: imgData.imageUrl,
                imageHint: imgData.imageHint,
            })
          }
      }

      if (step.choices) {
        setQuickReplies(step.choices);
        setActionButton(null);
      }
      
      if (step.actionButton) {
          setActionButton(step.actionButton);
          setQuickReplies([]);
      }
    }
  }, [addMessage]);

  const startChat = useCallback(() => {
    chatFlowHasStarted.current = true;
    setMessages([]);
    setQuickReplies([]);
    setActionButton(null);
    sendModelMessages(chatFlow);
  }, [sendModelMessages, chatFlow]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      if (!chatFlowHasStarted.current) {
        startChat();
      }
      timer = setTimeout(() => {
        if (isOpen) { // Check if modal is still open
            setPaymentPopupOpen(true);
        }
      }, 30000);
    } else {
        chatFlowHasStarted.current = false;
        setPaymentPopupOpen(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen, startChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, actionButton]);

  const handleOptionSelect = (option: QuickReply) => {
    addMessage({ from: 'user', content: option.response, type: 'text' });
    setQuickReplies([]);
    setActionButton(null);
    sendModelMessages(option.next);
  };

  const handleActionClick = () => {
      if (actionButton?.action === 'scrollToCheckout') {
          onOpenChange(false); // Close modal
          onScrollToCheckout(); // Scroll to checkout section
      }
  };
  

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="whatsapp-modal p-0 gap-0">
          <DialogHeader className="p-3 flex flex-row items-center gap-3 shadow-md z-10 bg-[#005E54]">
             <Avatar>
              {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint} />}
              <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="font-bold text-white text-base">{model.name}</DialogTitle>
              <DialogDescription className="text-xs text-[#77b783]">online</DialogDescription>
            </div>
             <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
             </button>
            <button onClick={() => onOpenChange(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </DialogHeader>

          <div className="bg-[#E5DDD5] dark:bg-[#0b141a] flex-1 overflow-y-auto p-4 flex flex-col" style={{ backgroundImage: `url('/bg-chat-tile-light.png')`, backgroundRepeat: 'repeat' }}>
            <div className="flex-1 space-y-3">
              {messages.map((message, index) => (
                <Fragment key={message.id}>
                    {index === 0 && (
                         <div className="text-center my-2">
                            <span className="bg-[#E1F3FB] dark:bg-[#1a2c38] text-gray-600 dark:text-gray-300 text-xs rounded-md px-2 py-1 shadow-sm">HOJE</span>
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
                            'max-w-[80%] rounded-lg shadow-sm',
                             message.type !== 'image' && 'px-3 py-2',
                            message.from === 'user'
                                ? 'bg-white dark:bg-[#005C4B]'
                                : 'bg-[#DCF8C6] dark:bg-[#202c33]'
                            )}
                        >
                            {message.type === 'text' && <p className="text-sm text-gray-800 dark:text-gray-100" style={{whiteSpace: 'pre-wrap'}}>{message.content}</p>}
                            
                            {message.type === 'image' && message.imageUrl && (
                                 <button onClick={() => setSelectedImage(message.imageUrl!)} className="relative w-64 h-auto aspect-square rounded-lg overflow-hidden cursor-pointer">
                                     <Image src={message.imageUrl} alt={message.imageHint || "Imagem do chat"} fill className="object-cover" unoptimized={message.imageUrl.endsWith('.gif')} />
                                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                          <Maximize className="text-white" />
                                      </div>
                                 </button>
                            )}

                        </div>
                    </div>
                </Fragment>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#DCF8C6] dark:bg-[#202c33] rounded-lg px-4 py-3 shadow-sm animate-slide-in">
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
            
            {!isTyping && (
              <div className="mt-4 space-y-2 animate-fade-in">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(reply)}
                    className="w-full text-left bg-white dark:bg-gray-700 rounded-full p-3 shadow-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="flex-1 text-blue-500 dark:text-blue-400 text-sm font-medium text-center">{reply.text}</span>
                  </button>
                ))}
                {actionButton && (
                    <Button
                        onClick={handleActionClick}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-full p-3 shadow-lg"
                    >
                        {actionButton.text}
                    </Button>
                )}
              </div>
            )}
          </div>

          <audio ref={audioRef} src="/notification.mp3" preload="auto" />
          {isPaymentPopupOpen && <PaymentPopup 
            isOpen={isPaymentPopupOpen} 
            onClose={() => setPaymentPopupOpen(false)} 
            model={model} 
          />}
        </DialogContent>
      </Dialog>
      
      {/* Image viewer modal */}
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="image-modal-content p-0 border-0 bg-transparent shadow-none max-w-2xl">
            <DialogHeader className='sr-only'>
              <DialogTitle>Visualização de Imagem</DialogTitle>
              <DialogDescription>Imagem do chat em tela cheia.</DialogDescription>
            </DialogHeader>
            {selectedImage && (
                <div className="relative w-full h-auto">
                    <Image src={selectedImage} alt="Visualização de imagem" width={800} height={800} className="rounded-lg object-contain" unoptimized={selectedImage.endsWith('.gif')} />
                </div>
            )}
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1">
                <X size={24} />
            </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
