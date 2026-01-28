'use client';

import { cn } from '@/lib/utils';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-8">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={event.year}
              className={cn(
                'relative flex items-start gap-4 md:gap-8',
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              )}
            >
              {/* Dot */}
              <div className="absolute left-4 top-0 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2">
                <div className="h-4 w-4 rounded-full border-4 border-primary bg-background" />
              </div>

              {/* Content */}
              <div
                className={cn(
                  'ml-8 flex-1 rounded-lg border bg-card p-4 shadow-sm md:ml-0',
                  isEven ? 'md:mr-auto md:text-right' : 'md:ml-auto md:text-left',
                  'md:w-[calc(50%-2rem)]'
                )}
              >
                <span className="inline-block rounded bg-primary px-2 py-1 text-sm font-bold text-primary-foreground">
                  {event.year}
                </span>
                <h3 className="mt-2 font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden flex-1 md:block" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
