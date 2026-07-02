"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <AlertTriangle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-lg font-semibold mb-1">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        An unexpected error occurred. Try again, or head back home.
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Go home
        </Link>
      </div>
    </div>
  );
}
