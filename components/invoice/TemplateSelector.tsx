"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { FREE_TEMPLATES, PRO_TEMPLATES } from "@/lib/types";
import { UpgradeModal } from "@/components/shared/UpgradeModal";

interface TemplateSelectorProps {
  value: string;
  onChange: (templateId: string) => void;
  isPro: boolean;
}

const TEMPLATE_LABELS: Record<string, string> = {
  clean: "Clean",
  professional: "Professional",
  minimal: "Minimal",
  bold: "Bold",
  modern: "Modern",
};

export function TemplateSelector({ value, onChange, isPro }: TemplateSelectorProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {FREE_TEMPLATES.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
              value === id
                ? "border-primary bg-primary/10 text-primary"
                : "border-input hover:bg-muted"
            )}
          >
            {TEMPLATE_LABELS[id]}
          </button>
        ))}
        {PRO_TEMPLATES.map((id) =>
          isPro ? (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                value === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted"
              )}
            >
              {TEMPLATE_LABELS[id]}
            </button>
          ) : (
            <button
              key={id}
              type="button"
              onClick={() => setShowUpgrade(true)}
              title="Available on Pro"
              className="px-3 py-1.5 rounded-md text-sm font-medium border border-input text-muted-foreground opacity-60 flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3" />
              {TEMPLATE_LABELS[id]}
            </button>
          )
        )}
      </div>
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        reason="More templates are a Pro feature."
      />
    </>
  );
}
