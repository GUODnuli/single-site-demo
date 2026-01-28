'use client';

import { useTranslations } from 'next-intl';
import { Target, Lightbulb, Heart, Award, Leaf, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function ValuesSection() {
  const t = useTranslations('about');

  const values = [
    {
      icon: Award,
      title: t('valuesQuality'),
      description: 'We never compromise on quality, ensuring every product meets the highest standards.',
    },
    {
      icon: Lightbulb,
      title: t('valuesInnovation'),
      description: 'We constantly innovate to bring new designs and technologies to our customers.',
    },
    {
      icon: Leaf,
      title: t('valuesSustainability'),
      description: 'We are committed to sustainable practices and eco-friendly materials.',
    },
    {
      icon: Users,
      title: t('valuesCustomer'),
      description: 'Customer satisfaction is our top priority in everything we do.',
    },
  ];

  return (
    <section className="py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Mission & Vision */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col justify-center p-8">
            <div className="mb-6">
              <Target className="mb-4 h-10 w-10" />
              <h3 className="mb-2 text-xl font-bold">{t('mission')}</h3>
              <p className="opacity-90">{t('missionContent')}</p>
            </div>
            <div>
              <Lightbulb className="mb-4 h-10 w-10" />
              <h3 className="mb-2 text-xl font-bold">{t('vision')}</h3>
              <p className="opacity-90">{t('visionContent')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Values Grid */}
        <div>
          <h3 className="mb-4 text-xl font-bold">{t('values')}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title}>
                  <CardContent className="p-4">
                    <Icon className="mb-2 h-6 w-6 text-primary" />
                    <h4 className="mb-1 font-medium">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
