'use client';

import { useLanguage } from './LanguageToggle';

export type AvailabilityFilter = 'all' | 'available' | 'out-of-stock';
export type CategoryFilter = 'all' | 'banh-mi' | 'meat-balls' | 'meats' | 'condiments';

interface ProductFiltersProps {
  availabilityFilter: AvailabilityFilter;
  categoryFilter: CategoryFilter;
  onAvailabilityChange: (filter: AvailabilityFilter) => void;
  onCategoryChange: (filter: CategoryFilter) => void;
}

export default function ProductFilters({
  availabilityFilter,
  categoryFilter,
  onAvailabilityChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const currentLang = useLanguage();

  const availabilityOptions = [
    { value: 'all' as const, label: { vi: 'Tất cả', en: 'All' } },
    { value: 'available' as const, label: { vi: 'Còn hàng', en: 'In Stock' } },
    { value: 'out-of-stock' as const, label: { vi: 'Hết hàng', en: 'Out of Stock' } },
  ];

  const categoryOptions = [
    { value: 'all' as const, label: { vi: 'Tất cả', en: 'All Categories' } },
    { value: 'banh-mi' as const, label: { vi: 'Bánh Mì', en: 'Banh Mi' } },
    { value: 'meat-balls' as const, label: { vi: 'Viên', en: 'Meat Balls' } },
    { value: 'meats' as const, label: { vi: 'Thịt', en: 'Meats' } },
    { value: 'condiments' as const, label: { vi: 'Gia vị & Nhân', en: 'Condiments & Fillings' } },
  ];

  return (
    <div className="bg-light border border-primary/10 p-6 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Availability Filter */}
        <div>
          <label className="block text-primary font-semibold mb-3">
            {currentLang === 'vi' ? 'Tình trạng' : 'Availability'}
          </label>
          <div className="flex flex-wrap gap-2">
            {availabilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onAvailabilityChange(option.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  availabilityFilter === option.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary hover:bg-primary/5 border border-primary/20'
                }`}
              >
                {option.label[currentLang]}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-primary font-semibold mb-3">
            {currentLang === 'vi' ? 'Danh mục' : 'Category'}
          </label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onCategoryChange(option.value)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  categoryFilter === option.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary hover:bg-primary/5 border border-primary/20'
                }`}
              >
                {option.label[currentLang]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
