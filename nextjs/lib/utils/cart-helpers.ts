/**
 * Cart Helper Utilities
 * Helper functions to transform data for cart operations
 */

import type { AddToCartProduct } from '@/types/cart';

/**
 * Transform a Prisma Product to AddToCartProduct format
 *
 * @example
 * ```tsx
 * const product = await prisma.product.findUnique({ where: { id } });
 * const cartProduct = productToCartFormat(product, 'en');
 * ```
 */
export function productToCartFormat(
  product: {
    id: number;
    slug: string;
    nameEn: string;
    nameVi: string;
    price: any; // Decimal type from Prisma
    images?: string[];
    weightUnit?: string | null;
  },
  locale: 'en' | 'vi' = 'en'
): AddToCartProduct {
  const price = parseFloat(product.price.toString());
  const unit = product.weightUnit || 'item';

  return {
    id: product.id,
    slug: product.slug,
    name: {
      en: product.nameEn,
      vi: product.nameVi,
    },
    price: {
      amount: price,
      currency: 'GBP',
      displayPrice: `£${price} / ${unit}`,
      displayPriceVi: `£${price} / ${unit}`,
      unit: {
        en: unit,
        vi: unit,
      },
    },
    images: product.images?.map((url, index) => ({
      url,
      alt: locale === 'en' ? product.nameEn : product.nameVi,
    })),
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'GBP'): string {
  const symbol = currency === 'GBP' ? '£' : currency;
  return `${symbol}${price.toFixed(2)}`;
}

/**
 * Calculate item total
 */
export function calculateItemTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

/**
 * Calculate free items from promotion (buy 10 get 1 free)
 */
export function calculateFreeItems(quantity: number): number {
  return Math.floor(quantity / 10);
}

/**
 * Calculate actual quantity including free items
 */
export function calculateActualQuantity(quantity: number): number {
  return quantity + calculateFreeItems(quantity);
}

/**
 * Validate cart item quantity
 */
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 9999;
}

/**
 * Get localized product name from cart item
 */
export function getLocalizedProductName(
  productName: { en: string; vi: string },
  locale: 'en' | 'vi' = 'en'
): string {
  return locale === 'vi' ? productName.vi : productName.en;
}
