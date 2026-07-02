import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "InvoiceFlow — Free Invoice Generator for Freelancers",
  description:
    "Create professional invoices in 60 seconds. No signup required to try. Download PDF free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
