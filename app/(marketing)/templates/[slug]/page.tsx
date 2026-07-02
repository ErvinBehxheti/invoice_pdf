import { notFound } from "next/navigation";
import { templatePages, getTemplatePage } from "@/lib/content/template-pages";
import { TemplateLandingPage } from "@/components/marketing/TemplateLandingPage";

export function generateStaticParams() {
  return templatePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getTemplatePage(slug);
  if (!page) return {};

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/templates/${page.slug}` },
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getTemplatePage(slug);

  if (!page) notFound();

  return (
    <TemplateLandingPage
      title={page.title}
      intro={page.intro}
      templateId={page.templateId}
      features={page.features}
      sections={page.sections}
      faqs={page.faqs}
      learnMoreHref={page.learnMoreHref}
      learnMoreLabel={page.learnMoreLabel}
    />
  );
}
