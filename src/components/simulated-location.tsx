'use client';

import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface SimulatedLocationProps {
  onCityChange: (city: string) => void;
}

export default function SimulatedLocation({ onCityChange }: SimulatedLocationProps) {
  const [city, setCity] = useState('Carregando...');

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const detectedCity = data.city || 'São Paulo';
        setCity(detectedCity);
        onCityChange(detectedCity);
      })
      .catch(() => {
        const fallbackCity = 'São Paulo';
        setCity(fallbackCity);
        onCityChange(fallbackCity);
      });
  }, [onCityChange]);

  return (
    <Card className="border-dashed">
      <CardContent className="p-4 flex items-center gap-3">
        <MapPin className="h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold">Localização detectada: {city}</p>
        </div>
      </CardContent>
    </Card>
  );
}
