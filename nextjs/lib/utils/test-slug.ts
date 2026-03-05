/**
 * Test script for slug generation
 * Run with: npx ts-node --project tsconfig.json lib/utils/test-slug.ts
 */

import { slugify } from './slug';

// Test cases with Vietnamese product names
const testCases = [
  'Bánh Mì Sài Gòn',
  'Bò Viên',
  'Gà Viên',
  'Thịt Xá Xíu',
  'Vịt Quay',
  'Nem Lụi',
  'Chả Lụa',
  'Pate',
  'Thịt Nguội',
  'Chà Bông',
  'Cà Phê Sữa Đá',
  'Phở Bò',
  'Bún Chả',
  'Gỏi Cuốn',
  'Bánh Xèo',
  'Cơm Tấm',
  'Hủ Tiếu',
  'Mì Quảng',
  'Cao Lầu',
  'Bánh Cuốn',
  'Bún Bò Huế',
  'Bánh Mì Đặc Biệt',
  'Bánh Mì Thịt Nguội',
  'Special Bread', // English test
  'Grilled Pork Skewers',
  'Vietnamese Ham',
];

console.log('\n=== Slug Generation Test ===\n');
console.log('Testing Vietnamese-friendly slug generation:\n');

testCases.forEach((name) => {
  const slug = slugify(name);
  console.log(`${name.padEnd(35)} => ${slug}`);
});

console.log('\n=== Testing Edge Cases ===\n');

const edgeCases = [
  { name: 'Bánh   Mì   (with spaces)', input: 'Bánh   Mì   ' },
  { name: 'Product!!!Name***', input: 'Product!!!Name***' },
  { name: 'Đặc-Biệt-123', input: 'Đặc-Biệt-123' },
  { name: 'UPPERCASE VIỆT NAM', input: 'UPPERCASE VIỆT NAM' },
  { name: 'Mixed English & Tiếng Việt', input: 'Mixed English & Tiếng Việt' },
];

edgeCases.forEach(({ name, input }) => {
  const slug = slugify(input);
  console.log(`${name.padEnd(35)} => ${slug}`);
});

console.log('\n=== Validation Test ===\n');

// Test if generated slugs match the expected pattern
const validPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const invalidCases: string[] = [];

testCases.forEach((name) => {
  const slug = slugify(name);
  if (!validPattern.test(slug)) {
    invalidCases.push(`${name} => ${slug}`);
  }
});

if (invalidCases.length === 0) {
  console.log('✓ All generated slugs are valid!');
} else {
  console.log('✗ Invalid slugs found:');
  invalidCases.forEach((c) => console.log(`  - ${c}`));
}

console.log('\n=== Test Complete ===\n');
