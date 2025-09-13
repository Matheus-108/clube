export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-xs">
        <p>
          Conteúdo para maiores de 18 anos. A conversa e a localização são simulações para uma experiência imersiva e não correspondem a locais ou serviços reais. Não vendemos ou prometemos serviços presenciais.
        </p>
        <p className="mt-2">Clube HOT All Access © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
