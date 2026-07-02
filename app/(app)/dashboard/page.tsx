import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { buttonVariants } from "@/components/ui/button";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { InvoiceListRow } from "@/components/dashboard/InvoiceListRow";
import type { Invoice } from "@/lib/generated/prisma/client";

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const invoices = await db.invoice.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const outstanding = invoices
    .filter((inv: Invoice) => inv.status === "sent" || inv.status === "viewed")
    .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

  const paidThisMonth = invoices
    .filter(
      (inv: Invoice) =>
        inv.status === "paid" && inv.paidAt && inv.paidAt >= startOfMonth
    )
    .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

  const overdueCount = invoices.filter(
    (inv: Invoice) => inv.status === "overdue"
  ).length;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your invoices and track payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          {invoices.length > 0 && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages -- this triggers a file download (Content-Disposition: attachment), not a page navigation; next/link would soft-navigate and break the download
            <a
              href="/api/invoices?export=csv"
              className={buttonVariants({ variant: "outline" })}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV
            </a>
          )}
          <Link href="/invoices/new" className={buttonVariants()}>
            <Plus className="w-4 h-4 mr-1.5" />
            New invoice
          </Link>
        </div>
      </div>

      {/* Stats */}
      {invoices.length > 0 && (
        <StatsBar
          outstanding={outstanding}
          paidThisMonth={paidThisMonth}
          overdueCount={overdueCount}
          currency={user.defaultCurrency}
        />
      )}

      {/* List */}
      {invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-xl border bg-card">
          {invoices.map((invoice: Invoice) => (
            <InvoiceListRow key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
}
