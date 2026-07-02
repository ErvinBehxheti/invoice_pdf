"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-lg font-semibold mb-1">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        An unexpected error occurred loading this page. Try again, or head
        back to your dashboard.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline" }))}>
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
