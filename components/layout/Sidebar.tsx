"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Users,
  Settings,
  Zap,
  LogOut,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices/new", label: "New Invoice", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users, proOnly: true },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <aside className="flex flex-col w-60 min-h-screen border-r bg-card px-4 py-6 shrink-0">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-base tracking-tight">
          InvoiceFlow
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon, proOnly }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {proOnly && (
                <Badge
                  variant="secondary"
                  className="ml-auto text-[10px] px-1.5 py-0"
                >
                  Pro
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="mt-auto pt-4 space-y-3">
        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-xs font-medium mb-1">Free plan</p>
          <p className="text-xs text-muted-foreground mb-3">
            3 invoices/month. Upgrade for unlimited.
          </p>
          <Link
            href="/settings/billing"
            className={cn(buttonVariants({ size: "sm" }), "w-full gap-1.5")}
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade to Pro
          </Link>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-1">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {user?.fullName ?? user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
