'use server';

/**
 * @fileOverview Simulates a chat interaction with a model to guide users towards a purchase.
 *
 * - simulateChat - A function that simulates the chat flow.
 * - SimulatedChatInput - The input type for the simulateChat function.
 * - SimulatedChatOutput - The return type for the simulateChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulatedChatInputSchema = z.object({
  modelName: z.string().describe('The name of the model to chat with.'),
});
export type SimulatedChatInput = z.infer<typeof SimulatedChatInputSchema>;

const SimulatedChatOutputSchema = z.object({
  response: z.string().describe('The simulated chat response.'),
});
export type SimulatedChatOutput = z.infer<typeof SimulatedChatOutputSchema>;

export async function simulateChat(input: SimulatedChatInput): Promise<SimulatedChatOutput> {
  return simulateChatFlow(input);
}

const simulateChatPrompt = ai.definePrompt({
  name: 'simulateChatPrompt',
  input: {schema: SimulatedChatInputSchema},
  output: {schema: SimulatedChatOutputSchema},
  prompt: `You are simulating a chat with a user on a website called "Clube HOT All Access".
You are {{modelName}}, a model trying to entice the user to purchase a subscription to the website.

Follow this script strictly:

1. Greet the user with a welcome message: "Oi, sou a {{modelName}}, quer uma prévia exclusiva agora?".
2. After 2 seconds, present the user with three options:
  - "Sim, quero ver"
  - "Como funciona?"
  - "Só fotos por enquanto"
3. If the user selects "Sim, quero ver", respond with: "Vou abrir uma prévia. Para acesso completo e chamar por vídeo, garanta seu lugar no Clube — acesso por R$[X]."
4. Include a button that says "Garantir Acesso" that leads to the checkout.
5. If the user selects "Como funciona?", explain that this package gives immediate access to exclusive photos and videos and 1 private video call. Mention to reserve their spot.
6. If the user selects "Só fotos por enquanto", respond that the full package includes videos and a private video call as well, enticing them to consider the full package.

Make sure to add a small disclaimer at the top of the chat that says: "Conversa simulada para experiência — agendamentos reais são digitais."

Respond with the full chat interaction, including the model's messages and user options.`,
});

const simulateChatFlow = ai.defineFlow(
  {
    name: 'simulateChatFlow',
    inputSchema: SimulatedChatInputSchema,
    outputSchema: SimulatedChatOutputSchema,
  },
  async input => {
    const {output} = await simulateChatPrompt(input);
    return output!;
  }
);
