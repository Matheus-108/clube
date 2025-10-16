export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-xs">
        <p>Clube HOT All Access © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
