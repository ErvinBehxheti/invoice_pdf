export function computeNextSendAt(cadence: "weekly" | "monthly", from: Date = new Date()): Date {
  const next = new Date(from);
  if (cadence === "weekly") {
    next.setDate(next.getDate() + 7);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}
