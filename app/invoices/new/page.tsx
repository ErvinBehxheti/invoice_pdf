import Link from "next/link";
import { FileText } from "lucide-react";
import { InvoiceBuilder } from "@/components/invoice/InvoiceBuilder";

export const metadata = {
  title: "Create a free invoice — InvoiceFlow",
  description: "Build a professional invoice in under 60 seconds. No signup required.",
};

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            InvoiceFlow
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <InvoiceBuilder initialTemplate={template} />
      </main>
    </div>
  );
}
