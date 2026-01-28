'use client';

import { MapPin } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ContactMapProps {
  lat: number;
  lng: number;
  address: string;
}

export function ContactMap({ lat, lng, address }: ContactMapProps) {
  // Using OpenStreetMap embed (free, no API key required)
  // In production, you could use Google Maps, Mapbox, or Leaflet
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
  const directionsUrl = `https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/9] bg-muted">
        <iframe
          title="Location Map"
          src={mapUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{address}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
