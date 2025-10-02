'use client';

import { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Heart, Flame, MessageCircle, Loader2, Copy, Check } from 'lucide-react';
import {
  HeartFilledIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const benefits = [
    { text: 'WhatsApp pessoal da Letycia', icon: <HeartFilledIcon className="h-5 w-5 text-emerald-400" /> },
    { text: 'Fotos exclusivas e picantes', icon: <Flame className="h-5 w-5 text-emerald-400" /> },
    { text: 'Chat sem limites 24h', icon: <ChatBubbleIcon className="h-5 w-5 text-emerald-400" /> },
    { text: 'Conteúdo personalizado', icon: <Heart className="h-5 w-5 text-emerald-400" /> }
];

type PixData = {
    qrCodeBase64: string;
    qrCode: string;
}

const TransparentCheckout = forwardRef<HTMLDivElement>((props, ref) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pixData, setPixData] = useState<PixData | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const handleCheckout = async () => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast({
                variant: 'destructive',
                title: 'E-mail inválido',
                description: 'Por favor, insira um e-mail válido para continuar.',
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao gerar o código PIX.');
            }

            const data: PixData = await response.json();
            setPixData(data);

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast({
                variant: 'destructive',
                title: 'Erro no Checkout',
                description: error.message || 'Não foi possível gerar o PIX. Tente novamente.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        if (pixData?.qrCode) {
            navigator.clipboard.writeText(pixData.qrCode);
            setIsCopied(true);
            toast({
                title: 'Copiado!',
                description: 'O código PIX Copia e Cola foi copiado para sua área de transferência.',
            });
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const closePixModal = () => {
        setPixData(null);
    }

    return (
        <>
            <div id="checkout-section" ref={ref} className="max-w-md mx-auto mt-12 bg-black rounded-xl p-px scroll-mt-20"
                 style={{
                    background: 'linear-gradient(to bottom, #4a4a4a, #1c1c1c)',
                    boxShadow: '0px 10px 30px rgba(138, 43, 226, 0.3)',
                 }}
            >
                <div className="bg-black rounded-xl p-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-gradient-to-br from-purple-600 to-pink-500 shadow-lg">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                            Desbloquear Acesso
                        </h2>
                        <div className="flex items-baseline justify-center gap-2 mb-4">
                            <p className="text-4xl font-bold text-white">R$27,00</p>
                            <p className="text-xl font-medium text-gray-500 line-through">R$97,00</p>
                        </div>
                        <p className="text-gray-400 mb-8">Faça o pagamento PIX para liberar o grupo</p>
                    </div>

                    <div className="bg-[#1C1C1C] rounded-lg p-6 mb-8 border border-gray-800">
                        <h3 className="font-bold text-white text-lg mb-4 text-center">Após a confirmação você recebe:</h3>
                        <ul className="space-y-3">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    {benefit.icon}
                                    <span className="text-gray-300">{benefit.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-[#1C1C1C] border-gray-700 text-white placeholder:text-gray-500 h-14 rounded-md text-base"
                        />
                        <Button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="w-full h-14 text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_14px_0_rgb(0,255,127,0.3)]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Gerar PIX'}
                            {!isLoading && <span className="ml-2">›</span>}
                        </Button>
                    </div>
                     <p className="text-center text-gray-500 text-xs mt-4">
                        A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor.
                    </p>
                </div>
            </div>

            {/* PIX QR Code Modal */}
            <Dialog open={!!pixData} onOpenChange={(isOpen) => !isOpen && closePixModal()}>
                <DialogContent className="bg-[#1C1C1C] text-white border-gray-800 p-8 rounded-lg max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold text-emerald-400">Pague com PIX</DialogTitle>
                        <DialogDescription className="text-center text-gray-400 pt-2">
                            Escaneie o QR Code abaixo com o app do seu banco ou use o código Copia e Cola.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {pixData?.qrCodeBase64 && (
                        <div className="my-6 p-4 bg-white rounded-lg flex justify-center">
                            <Image src={pixData.qrCodeBase64} alt="PIX QR Code" width={256} height={256} />
                        </div>
                    )}
                    
                    <div className="space-y-4">
                         <p className="text-center text-gray-500 text-xs">
                            O acesso é liberado automaticamente após a confirmação do pagamento.
                         </p>
                         <Button onClick={handleCopyToClipboard} className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                            {isCopied ? <Check className="mr-2 text-green-400" /> : <Copy className="mr-2" />}
                            {isCopied ? 'Copiado!' : 'Copiar Código PIX'}
                         </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
});
TransparentCheckout.displayName = 'TransparentCheckout';

export default TransparentCheckout;
