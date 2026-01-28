'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RelatedCase {
  id: string;
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
}

interface RelatedCasesProps {
  cases: RelatedCase[];
}

export function RelatedCases({ cases }: RelatedCasesProps) {
  const t = useTranslations('cases');

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'residential':
        return t('residential');
      case 'commercial':
        return t('commercial');
      case 'hotel':
        return t('hotel');
      default:
        return category;
    }
  };

  if (cases.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseItem) => (
        <Link key={caseItem.id} href={`/cases/${caseItem.slug}`}>
          <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
            <div className="relative aspect-[4/3]">
              <Image
                src={caseItem.featuredImage}
                alt={caseItem.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge className="absolute left-2 top-2" variant="secondary">
                {getCategoryLabel(caseItem.category)}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="flex items-center text-sm font-medium group-hover:text-primary">
                {caseItem.title}
                <ArrowRight className="ml-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
