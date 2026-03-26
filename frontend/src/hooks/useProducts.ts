import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  imageUrl: string;
  description: string;
  categoryId: string;
  tags: string[];
  inStock: boolean;
  stockQty: number;
  unit: string;
  brand: string;
}

export function useProducts(
  page = 1,
  limit = 20,
  categoryId?: string,
  search?: string,
  sort?: string,
) {
  return useQuery({
    queryKey: ['products', { page, limit, categoryId, search, sort }],
    queryFn: async () => {
      const response = await apiClient.get('/products', {
        params: {
          page,
          limit,
          categoryId,
          search,
          sort,
          inStock: true,
        },
      });
      return response.data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/products/categories');
      return response.data;
    },
  });
}

export function useCategoryProducts(
  slug: string,
  page = 1,
  limit = 20,
  sort?: string,
) {
  return useQuery({
    queryKey: ['categoryProducts', slug, { page, limit, sort }],
    queryFn: async () => {
      const response = await apiClient.get(
        `/products/categories/${slug}/products`,
        {
          params: { page, limit, sort, inStock: true },
        },
      );
      return response.data;
    },
    enabled: !!slug,
  });
}
