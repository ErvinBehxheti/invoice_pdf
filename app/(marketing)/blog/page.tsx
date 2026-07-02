import Link from "next/link";
import { FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { blogPosts } from "@/lib/content/blog";
import { formatDate } from "@/lib/utils/format";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const metadata = {
  title: "Freelancer Invoicing Guides & Tips — InvoiceFlow Blog",
  description:
    "Practical invoicing guides for freelancers: writing professional invoices, VAT, chasing late payments, and more.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            InvoiceFlow
          </Link>
          <Link href="/invoices/new" className={buttonVariants({ size: "sm" })}>
            Try for free
          </Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">
          Practical invoicing guides for freelancers.
        </p>

        <div className="space-y-8">
          {blogPosts
            .slice()
            .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
            .map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <p className="text-xs text-muted-foreground mb-1.5">
                  {formatDate(post.publishedAt)} · {post.readingTime}
                </p>
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
              </Link>
            ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
