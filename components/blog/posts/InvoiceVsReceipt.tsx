import Link from "next/link";

export function InvoiceVsReceipt() {
  return (
    <>
      <p>
        &quot;Can you send me an invoice?&quot; and &quot;Can you send me a
        receipt?&quot; sound interchangeable, but clients (and tax
        authorities) treat them very differently. Getting this wrong is a
        small but common freelancer mistake — here&apos;s the actual
        distinction.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">An invoice is a request for payment</h2>
      <p>
        You send an invoice <em>before</em> you&apos;ve been paid. It says
        &quot;here&apos;s what I did, here&apos;s what you owe, here&apos;s
        how to pay it.&quot; It includes line items, a due date, and
        payment details. Its job is to get money moving.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">A receipt is proof that payment happened</h2>
      <p>
        You send a receipt <em>after</em> you&apos;ve been paid. It
        confirms the amount received, the date it was received, and the
        payment method. Its job is recordkeeping — for the client&apos;s
        expense reports, or for your own bookkeeping.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Side by side</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-semibold"></th>
            <th className="text-left py-2 font-semibold">Invoice</th>
            <th className="text-left py-2 font-semibold">Receipt</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          <tr className="border-b">
            <td className="py-2 font-medium text-foreground">Sent</td>
            <td className="py-2">Before payment</td>
            <td className="py-2">After payment</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-foreground">Purpose</td>
            <td className="py-2">Request money owed</td>
            <td className="py-2">Confirm money received</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-foreground">Has a due date</td>
            <td className="py-2">Yes</td>
            <td className="py-2">No</td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-foreground">Has payment details</td>
            <td className="py-2">Yes (where to send it)</td>
            <td className="py-2">Optional (how it was paid)</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mt-8 mb-2">Do you need to send both?</h2>
      <p>
        Most freelancer-to-client relationships only need the invoice — once
        it&apos;s paid, the paid invoice itself usually serves as adequate
        proof for both sides&apos; records. A separate receipt is mainly
        worth sending when:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>The client specifically asks for one (common with expense reimbursements)</li>
        <li>You received a partial payment and want to document exactly what&apos;s been settled so far</li>
        <li>Local regulations in your country specifically require one for tax purposes</li>
      </ul>

      <p>
        In InvoiceFlow, marking an invoice as{" "}
        <strong className="font-semibold">Paid</strong> keeps a permanent
        record of when it was settled — for most freelancers, that paid
        invoice record is all the documentation you&apos;ll ever need.{" "}
        <Link href="/invoices/new" className="underline">
          Create your first invoice
        </Link>{" "}
        free, no signup required to try it.
      </p>
    </>
  );
}
