'use client';

import { useState, useEffect, useRef } from 'react';
import { models, type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import FloatingBubble from './floating-bubble';

interface InteractivePopupProps {
  onOpenChat: (model: Model) => void;
}

export default function InteractivePopup({ onOpenChat }: InteractivePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Timer to show the popup after 60 seconds
  useEffect(() => {
    const mainPopupTimer = setTimeout(() => {
      if (!isClosed) {
        const randomModel = models[Math.floor(Math.random() * models.length)];
        setSelectedModel(randomModel);
        setIsVisible(true);
      }
    }, 60000); // 60 seconds

    return () => clearTimeout(mainPopupTimer);
  }, [isClosed]);

  // Timer to show the floating bubble after 90 seconds if popup was closed
  useEffect(() => {
    let bubbleTimer: NodeJS.Timeout;
    if (isClosed && !showBubble) {
      bubbleTimer = setTimeout(() => {
        setShowBubble(true);
      }, 90000); // 90 seconds
    }
    return () => clearTimeout(bubbleTimer);
  }, [isClosed, showBubble]);

  // Effect to play sound when popup becomes visible
  useEffect(() => {
    if (isVisible && !isMuted && audioRef.current) {
      audioRef.current.play().catch(error => console.log("Audio play failed:", error));
    }
  }, [isVisible, isMuted]);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
  };

  const handleOpenBubble = () => {
    setShowBubble(false);
    setIsVisible(true);
  };

  const handleLiberarChat = () => {
    if (selectedModel) {
      onOpenChat(selectedModel);
      setIsVisible(false);
      setIsClosed(true); // Prevents popup from reappearing
    }
  };

  const modelImage = selectedModel ? PlaceHolderImages.find(img => img.id === selectedModel.avatarImageId) : null;

  if (showBubble && selectedModel) {
    return <FloatingBubble model={selectedModel} onClick={handleOpenBubble} />;
  }

  if (!isVisible || !selectedModel) {
    return <audio ref={audioRef} src="/notification.mp3" preload="auto"></audio>;
  }

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3" preload="auto"></audio>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm rounded-lg bg-gradient-to-b from-[#B8001F] to-black text-white overflow-hidden shadow-2xl animate-bounce-in">
          <div className="p-8 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
              {modelImage && <AvatarImage src={modelImage.imageUrl} alt={selectedModel.name} data-ai-hint={modelImage.imageHint}/>}
              <AvatarFallback>{selectedModel.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold">
              {selectedModel.name} te cutucou
            </h2>
            
            <div className="flex items-center justify-center gap-2 mt-2">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-400">Online</span>
            </div>

            <p className="mt-4 text-white/80">
              Ela quer conversar com você e mandar uma prévia exclusiva agora.
            </p>

            <Button
              className="mt-6 w-full bg-[#E61E42] hover:bg-red-500 text-white font-bold text-lg py-6 rounded-md shadow-md"
              onClick={handleLiberarChat}
            >
              Liberar Chat
            </Button>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-3 left-3 text-white/50 hover:text-white transition-colors"
            aria-label="Silenciar"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}
