import Link from "next/link";
import { FileText } from "lucide-react";

const productLinks = [
  { href: "/invoices/new", label: "Invoice generator" },
  { href: "/pricing", label: "Pricing" },
  { href: "/templates/freelancer-invoice-template", label: "Freelancer invoice template" },
  { href: "/templates/vat-invoice-template", label: "VAT invoice template" },
];

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/blog/how-to-write-a-professional-invoice", label: "How to write an invoice" },
  { href: "/blog/how-to-add-vat-to-an-invoice", label: "How to add VAT" },
  { href: "/blog/how-to-follow-up-on-an-unpaid-invoice", label: "Chasing late payments" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-dashed border-border">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 font-extrabold tracking-tight mb-3">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              InvoiceFlow
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Professional invoices in under 60 seconds. Built for freelancers
              who&apos;d rather work than wrestle accounting software.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Product</p>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Resources</p>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-10 pt-6 border-t border-dashed border-border">
          © {new Date().getFullYear()} InvoiceFlow · Simple invoicing for freelancers
        </p>
      </div>
    </footer>
  );
}
