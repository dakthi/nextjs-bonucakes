/**
 * CartItem Component
 * Individual cart item row with quantity controls and remove button
 */

'use client';

import { useLanguage } from './LanguageToggle';
import type { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string | number, quantity: number) => void;
  onRemove: (productId: string | number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const currentLang = useLanguage();

  // Calculate free items from promotion (buy 10 get 1 free)
  const freeItems = Math.floor(item.quantity / 10);
  const actualQuantity = item.quantity + freeItems;

  // Get localized product name
  const itemName = currentLang === 'vi' ? item.productName.vi : item.productName.en;

  // Get localized unit
  const unit = currentLang === 'vi' ? item.unitVi : item.unitEn;

  // Format price display
  const formatPrice = () => {
    const amount = Number(item.unitPrice || 0);
    if (amount > 0 && unit) {
      return `£${amount} / ${unit}`;
    }
    const localizedDisplay =
      currentLang === 'vi'
        ? item.displayPriceVi || item.displayPrice
        : item.displayPrice || item.displayPriceVi;
    if (localizedDisplay) return localizedDisplay;
    return amount > 0 ? `£${amount}` : '';
  };

  const handleRemove = () => {
    const message = currentLang === 'vi' ? 'Xóa sản phẩm khỏi giỏ hàng?' : 'Remove product from cart?';
    if (confirm(message)) {
      onRemove(item.productId);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.productId, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 bg-white border border-espresso/10 p-4">
      {/* Product Image */}
      {item.image ? (
        <img
          src={item.image.url}
          alt={item.image.alt || itemName}
          className="w-24 h-24 object-cover"
        />
      ) : (
        <div className="w-24 h-24 bg-cream flex items-center justify-center text-coffee text-sm">
          No Image
        </div>
      )}

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-espresso mb-1">{itemName}</h3>
        <p className="text-terracotta font-semibold mb-2">{formatPrice()}</p>

        {/* Promotion Badge */}
        {freeItems > 0 && (
          <p className="text-sm text-gold font-semibold mb-2">
            {currentLang === 'vi' ? 'Mua 10 tặng 1' : 'Buy 10 get 1 free'} (
            {currentLang === 'vi' ? 'thực tế' : 'actual'}: {actualQuantity})
          </p>
        )}

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 border border-espresso/20 hover:bg-espresso/10 flex items-center justify-center font-bold transition-colors"
            aria-label="Decrease quantity"
          >
            -
          </button>

          <span className="w-12 text-center font-semibold">{item.quantity}</span>

          {unit && <span className="text-sm text-coffee">({unit})</span>}

          <button
            onClick={handleIncrement}
            className="w-8 h-8 border border-espresso/20 hover:bg-espresso/10 flex items-center justify-center font-bold transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>

          <button
            onClick={handleRemove}
            className="ml-auto text-terracotta hover:text-terracotta/80 text-sm font-semibold transition-colors"
          >
            {currentLang === 'vi' ? 'Xóa' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}
