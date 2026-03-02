# Cart Management System - Integration Guide

This guide explains how to integrate the Zustand cart management system into your Next.js application.

## Files Created

### Core Files
1. **`/types/cart.ts`** - TypeScript type definitions for cart
2. **`/lib/stores/cart-store.ts`** - Zustand store with cart logic
3. **`/lib/utils/cart-helpers.ts`** - Helper utilities for cart operations

### Components
4. **`/components/CartBadge.tsx`** - Cart icon with item count badge
5. **`/components/AddToCartButton.tsx`** - Add to cart button
6. **`/components/cart/CartItemCard.tsx`** - Individual cart item display
7. **`/components/cart/CartSummary.tsx`** - Cart totals and promotions

### Example Pages
8. **`/app/cart/page.tsx`** - Complete cart page example

## Quick Start

### 1. Add CartBadge to Your Navbar

Update your existing navbar component:

```tsx
// app/components/Navbar.tsx or similar
import CartBadge from '@/components/CartBadge';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <Logo />
      <Navigation />
      <div className="flex items-center gap-4">
        <LanguageToggle />
        <CartBadge className="text-gray-700 hover:text-blue-600" />
      </div>
    </nav>
  );
}
```

### 2. Add to Product Listing Pages

```tsx
// app/products/page.tsx
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import { productToCartFormat } from '@/lib/utils/cart-helpers';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { available: true },
  });

  return (
    <div className="grid grid-cols-3 gap-6">
      {products.map((product) => {
        const cartProduct = productToCartFormat(product);

        return (
          <div key={product.id} className="rounded-lg border p-4">
            <h3>{product.nameEn}</h3>
            <p>£{product.price}</p>

            <AddToCartButton
              product={cartProduct}
              variant="primary"
              size="md"
            />
          </div>
        );
      })}
    </div>
  );
}
```

### 3. Add to Product Detail Page

```tsx
// app/products/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import AddToCartButton from '@/components/AddToCartButton';
import { productToCartFormat } from '@/lib/utils/cart-helpers';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) notFound();

  const cartProduct = productToCartFormat(product);

  return (
    <div>
      <h1>{product.nameEn}</h1>
      <p className="text-2xl font-bold">£{product.price}</p>

      <div className="mt-6">
        <AddToCartButton
          product={cartProduct}
          quantity={1}
          variant="primary"
          size="lg"
        >
          Add to Cart
        </AddToCartButton>
      </div>
    </div>
  );
}
```

### 4. Create Cart Page

The example cart page is already created at `/app/cart/page.tsx`. You can use it as-is or customize it.

### 5. Integrate with Checkout

```tsx
// app/checkout/page.tsx
'use client';

import { useCartStore } from '@/lib/stores/cart-store';
import CartSummary from '@/components/cart/CartSummary';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const getCartForAPI = useCartStore((state) => state.getCartForAPI);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmitOrder = async (formData: any) => {
    const cartItems = getCartForAPI();

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        customer: formData,
        // ... other order data
      }),
    });

    if (response.ok) {
      clearCart();
      // Redirect to success page
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        {/* Checkout form */}
        <CheckoutForm onSubmit={handleSubmitOrder} />
      </div>

      <div>
        <CartSummary locale="en" showPromotions />
      </div>
    </div>
  );
}
```

## Working with Prisma Products

### Converting Prisma Products to Cart Format

Use the `productToCartFormat` helper:

```tsx
import { productToCartFormat } from '@/lib/utils/cart-helpers';

// For a single product
const cartProduct = productToCartFormat(product, 'en');

// For a list of products
const cartProducts = products.map(p => productToCartFormat(p, locale));
```

### Custom Price Formatting

If your products have different unit formats:

```tsx
import { AddToCartProduct } from '@/types/cart';

function customProductFormat(product: any): AddToCartProduct {
  const price = parseFloat(product.price.toString());

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
      displayPrice: `£${price} / ${product.weightUnit || 'item'}`,
      displayPriceVi: `£${price} / ${product.weightUnit || 'cái'}`,
      unit: {
        en: product.weightUnit || 'item',
        vi: product.weightUnit || 'cái',
      },
    },
    images: product.images?.map(url => ({
      url,
      alt: product.nameEn,
    })),
  };
}
```

## Multilingual Support

### Using with next-intl

```tsx
'use client';

import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/stores/cart-store';

export default function CartPage() {
  const locale = useLocale() as 'en' | 'vi';
  const items = useCartStore((state) => state.items);

  return (
    <div>
      {items.map(item => (
        <div key={item.productId}>
          <h3>
            {locale === 'vi' ? item.productName.vi : item.productName.en}
          </h3>
          <p>
            £{item.unitPrice} / {locale === 'vi' ? item.unitVi : item.unitEn}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Getting Localized Names

```tsx
import { getLocalizedProductName } from '@/lib/utils/cart-helpers';

const productName = getLocalizedProductName(item.productName, locale);
```

## API Integration

### Server Action Example

```tsx
// app/actions/orders.ts
'use server';

import { prisma } from '@/lib/prisma';
import type { CartAPIItem } from '@/types/cart';

export async function createOrder(items: CartAPIItem[], customerData: any) {
  const order = await prisma.order.create({
    data: {
      // ... customer data
      orderItems: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          // ... other fields
        })),
      },
    },
  });

  return order;
}
```

### API Route Example

```tsx
// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CartAPIItem } from '@/types/cart';

export async function POST(request: Request) {
  const body = await request.json();
  const { items, customer } = body as {
    items: CartAPIItem[];
    customer: any;
  };

  // Validate cart items exist and are available
  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds as number[] },
      available: true,
    },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { error: 'Some products are no longer available' },
      { status: 400 }
    );
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      // ... order data
      orderItems: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  return NextResponse.json({ order });
}
```

## Advanced Usage

### Custom Quantity Selector

```tsx
'use client';

import { useState } from 'react';
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductDetailWithQuantity({ product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max="99"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="w-20 rounded border px-3 py-2"
        />

        <AddToCartButton
          product={product}
          quantity={quantity}
          onAddToCart={() => setQuantity(1)}
        />
      </div>
    </div>
  );
}
```

### Cart Event Listener

If you need to react to cart changes in other components:

```tsx
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/stores/cart-store';

export default function CartListener() {
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // Trigger analytics, etc.
    console.log('Cart updated:', items);
  }, [items]);

  return null;
}
```

### Checking Product in Cart

```tsx
'use client';

import { useCartStore } from '@/lib/stores/cart-store';

export function useIsInCart(productId: string | number) {
  return useCartStore((state) =>
    state.items.some((item) => item.productId === productId)
  );
}

// Usage
export default function ProductCard({ product }) {
  const isInCart = useIsInCart(product.id);

  return (
    <div>
      {isInCart && <span className="badge">In Cart</span>}
      {/* ... */}
    </div>
  );
}
```

## Promotion Details

### Buy 10 Get 1 Free

The promotion is automatically calculated:
- Applies per product (not across all products)
- Calculated as: `Math.floor(quantity / 10)`
- Examples:
  - 9 items = 0 free
  - 10 items = 1 free (11 total)
  - 19 items = 1 free (20 total)
  - 20 items = 2 free (22 total)

The promotion is visible in:
1. `getPromotions()` method returns promotion details
2. `CartSummary` component displays active promotions
3. Messages are customizable per locale

## Shipping Fee

- Flat rate: £8
- Applied when cart has at least 1 item
- Automatically included in total
- Can be customized in `/lib/stores/cart-store.ts` by changing `SHIPPING_FEE`

## localStorage Persistence

- Cart data is automatically saved to localStorage
- Key: `bonu_cart`
- Data persists across page refreshes and sessions
- Includes automatic data migration from old formats

## Testing

### Manual Testing Steps

1. Add items to cart from product pages
2. Verify badge shows correct count in navbar
3. Visit cart page and verify items display correctly
4. Test quantity increase/decrease
5. Test item removal
6. Add 10+ items to test promotion
7. Verify totals calculate correctly (subtotal + £8 shipping)
8. Refresh page and verify cart persists
9. Clear cart and verify localStorage is updated

### Test with Browser DevTools

```javascript
// View cart in console
const cartData = localStorage.getItem('bonu_cart');
console.log(JSON.parse(cartData));

// Clear cart
localStorage.removeItem('bonu_cart');
window.location.reload();
```

## Troubleshooting

### Cart not persisting
- Check browser localStorage is enabled
- Verify the key `bonu_cart` exists in DevTools > Application > localStorage

### Type errors
- Ensure all product data matches `AddToCartProduct` interface
- Use `productToCartFormat` helper for Prisma products

### Cart count not updating
- Ensure components use `'use client'` directive
- Check that Zustand store hooks are imported correctly

### Items not showing in cart
- Verify product ID types match (string vs number)
- Check that all required fields are provided when adding items

## Migration from HTML/JS Version

The Zustand store includes automatic migration logic for the original `html/js/cart.js` format:
- Reads from the same localStorage key (`bonu_cart`)
- Automatically parses old price formats
- Backfills missing unit labels
- Maintains backward compatibility

To migrate, simply start using the new components. The store will handle old data automatically.

## Next Steps

1. Add CartBadge to your navbar
2. Replace product page buttons with AddToCartButton
3. Create or update your cart page using the example
4. Integrate with your checkout flow
5. Test the complete user journey
6. Customize styling to match your design system
