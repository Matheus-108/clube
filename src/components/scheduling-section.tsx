import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper } from "lucide-react";
import Link from "next/link";

export default function SchedulingSection() {
    return (
        <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="items-center">
                <PartyPopper className="h-12 w-12 text-accent" />
                <CardTitle className="font-headline text-3xl pt-4">Pagamento Aprovado!</CardTitle>
                <CardDescription>Seu acesso ao Clube HOT foi liberado.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Enviamos as instruções de acesso para seu e-mail. O próximo passo é agendar sua chamada de vídeo privada.
                </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    AGENDAR CHAMADA
                </Button>
                <Button variant="outline" asChild className="w-full">
                    <Link href="/">Voltar ao Clube</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
