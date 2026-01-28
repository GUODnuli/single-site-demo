'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface CasesFilterProps {
  categories: string[];
  selectedCategory: string;
}

export function CasesFilter({ categories, selectedCategory }: CasesFilterProps) {
  const t = useTranslations('cases');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    router.push(`?${params.toString()}`);
  };

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
    <div className="mb-8 flex flex-wrap justify-center gap-2">
      <Button
        variant={selectedCategory === '' ? 'default' : 'outline'}
        onClick={() => handleCategoryChange('')}
      >
        {t('allCategories')}
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => handleCategoryChange(category)}
        >
          {getCategoryLabel(category)}
        </Button>
      ))}
    </div>
  );
}
