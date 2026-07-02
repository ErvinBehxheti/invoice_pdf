import { z } from "zod";
import { ALL_TEMPLATES } from "@/lib/types";

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().max(500),
  quantity: z.number().min(0).max(1_000_000),
  rate: z.number().min(0).max(100_000_000),
});

export const invoiceFormSchema = z.object({
  fromName: z.string().max(200),
  fromEmail: z.string().max(200),
  fromAddress: z.string().max(1000),
  fromVatNumber: z.string().max(100),

  clientId: z.string().max(100).nullable(),
  toName: z.string().max(200),
  toEmail: z.string().max(200),
  toCompany: z.string().max(200),
  toAddress: z.string().max(1000),
  toVatNumber: z.string().max(100),

  invoiceNumber: z.string().max(100),
  issueDate: z.string(),
  dueDate: z.string(),
  paymentTerms: z.string().max(200),

  lineItems: z.array(lineItemSchema).min(1).max(100),

  currency: z.string().length(3),
  taxLabel: z.string().max(50),
  taxRate: z.number().min(0).max(100),
  discountType: z.enum(["percent", "fixed"]).nullable(),
  discountValue: z.number().min(0),

  notes: z.string().max(2000),
  bankDetails: z.string().max(1000),
  // Defaulted so drafts saved before this field existed still parse.
  paymentLinkUrl: z.string().max(2000).default(""),

  logoUrl: z.string().max(2000).nullable(),
  templateId: z.enum(ALL_TEMPLATES),
  brandColor: z.string().max(20),
});

export type InvoiceFormInput = z.infer<typeof invoiceFormSchema>;

export const userSettingsSchema = z.object({
  name: z.string().max(200).optional(),
  defaultCurrency: z.string().length(3).optional(),
  defaultPaymentTerms: z.string().max(200).nullable().optional(),
  defaultBankDetails: z.string().max(1000).nullable().optional(),
  defaultPaymentLinkUrl: z.string().max(2000).nullable().optional(),
  defaultTaxLabel: z.string().max(50).nullable().optional(),
  defaultTaxRate: z.number().min(0).max(100).nullable().optional(),
  brandColor: z.string().max(20).nullable().optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  address: z.string().max(1000).optional(),
  vatNumber: z.string().max(100).optional(),
  currency: z.string().length(3).optional(),
  defaultTerms: z.string().max(200).optional(),
});
