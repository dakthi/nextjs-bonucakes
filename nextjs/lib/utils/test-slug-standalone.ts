/**
 * Standalone test script for slug generation (no Prisma dependency)
 * Run with: npx tsx lib/utils/test-slug-standalone.ts
 */

// Inline slugify function for testing without Prisma dependency
const vietnameseMap: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
  'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
  'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
  'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
  'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
  'đ': 'd',
  'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
  'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
  'Đ': 'D',
};

function slugify(text: string): string {
  if (!text) return '';

  let slug = text.trim();

  // Replace Vietnamese characters with ASCII equivalents
  for (const [viet, ascii] of Object.entries(vietnameseMap)) {
    slug = slug.replace(new RegExp(viet, 'g'), ascii);
  }

  // Convert to lowercase
  slug = slug.toLowerCase();

  // Remove any remaining non-alphanumeric characters (except spaces and hyphens)
  slug = slug.replace(/[^a-z0-9\s-]/g, '');

  // Replace multiple spaces or hyphens with a single hyphen
  slug = slug.replace(/[\s-]+/g, '-');

  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

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
