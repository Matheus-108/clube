'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ModelCard from '@/components/model-card';
import ChatModal from '@/components/chat-modal';
import SampleModal from '@/components/sample-modal';
import InteractivePopup from '@/components/interactive-popup';
import SearchLoadingModal from '@/components/search-loading-modal';
import { Button } from '@/components/ui/button';
import { models, type Model } from '@/lib/models';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Users, Zap, Sparkles, MessageSquare, Circle, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import GifPreview from '@/components/gif-preview';
import Image from 'next/image';

const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function Home() {
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isSampleModalOpen, setSampleModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // State for city search
  const [city, setCity] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [shuffledModels, setShuffledModels] = useState<Model[]>([]);
  const [newModelsCount, setNewModelsCount] = useState(0);
  const [onlineGirlsCount, setOnlineGirlsCount] = useState(94);
  const [newTodayCount, setNewTodayCount] = useState(12);

  useEffect(() => {
    setIsMounted(true);
    // Initial random values
    setOnlineGirlsCount(Math.floor(Math.random() * (100 - 80 + 1)) + 80);
    setNewTodayCount(Math.floor(Math.random() * (15 - 5 + 1)) + 5);

    const onlineInterval = setInterval(() => {
        setOnlineGirlsCount(prev => {
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newCount = prev + change;
            return Math.max(80, Math.min(100, newCount)); // Keep between 80 and 100
        });
    }, 3000);

    const newTodayInterval = setInterval(() => {
        setNewTodayCount(prev => {
            const change = Math.random() > 0.8 ? 1 : 0; // Occasionally increase
            return prev + change;
        });
    }, 10000);
    
    return () => {
        clearInterval(onlineInterval);
        clearInterval(newTodayInterval);
    }
  }, []);

  const handleOpenChat = (model: Model) => {
    setSelectedModel(model);
    setChatModalOpen(true);
    setSampleModalOpen(false);
  };
  
  const handleOpenSample = (model: Model) => {
    setSelectedModel(model);
    setSampleModalOpen(true);
  }

  const handleSearch = () => {
    if (!city || isSearchLoading) return;
    setIsSearchLoading(true);
    setSearchPerformed(false);

    // Total duration for the loading modal
    const totalLoadingTime = 5000; // 5 seconds for all steps

    setTimeout(() => {
      setNewModelsCount(Math.floor(Math.random() * 3) + 1);
      setShuffledModels(shuffleArray([...models]).slice(0, 11));
      setIsSearchLoading(false);
      setSearchPerformed(true);
    }, totalLoadingTime);
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 pt-8 pb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl font-body text-white">
              Clube do Sexo
            </h1>
            <p className="mt-1 text-lg md:text-xl max-w-2xl mx-auto text-white/80">
              Entre no Clube do Sexo — encontros, vídeos e chamadas privadas num só lugar.
            </p>
          </div>

          {/* Stats Section */}
          <div className="flex justify-center items-center flex-wrap gap-x-8 gap-y-2 sm:gap-x-12 my-8 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 text-green-500 fill-green-500" />
                    <span className="font-bold text-green-400">{onlineGirlsCount} Garotas Online</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-purple-400">{newTodayCount} Novas Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-400" />
                    <span className="font-bold text-green-400">100% Interações Reais</span>
                </div>
            </div>


          {/* City Search Section */}
          <Card className="max-w-md mx-auto bg-transparent border-none p-0">
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input 
                  type="text" 
                  placeholder="Digite sua cidade para procurar garotas"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-[#1C1C1C] border-none text-white placeholder:text-gray-500 w-full h-14 pl-12 pr-4 rounded-full text-base"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearchLoading}
                className="w-full h-[50px] bg-vibrant-red text-white hover-gradient font-bold rounded-full text-base shadow-lg"
              >
                {isSearchLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Flame className="mr-2"/>
                    Procurar garotas
                  </>
                )}
              </Button>
            </div>
             <p className="text-center text-gray-400 text-xs mt-3">Simulação em tempo real — 18+ apenas.</p>
             <GifPreview />
          </Card>

          {/* Search Results Section */}
          {searchPerformed && !isSearchLoading && (
            <div className="mt-12">
              <Card className="max-w-3xl mx-auto bg-transparent border-none text-center mb-6">
                  <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                      <MapPin className="text-vibrant-red"/>
                      Localização detectada: {city}
                  </div>
              </Card>

              <p className="text-center text-lg md:text-xl max-w-2xl mx-auto text-white/90 mb-10 leading-relaxed">
                  Descobrimos quem está disponível em <span className="font-bold text-vibrant-red">{city}</span> neste momento.
                  <br />
                  No Clube do Sexo você pode espiar fotos secretas, desbloquear vídeos íntimos e marcar encontros sigilosos… tudo em um só lugar.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shuffledModels.map(model => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onChatClick={handleOpenChat}
                    onSampleClick={handleOpenSample}
                  />
                ))}
              </div>

              <Card className="max-w-lg mx-auto mt-12 bg-red-900/20 border-red-500/30 text-center p-4 rounded-lg">
                  <p className="font-semibold text-white">
                      <Zap className="inline text-yellow-400 animate-pulse h-5 w-5 mr-1" />
                      {newModelsCount} nova{newModelsCount > 1 ? 's' : ''} {newModelsCount > 1 ? 'modelos' : 'modelo'} entraram nos últimos minutos em {city}
                  </p>
              </Card>

              <div className="text-center mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl font-bold shadow-lg py-7 px-10"
                >
                  <Link href="https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468">Ver modelos de {city} agora 🔥</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
        
      {selectedModel && (
        <ChatModal
          isOpen={isChatModalOpen}
          onOpenChange={setChatModalOpen}
          model={selectedModel}
        />
      )}
      
      {selectedModel && (
        <SampleModal
          isOpen={isSampleModalOpen}
          onOpenChange={setSampleModalOpen}
          model={selectedModel}
          city={city}
          onStartChat={handleOpenChat}
        />
      )}

      <SearchLoadingModal isOpen={isSearchLoading} city={city} />

      <InteractivePopup onOpenChat={handleOpenChat} />
    </>
  );
}
