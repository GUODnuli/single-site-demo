import { getTranslations } from 'next-intl/server';
import { FileQuestion, Home, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/lib/navigation';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>

      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
        Page Not Found
      </h2>

      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            {t('home')}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/products">
            <Search className="mr-2 h-4 w-4" />
            {t('products')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
