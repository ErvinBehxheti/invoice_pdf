export function HowToFollowUpOnAnUnpaidInvoice() {
  return (
    <>
      <p>
        Most late payments aren&apos;t deliberate — they&apos;re a missed
        email, a busy finance team, or an invoice that got buried in an
        inbox. A short, clear follow-up usually resolves it faster than
        you&apos;d expect. Here are three templates, escalating in tone,
        and when to send each.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. The day after it&apos;s due — friendly reminder
      </h2>
      <p>
        Assume it&apos;s an oversight. Keep it short and low-pressure.
      </p>
      <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground">
        Subject: Quick reminder — Invoice {"{number}"} now due
        <br />
        <br />
        Hi {"{name}"},
        <br />
        <br />
        Just a quick note that invoice {"{number}"} for {"{amount}"} was
        due on {"{date}"}. I know things get busy — could you let me know
        when payment is scheduled?
        <br />
        <br />
        Thanks,
        <br />
        {"{your name}"}
      </blockquote>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. One to two weeks late — firm follow-up
      </h2>
      <p>
        Still polite, but now you&apos;re explicitly asking for a date and
        referencing the original terms.
      </p>
      <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground">
        Subject: Following up — Invoice {"{number}"}, {"{days}"} days
        overdue
        <br />
        <br />
        Hi {"{name}"},
        <br />
        <br />
        I haven&apos;t received payment for invoice {"{number}"} ({"{amount}"}),
        which was due on {"{date}"} under our agreed {"{terms}"} terms.
        Could you confirm when I can expect payment? Happy to resend the
        invoice or provide any documentation your finance team needs.
        <br />
        <br />
        Best,
        <br />
        {"{your name}"}
      </blockquote>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Three+ weeks late — final notice
      </h2>
      <p>
        Direct, specific about consequences, and gives a hard deadline.
        Only send this once you genuinely mean it.
      </p>
      <blockquote className="border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground">
        Subject: Final notice — Invoice {"{number}"} ({"{days}"} days
        overdue)
        <br />
        <br />
        Hi {"{name}"},
        <br />
        <br />
        Invoice {"{number}"} for {"{amount}"} is now {"{days}"} days
        overdue, despite my reminders on {"{date1}"} and {"{date2}"}.
        Please arrange payment by {"{deadline}"}. If I don&apos;t hear
        back, I&apos;ll need to pause further work and consider next
        steps, including late payment fees as outlined in our agreement.
        <br />
        <br />
        {"{your name}"}
      </blockquote>

      <h2 className="text-xl font-semibold mt-8 mb-2">A few things that actually help</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Attach the invoice PDF again every time — don&apos;t assume
          they still have the original.
        </li>
        <li>
          If you can see whether the invoice was opened, mention it
          tactfully if it clearly wasn&apos;t (&quot;just want to make sure
          this reached the right inbox&quot;) — it&apos;s a softer way to
          flag a possible delivery issue than a payment issue.
        </li>
        <li>
          Set a late payment fee in your contract upfront, so referencing
          it later isn&apos;t a surprise escalation.
        </li>
        <li>
          Keep a record of every reminder sent and when — useful if it
          ever needs to go to a collections agency or small claims.
        </li>
      </ul>

      <p>
        InvoiceFlow&apos;s Pro plan tracks exactly when (and how many
        times) a client opens an invoice, so you know whether a reminder
        is actually needed or the invoice is just sitting unopened.
      </p>
    </>
  );
}
