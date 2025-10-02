
'use client';

import { useState, useEffect, ReactElement } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  completedIcon: ReactElement;
};

const loadingSteps: LoadingStep[] = [
  { text: (city) => `Buscando localização em ${city}...`, icon: <MapPin className="text-blue-400" />, completedIcon: <CheckCircle className="text-green-500" /> },
  { text: () => "Encontrando modelos disponíveis...", icon: <Users className="text-rose-400" />, completedIcon: <CheckCircle className="text-green-500" /> },
  { text: () => "Verificando quem está online agora...", icon: <Sparkles className="text-orange-400" />, completedIcon: <CheckCircle className="text-green-500" /> },
  { text: () => "Filtrando os melhores perfis...", icon: <Gem className="text-amber-400" />, completedIcon: <CheckCircle className="text-green-500" /> },
  { text: () => "Resultados prontos!", icon: <CheckCircle className="text-green-500" />, completedIcon: <CheckCircle className="text-green-500" /> },
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

      const stepTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          clearInterval(stepTimer);
          return prev;
        });
      }, stepInterval);
      
      const progressTimer = setInterval(() => {
        setProgress(prev => Math.min(prev + (100 / (totalDuration / 100)), 100));
      }, 100);

      return () => {
        clearInterval(stepTimer);
        clearInterval(progressTimer);
      };
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-gradient-to-b from-black to-[#1c1c1c] text-white border-white/10 shadow-2xl rounded-2xl w-[90vw] max-w-md p-8 flex flex-col items-center justify-center gap-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Buscando modelos</DialogTitle>
          <DialogDescription>Aguarde enquanto buscamos os melhores perfis para você em {city}.</DialogDescription>
        </DialogHeader>
        <Loader2 className="w-12 h-12 text-vibrant-red animate-spin" />
        
        <div className="text-center space-y-4 w-full">
            {loadingSteps.map((step, index) => {
                 const isCompleted = index < currentStep;
                 const isCurrent = index === currentStep;

                 return (
                    <div
                        key={index}
                        className={cn(
                            'flex items-center gap-4 transition-all duration-300',
                            isCurrent ? 'opacity-100' : 'opacity-50',
                            isCompleted && 'opacity-100'
                        )}
                    >
                        <div className={cn("w-6 h-6 flex items-center justify-center", isCurrent && "animate-pulse")}>
                            {isCompleted ? step.completedIcon : step.icon}
                        </div>
                        <span className={cn(
                            "text-base text-gray-300",
                            isCurrent && "text-white font-semibold",
                            isCompleted && "text-green-400"
                        )}>{step.text(city)}</span>
                    </div>
                 )
            })}
        </div>

        <Progress value={progress} className="w-full h-3 bg-gray-800 rounded-full overflow-hidden animated-progress-bar" />
        
        <p className="text-center text-gray-500 text-xs mt-2">Simulação em tempo real — 18+ apenas.</p>
      </DialogContent>
    </Dialog>
  );
}
