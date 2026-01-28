import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CasesList } from '@/components/cases/CasesList';
import { CasesFilter } from '@/components/cases/CasesFilter';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cases');

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

// Mock data - In production, fetch from API
const mockCases = [
  {
    id: '1',
    title: 'Modern Living Room Transformation',
    slug: 'modern-living-room',
    description: 'Complete curtain installation for a contemporary apartment',
    category: 'residential',
    location: 'New York, USA',
    completedAt: '2024-01',
    beforeImage: '/placeholder.jpg',
    afterImage: '/placeholder.jpg',
    featuredImage: '/placeholder.jpg',
  },
  {
    id: '2',
    title: 'Luxury Hotel Suite',
    slug: 'luxury-hotel-suite',
    description: 'Premium blackout curtains for a 5-star hotel chain',
    category: 'hotel',
    location: 'Los Angeles, USA',
    completedAt: '2024-02',
    beforeImage: '/placeholder.jpg',
    afterImage: '/placeholder.jpg',
    featuredImage: '/placeholder.jpg',
  },
  {
    id: '3',
    title: 'Corporate Office Renovation',
    slug: 'corporate-office',
    description: 'Smart motorized blinds for a tech company headquarters',
    category: 'commercial',
    location: 'San Francisco, USA',
    completedAt: '2024-03',
    beforeImage: '/placeholder.jpg',
    afterImage: '/placeholder.jpg',
    featuredImage: '/placeholder.jpg',
  },
];

const categories = ['residential', 'commercial', 'hotel'] as const;

interface CasesPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const t = await getTranslations('cases');
  const params = await searchParams;
  const selectedCategory = params.category || '';

  const filteredCases = selectedCategory
    ? mockCases.filter((c) => c.category === selectedCategory)
    : mockCases;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Filter */}
      <CasesFilter
        categories={categories as unknown as string[]}
        selectedCategory={selectedCategory}
      />

      {/* Cases Grid */}
      <CasesList cases={filteredCases} />
    </div>
  );
}
