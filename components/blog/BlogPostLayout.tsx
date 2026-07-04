import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format";
import type { BlogPost } from "@/lib/content/blog";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export function BlogPostLayout({
  post,
  jsonLd,
  children,
}: {
  post: BlogPost;
  jsonLd?: object;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <SiteNav />

      <article className="max-w-2xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to blog
        </Link>

        <header className="mt-6 mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-[1.1] mb-3">
            {post.title}
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            {formatDate(post.publishedAt)} · {post.readingTime}
          </p>
        </header>

        <div className="space-y-5 text-[15px] leading-7 text-foreground">
          {children}
        </div>

        <div className="mt-14 rounded-xl border border-border p-6 text-center">
          <p className="font-semibold mb-1">Ready to send your invoice?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Create a professional invoice in under 60 seconds. No signup required to try.
          </p>
          <Link href="/invoices/new" className={buttonVariants()}>
            Create free invoice
          </Link>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}
