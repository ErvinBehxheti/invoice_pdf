import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", className: "bg-blue-100 text-blue-700" },
  viewed: { label: "Viewed", className: "bg-purple-100 text-purple-700" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700" },
  overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
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
