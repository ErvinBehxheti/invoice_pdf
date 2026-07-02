import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content/blog";
import { templatePages } from "@/lib/content/template-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/invoices/new`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...templatePages.map((page) => ({
      url: `${baseUrl}/templates/${page.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
