import Link from "next/link";
import { blogPosts } from "@/lib/content/blog";
import { formatDate } from "@/lib/utils/format";
import { SiteNav } from "@/components/marketing/SiteNav";
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
      <SiteNav />

      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-2">Blog</h1>
        <p className="text-muted-foreground mb-12">
          Practical invoicing guides for freelancers.
        </p>

        <div className="divide-y divide-dashed divide-border border-t border-dashed border-border">
          {blogPosts
            .slice()
            .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
            .map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group py-6 first:pt-0"
              >
                <p className="text-xs font-mono text-muted-foreground mb-1.5">
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
