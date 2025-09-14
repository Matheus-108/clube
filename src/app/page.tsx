'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ModelCard from '@/components/model-card';
import ChatModal from '@/components/chat-modal';
import InteractivePopup from '@/components/interactive-popup';
import { Button } from '@/components/ui/button';
import { models, type Model } from '@/lib/models';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Users, Zap, Sparkles, MessageSquare, Circle } from 'lucide-react';
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
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isMounted, setIsMounted] = useState(false);
  
  // State for city search
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [shuffledModels, setShuffledModels] = useState<Model[]>([]);
  const [onlineGirlsCount, setOnlineGirlsCount] = useState(94);
  const [newModelsCount, setNewModelsCount] = useState(0);
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
  };

  const handleSearch = () => {
    if (!city) return;
    setIsLoading(true);
    setSearchPerformed(false);

    setTimeout(() => {
      setNewModelsCount(Math.floor(Math.random() * 3) + 1);
      setShuffledModels(shuffleArray([...models]).slice(0, 6));
      setIsLoading(false);
      setSearchPerformed(true);
    }, 2000);
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl font-body text-white">
              Club do sexo
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/80">
              Entre no Clube do Sexo — encontros, vídeos e chamadas privadas num só lugar.
            </p>
            <div className="mt-6 flex justify-center">
                <Image
                    src="https://i.imgur.com/mWeHZtH.png"
                    alt="Modelos do Clube"
                    width={400}
                    height={90}
                    className="object-contain"
                />
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex justify-center items-center gap-4 sm:gap-8 mb-8 text-sm sm:text-base">
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
          <Card className="max-w-2xl mx-auto bg-[#1a1a1a] border-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                type="text" 
                placeholder="Digite sua cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-grow"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="bg-[#FFB300] text-black hover:bg-amber-500 font-bold"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Search className="mr-2"/>
                )}
                Procurar garotas
              </Button>
            </div>
            {!searchPerformed && <GifPreview />}
          </Card>

          {/* Search Results Section */}
          {isLoading && (
            <div className="text-center mt-8 flex items-center justify-center gap-2 text-white/80">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Buscando modelos em {city}...</span>
            </div>
          )}

          {searchPerformed && (
            <div className="mt-12">
              <Card className="max-w-3xl mx-auto bg-transparent border-none text-center mb-8">
                  <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                      <MapPin className="text-primary"/>
                      Localização detectada: {city}
                  </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shuffledModels.map(model => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    onChatClick={handleOpenChat}
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
                  className="bg-[#FFB300] text-black hover:bg-amber-500 text-xl font-bold shadow-lg py-7 px-10"
                >
                  <Link href="/checkout">Ver modelos de {city} agora 🔥</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>

      <ChatModal
        isOpen={isChatModalOpen}
        onOpenChange={setChatModalOpen}
        model={selectedModel}
      />
      
      <InteractivePopup onOpenChat={handleOpenChat} />
    </>
  );
}
