'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from './ui/badge';

export default function UrgencyCounter() {
  const [count, setCount] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => (prevCount > 2 ? prevCount - 1 : 2));
    }, 8000); // Decrease every 8 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="p-4 flex items-center gap-4">
        <Users className="h-6 w-6" />
        <div>
          <p className="font-bold text-lg leading-tight">Apenas {count} acessos restantes hoje</p>
          <p className="text-xs text-primary-foreground/80">(contador simulado para urgência)</p>
        </div>
        <Badge variant="destructive" className="ml-auto bg-accent text-accent-foreground animate-pulse">Vagas limitadas</Badge>
      </CardContent>
    </Card>
  );
}
