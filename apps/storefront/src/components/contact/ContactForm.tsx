'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Send, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ContactFormProps {
  prefilledMessage?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ prefilledMessage = '' }: ContactFormProps) {
  const t = useTranslations('contact');
  const analytics = useAnalytics();
  const [status, setStatus] = React.useState<FormStatus>('idle');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: prefilledMessage,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit');

      // Track successful form submission
      analytics.contactFormSubmit(formData.subject || 'general');

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch {
      // Track form submission error
      analytics.error('contact_form', 'Form submission failed');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <h3 className="mb-2 text-xl font-semibold">{t('form.success')}</h3>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setStatus('idle')}
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('getInTouch')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('form.name')} *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('form.namePlaceholder')}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('form.email')} *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('form.emailPlaceholder')}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t('form.phone')}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('form.phonePlaceholder')}
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <Label htmlFor="company">{t('form.company')}</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={t('form.companyPlaceholder')}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">{t('form.subject')} *</Label>
            <Select value={formData.subject} onValueChange={handleSubjectChange} required>
              <SelectTrigger>
                <SelectValue placeholder={t('form.subjectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t('subjects.general')}</SelectItem>
                <SelectItem value="quote">{t('subjects.quote')}</SelectItem>
                <SelectItem value="sample">{t('subjects.sample')}</SelectItem>
                <SelectItem value="support">{t('subjects.support')}</SelectItem>
                <SelectItem value="partnership">{t('subjects.partnership')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">{t('form.message')} *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('form.messagePlaceholder')}
              rows={5}
              required
            />
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <p className="text-sm text-destructive">{t('form.error')}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('form.submitting')}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t('form.submit')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
