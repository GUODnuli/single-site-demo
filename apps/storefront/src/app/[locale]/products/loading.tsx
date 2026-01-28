import { Skeleton, SkeletonProductGrid } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-2 h-10 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filter */}
        <aside className="w-full shrink-0 lg:w-64">
          <div className="space-y-6">
            <div>
              <Skeleton className="mb-3 h-5 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="mb-3 h-5 w-20" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {/* Sort Bar */}
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Products */}
          <SkeletonProductGrid count={9} />
        </main>
      </div>
    </div>
  );
}
