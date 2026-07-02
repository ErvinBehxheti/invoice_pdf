import Link from "next/link";

export function HowToWriteAProfessionalInvoice() {
  return (
    <>
      <p>
        If you freelance, invoicing is the one piece of admin that directly
        affects whether — and how fast — you get paid. A messy or incomplete
        invoice gives a client an easy excuse to delay. A clear one gets
        approved and paid without a single follow-up email.
      </p>

      <p>
        Here&apos;s exactly what a professional invoice needs, in the order
        it should appear.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Your details and theirs</h2>
      <p>
        Every invoice needs a clear &quot;from&quot; and &quot;to&quot;:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Your name or business name, email, and address</li>
        <li>Your client&apos;s name, company, and billing address</li>
        <li>
          Your VAT/tax number if you&apos;re registered (and theirs, for
          B2B invoices in the EU)
        </li>
      </ul>
      <p>
        Don&apos;t skip the address fields, even though it feels redundant
        for a client you email every week — accounting and tax software on
        the client&apos;s end often requires a complete billing address to
        process the payment.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. A unique invoice number</h2>
      <p>
        Use a consistent, sequential format like{" "}
        <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
          INV-2026-001
        </code>
        . Avoid restarting the sequence per client — a single running
        number across your whole business is easier for your own
        bookkeeping and looks more established to clients. Never reuse a
        number, even for a cancelled invoice.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Issue date and due date</h2>
      <p>
        State both explicitly — don&apos;t make the client calculate the due
        date from your payment terms. &quot;Due: 14 July 2026&quot; gets
        paid faster than &quot;Net 14.&quot;
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Itemized work, not a lump sum</h2>
      <p>
        Break the total into line items: a short description, quantity (or
        hours), rate, and the line amount. Even if you charged a flat
        project fee, splitting it into 2-3 lines (e.g. &quot;Design,&quot;
        &quot;Development,&quot; &quot;Revisions&quot;) makes the invoice
        easier for a client to approve internally — many companies require
        a breakdown before finance will release payment.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Subtotal, tax, and total</h2>
      <p>
        Show the subtotal before tax, the tax rate and amount (if
        applicable — see our{" "}
        <Link href="/blog/how-to-add-vat-to-an-invoice" className="underline">
          guide to adding VAT
        </Link>
        ), and the final total due, in that order. Use the actual currency
        symbol, not just a number — international clients shouldn&apos;t
        have to guess if €1,200 means euros.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Payment details</h2>
      <p>
        Bank details (IBAN, account number, SWIFT/BIC) or a payment link.
        Put this on every invoice — &quot;same as last time&quot; is not a
        payment method a client&apos;s accounts team can act on.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Payment terms</h2>
      <p>
        Net 7, Net 14, Net 30 — whatever you&apos;ve agreed. State it
        clearly and keep it consistent across clients where possible; it
        makes your own cash flow far more predictable.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">A note on looking professional</h2>
      <p>
        None of the above requires design skill — it requires consistency.
        A plain, well-organized invoice with your logo and a clean layout
        reads as more professional than a cluttered one with five fonts.
        That&apos;s the entire idea behind{" "}
        <Link href="/" className="underline">
          InvoiceFlow
        </Link>
        : pick a clean template, fill in the fields above, and download a
        PDF that looks like it came from an established business — free,
        no signup required to try it.
      </p>
    </>
  );
}
