'use client';

import { Quote } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface ClientTestimonialProps {
  content: string;
  author: string;
  title?: string;
}

export function ClientTestimonial({ content, author, title }: ClientTestimonialProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="relative">
          <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/20" />
          <blockquote className="pl-6 text-lg italic text-muted-foreground">
            &ldquo;{content}&rdquo;
          </blockquote>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10" />
          <div>
            <p className="font-medium">{author}</p>
            {title && <p className="text-sm text-muted-foreground">{title}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
