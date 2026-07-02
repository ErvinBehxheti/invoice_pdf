"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoUploadProps {
  logoUrl: string | null;
  onChange: (url: string | null) => void;
}

export function LogoUpload({ logoUrl, onChange }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/user/logo", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to upload logo");
      onChange(body.logoUrl);
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't upload logo");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    try {
      const res = await fetch("/api/user/logo", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove logo");
      onChange(null);
    } catch {
      toast.error("Couldn't remove logo");
    }
  }

  return (
    <div className="flex items-center gap-4">
      {logoUrl ? (
        <div className="relative w-16 h-16 rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            title="Remove logo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground">
          <Upload className="w-5 h-5" />
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5 mr-1.5" />
          )}
          {uploading ? "Uploading…" : logoUrl ? "Replace logo" : "Upload logo"}
        </Button>
        <p className="text-xs text-muted-foreground mt-1.5">PNG, JPG, SVG or WebP. Max 2MB.</p>
      </div>
    </div>
  );
}
