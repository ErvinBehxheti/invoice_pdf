import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <h1 className="text-lg font-semibold mb-1">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className={buttonVariants()}>
        Go home
      </Link>
    </div>
  );
}
