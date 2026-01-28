'use client';

import Image from 'next/image';
import { Linkedin, Mail } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <Card key={member.id} className="overflow-hidden">
          <div className="relative aspect-square">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-primary">{member.position}</p>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
