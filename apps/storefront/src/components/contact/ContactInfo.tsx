'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ContactInfoProps {
  info: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

export function ContactInfo({ info }: ContactInfoProps) {
  const t = useTranslations('contact');

  const infoItems = [
    {
      icon: MapPin,
      label: t('info.address'),
      value: info.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(info.address)}`,
    },
    {
      icon: Phone,
      label: t('info.phone'),
      value: info.phone,
      href: `tel:${info.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: t('info.email'),
      value: info.email,
      href: `mailto:${info.email}`,
    },
    {
      icon: Clock,
      label: t('info.hours'),
      value: info.hours,
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: info.socialLinks?.facebook, label: 'Facebook' },
    { icon: Instagram, href: info.socialLinks?.instagram, label: 'Instagram' },
    { icon: Linkedin, href: info.socialLinks?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: info.socialLinks?.twitter, label: 'Twitter' },
  ].filter((link) => link.href);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('getInTouch')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {infoItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          );

          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block transition-opacity hover:opacity-80"
              >
                {content}
              </a>
            );
          }

          return <div key={item.label}>{content}</div>;
        })}

        {socialLinks.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-3 text-sm font-medium">Follow Us</p>
              <div className="flex gap-2">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.label}
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
