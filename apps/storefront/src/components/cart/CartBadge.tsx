'use client';

import { useActiveOrder } from '@/hooks/useOrder';

export function CartBadge() {
  const { data: activeOrder } = useActiveOrder();
  const count = activeOrder?.totalQuantity || 0;

  if (count === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
      {count > 99 ? '99+' : count}
    </span>
  );
}
