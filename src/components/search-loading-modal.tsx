
'use client';

import { useState, useEffect, ReactElement } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { MapPin, Users, Sparkles, Gem, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchLoadingModalProps {
  isOpen: boolean;
  city: string;
}

type LoadingStep = {
  text: (city: string) => string;
  icon: ReactElement;
};

const loadingSteps: LoadingStep[] = [
  { text: (city) => `Buscando localização em ${city}...`, icon: <MapPin className="text-blue-400" /> },
  { text: () => "Encontrando modelos disponíveis na região...", icon: <Users className="text-purple-400" /> },
  { text: () => "Verificando quem está online agora...", icon: <Sparkles className="text-yellow-400" /> },
  { text: () => "Encontrando melhores preços e vantagens exclusivas...", icon: <Gem className="text-vibrant-red" /> },
  { text: () => "Resultados prontos! Carregando sua lista de modelos...", icon: <CheckCircle className="text-green-500" /> },
];

const totalDuration = 5000; // 5 seconds
const stepInterval = totalDuration / loadingSteps.length;

export default function SearchLoadingModal({ isOpen, city }: SearchLoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setProgress(0);

      // Interval for updating steps
      const stepTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepTimer);
          return prev;
        });
      }, stepInterval);
      
      // Interval for updating progress bar
      const progressTimer = setInterval(() => {
        setProgress(prev => Math.min(prev + (100 / (totalDuration / 100)), 100));
      }, 100);

      return () => {
        clearInterval(stepTimer);
        clearInterval(progressTimer);
      };
    }
  }, [isOpen]);
  
  // onOpenChange is not used, so the Dialog doesn't close on overlay click
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-[#1C1C1C] text-white border-white/20 shadow-2xl rounded-lg w-[90vw] max-w-md p-8 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        
        <div className="text-center space-y-4 w-full">
            {loadingSteps.map((step, index) => (
                 <div
                    key={index}
                    className={cn(
                        'flex items-center gap-3 transition-opacity duration-500',
                        currentStep >= index ? 'opacity-100' : 'opacity-30'
                    )}
                 >
                    {step.icon}
                    <span className="text-base">{step.text(city)}</span>
                </div>
            ))}
        </div>

        <Progress value={progress} className="w-full h-2 bg-gray-600" />

      </DialogContent>
    </Dialog>
  );
}
