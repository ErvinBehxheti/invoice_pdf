import { formatCurrency } from "@/lib/utils/format";

interface StatsBarProps {
  outstanding: number;
  paidThisMonth: number;
  overdueCount: number;
  currency: string;
}

export function StatsBar({
  outstanding,
  paidThisMonth,
  overdueCount,
  currency,
}: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
        <p className="text-2xl font-semibold">
          {formatCurrency(outstanding, currency)}
        </p>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs text-muted-foreground mb-1">Paid this month</p>
        <p className="text-2xl font-semibold text-green-600">
          {formatCurrency(paidThisMonth, currency)}
        </p>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs text-muted-foreground mb-1">Overdue</p>
        <p className={`text-2xl font-semibold ${overdueCount > 0 ? "text-red-600" : ""}`}>
          {overdueCount}
        </p>
      </div>
    </div>
  );
}
