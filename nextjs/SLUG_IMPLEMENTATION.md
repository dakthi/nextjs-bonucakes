# Product Slug Implementation

This document describes the product slug functionality implemented for the Bonucakes e-commerce platform.

## Overview

Product slugs are URL-friendly identifiers that replace numeric IDs in product URLs. Instead of `/products/1`, users now see `/products/banh-mi-dac-biet`, which is more SEO-friendly and user-friendly.

## Features

1. **Vietnamese Character Support**: Properly converts Vietnamese diacritics to ASCII equivalents
   - `Bánh Mì Sài Gòn` → `banh-mi-sai-gon`
   - `Cà Phê Sữa Đá` → `ca-phe-sua-da`
   - `Phở Bò` → `pho-bo`

2. **Auto-generation**: Slugs are automatically generated from product names
   - In the admin form when creating new products
   - In the API when creating products without a slug
   - Manual editing is supported and validated

3. **Uniqueness**: Slugs are guaranteed to be unique
   - Duplicates are automatically numbered (e.g., `banh-mi-2`, `banh-mi-3`)
   - Database-level unique constraint ensures data integrity

4. **Validation**: Slugs follow strict formatting rules
   - Only lowercase letters, numbers, and hyphens
   - No leading or trailing hyphens
   - Pattern: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`

5. **Update Handling**: Smart slug updates
   - Changing product name regenerates slug (if not manually set)
   - Manual slug changes are validated and checked for uniqueness
   - Product ID exclusion prevents false uniqueness conflicts on updates

## Files Modified/Created

### Core Utilities
- **`/lib/utils/slug.ts`**: Main slug utility functions
  - `slugify()`: Convert text to URL-safe slug
  - `generateUniqueSlug()`: Generate unique slug with database check
  - `isSlugAvailable()`: Check slug availability
  - `isValidSlugFormat()`: Validate slug format

### API Routes
- **`/app/api/admin/products/route.ts`**: Product creation API
  - Auto-generates slug if not provided
  - Validates provided slugs
  - Ensures uniqueness

- **`/app/api/admin/products/[id]/route.ts`**: Product update API
  - Regenerates slug when name changes (if slug not manually set)
  - Validates slug changes
  - Prevents duplicate slugs

- **`/app/api/products/[slug]/route.ts`**: Public product detail API (already existed)
  - Fetches product by slug
  - Returns 404 if not found

### Frontend Components
- **`/components/admin/ProductForm.tsx`**: Admin product form
  - Auto-generates slug from Vietnamese name
  - Shows live URL preview
  - Client-side validation
  - Manual editing supported

- **`/app/products/[slug]/page.tsx`**: Product detail page
  - Displays product by slug
  - Full product information
  - Add to cart functionality
  - Related products
  - Reviews and ratings

- **`/components/ProductCard.tsx`**: Product card component (already used slugs)
  - Links to `/products/{slug}`

### Database
- **Prisma Schema**: Product model already has slug field
  - `slug String @unique`
  - Indexed for fast lookups

### Tests
- **`/lib/utils/test-slug-standalone.ts`**: Test script
  - Tests Vietnamese character conversion
  - Tests edge cases
  - Validates output format

## Usage

### Admin: Creating a Product

1. Navigate to `/admin/products/new`
2. Enter the Vietnamese product name (e.g., "Bánh Mì Đặc Biệt")
3. The slug field auto-fills with "banh-mi-dac-biet"
4. Edit the slug manually if desired (optional)
5. Submit the form

The API will:
- Use the provided slug if valid and unique
- Auto-generate a unique slug if not provided
- Return an error if the slug is invalid or duplicate

### Admin: Updating a Product

1. Navigate to `/admin/products/{id}`
2. Change the product name if desired
3. The slug can be:
   - Left as-is (no change)
   - Manually edited (will be validated)
   - Auto-regenerated if name changes and slug field is empty

### Public: Viewing a Product

Users can access products via:
- Product listing page: `/products`
- Direct URL: `/products/banh-mi-dac-biet`
- Search engines will index the readable URLs

## API Reference

### Slug Utility Functions

```typescript
import { slugify, generateUniqueSlug, isSlugAvailable, isValidSlugFormat } from '@/lib/utils/slug';

// Convert text to slug
const slug = slugify('Bánh Mì Sài Gòn'); // 'banh-mi-sai-gon'

// Generate unique slug (checks database)
const uniqueSlug = await generateUniqueSlug('Bánh Mì'); // 'banh-mi' or 'banh-mi-2'

// Check if slug is available
const available = await isSlugAvailable('banh-mi'); // true/false

// Validate slug format
const valid = isValidSlugFormat('banh-mi-dac-biet'); // true
const invalid = isValidSlugFormat('Bánh-Mì'); // false (uppercase/diacritics)
```

### API Endpoints

**Create Product**
```
POST /api/admin/products
Content-Type: application/json

{
  "nameVi": "Bánh Mì Đặc Biệt",
  "nameEn": "Special Banh Mi",
  "descriptionVi": "...",
  "descriptionEn": "...",
  "price": 9.00,
  "category": "food",
  // slug is optional - will be auto-generated from nameVi
  "slug": "banh-mi-dac-biet" // optional
}
```

**Update Product**
```
PUT /api/admin/products/{id}
Content-Type: application/json

{
  "nameVi": "Bánh Mì Sài Gòn", // changing name
  // slug can be:
  // 1. Omitted (will regenerate from new name)
  // 2. Provided explicitly (will be validated)
  "slug": "banh-mi-sai-gon" // optional
}
```

**Get Product by Slug**
```
GET /api/products/banh-mi-dac-biet

Response:
{
  "product": {
    "id": 1,
    "slug": "banh-mi-dac-biet",
    "nameVi": "Bánh Mì Đặc Biệt",
    "nameEn": "Special Banh Mi",
    // ... other fields
  }
}
```

## Testing

Run the slug generation test:

```bash
cd /Users/dakthi/Documents/Factory-Tech/clients/04-non-commercial/bonucakes/nextjs
npx tsx lib/utils/test-slug-standalone.ts
```

Expected output:
- All Vietnamese product names convert correctly
- Edge cases are handled properly
- All generated slugs pass validation

## Error Handling

The implementation includes comprehensive error handling:

1. **Invalid Slug Format**: Returns 400 with clear error message
2. **Duplicate Slug**: Returns 400 indicating slug already exists
3. **Product Not Found**: Returns 404 from public API
4. **Generation Failure**: Returns 400 with specific error from `generateUniqueSlug()`

## SEO Benefits

1. **Readable URLs**: `/products/banh-mi-dac-biet` vs `/products/1`
2. **Keyword Rich**: Product name in URL helps SEO
3. **Stable URLs**: Slugs don't change unless explicitly updated
4. **Canonical URLs**: Unique slugs prevent duplicate content issues

## Security

1. **Input Sanitization**: All special characters removed
2. **Format Validation**: Strict pattern matching
3. **Database Constraints**: Unique constraint at database level
4. **SQL Injection Prevention**: Using Prisma ORM with parameterized queries

## Migration Notes

Existing products in the database already have slugs (schema has the field). If you need to regenerate slugs for existing products:

1. Use the admin interface to update each product
2. Or create a migration script to bulk regenerate slugs
3. Ensure no duplicate slugs before migration

## Future Enhancements

Possible improvements:
1. Slug history/redirects for changed slugs (SEO preservation)
2. Custom slug patterns per category
3. Bulk slug regeneration tool in admin
4. Slug analytics and optimization suggestions
5. Multi-language slug support (separate slugs for vi/en)

## Support

For issues or questions:
- Check the test script output for validation
- Review API error messages for specific issues
- Ensure database has unique constraint on slug field
- Verify Prisma client is up to date: `npx prisma generate`
