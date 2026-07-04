"use client";

import { Pencil, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Client } from "@/lib/generated/prisma/client";

interface ClientCardProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{client.company || client.name}</p>
        {client.company && (
          <p className="text-xs text-muted-foreground truncate">{client.name}</p>
        )}
        {client.email && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3" />
            {client.email}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={onEdit} title="Edit">
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          title="Delete"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
