'use client';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

interface Certification {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {certifications.map((cert) => (
        <Card key={cert.id} className="text-center">
          <CardContent className="flex flex-col items-center p-6">
            <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full bg-muted">
              <Image
                src={cert.icon}
                alt={cert.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <h3 className="font-semibold">{cert.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{cert.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
