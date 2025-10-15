'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
}

export default function CookieConsent({ onAccept }: CookieConsentProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl animate-fade-in border-gray-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Políticas de Cookies e Privacidade</CardTitle>
          <CardDescription className="pt-2 text-base">
            Para continuar, você deve ter 18 anos ou mais e aceitar nossos termos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 text-center">
            Este site utiliza cookies para garantir que você obtenha a melhor experiência. Nossos serviços são destinados apenas para maiores de idade. Ao continuar, você confirma que tem 18 anos ou mais e concorda com o uso de cookies e nossas políticas de privacidade.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={onAccept} className="w-full h-12 text-lg bg-primary hover:bg-primary/90">
            Aceitar e continuar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
