'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('common');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>

      <h1 className="mb-2 text-2xl font-bold">{t('error')}</h1>

      <p className="mb-6 max-w-md text-muted-foreground">
        We apologize for the inconvenience. An unexpected error has occurred.
        Please try again or return to the homepage.
      </p>

      {process.env.NODE_ENV === 'development' && error.message && (
        <div className="mb-6 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left">
          <p className="font-mono text-sm text-destructive">{error.message}</p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            {t('home')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
