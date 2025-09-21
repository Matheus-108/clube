import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Clube HOT All Access',
  description: 'Acesso único: fotos + vídeos + chamada — tudo em um só lugar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Script 
            id="xtracky-utm-handler"
            src="https://cdn.jsdelivr.net/gh/xTracky/static/utm-handler.js"
            data-token="fb353bf0-d7af-43d9-b27e-40b9e2466f15"
            data-click-id-param="click_id"
            strategy="afterInteractive"
        />
        <Script
            id="kwai-pixel-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.kwaiPixelId = "68d086d63fa58fabc95c190f";
                var a = document.createElement("script");
                a.setAttribute("async", "");
                a.setAttribute("defer", "");
                a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel-kwai.js");
                document.head.appendChild(a);
              `,
            }}
        />
      </body>
    </html>
  );
}
