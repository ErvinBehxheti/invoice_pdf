"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { InvoiceData } from "@/lib/types";
import { CleanTemplate } from "@/components/templates/CleanTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Loading preview…
      </div>
    ),
  }
);

const templateComponents: Record<string, (props: { invoice: InvoiceData }) => React.ReactElement> = {
  clean: CleanTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  modern: ModernTemplate,
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function InvoicePreviewPane({ invoice }: { invoice: InvoiceData }) {
  const debouncedInvoice = useDebouncedValue(invoice, 500);
  const Template = templateComponents[debouncedInvoice.templateId] ?? CleanTemplate;

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden h-[800px] sticky top-6">
      <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: "none" }}>
        <Template invoice={debouncedInvoice} />
      </PDFViewer>
    </div>
  );
}
