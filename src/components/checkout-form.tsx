'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(2, 'Nome completo é obrigatório.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  cpf: z.string().optional(),
  paymentMethod: z.enum(['card', 'pix'], { required_error: 'Selecione um método de pagamento.' }),
  addExtraTime: z.boolean().default(false),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve confirmar que tem mais de 18 anos e concorda com os termos.',
  }),
});

export default function CheckoutForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      addExtraTime: false,
      agreeTerms: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Processando pagamento...',
      description: 'Aguarde um momento.',
    });
    // Simulate payment processing delay
    setTimeout(() => {
      router.push('/obrigado');
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormDescription>Usado para enviar seu acesso.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Método de Pagamento</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="card" />
                    </FormControl>
                    <FormLabel className="font-normal">Cartão de Crédito</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="pix" />
                    </FormControl>
                    <FormLabel className="font-normal">PIX</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="addExtraTime"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-muted/20">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <span className="font-bold text-primary">OFERTA ÚNICA:</span> Adicionar 15 min extra na chamada por <span className="font-bold">R$29</span>!
                </FormLabel>
                <FormDescription>
                  Aproveite essa oferta exclusiva de checkout.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <Label htmlFor="agreeTerms" className="text-sm">
                  Confirmo ter mais de 18 anos e concordo com a <Link href="#" className="underline">política de reembolso e termos de serviço</Link>.
                </Label>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Comprar Agora
        </Button>
      </form>
    </Form>
  );
}
