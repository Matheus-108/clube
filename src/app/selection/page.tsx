'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SimulatedLocation from '@/components/simulated-location';
import UrgencyCounter from '@/components/urgency-counter';
import ModelCard from '@/components/model-card';
import ChatModal from '@/components/chat-modal';
import InteractivePopup from '@/components/interactive-popup';
import { Button } from '@/components/ui/button';
import { models, type Model } from '@/lib/models';
import Link from 'next/link';

export default function SelectionPage() {
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isMounted, setIsMounted] = useState(false);
  const [city, setCity] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenChat = (model: Model) => {
    setSelectedModel(model);
    setChatModalOpen(true);
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline text-primary">
              Entre no Clube do Sexo Digital — fotos, vídeos e chamadas privadas num só lugar.
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <SimulatedLocation onCityChange={setCity} />
            <UrgencyCounter />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map(model => (
              <ModelCard
                key={model.id}
                model={model}
                onChatClick={handleOpenChat}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-bold shadow-lg"
            >
              <Link href="/checkout">Acessar Pacote Completo - R$49</Link>
            </Button>
          </div>
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
