interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <span className={`skeleton ${className}`} aria-hidden="true" />;
}

export function CardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <Skeleton className="skeleton-photo" />
      <Skeleton className="skeleton-line skeleton-line-short" />
      <Skeleton className="skeleton-line" />
      <Skeleton className="skeleton-line skeleton-line-medium" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <main className="skeleton-page" aria-label="Loading page">
      <Skeleton className="skeleton-heading" />
      <Skeleton className="skeleton-search" />
      <div className="skeleton-grid">
        {Array.from({ length: 6 }, (_, index) => <CardSkeleton key={index} />)}
      </div>
    </main>
  );
}
