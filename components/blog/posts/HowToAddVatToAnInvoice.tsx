export function HowToAddVatToAnInvoice() {
  return (
    <>
      <p>
        VAT confuses more freelancers than any other part of invoicing —
        partly because the rules genuinely differ by country, and partly
        because most invoicing tools bury the setting three menus deep.
        Here&apos;s the plain-English version.
      </p>

      <p>
        <strong className="font-semibold">
          This is general guidance, not tax advice
        </strong>{" "}
        — VAT rules vary by country and change over time. Confirm your
        specific obligations with a local accountant or your tax
        authority.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Do you need to charge VAT at all?</h2>
      <p>
        In most countries, you only charge VAT once your annual revenue
        crosses a registration threshold (for example, many EU countries
        sit somewhere between €25,000 and €100,000, and the UK&apos;s is
        £90,000 as of this writing). Below that threshold, freelancers
        often aren&apos;t required to register — meaning you simply
        don&apos;t add VAT, and your invoice should say why (e.g. &quot;VAT
        not applicable — small business exemption&quot; in some
        jurisdictions, or simply omit the line).
      </p>
      <p>
        Once you&apos;re registered, charging VAT becomes mandatory on
        every applicable invoice — there&apos;s no choosing not to.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">What your invoice must show</h2>
      <p>Once VAT applies, your invoice needs:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Your VAT registration number</li>
        <li>
          The VAT rate applied (e.g. 19%, 20%, 21% — varies by country and
          sometimes by service type)
        </li>
        <li>The subtotal before VAT</li>
        <li>The VAT amount as its own line</li>
        <li>The total including VAT</li>
      </ul>
      <p>
        For B2B invoices within the EU where the reverse-charge mechanism
        applies (you&apos;re invoicing a VAT-registered business in
        another EU country), you typically don&apos;t charge VAT at all —
        instead you write &quot;Reverse charge — VAT to be accounted for
        by the recipient&quot; and include both your VAT number and
        theirs. This is the case that trips up the most freelancers doing
        cross-border B2B work, so double check it with an accountant if
        you&apos;re unsure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">The actual calculation</h2>
      <p>
        VAT is calculated on the subtotal, after any discount, before
        anything else:
      </p>
      <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
        <code>{`subtotal = sum of line items
discount = subtotal × discount % (if any)
taxable amount = subtotal − discount
VAT amount = taxable amount × VAT rate
total = taxable amount + VAT amount`}</code>
      </pre>
      <p>
        Example: €1,000 of work, a 10% discount, 19% VAT.
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Subtotal: €1,000.00</li>
        <li>Discount (10%): −€100.00</li>
        <li>Taxable amount: €900.00</li>
        <li>VAT (19%): €171.00</li>
        <li>
          <strong className="font-semibold">Total: €1,071.00</strong>
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">A common mistake</h2>
      <p>
        Applying VAT to the subtotal{" "}
        <em>before</em> the discount instead of after. It seems minor, but
        it means you&apos;re collecting (and owing) slightly more VAT than
        you actually should — and it&apos;s the kind of small error that
        looks bad in a tax audit even though it was unintentional.
      </p>

      <p>
        InvoiceFlow handles this calculation automatically — set your tax
        label (VAT, GST, or Sales Tax) and rate once in your account
        settings, and every invoice applies it correctly to the
        post-discount amount.
      </p>
    </>
  );
}
