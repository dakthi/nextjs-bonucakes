/**
 * CartBadge Component
 * Shopping cart icon with item count badge for navbar
 */

'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartCount } from '@/lib/stores/cart-store';

interface CartBadgeProps {
  className?: string;
  showBadge?: boolean;
}

export default function CartBadge({ className = '', showBadge = true }: CartBadgeProps) {
  const itemCount = useCartCount();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="h-6 w-6" />

      {showBadge && itemCount > 0 && (
        <span
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary"
          aria-label={`${itemCount} items in cart`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
