/**
 * CartItemCard Component
 * Displays a single cart item with quantity controls and remove button
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import { formatPrice, isValidQuantity } from '@/lib/utils/cart-helpers';
import type { CartItem } from '@/types/cart';

interface CartItemCardProps {
  item: CartItem;
  locale?: 'en' | 'vi';
  className?: string;
}

export default function CartItemCard({
  item,
  locale = 'en',
  className = '',
}: CartItemCardProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isUpdating, setIsUpdating] = useState(false);

  const productName = locale === 'vi' ? item.productName.vi : item.productName.en;
  const itemTotal = item.unitPrice * item.quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (!isValidQuantity(newQuantity) && newQuantity !== 0) return;

    setIsUpdating(true);
    try {
      updateQuantity(item.productId, newQuantity);
    } finally {
      setTimeout(() => setIsUpdating(false), 300);
    }
  };

  const handleRemove = () => {
    if (confirm(`Remove ${productName} from cart?`)) {
      removeItem(item.productId);
    }
  };

  return (
    <div
      className={`flex gap-4 rounded-lg border border-primary/20 bg-white p-4 ${className}`}
    >
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-light">
        {item.image ? (
          <Image
            src={item.image.url}
            alt={item.image.alt}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <Link
              href={`/products/${item.productSlug}`}
              className="font-semibold text-primary hover:text-secondary"
            >
              {productName}
            </Link>
            <p className="mt-1 text-sm text-muted">
              {formatPrice(item.unitPrice)} / {locale === 'vi' ? item.unitVi : item.unitEn}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-muted hover:text-secondary"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Quantity Controls & Total */}
        <div className="mt-3 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 hover:bg-light disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>

            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value)) {
                  handleQuantityChange(value);
                }
              }}
              min="1"
              max="9999"
              disabled={isUpdating}
              className="h-8 w-16 rounded-md border border-primary/20 text-center disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= 9999}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 hover:bg-light disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-lg font-semibold text-primary">
              {formatPrice(itemTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
