'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from './ui/badge';

export default function UrgencyCounter() {
  const [count, setCount] = useState(9);

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
          <p className="font-bold text-lg leading-tight">{count} garotas online agora</p>
          <p className="text-xs text-primary-foreground/80">(simulação em tempo real)</p>
        </div>
        <Badge variant="destructive" className="ml-auto bg-accent text-accent-foreground animate-pulse">Online Agora</Badge>
      </CardContent>
    </Card>
  );
}
