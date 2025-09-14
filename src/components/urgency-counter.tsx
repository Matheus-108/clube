'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from './ui/badge';

export default function UrgencyCounter() {
  const [count, setCount] = useState(9);

  useEffect(() => {
    const min = 7;
    const max = 15;

    const timer = setInterval(() => {
      setCount(prevCount => {
        // Decide se vai aumentar ou diminuir
        const shouldIncrease = Math.random() > 0.5;
        let nextCount = prevCount + (shouldIncrease ? 1 : -1);

        // Garante que o número permaneça dentro dos limites
        if (nextCount > max) nextCount = max - 1;
        if (nextCount < min) nextCount = min + 1;

        return nextCount;
      });
    }, 4500); // Altera o número a cada 4.5 segundos

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-4 flex items-center gap-4">
        <Users className="h-6 w-6" />
        <div>
          <p className="font-bold text-lg leading-tight">{count} garotas online agora</p>
          <p className="text-xs text-primary-foreground/80">(simulação em tempo real)</p>
        </div>
        <Badge variant="destructive" className="ml-auto bg-accent text-accent-foreground animate-pulse">Online Agora</Badge>
      </CardContent>
    </Card>
  );
}
