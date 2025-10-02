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
        <Script id="pushinpay-script" strategy="afterInteractive">
          {`
            (function(p, u, s, h, i, n, g) {
              p.PushinPay = i;
              p[i] = p[i] || function() {
                (p[i].q = p[i].q || []).push(arguments)
              };
              n = u.createElement(s);
              g = u.getElementsByTagName(s)[0];
              n.async = 1;
              n.src = h;
              g.parentNode.insertBefore(n, g)
            })(window, document, 'script', 'https://app.pushinpay.com.br/checkout.js', 'pp');
          `}
        </Script>
        <script>
          {`
            window.kwaiPixelId = "68d950c2efa723954c3ec30d";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel-kwai.js");
            document.head.appendChild(a);
          `}
        </script>
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
      </body>
    </html>
  );
}
