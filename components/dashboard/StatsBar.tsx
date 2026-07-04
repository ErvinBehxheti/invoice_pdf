import { Amount } from "@/components/shared/Amount";

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
      <div className="rounded-xl border border-border p-5">
        <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
        <Amount value={outstanding} currency={currency} className="text-2xl font-semibold" />
      </div>
      <div className="rounded-xl border border-border p-5">
        <p className="text-xs text-muted-foreground mb-1">Paid this month</p>
        <Amount
          value={paidThisMonth}
          currency={currency}
          className="text-2xl font-semibold text-primary"
        />
      </div>
      <div className="rounded-xl border border-border p-5">
        <p className="text-xs text-muted-foreground mb-1">Overdue</p>
        <p
          className={`text-2xl font-mono font-semibold tabular-nums ${overdueCount > 0 ? "text-destructive" : ""}`}
        >
          {overdueCount}
        </p>
      </div>
    </div>
  );
}
