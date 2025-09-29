'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy, Lock, Sparkles, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
}

const PIX_KEY = 'suportepro29@gmail.com';
const PRICE = '17,00';
const CHECKOUT_URL = "https://pay.nitropaycheckout.com.br/checkout/6392cb5a-74af-4e15-b794-d194dadad468";


export default function PaymentPopup({ isOpen, onClose, modelName }: PaymentPopupProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

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
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <X size={20}/>
            </button>

            <div className="text-center">
                <div className="mx-auto bg-fuchsia-500/20 w-16 h-16 rounded-full flex items-center justify-center border-2 border-fuchsia-500">
                    <Lock className="text-fuchsia-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mt-4 text-fuchsia-300">Desbloquear WhatsApp da {modelName}</h2>
                <p className="text-gray-400 mt-2 text-sm">Por segurança, confirme seu perfil com um PIX de R${PRICE}</p>
            </div>

            <div className="my-6 p-4 rounded-lg bg-black/30 border border-gray-700 text-center">
                <h3 className="font-semibold text-white">Conteúdo Bloqueado</h3>
                <p className="text-sm text-gray-400">Confirme o pagamento para ver</p>
            </div>
            
            <div className="p-4 rounded-lg bg-fuchsia-900/20 border border-fuchsia-700/50">
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

            <div className="mt-6">
                <label className="text-sm font-semibold text-fuchsia-300">Chave PIX (E-mail):</label>
                <div className="flex items-center mt-1 bg-black/50 border border-gray-600 rounded-md p-3">
                    <span className="flex-1 text-gray-300 truncate">{PIX_KEY}</span>
                    <button onClick={handleCopy} className="ml-2 px-3 py-1 text-xs font-bold bg-fuchsia-600 hover:bg-fuchsia-500 rounded-md transition-all">
                        {isCopied ? <Check size={14}/> : 'Copiar'}
                    </button>
                </div>
            </div>

            <Button onClick={handleAccessClick} className="w-full mt-8 py-6 text-lg font-bold payment-button-gradient rounded-lg">
                <Sparkles className="mr-2" size={20}/>
                Acessar Clube Agora - R$ {PRICE}
            </Button>
            
            <p className="text-center text-xs text-gray-500 mt-4">
                <Lock size={12} className="inline-block mr-1"/>
                Pagamento 100% seguro • Satisfação garantida
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
