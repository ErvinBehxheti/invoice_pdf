"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string;
}

export function UpgradeModal({ open, onOpenChange, reason }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            {reason ?? "You've reached the free plan limit."} Pro gives you unlimited
            invoices, custom branding, client database, and more — for €2/month.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          <Link href="/settings/billing" className={buttonVariants()}>
            View plans
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
