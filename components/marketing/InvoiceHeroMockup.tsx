import { Eye } from "lucide-react";

/**
 * Decorative CSS rendition of the "Professional" PDF template for the
 * landing-page hero — a real product screenshot substitute that costs zero
 * image bytes and always matches the current brand color.
 */
export function InvoiceHeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md select-none" aria-hidden="true">
      {/* Invoice card */}
      <div className="rounded-xl border bg-card shadow-2xl shadow-primary/10 rotate-1 overflow-hidden text-left">
        {/* Brand band */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground font-bold text-lg leading-none">INVOICE</p>
            <p className="text-primary-foreground/80 text-xs mt-1">INV-2026-014</p>
          </div>
          <div className="w-9 h-9 rounded-md bg-white/20 flex items-center justify-center text-primary-foreground text-xs font-bold">
            SK
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Parties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                From
              </p>
              <p className="text-sm font-medium">Sofia Keller</p>
              <p className="text-xs text-muted-foreground">Brand & web design</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                Bill to
              </p>
              <p className="text-sm font-medium">Northwind Studio</p>
              <p className="text-xs text-muted-foreground">Amsterdam, NL</p>
            </div>
          </div>

          {/* Line items */}
          <div className="text-xs">
            <div className="flex justify-between text-muted-foreground border-b pb-1.5 mb-1.5">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dashed">
              <span>Homepage redesign</span>
              <span>€1,200.00</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-dashed">
              <span>Design system — 12 components</span>
              <span>€480.00</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Launch support (3h)</span>
              <span>€180.00</span>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-44 space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>€1,860.00</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (21%)</span>
                <span>€390.60</span>
              </div>
              <div className="flex justify-between items-center bg-primary text-primary-foreground rounded-md px-2.5 py-1.5 mt-1.5 text-sm font-semibold">
                <span>Total</span>
                <span>€2,250.60</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating "viewed" badge — the tracking differentiator */}
      <div className="absolute -top-4 -right-2 sm:-right-6 rounded-lg border bg-card shadow-lg px-3 py-2 flex items-center gap-2 -rotate-2">
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium">Viewed 2× · 1h ago</span>
      </div>

      {/* Floating "paid" badge */}
      <div className="absolute -bottom-4 -left-2 sm:-left-6 rounded-lg border bg-card shadow-lg px-3 py-2 flex items-center gap-2 rotate-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium">Paid · €2,250.60</span>
      </div>
    </div>
  );
}
