import { Sidebar } from "./Sidebar";

export function AppShell({
  children,
  isPro,
}: {
  children: React.ReactNode;
  isPro: boolean;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar isPro={isPro} />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
}
