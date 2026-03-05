# Product Slug - Quick Reference

## What Changed

### URLs
- **Before**: `/products/1`, `/products/2`, etc.
- **After**: `/products/banh-mi-dac-biet`, `/products/bo-vien`, etc.

### Database
- No changes needed - slug field already exists with unique constraint

## Quick Commands

```bash
# Test slug generation
npx tsx lib/utils/test-slug-standalone.ts

# Generate slugs for existing products
npx tsx scripts/generate-slugs-for-existing-products.ts

# Generate Prisma client (if needed)
npx prisma generate
```

## Common Examples

### Vietnamese Product Names → Slugs

| Product Name | Generated Slug |
|--------------|----------------|
| Bánh Mì Sài Gòn | `banh-mi-sai-gon` |
| Bò Viên | `bo-vien` |
| Cà Phê Sữa Đá | `ca-phe-sua-da` |
| Phở Bò | `pho-bo` |
| Bánh Mì Đặc Biệt | `banh-mi-dac-biet` |
| Chả Lụa | `cha-lua` |
| Gỏi Cuốn | `goi-cuon` |

### API Usage

**Create Product (slug auto-generated)**
```json
POST /api/admin/products
{
  "nameVi": "Bánh Mì Đặc Biệt",
  "nameEn": "Special Banh Mi",
  "descriptionVi": "...",
  "descriptionEn": "...",
  "price": 9,
  "category": "food"
}
// Slug will be: "banh-mi-dac-biet"
```

**Create Product (custom slug)**
```json
POST /api/admin/products
{
  "nameVi": "Bánh Mì Đặc Biệt",
  "slug": "my-custom-slug",
  // ... other fields
}
// Slug will be: "my-custom-slug" (if valid and unique)
```

**Get Product by Slug**
```
GET /api/products/banh-mi-dac-biet
```

### Code Usage

```typescript
// Generate slug from text
import { slugify } from '@/lib/utils/slug';
const slug = slugify('Bánh Mì Sài Gòn'); // "banh-mi-sai-gon"

// Generate unique slug (with DB check)
import { generateUniqueSlug } from '@/lib/utils/slug';
const slug = await generateUniqueSlug('Bánh Mì'); // "banh-mi" or "banh-mi-2"

// Validate slug format
import { isValidSlugFormat } from '@/lib/utils/slug';
const valid = isValidSlugFormat('banh-mi-dac-biet'); // true
```

## Admin Workflow

### Creating New Product
1. Go to `/admin/products/new`
2. Enter Vietnamese name (e.g., "Bánh Mì Đặc Biệt")
3. Slug auto-fills: "banh-mi-dac-biet"
4. Edit slug if needed (optional)
5. Click "Create Product"

### Editing Product
1. Go to `/admin/products/{id}`
2. Change name if needed
3. Slug will:
   - Stay the same (if not changed)
   - Auto-regenerate (if name changed and slug empty)
   - Use manual value (if you edit it)
4. Click "Save Changes"

## Public Access

### Product Links
```tsx
// In ProductCard or any component
<Link href={`/products/${product.slug}`}>
  View Product
</Link>
```

### Direct URL
```
https://yourdomain.com/products/banh-mi-dac-biet
```

## Validation Rules

### Valid Slugs ✓
- `banh-mi-dac-biet`
- `bo-vien`
- `special-bread`
- `product-123`
- `my-product-name`

### Invalid Slugs ✗
- `Bánh-Mì` (uppercase/diacritics)
- `bánh-mì` (diacritics)
- `-banh-mi` (leading hyphen)
- `banh-mi-` (trailing hyphen)
- `banh--mi` (double hyphens)
- `banh mi` (spaces)
- `banh_mi` (underscores)

## Troubleshooting

### "Slug already exists" error
- System will auto-append number: `banh-mi-2`
- Or manually enter different slug

### Slug not auto-generating
- Only works for new products
- Enter Vietnamese name first
- Can always enter manually

### Product page 404
- Check slug is correct
- Verify product exists in database
- Check product is `available: true`

### Invalid format error
- Use only lowercase letters, numbers, hyphens
- No spaces, special characters, or diacritics
- No leading/trailing hyphens

## File Locations

```
/lib/utils/slug.ts                           # Core slug functions
/lib/utils/test-slug-standalone.ts           # Test script
/components/admin/ProductForm.tsx            # Admin form (auto-gen)
/app/api/admin/products/route.ts             # Create API
/app/api/admin/products/[id]/route.ts        # Update API
/app/api/products/[slug]/route.ts            # Public API
/app/products/[slug]/page.tsx                # Product detail page
/scripts/generate-slugs-for-existing-products.ts  # Migration script
```

## Migration Checklist

For existing products:

1. Check if products have slugs:
   ```sql
   SELECT id, nameVi, slug FROM products WHERE slug IS NULL OR slug = '';
   ```

2. Run migration script:
   ```bash
   npx tsx scripts/generate-slugs-for-existing-products.ts
   ```

3. Verify results:
   ```sql
   SELECT COUNT(*) FROM products WHERE slug IS NULL OR slug = '';
   -- Should be 0
   ```

## Performance Tips

- Slug field is indexed → fast lookups
- Cache product pages for better performance
- Use CDN for static product pages
- Consider Redis cache for popular products

## SEO Checklist

- [x] URLs are readable
- [x] Keywords in URL
- [x] Unique slugs (no duplicates)
- [ ] Update sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Add structured data (product schema)
- [ ] Set up 301 redirects (if changing existing URLs)

## Need Help?

See detailed documentation:
- `/SLUG_IMPLEMENTATION.md` - Full implementation details
- `/SLUG_SUMMARY.md` - Complete summary
- `/SLUG_QUICK_REFERENCE.md` - This guide

Run tests:
```bash
npx tsx lib/utils/test-slug-standalone.ts
```

Check database:
```bash
npx prisma studio
# Browse to Product model, check slug field
```
