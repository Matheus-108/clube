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

type Message = {
  id: number;
  from: 'model' | 'user';
  content: string | string[];
  type: 'text' | 'image-group';
};

type QuickReply = {
  text: string;
  nextStep: number;
};

type ChatStep = {
  modelMessages: {
    content: string | string[];
    type: 'text' | 'image-group';
    delay: number;
    typing: number;
  }[];
  replies?: QuickReply[];
  isFinalStep?: boolean;
};

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  model: Model;
}

const CHECKOUT_URL = "https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468";
const WHATSAPP_NUMBER = "5511999999999";

export default function ChatModal({ isOpen, onOpenChange, model }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chatFlowHasStarted = useRef(false);

  const getChatFlow = (modelName: string): ChatStep[] => [
    { // Step 0: Initial message
      modelMessages: [
        {
          content: `Oii amor, essas horas online? hahahahha eu sei o que você ta procurando 👀\n\nVou ser bem direta com você, tá bom?`,
          type: 'text',
          delay: 1200,
          typing: 2000,
        },
      ],
      replies: [
        { text: 'Sim, Continuar!', nextStep: 1 },
        { text: 'Me conte mais', nextStep: 1 },
      ],
    },
    { // Step 1: Group explanation
      modelMessages: [
        {
          content: `Meu amor, então você está aqui pois quer entrar no grupinho secreto das mulheres mais gostosas que moram por perto de você né? 😏`,
          type: 'text',
          delay: 1000,
          typing: 2000,
        },
      ],
      replies: [
        { text: 'Sim, quero!', nextStep: 2 },
        { text: 'Quero saber sobre esse grupo!', nextStep: 2 },
      ],
    },
    { // Step 2: Image preview offer
      modelMessages: [
        {
          content: `Delícia... vida já vou te falar sobre o grupinho mas antes, posso te mostrar o quem lá dentro?🙈🔥`,
          type: 'text',
          delay: 1000,
          typing: 1500,
        },
      ],
      replies: [
        { text: 'Sim, mostra!', nextStep: 3 },
        { text: 'Quero só fotos sua.', nextStep: 3 },
      ],
    },
    { // Step 3: Show images
        modelMessages: [
          {
            content: ["https://i.imgur.com/YQA5CkO.png", "https://i.imgur.com/5P2TlJs.png"],
            type: 'image-group',
            delay: 800,
            typing: 1500,
          },
        ],
        replies: [],
    },
    { // Step 4: After images
        modelMessages: [
        {
            content: `E ai amor, o que você achou? vai querer entrar? e sabe o melhor eu tô lá dentro e você pode conversar comigo direto no meu WhatsApp pessoal.`,
            type: 'text',
            delay: 1200,
            typing: 2000,
        },
        ],
        replies: [
            { text: 'Quero entrar no Clube.', nextStep: 5 },
        ],
    },
    { // Step 5: Final CTA
        modelMessages: [
        {
            content: `Adoro quem é direto assim 😈\n\nDentro do Clube do Sexo eu libero fotos, vídeos íntimos e a gente pode conversar muito mais em privado comigo 😏`,
            type: 'text',
            delay: 1000,
            typing: 1500,
        },
        ],
        isFinalStep: true,
    },
  ];
  
  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);
  const chatFlow = getChatFlow(model.name);

  const addMessage = useCallback((message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: prev.length }]);
    if (message.from === 'model' && !isMuted && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [isMuted]);

  const processStep = useCallback(async (stepIndex: number) => {
    const step = chatFlow[stepIndex];
    if (!step) return;

    for (const msg of step.modelMessages) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, msg.typing));
      setIsTyping(false);
      
      addMessage({
        from: 'model',
        content: msg.content,
        type: msg.type
      });

      await new Promise(resolve => setTimeout(resolve, msg.delay));
    }

    if (step.replies && step.replies.length > 0) {
      setQuickReplies(step.replies);
    } else if (!step.isFinalStep) {
        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < chatFlow.length) {
            setCurrentStep(nextStepIndex);
        }
    }
  }, [chatFlow, addMessage]);
  
  useEffect(() => {
    if (isOpen) {
      if (!chatFlowHasStarted.current) {
        chatFlowHasStarted.current = true;
        setMessages([]);
        setQuickReplies([]);
        setCurrentStep(0);
        processStep(0);
      }
    } else {
      chatFlowHasStarted.current = false;
    }
  }, [isOpen, processStep]);

  useEffect(() => {
    if (isOpen && currentStep > 0 && chatFlow[currentStep]) {
      processStep(currentStep);
    }
  }, [currentStep, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleQuickReply = (reply: QuickReply) => {
    addMessage({ from: 'user', content: reply.text, type: 'text' });
    setQuickReplies([]);
    setCurrentStep(reply.nextStep);
  };
  
  const handleOpenImage = (url: string) => {
    setSelectedImage(url);
    setImageModalOpen(true);
  }

  const renderMessageContent = (message: Message) => {
    if (message.type === 'image-group' && Array.isArray(message.content)) {
        return (
            <div className="flex flex-col gap-1">
            {message.content.map((url, index) => (
                <div key={index} className="relative cursor-pointer group" onClick={() => handleOpenImage(url)}>
                    <Image
                        src={url}
                        alt={`Preview image ${index + 1}`}
                        width={250}
                        height={250}
                        className="rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize className="text-white" size={32} />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {index + 1} de {message.content.length}
                    </div>
                </div>
            ))}
            </div>
        );
    }
    return <p className="text-sm text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>;
  }

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
                  <div className={cn('flex items-end gap-2 animate-slide-in', message.from === 'user' ? 'justify-end' : 'justify-start')}>
                    {message.from === 'model' && <div className="w-6"></div>}
                    <div className={cn(
                      'max-w-[85%] rounded-lg px-3 py-2 shadow-sm',
                      message.from === 'user' ? 'bg-white' : 'bg-whatsapp-message-out'
                    )}>
                      {renderMessageContent(message)}
                       {message.id === messages.length - 1 && currentStep === 4 && (
                            <p className="text-xs text-gray-500 mt-2">
                                Contato via WhatsApp é para conversas digitais. Não garantimos ou oferecemos encontros presenciais.
                            </p>
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
            
            {chatFlow[currentStep]?.isFinalStep && (
                <div className="mt-4 space-y-2 animate-fade-in">
                    <Button asChild className="w-full h-12 bg-whatsapp-green-light text-black font-bold hover:bg-whatsapp-green-light/90">
                        <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer">Acessar Clube Agora</a>
                    </Button>
                </div>
            )}


            {quickReplies.length > 0 && !isTyping && (
              <div className="mt-4 space-y-2 animate-fade-in">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
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
        </DialogContent>
      </Dialog>
      
      {isImageModalOpen && selectedImage && (
        <Dialog open={isImageModalOpen} onOpenChange={setImageModalOpen}>
            <DialogContent className="image-modal-content p-0 m-0 bg-transparent border-none w-auto h-auto max-w-[90vw] max-h-[90vh]">
                <Image src={selectedImage} alt="Preview" layout="responsive" width={800} height={800} className="rounded-lg object-contain" />
                 <button onClick={() => setImageModalOpen(false)} className="absolute -top-2 -right-2 text-white bg-black/50 rounded-full p-1">
                    <X size={20} />
                </button>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
