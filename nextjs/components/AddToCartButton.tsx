/**
 * AddToCartButton Component
 * Reusable button for adding products to cart with loading state and notifications
 */

'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';
import type { AddToCartProduct } from '@/types/cart';

interface AddToCartButtonProps {
  product: AddToCartProduct;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
  onAddToCart?: () => void;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onAddToCart,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    try {
      setIsAdding(true);

      // Add to cart
      addItem(product, quantity);

      // Show success state
      setJustAdded(true);

      // Call optional callback
      if (onAddToCart) {
        onAddToCart();
      }

      // Reset success state after 2 seconds
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Variant styles
  const variantStyles = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `
    inline-flex items-center justify-center gap-2
    rounded-lg font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-60
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={buttonClasses}
      aria-label={`Add ${product.name.en} to cart`}
    >
      {justAdded ? (
        <>
          <Check className="h-5 w-5" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          <span>{children || 'Add to Cart'}</span>
        </>
      )}
    </button>
  );
}
