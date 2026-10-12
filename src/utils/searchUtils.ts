import { Product } from '../services/query/productQueries';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'keyword' | 'category' | 'product';
  productId?: number;
  categorySlug?: string;
  thumbnail?: string;
  price?: number;
}

export const POPULAR_SEARCH_KEYWORDS: ReadonlyArray<string> = [
  'Smartphones',
  'Laptops',
  'Mascara',
  'Sneakers',
  'Perfume',
  'Watches',
  'Sunglasses',
  'Groceries',
] as const;

/**
 * Sanitizes search input by trimming and collapsing multiple spaces
 */
export function sanitizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

/**
 * Splits text into segments for UI highlight matches
 */
export function highlightSearchMatch(
  text: string,
  query: string
): Array<{ text: string; isMatch: boolean }> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return [{ text, isMatch: false }];
  }

  const regex = new RegExp(`(${cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts
    .filter(Boolean)
    .map((part) => ({
      text: part,
      isMatch: part.toLowerCase() === cleanQuery.toLowerCase(),
    }));
}

/**
 * Builds live suggestion objects combining keywords, matching categories, and products
 */
export function buildSearchSuggestions(
  query: string,
  products: Product[] = [],
  categorySlugs: string[] = []
): SearchSuggestion[] {
  const clean = sanitizeSearchQuery(query).toLowerCase();
  if (!clean) return [];

  const suggestions: SearchSuggestion[] = [];

  // 1. Matching categories
  const matchingCategories = categorySlugs
    .filter((slug) => slug.toLowerCase().includes(clean))
    .slice(0, 2);

  matchingCategories.forEach((slug) => {
    suggestions.push({
      id: `cat-${slug}`,
      text: `${slug.replace(/-/g, ' ')}`,
      type: 'category',
      categorySlug: slug,
    });
  });

  // 2. Matching direct products
  products.slice(0, 6).forEach((prod) => {
    suggestions.push({
      id: `prod-${prod.id}`,
      text: prod.title,
      type: 'product',
      productId: prod.id,
      thumbnail: prod.thumbnail,
      price: prod.price,
    });
  });

  return suggestions;
}
