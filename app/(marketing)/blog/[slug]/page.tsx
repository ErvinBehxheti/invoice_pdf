import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/content/blog";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { HowToWriteAProfessionalInvoice } from "@/components/blog/posts/HowToWriteAProfessionalInvoice";
import { HowToAddVatToAnInvoice } from "@/components/blog/posts/HowToAddVatToAnInvoice";
import { HowToFollowUpOnAnUnpaidInvoice } from "@/components/blog/posts/HowToFollowUpOnAnUnpaidInvoice";
import { InvoiceVsReceipt } from "@/components/blog/posts/InvoiceVsReceipt";

const postContent: Record<string, () => React.ReactElement> = {
  "how-to-write-a-professional-invoice": HowToWriteAProfessionalInvoice,
  "how-to-add-vat-to-an-invoice": HowToAddVatToAnInvoice,
  "how-to-follow-up-on-an-unpaid-invoice": HowToFollowUpOnAnUnpaidInvoice,
  "invoice-vs-receipt": InvoiceVsReceipt,
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — InvoiceFlow Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const Content = postContent[slug];

  if (!post || !Content) notFound();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const postUrl = `${appUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    image: `${appUrl}/opengraph-image`,
    author: {
      "@type": "Organization",
      name: "InvoiceFlow",
      url: appUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "InvoiceFlow",
      url: appUrl,
      logo: { "@type": "ImageObject", url: `${appUrl}/opengraph-image` },
    },
  };

  return (
    <BlogPostLayout post={post} jsonLd={jsonLd}>
      <Content />
    </BlogPostLayout>
  );
}
