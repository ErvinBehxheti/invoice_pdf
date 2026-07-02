"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingActions({ isPro }: { isPro: boolean }) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") toast.success("Welcome to Pro!");
    if (checkout === "cancelled") toast.info("Checkout cancelled.");
  }, [searchParams]);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch(isPro ? "/api/stripe/portal" : "/api/stripe/checkout", {
        method: "POST",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong");
      window.location.href = body.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {isPro ? (
        <>
          <Settings className="w-4 h-4 mr-1.5" />
          {loading ? "Loading…" : "Manage subscription"}
        </>
      ) : (
        <>
          <Zap className="w-4 h-4 mr-1.5" />
          {loading ? "Loading…" : "Upgrade to Pro"}
        </>
      )}
    </Button>
  );
}
