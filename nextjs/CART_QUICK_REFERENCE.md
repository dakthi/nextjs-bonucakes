# Cart System - Quick Reference Card

## Import Statements

```tsx
// Store and hooks
import { useCartStore, useCartCount, useCartTotals } from '@/lib/stores/cart-store';

// Components
import CartBadge from '@/components/CartBadge';
import AddToCartButton from '@/components/AddToCartButton';
import CartItemCard from '@/components/cart/CartItemCard';
import CartSummary from '@/components/cart/CartSummary';

// Types
import type { CartItem, AddToCartProduct } from '@/types/cart';

// Helpers
import { productToCartFormat, formatPrice } from '@/lib/utils/cart-helpers';
```

## Common Patterns

### Add to Navbar
```tsx
<CartBadge className="hover:text-blue-600" />
```

### Add to Product Card
```tsx
const cartProduct = productToCartFormat(product, 'en');
<AddToCartButton product={cartProduct} variant="primary" size="md" />
```

### Get Cart Count
```tsx
const count = useCartCount();
```

### Get Cart Items
```tsx
const items = useCartStore((state) => state.items);
```

### Get Cart Totals
```tsx
const { subtotal, shipping, total, itemCount } = useCartTotals();
```

### Add Item Programmatically
```tsx
const addItem = useCartStore((state) => state.addItem);
addItem(cartProduct, 2); // Add 2 items
```

### Remove Item
```tsx
const removeItem = useCartStore((state) => state.removeItem);
removeItem(productId);
```

### Update Quantity
```tsx
const updateQuantity = useCartStore((state) => state.updateQuantity);
updateQuantity(productId, 5);
```

### Clear Cart
```tsx
const clearCart = useCartStore((state) => state.clearCart);
clearCart();
```

### Get Cart for API
```tsx
const getCartForAPI = useCartStore((state) => state.getCartForAPI);
const items = getCartForAPI();
// Send to backend
```

### Get Promotions
```tsx
const promotions = useCartPromotions();
promotions.forEach(promo => {
  console.log(`${promo.productName.en}: +${promo.freeItems} free`);
});
```

## Product Data Format

```tsx
const cartProduct: AddToCartProduct = {
  id: product.id,
  slug: product.slug,
  name: {
    en: product.nameEn,
    vi: product.nameVi,
  },
  price: {
    amount: parseFloat(product.price),
    currency: 'GBP',
    displayPrice: `£${product.price} / loaf`,
    displayPriceVi: `£${product.price} / ổ`,
    unit: {
      en: 'loaf',
      vi: 'ổ',
    },
  },
  images: [{ url: '/image.jpg', alt: 'Product' }],
};
```

## Type Signatures

```typescript
// Store State
interface CartStore {
  items: CartItem[];
  addItem: (product: AddToCartProduct, quantity?: number) => void;
  removeItem: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getTotals: () => CartTotals;
  getPromotions: () => CartPromotion[];
  getCartForAPI: () => CartAPIItem[];
}

// Cart Item
interface CartItem {
  productId: string | number;
  productSlug: string;
  productName: { en: string; vi: string };
  quantity: number;
  unitPrice: number;
  currency: string;
  displayPrice: string;
  displayPriceVi?: string;
  unitEn: string;
  unitVi: string;
  image: { url: string; alt: string } | null;
}

// Cart Totals
interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}
```

## Key Constants

```typescript
SHIPPING_FEE = 8; // £8 flat rate
STORAGE_KEY = 'bonu_cart'; // localStorage key
PROMOTION_RATIO = 10; // Buy 10 get 1 free
```

## Component Props

### CartBadge
```tsx
<CartBadge
  className?: string
  showBadge?: boolean  // default: true
/>
```

### AddToCartButton
```tsx
<AddToCartButton
  product: AddToCartProduct  // required
  quantity?: number          // default: 1
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'  // default: 'primary'
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  disabled?: boolean         // default: false
  children?: React.ReactNode // Button text
  onAddToCart?: () => void   // Callback after add
/>
```

### CartItemCard
```tsx
<CartItemCard
  item: CartItem      // required
  locale?: 'en' | 'vi'  // default: 'en'
  className?: string
/>
```

### CartSummary
```tsx
<CartSummary
  locale?: 'en' | 'vi'      // default: 'en'
  showPromotions?: boolean  // default: true
  className?: string
/>
```

## Checkout Integration

```tsx
export default function CheckoutPage() {
  const getCartForAPI = useCartStore((state) => state.getCartForAPI);
  const clearCart = useCartStore((state) => state.clearCart);

  async function handleSubmit(formData: any) {
    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: getCartForAPI(),
        customer: formData,
      }),
    });

    if (response.ok) {
      clearCart();
      router.push('/order-success');
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Helper Functions

```typescript
// Convert Prisma product to cart format
productToCartFormat(product, locale): AddToCartProduct

// Format price with currency
formatPrice(price, currency?): string

// Calculate item total
calculateItemTotal(unitPrice, quantity): number

// Calculate free items
calculateFreeItems(quantity): number

// Calculate actual quantity with free items
calculateActualQuantity(quantity): number

// Validate quantity
isValidQuantity(quantity): boolean

// Get localized name
getLocalizedProductName(productName, locale): string
```

## Debugging

```javascript
// View cart in console
const data = localStorage.getItem('bonu_cart');
console.log(JSON.parse(data));

// Clear cart manually
localStorage.removeItem('bonu_cart');

// Check store state
import { useCartStore } from '@/lib/stores/cart-store';
console.log(useCartStore.getState());
```

## File Locations

```
/types/cart.ts                      - Type definitions
/lib/stores/cart-store.ts          - Zustand store
/lib/utils/cart-helpers.ts         - Helper functions
/components/CartBadge.tsx          - Cart badge
/components/AddToCartButton.tsx    - Add to cart button
/components/cart/CartItemCard.tsx  - Cart item card
/components/cart/CartSummary.tsx   - Order summary
/app/cart/page.tsx                 - Cart page
```

## Next Steps

1. Add `<CartBadge />` to your Navbar
2. Use `<AddToCartButton />` on product pages
3. Create cart page or use `/app/cart/page.tsx`
4. Integrate with checkout
5. Test end-to-end flow

---

**Full Documentation**: See `CART_INTEGRATION_GUIDE.md`
