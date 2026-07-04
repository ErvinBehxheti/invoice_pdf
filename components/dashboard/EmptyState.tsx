import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center mb-5">
        <FileText className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold mb-1">No invoices yet</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Create your first invoice and get paid in minutes.
      </p>
      <Link href="/invoices/new" className={buttonVariants()}>
        <Plus className="w-4 h-4 mr-1.5" />
        Create invoice
      </Link>
    </div>
  );
}
