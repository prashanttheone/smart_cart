import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../api/apiClient';
import { ENDPOINTS } from '../../app/lib/EndPoint';

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images?: string[];
  reviews?: ProductReview[];
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  tags?: string[];
  sku?: string;
  meta?: ProductMeta;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export function useProductsQuery(limit = 10) {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: () =>
      api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.PAGINATED({ limit })),
  });
}

export interface InfiniteProductsParams {
  limit?: number;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Infinite query hook for paginated products with automatic next limit/skip fetching
 */
export function useInfiniteProductsQuery({
  limit = 10,
  category,
  sortBy,
  order,
}: InfiniteProductsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', { limit, category, sortBy, order }],
    queryFn: ({ pageParam = 0 }) => {
      if (category) {
        return api.get<ProductsResponse>(
          ENDPOINTS.PRODUCTS.BY_CATEGORY(category, {
            limit,
            skip: pageParam,
            sortBy,
            order,
          })
        );
      }
      return api.get<ProductsResponse>(
        ENDPOINTS.PRODUCTS.PAGINATED({
          limit,
          skip: pageParam,
          sortBy,
          order,
        })
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Hook to fetch single product by ID from /products/:id
 */
export function useProductByIdQuery(
  id?: number | string,
  initialData?: Product
) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id!)),
    enabled: id !== undefined && id !== null && id !== '',
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
  });
}

/**
 * Backward compatible alias for useProductByIdQuery
 */
export const useProductDetailsQuery = useProductByIdQuery;

/**
 * Hook to fetch Deals of the Day (sorted by highest discount percentage descending)
 * API: /products?sortBy=discountPercentage&order=desc&limit=:limit
 */
export function useDealsOfTheDayQuery(limit = 10) {
  return useQuery({
    queryKey: ['products', 'deals-of-the-day', limit],
    queryFn: () =>
      api.get<ProductsResponse>(ENDPOINTS.PRODUCTS.DEALS_OF_THE_DAY(limit)),
    staleTime: 1000 * 60 * 10, // 10 minutes TTL
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
