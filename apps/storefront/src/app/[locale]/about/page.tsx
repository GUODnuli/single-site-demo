import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CompanyStory } from '@/components/about/CompanyStory';
import { Timeline } from '@/components/about/Timeline';
import { TeamSection } from '@/components/about/TeamSection';
import { CertificationsSection } from '@/components/about/CertificationsSection';
import { ValuesSection } from '@/components/about/ValuesSection';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');

  return {
    title: t('title'),
    description: t('storyContent'),
  };
}

// Mock data - In production, fetch from CMS
const timelineEvents = [
  {
    year: '2010',
    title: 'Company Founded',
    description: 'Started as a small workshop with a passion for quality curtains.',
  },
  {
    year: '2013',
    title: 'First Export',
    description: 'Expanded to international markets, starting with European countries.',
  },
  {
    year: '2016',
    title: 'New Factory',
    description: 'Opened a state-of-the-art manufacturing facility to meet growing demand.',
  },
  {
    year: '2019',
    title: 'ISO Certification',
    description: 'Achieved ISO 9001 certification for quality management systems.',
  },
  {
    year: '2022',
    title: 'Sustainability Initiative',
    description: 'Launched eco-friendly product line using sustainable materials.',
  },
  {
    year: '2024',
    title: 'Global Expansion',
    description: 'Established partnerships in over 50 countries worldwide.',
  },
];

const teamMembers = [
  {
    id: '1',
    name: 'John Smith',
    position: 'CEO & Founder',
    bio: 'With over 20 years in the textile industry, John leads our company vision.',
    image: '/placeholder.jpg',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    position: 'Design Director',
    bio: 'Sarah brings creative excellence to every product we create.',
    image: '/placeholder.jpg',
  },
  {
    id: '3',
    name: 'Michael Chen',
    position: 'Production Manager',
    bio: 'Michael ensures the highest quality standards in manufacturing.',
    image: '/placeholder.jpg',
  },
  {
    id: '4',
    name: 'Emily Brown',
    position: 'Sales Director',
    bio: 'Emily manages our global partnerships and client relationships.',
    image: '/placeholder.jpg',
  },
];

const certifications = [
  {
    id: '1',
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    icon: '/placeholder.jpg',
  },
  {
    id: '2',
    name: 'OEKO-TEX Standard 100',
    description: 'Textile safety certification',
    icon: '/placeholder.jpg',
  },
  {
    id: '3',
    name: 'FSC Certified',
    description: 'Sustainable materials sourcing',
    icon: '/placeholder.jpg',
  },
  {
    id: '4',
    name: 'CE Marking',
    description: 'European conformity standards',
    icon: '/placeholder.jpg',
  },
];

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{t('title')}</h1>
      </div>

      {/* Company Story */}
      <CompanyStory />

      {/* Mission, Vision, Values */}
      <ValuesSection />

      {/* Timeline */}
      <section className="py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">{t('timeline')}</h2>
        <Timeline events={timelineEvents} />
      </section>

      {/* Team */}
      <section className="py-12">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">{t('team')}</h2>
          <p className="text-muted-foreground">{t('teamSubtitle')}</p>
        </div>
        <TeamSection members={teamMembers} />
      </section>

      {/* Certifications */}
      <section className="py-12">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">{t('certifications')}</h2>
          <p className="text-muted-foreground">{t('certificationsSubtitle')}</p>
        </div>
        <CertificationsSection certifications={certifications} />
      </section>
    </div>
  );
}
