export interface LineItemInput {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface DbInvoiceTotalsLike {
  subtotal: number;
  taxAmount: number | null;
  discountAmount: number | null;
  total: number;
}

interface DbInvoiceLike {
  clientId: string | null;
  fromName: string;
  fromEmail: string | null;
  fromAddress: string | null;
  fromVatNumber: string | null;
  toName: string;
  toEmail: string | null;
  toCompany: string | null;
  toAddress: string | null;
  toVatNumber: string | null;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date | null;
  paymentTerms: string | null;
  currency: string;
  taxLabel: string | null;
  taxRate: number | null;
  discountType: string | null;
  discountValue: number | null;
  notes: string | null;
  bankDetails: string | null;
  logoUrl: string | null;
  templateId: string;
  brandColor: string | null;
  lineItems: { id: string; description: string; quantity: number; rate: number }[];
}

export function dbInvoiceToFormState(invoice: DbInvoiceLike): InvoiceFormState {
  return {
    fromName: invoice.fromName,
    fromEmail: invoice.fromEmail ?? "",
    fromAddress: invoice.fromAddress ?? "",
    fromVatNumber: invoice.fromVatNumber ?? "",

    clientId: invoice.clientId,
    toName: invoice.toName,
    toEmail: invoice.toEmail ?? "",
    toCompany: invoice.toCompany ?? "",
    toAddress: invoice.toAddress ?? "",
    toVatNumber: invoice.toVatNumber ?? "",

    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate.toISOString().slice(0, 10),
    dueDate: invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : "",
    paymentTerms: invoice.paymentTerms ?? "",

    lineItems: invoice.lineItems.length
      ? invoice.lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        }))
      : [createEmptyLineItem()],

    currency: invoice.currency,
    taxLabel: invoice.taxLabel ?? "VAT",
    taxRate: invoice.taxRate ?? 0,
    discountType: invoice.discountType === "percent" || invoice.discountType === "fixed" ? invoice.discountType : null,
    discountValue: invoice.discountValue ?? 0,

    notes: invoice.notes ?? "",
    bankDetails: invoice.bankDetails ?? "",

    logoUrl: invoice.logoUrl,
    templateId: invoice.templateId,
    brandColor: invoice.brandColor ?? "#171717",
  };
}

export function dbInvoiceToInvoiceData(
  invoice: DbInvoiceLike & DbInvoiceTotalsLike
): InvoiceData {
  return {
    ...dbInvoiceToFormState(invoice),
    subtotal: invoice.subtotal,
    taxAmount: invoice.taxAmount ?? 0,
    discountAmount: invoice.discountAmount ?? 0,
    total: invoice.total,
  };
}

export interface InvoiceFormState {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromVatNumber: string;

  clientId: string | null;
  toName: string;
  toEmail: string;
  toCompany: string;
  toAddress: string;
  toVatNumber: string;

  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;

  lineItems: LineItemInput[];

  currency: string;
  taxLabel: string;
  taxRate: number;
  discountType: "percent" | "fixed" | null;
  discountValue: number;

  notes: string;
  bankDetails: string;

  logoUrl: string | null;
  templateId: string;
  brandColor: string;
}

export interface InvoiceTotals {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
}

export type InvoiceData = InvoiceFormState & InvoiceTotals;

export const FREE_TEMPLATES = ["clean", "professional"] as const;
export const PRO_TEMPLATES = ["minimal", "bold", "modern"] as const;
export const ALL_TEMPLATES = [...FREE_TEMPLATES, ...PRO_TEMPLATES] as const;

export const CURRENCIES = ["EUR", "USD", "GBP", "CHF"] as const;

export function resolveTemplateId(templateId: string, isPro: boolean): string {
  if (!isPro && (PRO_TEMPLATES as readonly string[]).includes(templateId)) {
    return "clean";
  }
  return templateId;
}

export function createEmptyLineItem(): LineItemInput {
  return {
    id: crypto.randomUUID(),
    description: "",
    quantity: 1,
    rate: 0,
  };
}

export function createInitialInvoiceState(): InvoiceFormState {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);

  return {
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    fromVatNumber: "",

    clientId: null,
    toName: "",
    toEmail: "",
    toCompany: "",
    toAddress: "",
    toVatNumber: "",

    invoiceNumber: "INV-0001",
    issueDate: today.toISOString().slice(0, 10),
    dueDate: dueDate.toISOString().slice(0, 10),
    paymentTerms: "Net 14",

    lineItems: [createEmptyLineItem()],

    currency: "EUR",
    taxLabel: "VAT",
    taxRate: 0,
    discountType: null,
    discountValue: 0,

    notes: "",
    bankDetails: "",

    logoUrl: null,
    templateId: "clean",
    brandColor: "#171717",
  };
}
