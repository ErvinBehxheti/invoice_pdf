"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { UpgradeModal } from "./UpgradeModal";

interface PlanGateProps {
  isPro: boolean;
  feature?: string;
  children: React.ReactNode;
}

export function PlanGate({ isPro, feature, children }: PlanGateProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (isPro) return <>{children}</>;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowUpgrade(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowUpgrade(true);
        }}
        className="relative w-full text-left cursor-pointer"
      >
        <div className="pointer-events-none opacity-50 select-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-md bg-background/60 text-xs font-medium">
          <Lock className="w-3.5 h-3.5" />
          Unlock with Pro
        </div>
      </div>
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        reason={feature ? `${feature} is a Pro feature.` : undefined}
      />
    </>
  );
}
