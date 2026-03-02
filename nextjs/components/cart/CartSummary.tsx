/**
 * CartSummary Component
 * Displays cart totals, promotions, and checkout information
 */

'use client';

import { useCartTotals, useCartPromotions } from '@/lib/stores/cart-store';
import { formatPrice } from '@/lib/utils/cart-helpers';

interface CartSummaryProps {
  locale?: 'en' | 'vi';
  showPromotions?: boolean;
  className?: string;
}

export default function CartSummary({
  locale = 'en',
  showPromotions = true,
  className = '',
}: CartSummaryProps) {
  const totals = useCartTotals();
  const promotions = useCartPromotions();

  const labels = {
    en: {
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      promotion: 'Promotion Applied',
      items: 'items',
    },
    vi: {
      subtotal: 'Tổng phụ',
      shipping: 'Phí vận chuyển',
      total: 'Tổng cộng',
      promotion: 'Khuyến mãi',
      items: 'sản phẩm',
    },
  };

  const t = labels[locale];

  if (totals.itemCount === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-6 ${className}`}>
      {/* Promotions */}
      {showPromotions && promotions.length > 0 && (
        <div className="mb-4 rounded-md bg-green-50 p-3">
          <p className="mb-2 text-sm font-semibold text-green-800">{t.promotion}</p>
          {promotions.map((promo) => (
            <p key={promo.productId} className="text-sm text-green-700">
              {locale === 'en'
                ? `${promo.productName.en}: +${promo.freeItems} free`
                : `${promo.productName.vi}: +${promo.freeItems} miễn phí`}
            </p>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>
            {t.subtotal} ({totals.itemCount} {t.items})
          </span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>{t.shipping}</span>
          <span>{formatPrice(totals.shipping)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>{t.total}</span>
            <span>{formatPrice(totals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
