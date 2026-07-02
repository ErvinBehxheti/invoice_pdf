import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/invoices/new",
        "/pricing",
        "/blog",
        "/templates/freelancer-invoice-template",
        "/templates/vat-invoice-template",
      ],
      disallow: [
        "/dashboard",
        "/invoices",
        "/clients",
        "/settings",
        "/i",
        "/api",
        "/sign-in",
        "/sign-up",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
