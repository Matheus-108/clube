'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Flame, Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  HeartFilledIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';


const benefits = [
    { text: 'WhatsApp pessoal da Letycia', icon: <HeartFilledIcon className="h-5 w-5 text-emerald-400" /> },
    { text: 'Fotos exclusivas e picantes', icon: <Flame className="h-5 w-5 text-emerald-400" /> },
    { text: 'Chat sem limites 24h', icon: <ChatBubbleIcon className="h-5 w-5 text-emerald-400" /> },
    { text: 'Conteúdo personalizado', icon: <Heart className="h-5 w-5 text-emerald-400" /> }
];

export default function TransparentCheckout() {
    const [email, setEmail] = useState('');
    // Este é o ID do seu produto/checkout na PushinPay.
    const checkoutId = "6392cb5a-74af-4e15-b794-d194dadad468";

    const handleCheckout = () => {
        if (!email) {
            alert('Por favor, insira seu melhor e-mail.');
            return;
        }
        // Monta a URL correta para a PushinPay.
        const checkoutUrl = `https://app.pushinpay.com.br/checkout/${checkoutId}?email=${encodeURIComponent(email)}`;
        window.location.href = checkoutUrl;
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-black rounded-xl p-px"
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
                        className="w-full h-14 text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_14px_0_rgb(0,255,127,0.3)]"
                    >
                        Gerar PIX
                        <span className="ml-2">›</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
