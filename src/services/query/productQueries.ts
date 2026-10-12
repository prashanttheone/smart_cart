import { useQuery } from '@tanstack/react-query';
import { api } from '../api/apiClient';

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
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export function useProductsQuery(limit = 10) {
  return useQuery({
    queryKey: ['products', limit],
    queryFn: () => api.get<ProductsResponse>(`/products?limit=${limit}`),
  });
}

export function useProductDetailsQuery(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get<Product>(`/products/${id}`),
    enabled: !!id,
  });
}
