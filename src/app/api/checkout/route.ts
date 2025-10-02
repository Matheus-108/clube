// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const PUSHINPAY_API_URL = 'https://api.pushinpay.com.br/api/pix/cashIn';
    const API_TOKEN = process.env.PUSHINPAY_API_TOKEN;

    if (!API_TOKEN) {
        console.error("PushinPay API token is not configured.");
        return NextResponse.json({ error: 'Internal server configuration error.' }, { status: 500 });
    }

    const response = await fetch(PUSHINPAY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: 2700, // R$27,00 em centavos
        // Adicionando o email do pagador para identificação, se a API suportar
        payer: {
          email: email,
        }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`PushinPay API error: ${response.status}`, errorBody);
      return NextResponse.json({ error: 'Failed to generate PIX code.', details: errorBody }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      qrCodeBase64: data.qr_code_base64,
      qrCode: data.qr_code,
    });

  } catch (error) {
    console.error('Error in checkout API route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
