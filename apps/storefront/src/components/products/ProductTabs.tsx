'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductTabsProps {
  product: {
    description: string;
    customFields?: {
      material?: string;
      style?: string;
      applicationScenes?: string[];
    };
  };
}

export function ProductTabs({ product }: ProductTabsProps) {
  const t = useTranslations('products');

  const specifications = [
    {
      label: t('specs.material'),
      value: product.customFields?.material || '-',
    },
    {
      label: t('specs.style'),
      value: product.customFields?.style || '-',
    },
    {
      label: t('specs.applications'),
      value: product.customFields?.applicationScenes?.join(', ') || '-',
    },
  ];

  const careInstructions = [
    {
      title: t('care.washing'),
      content: t('care.washingContent'),
    },
    {
      title: t('care.drying'),
      content: t('care.dryingContent'),
    },
    {
      title: t('care.ironing'),
      content: t('care.ironingContent'),
    },
    {
      title: t('care.storage'),
      content: t('care.storageContent'),
    },
  ];

  const faqItems = [
    {
      question: t('faq.customSize'),
      answer: t('faq.customSizeAnswer'),
    },
    {
      question: t('faq.samples'),
      answer: t('faq.samplesAnswer'),
    },
    {
      question: t('faq.moq'),
      answer: t('faq.moqAnswer'),
    },
    {
      question: t('faq.leadTime'),
      answer: t('faq.leadTimeAnswer'),
    },
  ];

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="description">{t('tabs.description')}</TabsTrigger>
        <TabsTrigger value="specifications">{t('tabs.specifications')}</TabsTrigger>
        <TabsTrigger value="care">{t('tabs.care')}</TabsTrigger>
        <TabsTrigger value="faq">{t('tabs.faq')}</TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description" className="mt-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p className="text-muted-foreground">{t('noDescription')}</p>
          )}
        </div>
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications" className="mt-6">
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <tbody>
              {specifications.map((spec, index) => (
                <tr
                  key={spec.label}
                  className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}
                >
                  <td className="px-4 py-3 text-sm font-medium text-muted-foreground">
                    {spec.label}
                  </td>
                  <td className="px-4 py-3 text-sm">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Care Instructions Tab */}
      <TabsContent value="care" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          {careInstructions.map((instruction) => (
            <div
              key={instruction.title}
              className="rounded-lg border bg-card p-4"
            >
              <h4 className="mb-2 font-medium">{instruction.title}</h4>
              <p className="text-sm text-muted-foreground">{instruction.content}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* FAQ Tab */}
      <TabsContent value="faq" className="mt-6">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>
    </Tabs>
  );
}
