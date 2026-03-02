# Cart Management System - Zustand

This directory contains the Zustand store for cart management.

## Files Created

1. **`/types/cart.ts`** - TypeScript type definitions
2. **`/lib/stores/cart-store.ts`** - Zustand store implementation
3. **`/components/CartBadge.tsx`** - Cart icon with badge component
4. **`/components/AddToCartButton.tsx`** - Add to cart button component

## Features

- Add/remove items from cart
- Update item quantities
- Calculate subtotals and totals
- £8 flat shipping fee
- "Buy 10 get 1 free" promotion per product
- Multilingual support (English/Vietnamese)
- localStorage persistence
- Type-safe with TypeScript
- Optimized with selector hooks

## Usage Examples

### 1. Using CartBadge in Navbar

```tsx
import CartBadge from '@/components/CartBadge';

export default function Navbar() {
  return (
    <nav>
      {/* Your navbar content */}
      <CartBadge className="text-gray-700 hover:text-blue-600" />
    </nav>
  );
}
```

### 2. Using AddToCartButton on Product Page

```tsx
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductPage({ product }) {
  const cartProduct = {
    id: product.id,
    slug: product.slug,
    name: {
      en: product.nameEn,
      vi: product.nameVi,
    },
    price: {
      amount: parseFloat(product.price),
      currency: 'GBP',
      displayPrice: `£${product.price} / ${product.unit}`,
      displayPriceVi: product.displayPriceVi,
      unit: {
        en: product.unitEn,
        vi: product.unitVi,
      },
    },
    images: product.images?.map(img => ({
      url: img.url,
      alt: img.alt || product.nameEn,
    })),
  };

  return (
    <div>
      <h1>{product.nameEn}</h1>
      <p>Price: £{product.price}</p>

      <AddToCartButton
        product={cartProduct}
        quantity={1}
        variant="primary"
        size="lg"
      >
        Add to Cart
      </AddToCartButton>
    </div>
  );
}
```

### 3. Using Cart Store Directly

```tsx
'use client';

import { useCartStore, useCartTotals, useCartPromotions } from '@/lib/stores/cart-store';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const totals = useCartTotals();
  const promotions = useCartPromotions();

  return (
    <div>
      <h1>Shopping Cart</h1>

      {/* Cart Items */}
      {items.map((item) => (
        <div key={item.productId}>
          <h3>{item.productName.en}</h3>
          <p>Price: £{item.unitPrice}</p>
          <p>Quantity: {item.quantity}</p>

          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
            -
          </button>
          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
            +
          </button>
          <button onClick={() => removeItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}

      {/* Promotions */}
      {promotions.length > 0 && (
        <div>
          <h3>Promotions Applied</h3>
          {promotions.map((promo) => (
            <p key={promo.productId}>{promo.message}</p>
          ))}
        </div>
      )}

      {/* Totals */}
      <div>
        <p>Subtotal: £{totals.subtotal.toFixed(2)}</p>
        <p>Shipping: £{totals.shipping.toFixed(2)}</p>
        <p>Total: £{totals.total.toFixed(2)}</p>
      </div>

      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### 4. Get Cart Data for API

```tsx
import { useCartStore } from '@/lib/stores/cart-store';

export default function CheckoutPage() {
  const getCartForAPI = useCartStore((state) => state.getCartForAPI);

  const handleCheckout = async () => {
    const cartItems = getCartForAPI();

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        // other order data...
      }),
    });

    // Handle response...
  };

  return (
    <button onClick={handleCheckout}>
      Complete Order
    </button>
  );
}
```

## Store API

### Actions

- `addItem(product, quantity?)` - Add product to cart
- `removeItem(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear all items

### Getters

- `getCartCount()` - Total number of items
- `getSubtotal()` - Merchandise subtotal
- `getShippingFee()` - Shipping fee (£8 if items exist)
- `getTotal()` - Grand total
- `getTotals()` - All totals at once
- `getPromotions()` - Active promotions
- `getCartForAPI()` - Format cart for API submission

## Selector Hooks (Performance Optimized)

```tsx
import {
  useCartItems,
  useCartCount,
  useCartTotals,
  useCartPromotions
} from '@/lib/stores/cart-store';

// These hooks only re-render when their specific data changes
const items = useCartItems();
const count = useCartCount();
const totals = useCartTotals();
const promotions = useCartPromotions();
```

## Product Data Format

When adding products to cart, ensure your product object matches this structure:

```typescript
interface AddToCartProduct {
  id: string | number;
  slug: string;
  name: {
    en: string;
    vi: string;
  };
  price: {
    amount: number;
    currency: string;
    displayPrice: string;
    displayPriceVi?: string;
    unit?: {
      en: string;
      vi: string;
    };
  };
  images?: Array<{
    url: string;
    alt: string;
  }>;
}
```

## Promotion Logic

The "Buy 10 get 1 free" promotion is automatically applied:
- For every 10 items of the same product, 1 free item is added
- Calculated separately for each product
- Shown in the promotions array

Example:
- 9 items = 0 free
- 10 items = 1 free (total 11)
- 20 items = 2 free (total 22)

## Migration from Original cart.js

The Zustand store includes migration logic to handle data from the original HTML/JS cart:
- Automatically migrates numeric prices from displayPrice
- Backfills unit labels from display prices
- Maintains backward compatibility

## Testing

To test the cart system:

1. Add items to cart
2. Check localStorage in browser DevTools (key: `bonu_cart`)
3. Verify quantities update correctly
4. Test promotion calculations with 10+ items
5. Verify shipping fee appears when items exist
6. Test cart persistence across page refreshes
