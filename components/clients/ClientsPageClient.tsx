"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanGate } from "@/components/shared/PlanGate";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ClientCard } from "./ClientCard";
import { ClientForm } from "./ClientForm";
import type { Client } from "@/lib/generated/prisma/client";

export function ClientsPageClient({
  isPro,
  initialClients,
}: {
  isPro: boolean;
  initialClients: Client[];
}) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  function refresh() {
    router.refresh();
    fetch("/api/clients")
      .then((res) => res.json())
      .then((body) => setClients(body.clients ?? []));
  }

  async function handleDelete() {
    if (!deletingClient) return;
    const res = await fetch(`/api/clients/${deletingClient.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Couldn't delete client");
      return;
    }
    toast.success("Client deleted");
    refresh();
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Save clients to pre-fill invoices in one click.
          </p>
        </div>
        <PlanGate isPro={isPro} feature="Saved clients">
          <Button
            onClick={() => {
              setEditingClient(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add client
          </Button>
        </PlanGate>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-base font-semibold mb-1">No clients yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            {isPro
              ? "Add a client to pre-fill their details on future invoices."
              : "Saved clients are a Pro feature — upgrade to start building your client list."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => {
                setEditingClient(client);
                setFormOpen(true);
              }}
              onDelete={() => setDeletingClient(client)}
            />
          ))}
        </div>
      )}

      <ClientForm
        open={formOpen}
        onOpenChange={setFormOpen}
        client={editingClient}
        onSaved={refresh}
      />
      <ConfirmDialog
        open={!!deletingClient}
        onOpenChange={(open) => !open && setDeletingClient(null)}
        title="Delete this client?"
        description="This won't affect any invoices you've already created for them."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  );
}
