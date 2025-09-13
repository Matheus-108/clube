'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import SimulatedLocation from '@/components/simulated-location';
import UrgencyCounter from '@/components/urgency-counter';
import ModelCard from '@/components/model-card';
import ChatModal from '@/components/chat-modal';
import SampleModal from '@/components/sample-modal';
import { Button } from '@/components/ui/button';
import { models, type Model } from '@/lib/models';
import Link from 'next/link';

export default function SelectionPage() {
  const [isChatModalOpen, setChatModalOpen] = useState(false);
  const [isSampleModalOpen, setSampleModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      if (!isChatModalOpen && !isSampleModalOpen) {
        const randomModel = models[Math.floor(Math.random() * models.length)];
        handleChatClick(randomModel);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [isChatModalOpen, isSampleModalOpen]);

  const handleChatClick = (model: Model) => {
    setSelectedModel(model);
    setChatModalOpen(true);
  };

  const handleSampleClick = (model: Model) => {
    setSelectedModel(model);
    setSampleModalOpen(true);
  }

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <SimulatedLocation />
            <UrgencyCounter />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map(model => (
              <ModelCard 
                key={model.id} 
                model={model} 
                onChatClick={handleChatClick}
                onSampleClick={handleSampleClick}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-bold shadow-lg">
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
      
      <SampleModal
        isOpen={isSampleModalOpen}
        onOpenChange={setSampleModalOpen}
      />
    </>
  );
}
