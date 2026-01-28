'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CaseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  completedAt: string;
  featuredImage: string;
}

interface CasesListProps {
  cases: CaseItem[];
}

export function CasesList({ cases }: CasesListProps) {
  const t = useTranslations('cases');

  if (cases.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No cases found.</p>
      </div>
    );
  }

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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseItem) => (
        <Link key={caseItem.id} href={`/cases/${caseItem.slug}`}>
          <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={caseItem.featuredImage}
                alt={caseItem.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge className="absolute left-3 top-3">
                {getCategoryLabel(caseItem.category)}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 text-lg font-semibold line-clamp-1 group-hover:text-primary">
                {caseItem.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {caseItem.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">{caseItem.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{caseItem.completedAt}</span>
                </div>
              </div>
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-primary"
              >
                {t('viewProject')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
