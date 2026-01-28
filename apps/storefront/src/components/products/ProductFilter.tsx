'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductFilterProps {
  currentCategory?: string;
  currentMaterial?: string;
  currentStyle?: string;
}

// Mock filter data - replace with actual API data
const categories = [
  { id: 'curtains', name: 'Curtains', count: 120 },
  { id: 'sheers', name: 'Sheers', count: 85 },
  { id: 'blackout', name: 'Blackout', count: 64 },
  { id: 'accessories', name: 'Accessories', count: 150 },
];

const materials = [
  { id: 'velvet', name: 'Velvet', count: 45 },
  { id: 'linen', name: 'Linen', count: 38 },
  { id: 'cotton', name: 'Cotton', count: 52 },
  { id: 'polyester', name: 'Polyester', count: 89 },
  { id: 'silk', name: 'Silk', count: 23 },
];

const styles = [
  { id: 'modern', name: 'Modern', count: 78 },
  { id: 'classic', name: 'Classic', count: 65 },
  { id: 'minimalist', name: 'Minimalist', count: 42 },
  { id: 'bohemian', name: 'Bohemian', count: 31 },
  { id: 'industrial', name: 'Industrial', count: 28 },
];

export function ProductFilter({
  currentCategory,
  currentMaterial,
  currentStyle,
}: ProductFilterProps) {
  const t = useTranslations('products');
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasActiveFilters = currentCategory || currentMaterial || currentStyle;

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page when filters change
    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="w-full justify-start text-muted-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          {t('clearFilters')}
        </Button>
      )}

      <Accordion type="multiple" defaultValue={['categories', 'materials', 'styles']}>
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-semibold">
            {t('categories')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={currentCategory === category.id}
                    onCheckedChange={(checked) =>
                      updateFilter('category', checked ? category.id : null)
                    }
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {category.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">({category.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Materials */}
        <AccordionItem value="materials">
          <AccordionTrigger className="text-sm font-semibold">
            {t('materials')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material.id}`}
                    checked={currentMaterial === material.id}
                    onCheckedChange={(checked) =>
                      updateFilter('material', checked ? material.id : null)
                    }
                  />
                  <Label
                    htmlFor={`material-${material.id}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {material.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">({material.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Styles */}
        <AccordionItem value="styles">
          <AccordionTrigger className="text-sm font-semibold">
            {t('styles')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {styles.map((style) => (
                <div key={style.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`style-${style.id}`}
                    checked={currentStyle === style.id}
                    onCheckedChange={(checked) =>
                      updateFilter('style', checked ? style.id : null)
                    }
                  />
                  <Label
                    htmlFor={`style-${style.id}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {style.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">({style.count})</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
