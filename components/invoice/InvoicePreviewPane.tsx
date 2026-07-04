"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
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

function useDebouncedValue<T>(value: T, delayMs: number): [T, boolean] {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  // Derived, not tracked state: pending whenever the live value hasn't
  // settled into `debounced` yet. Content-compared rather than reference-
  // compared, since the caller rebuilds `value` as a new object on every
  // render regardless of whether its contents actually changed.
  const isPending = JSON.stringify(value) !== JSON.stringify(debounced);

  return [debounced, isPending];
}

export function InvoicePreviewPane({ invoice }: { invoice: InvoiceData }) {
  const [debouncedInvoice, isPending] = useDebouncedValue(invoice, 500);
  const Template = templateComponents[debouncedInvoice.templateId] ?? CleanTemplate;

  // Memoized so PDFViewer's internal effect (keyed on `children` by reference)
  // only re-fires when the debounced value actually changes, not on every
  // keystroke-triggered re-render of this component.
  const templateElement = useMemo(
    () => <Template invoice={debouncedInvoice} />,
    [Template, debouncedInvoice]
  );

  return (
    <div className="rounded-xl border border-border bg-muted/30 overflow-hidden h-200 sticky top-6">
      <div
        className={cn(
          "h-full transition-opacity duration-200",
          isPending && "opacity-60"
        )}
      >
        <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: "none" }}>
          {templateElement}
        </PDFViewer>
      </div>
    </div>
  );
}
