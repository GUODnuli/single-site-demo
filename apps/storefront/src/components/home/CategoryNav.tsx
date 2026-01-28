'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Placeholder categories - will be fetched from Vendure Collections
const categories = [
  {
    id: 1,
    name: 'Curtains',
    slug: 'curtains',
    description: 'Premium curtains for every style',
    image: '/images/category-curtains.jpg',
    productCount: 120,
  },
  {
    id: 2,
    name: 'Sheers',
    slug: 'sheers',
    description: 'Light and elegant window sheers',
    image: '/images/category-sheers.jpg',
    productCount: 85,
  },
  {
    id: 3,
    name: 'Blackout',
    slug: 'blackout',
    description: 'Complete light blocking solutions',
    image: '/images/category-blackout.jpg',
    productCount: 64,
  },
  {
    id: 4,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Rods, rings, and more',
    image: '/images/category-accessories.jpg',
    productCount: 150,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function CategoryNav() {
  const t = useTranslations('home');

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{t('ourCategories')}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our carefully curated collection of window treatments
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group block overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <span>{category.name}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.productCount} products</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
