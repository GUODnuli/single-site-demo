import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { BeforeAfterSlider } from '@/components/cases/BeforeAfterSlider';
import { CaseDetails } from '@/components/cases/CaseDetails';
import { ClientTestimonial } from '@/components/cases/ClientTestimonial';
import { RelatedCases } from '@/components/cases/RelatedCases';

// Mock data - In production, fetch from API
const mockCaseDetail = {
  id: '1',
  title: 'Modern Living Room Transformation',
  slug: 'modern-living-room',
  description:
    'A complete window treatment makeover for a contemporary New York apartment. The client wanted to balance natural light with privacy while maintaining a modern aesthetic.',
  content: `
    <p>This project involved the complete transformation of a 2,500 sq ft apartment in Manhattan. The client, a young professional couple, wanted curtains that would complement their minimalist interior design while providing excellent light control and privacy.</p>
    <h3>The Challenge</h3>
    <p>The apartment featured floor-to-ceiling windows with stunning city views. However, the east-facing windows received intense morning sunlight, making the living space uncomfortably bright and warm.</p>
    <h3>Our Solution</h3>
    <p>We recommended our premium dual-layer curtain system combining sheer voile panels with heavy blackout drapes. The motorized track system allows for easy control via smartphone app.</p>
  `,
  category: 'residential',
  location: 'New York, USA',
  completedAt: '2024-01',
  beforeImage: '/placeholder.jpg',
  afterImage: '/placeholder.jpg',
  galleryImages: ['/placeholder.jpg', '/placeholder.jpg', '/placeholder.jpg'],
  productsUsed: [
    { name: 'Premium Blackout Drapes', slug: 'premium-blackout' },
    { name: 'Sheer Voile Panels', slug: 'sheer-voile' },
    { name: 'Motorized Track System', slug: 'motorized-track' },
  ],
  projectScope: '12 windows across living room, bedroom, and home office',
  testimonial: {
    content:
      "The transformation exceeded our expectations. The curtains not only look stunning but have made our apartment so much more comfortable. The team was professional and the installation was seamless.",
    author: 'Sarah & Michael',
    title: 'Homeowners',
  },
};

const relatedCases = [
  {
    id: '2',
    title: 'Penthouse Suite Renovation',
    slug: 'penthouse-suite',
    category: 'residential',
    featuredImage: '/placeholder.jpg',
  },
  {
    id: '3',
    title: 'Suburban Family Home',
    slug: 'suburban-home',
    category: 'residential',
    featuredImage: '/placeholder.jpg',
  },
];

interface CaseDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  // In production, fetch case data
  const caseData = slug === mockCaseDetail.slug ? mockCaseDetail : null;

  if (!caseData) {
    return { title: 'Case Not Found' };
  }

  return {
    title: caseData.title,
    description: caseData.description,
  };
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations('cases');

  // In production, fetch from API
  const caseData = slug === mockCaseDetail.slug ? mockCaseDetail : null;

  if (!caseData) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: t('title'), href: '/cases' },
    { label: caseData.title, href: `/cases/${slug}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      {/* Case Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{caseData.title}</h1>
        <p className="text-muted-foreground">{caseData.description}</p>
      </div>

      {/* Before/After Comparison */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">{t('beforeAfter')}</h2>
        <BeforeAfterSlider
          beforeImage={caseData.beforeImage}
          afterImage={caseData.afterImage}
          beforeLabel="Before"
          afterLabel="After"
        />
      </section>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: caseData.content }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CaseDetails
            location={caseData.location}
            completedAt={caseData.completedAt}
            category={caseData.category}
            projectScope={caseData.projectScope}
            productsUsed={caseData.productsUsed}
          />
        </div>
      </div>

      {/* Client Testimonial */}
      {caseData.testimonial && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">{t('clientTestimonial')}</h2>
          <ClientTestimonial
            content={caseData.testimonial.content}
            author={caseData.testimonial.author}
            title={caseData.testimonial.title}
          />
        </section>
      )}

      {/* Related Cases */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">{t('moreProjects')}</h2>
        <RelatedCases cases={relatedCases} />
      </section>
    </div>
  );
}
