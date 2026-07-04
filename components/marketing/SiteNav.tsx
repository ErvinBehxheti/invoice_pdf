import Link from "next/link";
import { FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-dashed border-border bg-background/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          InvoiceFlow
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Sign in
            </Link>
            <Link href="/invoices/new" className={buttonVariants({ size: "sm" })}>
              Try for free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
