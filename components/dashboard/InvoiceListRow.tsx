"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, MoreVertical, CheckCircle2, AlertCircle, Trash2, Copy } from "lucide-react";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import { formatCurrency, formatDate, formatRelativeTime } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  toName: string;
  toCompany: string | null;
  total: number;
  currency: string;
  status: string;
  issueDate: Date;
  viewCount: number;
  viewedAt: Date | null;
}

export function InvoiceListRow({ invoice }: { invoice: InvoiceRow }) {
  const router = useRouter();

  async function updateStatus(status: string) {
    const res = await fetch(`/api/invoices/${invoice.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Couldn't update invoice status.");
      return;
    }
    toast.success(`Marked as ${status}`);
    router.refresh();
  }

  async function handleDelete() {
    const res = await fetch(`/api/invoices/${invoice.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete invoice.");
      return;
    }
    toast.success("Invoice deleted");
    router.refresh();
  }

  async function handleClone() {
    const res = await fetch(`/api/invoices/${invoice.id}/clone`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (res.status === 402) {
      toast.error("Free plan limit reached for this month.");
      return;
    }
    if (!res.ok) {
      toast.error(body.error ?? "Couldn't clone invoice.");
      return;
    }
    toast.success("Invoice cloned");
    router.push(`/invoices/${body.invoice.id}`);
  }

  return (
    <div className="flex items-center gap-2 border-b last:border-0">
      <Link
        href={`/invoices/${invoice.id}`}
        className="flex-1 flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors min-w-0"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{invoice.invoiceNumber}</span>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {invoice.toCompany || invoice.toName}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm shrink-0">
          {invoice.viewCount > 0 && (
            <span
              className="flex items-center gap-1 text-xs text-muted-foreground"
              title={
                invoice.viewedAt
                  ? `Viewed ${invoice.viewCount}× • Last: ${formatRelativeTime(invoice.viewedAt)}`
                  : undefined
              }
            >
              <Eye className="w-3.5 h-3.5" />
              {invoice.viewCount}×
              {invoice.viewedAt && (
                <span className="hidden sm:inline">
                  • {formatRelativeTime(invoice.viewedAt)}
                </span>
              )}
            </span>
          )}
          <span className="text-muted-foreground text-xs">
            {formatDate(invoice.issueDate)}
          </span>
          <span className="font-medium w-24 text-right">
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="mr-3 shrink-0" />
          }
        >
          <MoreVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => updateStatus("paid")}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as paid
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("overdue")}>
            <AlertCircle className="w-4 h-4 mr-2" />
            Mark as overdue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleClone}>
            <Copy className="w-4 h-4 mr-2" />
            Clone
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
