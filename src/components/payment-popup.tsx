'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy, Lock, Sparkles, X, Loader2, CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { type Model } from '@/lib/models';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  model: Model;
}

const PIX_KEY = 'suportepro29@gmail.com';
const PRICE = '17,00';
const CHECKOUT_URL = "https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468";


export default function PaymentPopup({ isOpen, onClose, model }: PaymentPopupProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const modelImage = model ? PlaceHolderImages.find(img => img.id === model.avatarImageId) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setIsCopied(true);
    toast({
        title: "Chave PIX copiada!",
        description: "Agora você pode colar no seu app de pagamentos.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleAccessClick = () => {
    window.location.href = CHECKOUT_URL;
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="payment-popup-overlay" />
      <DialogContent className="p-0 border-none w-[95vw] max-w-md payment-popup-content text-white rounded-2xl overflow-hidden shadow-2xl payment-popup-glow">
        <div className="p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                <X size={20}/>
            </button>

            <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-fuchsia-500 shadow-lg">
                    {modelImage && <AvatarImage src={modelImage.imageUrl} alt={model.name} data-ai-hint={modelImage.imageHint}/>}
                    <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-fuchsia-300">Falta pouco para desbloquear...</h2>
                <p className="text-gray-400 mt-1 text-sm">Confirme o PIX de R${PRICE} para ter acesso à {model.name} e ao Clube.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-fuchsia-900/20 border border-fuchsia-700/50 mb-6">
                <h3 className="font-bold text-lg text-fuchsia-300 mb-3">Após a confirmação você recebe:</h3>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                        <Check className="text-green-400 w-5 h-5"/>
                        <span>Acesso ao grupo com mulheres solteiras</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="text-green-400 w-5 h-5"/>
                        <span>Modelos novas na sua cidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check className="text-green-400 w-5 h-5"/>
                        <span>Encontros para sexo casual</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-fuchsia-300">1. Pague com esta Chave PIX (E-mail):</label>
                    <div className="flex items-center mt-1 bg-black/50 border border-gray-600 rounded-md p-3">
                        <span className="flex-1 text-gray-300 truncate">{PIX_KEY}</span>
                        <button onClick={handleCopy} className="ml-2 px-3 py-1 text-xs font-bold bg-fuchsia-600 hover:bg-fuchsia-500 rounded-md transition-all">
                            {isCopied ? <Check size={14}/> : 'Copiar'}
                        </button>
                    </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-fuchsia-300">2. Aguarde a confirmação:</label>
                  <div className="mt-1 flex items-center justify-center gap-3 text-center p-3 rounded-lg bg-gray-900/50 border border-dashed border-gray-600 waiting-for-payment-glow">
                      <Loader2 className="animate-spin text-yellow-400"/>
                      <span className="font-semibold text-yellow-300">Aguardando pagamento...</span>
                  </div>
                </div>

                <div className="text-center pt-2">
                    <p className="text-xs text-gray-500 mb-2">Prefere pagar com cartão?</p>
                    <Button onClick={handleAccessClick} variant="outline" size="sm" className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">
                        <CreditCard className="mr-2"/>
                        Pagar com Cartão de Crédito
                    </Button>
                </div>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-6">
                <Lock size={12} className="inline-block mr-1"/>
                Pagamento 100% seguro • Acesso liberado em instantes
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
