import { notFound } from "next/navigation";
import { CreditCard, Download, FileText } from "lucide-react";
import { db } from "@/lib/db";
import { markViewedByToken } from "@/lib/track";
import { formatDate } from "@/lib/utils/format";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import { Amount } from "@/components/shared/Amount";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invoice = await db.invoice.findUnique({
    where: { viewToken: token },
    include: { lineItems: { orderBy: { sortOrder: "asc" } } },
  });

  if (!invoice) notFound();

  await markViewedByToken(token);

  const canPayOnline = !!invoice.paymentLinkUrl && invoice.status !== "paid";

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 font-extrabold text-sm tracking-tight">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            InvoiceFlow
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/invoices/${invoice.id}/pdf?token=${token}`}
              className={cn(
                buttonVariants({ variant: canPayOnline ? "outline" : "default", size: "sm" }),
                "gap-1.5"
              )}
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
            {canPayOnline && (
              <a
                href={invoice.paymentLinkUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay <Amount value={invoice.total} currency={invoice.currency} />
              </a>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{invoice.invoiceNumber}</h1>
              <div className="mt-2">
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
            {invoice.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={invoice.logoUrl} alt="" className="w-12 h-12 object-contain" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                From
              </p>
              <p className="font-medium">{invoice.fromName}</p>
              {invoice.fromEmail && (
                <p className="text-sm text-muted-foreground">{invoice.fromEmail}</p>
              )}
              {invoice.fromAddress && (
                <p className="text-sm text-muted-foreground">{invoice.fromAddress}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Bill to
              </p>
              <p className="font-medium">{invoice.toCompany || invoice.toName}</p>
              {invoice.toCompany && (
                <p className="text-sm text-muted-foreground">{invoice.toName}</p>
              )}
              {invoice.toAddress && (
                <p className="text-sm text-muted-foreground">{invoice.toAddress}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 pb-6 border-b border-dashed border-border text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Issue date</p>
              <p>{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Due date</p>
              <p>{invoice.dueDate ? formatDate(invoice.dueDate) : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Payment terms</p>
              <p>{invoice.paymentTerms || "—"}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-dashed border-border">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium text-right">Rate</th>
                <th className="pb-2 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-dashed border-border">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">
                    <Amount value={item.rate} currency={invoice.currency} />
                  </td>
                  <td className="py-2 text-right">
                    <Amount value={item.quantity * item.rate} currency={invoice.currency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-8">
            <div className="w-56 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <Amount value={invoice.subtotal} currency={invoice.currency} />
              </div>
              {!!invoice.discountAmount && invoice.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <Amount value={-invoice.discountAmount} currency={invoice.currency} />
                </div>
              )}
              {!!invoice.taxAmount && invoice.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {invoice.taxLabel} ({invoice.taxRate}%)
                  </span>
                  <Amount value={invoice.taxAmount} currency={invoice.currency} />
                </div>
              )}
              <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <Amount value={invoice.total} currency={invoice.currency} />
              </div>
            </div>
          </div>

          {(invoice.notes || invoice.bankDetails) && (
            <div className="border-t border-dashed border-border pt-6 grid grid-cols-2 gap-8 text-sm">
              {invoice.notes && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Notes
                  </p>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {invoice.notes}
                  </p>
                </div>
              )}
              {invoice.bankDetails && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Payment details
                  </p>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {invoice.bankDetails}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
