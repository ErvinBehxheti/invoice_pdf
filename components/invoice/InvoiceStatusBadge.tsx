import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Color budget stays reserved for pine=good and rust=bad; the in-between
// statuses are differentiated by border/weight, not by introducing more hues.
const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-muted text-foreground border border-border" },
  viewed: { label: "Viewed", className: "bg-muted text-foreground border border-primary/30" },
  paid: { label: "Paid", className: "bg-primary/15 text-primary" },
  overdue: { label: "Overdue", className: "bg-destructive/15 text-destructive" },
  canceled: { label: "Canceled", className: "bg-muted text-muted-foreground line-through" },
};

export function InvoiceStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.draft;
  return (
    <Badge className={cn("font-medium border-0", config.className)}>
      {config.label}
    </Badge>
  );
}
