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

const initialOptions = [
    { key: 'see', text: 'Sim, quero ver 👀' },
    { key: 'more-info', text: 'Me conta mais' },
    { key: 'only-photos', text: 'Só fotos por enquanto' },
];


export default function ChatModal({ isOpen, onOpenChange, model }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedChat = useRef(false);

  const modelImage = PlaceHolderImages.find(img => img.id === model.avatarImageId);

  // Function to add a message and play sound
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    if (message.from === 'model' && audioRef.current) {
        audioRef.current.play().catch(console.error);
    }
  }

  // Function to chain model messages with typing delay
  const sendModelMessages = (messageList: { text: string, isCheckoutButton?: boolean }[]) => {
    setIsTyping(true);
    let delay = 2500;
    
    messageList.forEach((msg, index) => {
        setTimeout(() => {
            setIsTyping(index < messageList.length - 1);
            addMessage({ id: Date.now() + index, from: 'model', text: msg.text, isCheckoutButton: msg.isCheckoutButton });
        }, (index + 1) * delay);
    });
  }

  useEffect(() => {
    if (isOpen && !hasStartedChat.current) {
        hasStartedChat.current = true;
        setMessages([]);
        setShowOptions(false);
        setIsTyping(true);

        const initialSequence = () => {
            setTimeout(() => {
                setIsTyping(false);
                addMessage({ id: 1, from: 'model', text: `Oi 😘 sou a ${model.name}. Vi que você tá por aqui agora…` });
            }, 1500);

            setTimeout(() => {
                setIsTyping(true);
            }, 2500);
            
            setTimeout(() => {
                setIsTyping(false);
                addMessage({ id: 2, from: 'model', text: 'Quer uma prévia só sua? 🔥' });
                setShowOptions(true);
            }, 5500);
        };

        initialSequence();

    } else if (!isOpen) {
      hasStartedChat.current = false;
      setMessages([]);
      setShowOptions(false);
      setIsTyping(false);
    }
  }, [isOpen, model.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleOptionSelect = (option: {key: string; text: string}) => {
    setShowOptions(false);
    addMessage({ id: Date.now(), from: 'user', text: option.text });

    let responseMessages: { text: string, isCheckoutButton?: boolean }[] = [];

    switch(option.key) {
        case 'see':
            responseMessages = [
                { text: 'Adoro quando alguém direto assim aparece 😏.' },
                { text: 'Tenho fotos e vídeos exclusivos, e tô disponível no Clube do Sexo pra conversar mais em privado agora mesmo.'},
                { text: 'Quer entrar?', isCheckoutButton: true }
            ];
            break;
        case 'more-info':
            responseMessages = [
                { text: 'É simples: no Clube você tem acesso a fotos + vídeos + pode conversar comigo em privado quando quiser 🔥.' },
                { text: 'Só membros entram… e eu tô online agora 👄.' },
                { text: 'Quer liberar seu acesso?', isCheckoutButton: true }
            ];
            break;
        case 'only-photos':
            responseMessages = [
                { text: 'Hmmm… tímido 😌 gosto disso.' },
                { text: 'Eu tenho um pack exclusivo que só libero dentro do Clube. Nada de conteúdo solto por aí.' },
                { text: 'Quer ver essa prévia exclusiva?', isCheckoutButton: true }
            ];
            break;
    }
    
    sendModelMessages(responseMessages);
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
                        <p className="text-sm text-gray-800" style={{whiteSpace: 'pre-wrap'}}>{message.text}</p>
                        {message.isCheckoutButton && (
                        <Button asChild size="sm" className="mt-2 w-full bg-vibrant-red text-white font-bold hover:bg-red-500">
                            <Link href="https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468">Entrar no Clube Agora 🔥</Link>
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
                        <button key={option.key} onClick={() => handleOptionSelect(option)} className="w-full text-left bg-white rounded-full p-3 shadow-sm flex items-center hover:bg-gray-100 transition-colors">
                            <span className="flex-1 text-primary text-sm">{option.text}</span>
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
