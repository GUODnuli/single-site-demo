import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section Skeleton */}
      <div className="mb-12">
        <Skeleton className="mb-4 h-[400px] w-full rounded-xl" />
      </div>

      {/* Content Section Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-8 w-48" />
        <SkeletonText lines={3} />
      </div>

      {/* Grid Section Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
