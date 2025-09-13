import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CheckoutForm from '@/components/checkout-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const packageFeatures = [
    "Fotos exclusivas",
    "Vídeos sensuais",
    "1 chamada de vídeo privada (agendada)",
    "Acesso imediato ao conteúdo"
]

export default function CheckoutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="order-2 md:order-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Finalize seu Acesso</CardTitle>
                                <CardDescription>Preencha seus dados para ter acesso instantâneo.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CheckoutForm />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="order-1 md:order-2">
                         <Card className="bg-muted/50 sticky top-24">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Clube HOT All Access</CardTitle>
                                <p className="text-3xl font-bold text-primary">R$49,00</p>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold mb-4">Seu pacote inclui:</p>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    {packageFeatures.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
