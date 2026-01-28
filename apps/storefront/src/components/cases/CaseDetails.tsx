'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, Tag, Package, Ruler } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Product {
  name: string;
  slug: string;
}

interface CaseDetailsProps {
  location: string;
  completedAt: string;
  category: string;
  projectScope: string;
  productsUsed: Product[];
}

export function CaseDetails({
  location,
  completedAt,
  category,
  projectScope,
  productsUsed,
}: CaseDetailsProps) {
  const t = useTranslations('cases');

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'residential':
        return t('residential');
      case 'commercial':
        return t('commercial');
      case 'hotel':
        return t('hotel');
      default:
        return cat;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('projectDetails')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('location')}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>

        {/* Completion Date */}
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('completedAt')}</p>
            <p className="text-sm text-muted-foreground">{completedAt}</p>
          </div>
        </div>

        {/* Category */}
        <div className="flex items-start gap-3">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('category')}</p>
            <Badge variant="secondary" className="mt-1">
              {getCategoryLabel(category)}
            </Badge>
          </div>
        </div>

        {/* Project Scope */}
        <div className="flex items-start gap-3">
          <Ruler className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('projectScope')}</p>
            <p className="text-sm text-muted-foreground">{projectScope}</p>
          </div>
        </div>

        <Separator />

        {/* Products Used */}
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium">{t('productsUsed')}</p>
            <ul className="space-y-1">
              {productsUsed.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
