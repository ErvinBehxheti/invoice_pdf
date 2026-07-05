"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignInButton } from "@clerk/nextjs";
import { toast } from "sonner";
import { Download, Save, Send, Trash2 } from "lucide-react";

import { invoiceReducer } from "@/lib/invoice-reducer";
import {
  createInitialInvoiceState,
  ALL_TEMPLATES,
  type InvoiceData,
  type InvoiceFormState,
} from "@/lib/types";
import { calculateTotals } from "@/lib/invoice-calc";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CurrencySelect } from "@/components/shared/CurrencySelect";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

import { LineItemsTable } from "./LineItemsTable";
import { ClientSelector } from "./ClientSelector";
import { TaxRow } from "./TaxRow";
import { InvoiceSummary } from "./InvoiceSummary";
import { TemplateSelector } from "./TemplateSelector";
import { InvoicePreviewPane } from "./InvoicePreviewPane";

const DRAFT_KEY = "invoiceflow_draft";
const PENDING_SAVE_KEY = "invoiceflow_pending_save";

interface InvoiceBuilderProps {
  invoiceId?: string;
  initialState?: InvoiceFormState;
  initialTemplate?: string;
  isPro?: boolean;
}

export function InvoiceBuilder({
  invoiceId,
  initialState,
  initialTemplate,
  isPro: isProProp,
}: InvoiceBuilderProps) {
  const isEditMode = !!invoiceId;
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [detectedIsPro, setDetectedIsPro] = useState(false);
  const isPro = isProProp ?? detectedIsPro;

  const [state, dispatch] = useReducer(
    invoiceReducer,
    undefined as never,
    () => {
      if (initialState) return initialState;
      const base = createInitialInvoiceState();
      const isValidTemplate =
        initialTemplate &&
        (ALL_TEMPLATES as readonly string[]).includes(initialTemplate);
      return isValidTemplate ? { ...base, templateId: initialTemplate } : base;
    }
  );
  const [hydrated, setHydrated] = useState(isEditMode);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hadExistingDraft = useRef(false);

  // Load draft from localStorage (create mode only)
  useEffect(() => {
    if (isEditMode) return;
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        hadExistingDraft.current = true;
        dispatch({ type: "LOAD_DRAFT", state: JSON.parse(saved) as InvoiceFormState });
      }
    } catch {
      // corrupt draft, ignore and start fresh
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- this flips a "mounted" flag gating client-only localStorage access (SSR-safe pattern); there's no lazy-init alternative since localStorage doesn't exist during server render
    setHydrated(true);
  }, [isEditMode]);

  // Persist draft to localStorage (create mode only)
  useEffect(() => {
    if (!hydrated || isEditMode) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  }, [state, hydrated, isEditMode]);

  // Prefill from saved account defaults for a genuinely fresh invoice (signed in, no draft yet)
  useEffect(() => {
    if (isEditMode || !hydrated || !isSignedIn || hadExistingDraft.current) return;
    fetch("/api/user")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!body?.user) return;
        const u = body.user;
        setDetectedIsPro(u.planTier === "pro");
        dispatch({
          type: "APPLY_DEFAULTS",
          defaults: {
            fromName: u.name ?? "",
            fromEmail: u.email ?? "",
            currency: u.defaultCurrency ?? "EUR",
            paymentTerms: u.defaultPaymentTerms ?? "",
            taxLabel: u.defaultTaxLabel ?? "VAT",
            taxRate: u.defaultTaxRate ?? 0,
            bankDetails: u.defaultBankDetails ?? "",
            paymentLinkUrl: u.defaultPaymentLinkUrl ?? "",
            logoUrl: u.logoUrl ?? null,
            brandColor: u.brandColor ?? "#171717",
          },
        });
      })
      .catch(() => {
        // defaults are a nice-to-have; ignore failures silently
      });
  }, [isEditMode, hydrated, isSignedIn]);

  const totals = calculateTotals(state);
  const invoiceData: InvoiceData = { ...state, ...totals };

  function setField<K extends keyof InvoiceFormState>(field: K, value: InvoiceFormState[K]) {
    dispatch({ type: "SET_FIELD", field, value });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = isEditMode ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      if (res.status === 402) {
        setShowUpgrade(true);
        return;
      }
      if (!res.ok) throw new Error("Failed to save invoice");

      const { invoice } = await res.json();

      if (isEditMode) {
        toast.success("Invoice updated");
        router.refresh();
      } else {
        localStorage.removeItem(DRAFT_KEY);
        toast.success("Invoice saved");
        router.push(`/invoices/${invoice.id}`);
      }
    } catch {
      toast.error("Couldn't save invoice. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Auto-save once a signed-out user completes sign-in via the modal triggered by Save.
  // Tracked through localStorage (not just component state) because OAuth sign-in
  // (Google/Apple) navigates away to the provider and back, which fully remounts this
  // component — a plain "was signed out, now signed in" ref never survives that reload,
  // silently dropping the save. localStorage does survive it.
  const pendingSaveHandled = useRef(false);
  useEffect(() => {
    if (!hydrated || isEditMode || !isSignedIn) return;
    if (pendingSaveHandled.current) return;
    if (localStorage.getItem(PENDING_SAVE_KEY) !== "1") return;
    pendingSaveHandled.current = true;
    localStorage.removeItem(PENDING_SAVE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: this effect is syncing with external state (a localStorage flag surviving a full-page OAuth redirect plus the Clerk session), not deriving local state from props
    handleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isEditMode, isSignedIn]);

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/invoices/draft/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${state.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Invoice deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Couldn't delete invoice.");
    }
  }

  async function handleSend() {
    if (!state.toEmail) {
      toast.error("Add a client email address before sending.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Failed to send invoice");
      toast.success(`Invoice sent to ${state.toEmail}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send invoice.");
    } finally {
      setSending(false);
    }
  }

  if (!hydrated) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Form */}
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Invoice number</Label>
            <Input
              value={state.invoiceNumber}
              disabled={isEditMode}
              onChange={(e) => setField("invoiceNumber", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Currency</Label>
            <CurrencySelect
              value={state.currency}
              onChange={(value) => setField("currency", value)}
              className="w-24"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Template</Label>
          <TemplateSelector
            value={state.templateId}
            isPro={isPro}
            onChange={(templateId) => setField("templateId", templateId)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">From</h3>
            <Input
              placeholder="Your name or business"
              value={state.fromName}
              onChange={(e) => setField("fromName", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={state.fromEmail}
              onChange={(e) => setField("fromEmail", e.target.value)}
            />
            <Textarea
              placeholder="Address"
              value={state.fromAddress}
              onChange={(e) => setField("fromAddress", e.target.value)}
            />
            <Input
              placeholder="VAT number (optional)"
              value={state.fromVatNumber}
              onChange={(e) => setField("fromVatNumber", e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Bill to</h3>
            <ClientSelector
              isPro={isPro}
              selectedClientId={state.clientId}
              onSelect={(client) => {
                dispatch({
                  type: "APPLY_DEFAULTS",
                  defaults: {
                    clientId: client.id,
                    toName: client.name,
                    toCompany: client.company ?? "",
                    toEmail: client.email ?? "",
                    toAddress: client.address ?? "",
                    toVatNumber: client.vatNumber ?? "",
                  },
                });
              }}
            />
            <Input
              placeholder="Client name"
              value={state.toName}
              onChange={(e) => setField("toName", e.target.value)}
            />
            <Input
              placeholder="Company (optional)"
              value={state.toCompany}
              onChange={(e) => setField("toCompany", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={state.toEmail}
              onChange={(e) => setField("toEmail", e.target.value)}
            />
            <Textarea
              placeholder="Address"
              value={state.toAddress}
              onChange={(e) => setField("toAddress", e.target.value)}
            />
            <Input
              placeholder="VAT number (optional)"
              value={state.toVatNumber}
              onChange={(e) => setField("toVatNumber", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Issue date</Label>
            <Input
              type="date"
              value={state.issueDate}
              onChange={(e) => setField("issueDate", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Due date</Label>
            <Input
              type="date"
              value={state.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Payment terms</Label>
            <Input
              placeholder="Net 14"
              value={state.paymentTerms}
              onChange={(e) => setField("paymentTerms", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Line items</h3>
          <LineItemsTable
            lineItems={state.lineItems}
            currency={state.currency}
            dispatch={dispatch}
          />
        </div>

        <TaxRow state={state} dispatch={dispatch} />

        <InvoiceSummary
          subtotal={totals.subtotal}
          discountAmount={totals.discountAmount}
          taxAmount={totals.taxAmount}
          total={totals.total}
          currency={state.currency}
          taxLabel={state.taxLabel}
          taxRate={state.taxRate}
        />

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea
              placeholder="Thanks for your business!"
              value={state.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Payment details</Label>
            <Textarea
              placeholder="IBAN / bank details"
              value={state.bankDetails}
              onChange={(e) => setField("bankDetails", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Payment link (optional)</Label>
          <Input
            placeholder="https://buy.stripe.com/… or paypal.me/yourname"
            value={state.paymentLinkUrl}
            onChange={(e) => setField("paymentLinkUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Clients get a &quot;Pay now&quot; button on the invoice page, the email,
            and the PDF. Works with Stripe Payment Links, PayPal.me, Wise, and more.
          </p>
        </div>
      </div>

      {/* Preview + actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive mr-auto"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          )}
          {isEditMode && (
            <Button variant="outline" onClick={handleSend} disabled={sending}>
              <Send className="w-4 h-4 mr-1.5" />
              {sending ? "Sending…" : "Send invoice"}
            </Button>
          )}
          {isSignedIn ? (
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-1.5" />
              {saving ? "Saving…" : isEditMode ? "Save changes" : "Save invoice"}
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button
                variant="outline"
                onClick={() => localStorage.setItem(PENDING_SAVE_KEY, "1")}
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save invoice
              </Button>
            </SignInButton>
          )}
          <Button onClick={handleDownload} disabled={downloading}>
            <Download className="w-4 h-4 mr-1.5" />
            {downloading ? "Generating…" : "Download PDF"}
          </Button>
        </div>
        <InvoicePreviewPane invoice={invoiceData} />
      </div>

      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        reason="You've used all 3 free invoices this month."
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete this invoice?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
