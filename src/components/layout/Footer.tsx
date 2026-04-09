export function Footer() {
  return (
    <footer className="border-t bg-background py-6 mt-auto">
      <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Elite Status. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
            <a href="/support" className="hover:text-foreground transition-colors">Support</a>
          </div>
          <div className="text-xs">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
}