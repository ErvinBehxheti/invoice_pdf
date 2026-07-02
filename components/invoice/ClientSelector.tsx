"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Client } from "@/lib/generated/prisma/client";

interface ClientSelectorProps {
  isPro: boolean;
  selectedClientId: string | null;
  onSelect: (client: Client) => void;
}

export function ClientSelector({ isPro, selectedClientId, onSelect }: ClientSelectorProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isPro) return;
    fetch("/api/clients")
      .then((res) => (res.ok ? res.json() : { clients: [] }))
      .then((body) => setClients(body.clients ?? []))
      .catch(() => {});
  }, [isPro]);

  if (!isPro || clients.length === 0) return null;

  const selected = clients.find((c) => c.id === selectedClientId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="outline" size="sm" className="justify-between w-full" />}
      >
        <span className="flex items-center gap-1.5 truncate">
          <Users className="w-3.5 h-3.5 shrink-0" />
          {selected ? selected.company || selected.name : "Select a saved client…"}
        </span>
        <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search clients…" />
          <CommandList>
            <CommandEmpty>No clients found.</CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.name} ${client.company ?? ""}`}
                  onSelect={() => {
                    onSelect(client);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "w-3.5 h-3.5 mr-2",
                      selectedClientId === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="truncate">{client.company || client.name}</p>
                    {client.company && (
                      <p className="text-xs text-muted-foreground truncate">{client.name}</p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
