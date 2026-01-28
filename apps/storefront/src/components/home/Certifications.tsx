'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Shield, Leaf, CheckCircle } from 'lucide-react';

// Placeholder certifications - will be fetched from CMS
const certifications = [
  {
    id: 1,
    name: 'ISO 9001',
    description: 'Quality Management System',
    icon: Award,
  },
  {
    id: 2,
    name: 'OEKO-TEX',
    description: 'Tested for harmful substances',
    icon: Shield,
  },
  {
    id: 3,
    name: 'Green Label',
    description: 'Eco-friendly production',
    icon: Leaf,
  },
  {
    id: 4,
    name: 'CE Certified',
    description: 'European standards compliance',
    icon: CheckCircle,
  },
];

export function Certifications() {
  const t = useTranslations('home');

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{t('certifications')}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Our commitment to quality and sustainability is recognized by leading certification bodies
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center rounded-lg border bg-card p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <cert.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
