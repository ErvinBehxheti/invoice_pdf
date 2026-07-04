import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import type { InvoiceData } from "@/lib/types";
import { CleanTemplate } from "@/components/templates/CleanTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";

const templateMap: Record<
  string,
  (props: { invoice: InvoiceData; watermark?: boolean }) => ReactElement
> = {
  clean: CleanTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  modern: ModernTemplate,
};

export async function generateInvoicePDF(
  invoice: InvoiceData,
  options?: { watermark?: boolean }
): Promise<Buffer> {
  const Template = templateMap[invoice.templateId] ?? CleanTemplate;
  const document = createElement(Template, {
    invoice,
    watermark: options?.watermark,
  }) as ReactElement<DocumentProps>;
  return renderToBuffer(document);
}
