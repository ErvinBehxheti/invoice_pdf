import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { dbInvoiceToFormState } from "@/lib/types";
import { InvoiceBuilder } from "@/components/invoice/InvoiceBuilder";
import { RecurringSettings } from "@/components/invoice/RecurringSettings";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { lineItems: { orderBy: { sortOrder: "asc" } } },
  });

  if (!invoice || invoice.userId !== user.id) notFound();

  const isPro = user.planTier === "pro";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.invoiceNumber}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {invoice.toCompany || invoice.toName}
          </p>
        </div>
        <RecurringSettings
          invoiceId={invoice.id}
          isPro={isPro}
          isRecurring={invoice.isRecurring}
          cadence={invoice.recurringCadence}
        />
      </div>
      <InvoiceBuilder
        invoiceId={invoice.id}
        initialState={dbInvoiceToFormState(invoice)}
        isPro={isPro}
      />
    </div>
  );
}
