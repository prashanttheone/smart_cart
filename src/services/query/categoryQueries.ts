import { useQuery } from '@tanstack/react-query';
import { api } from '../api/apiClient';
import { ENDPOINTS } from '../../app/lib/EndPoint';

export interface DynamicCategoryItem {
  slug: string;
  displayName: string;
  thumbnail?: string;
  bgColor: string;
}

const PASTEL_PALETTE = [
  '#FFF7ED', // Soft Orange
  '#EFF6FF', // Soft Blue
  '#FAF5FF', // Soft Purple
  '#F0FDF4', // Soft Emerald
  '#FEF2F2', // Soft Red
  '#FEF3C7', // Soft Amber
  '#F5F3FF', // Soft Violet
  '#ECFEFF', // Soft Cyan
  '#EEF2FF', // Soft Indigo
  '#FDF2F8', // Soft Pink
  '#ECFDF5', // Soft Teal
  '#F1F5F9', // Soft Slate
];

/**
 * Dynamically format slug into human-readable title (e.g. "kitchen-accessories" -> "Kitchen Accessories")
 */
export function formatCategoryName(slug: string): string {
  if (!slug) return '';
  return slug
    .replace(/^mens-/, "Men's ")
    .replace(/^womens-/, "Women's ")
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns dynamic pastel background color based on category index or hash
 */
export function getCategoryBgColor(slugOrIndex: string | number): string {
  if (typeof slugOrIndex === 'number') {
    return PASTEL_PALETTE[slugOrIndex % PASTEL_PALETTE.length];
  }
  let sum = 0;
  for (let i = 0; i < slugOrIndex.length; i++) {
    sum += slugOrIndex.charCodeAt(i);
  }
  return PASTEL_PALETTE[sum % PASTEL_PALETTE.length];
}

/**
 * TanStack React Query hook for dynamic category slug list
 * Fetches GET /products/category-list dynamically from API
 */
export function useCategoryListQuery() {
  return useQuery<string[]>({
    queryKey: ['categories', 'slug-list'],
    queryFn: () => api.get<string[]>(ENDPOINTS.CATEGORIES.SLUG_LIST),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * TanStack React Query hook that dynamically retrieves product thumbnails for each category from the API
 */
export function useCategoryThumbnailsQuery() {
  return useQuery<Record<string, string>>({
    queryKey: ['categories', 'thumbnails'],
    queryFn: async () => {
      const response = await api.get<{
        products: { category: string; thumbnail: string }[];
      }>('/products?limit=0&select=category,thumbnail');

      const thumbnailMap: Record<string, string> = {};
      if (response && Array.isArray(response.products)) {
        response.products.forEach((product) => {
          if (product.category && !thumbnailMap[product.category] && product.thumbnail) {
            thumbnailMap[product.category] = product.thumbnail;
          }
        });
      }
      return thumbnailMap;
    },
    staleTime: 1000 * 60 * 60, // 1 hour TTL
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
