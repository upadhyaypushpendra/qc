import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { useCartStore, type CartItem } from '../stores/cartStore';
import toast from 'react-hot-toast';

export function useAddToCart() {
  const { addItem } = useCartStore();

  return useMutation({
    mutationFn: async (item: Omit<CartItem, 'quantity'>) => {
      const response = await apiClient.post('/cart/items', {
        productId: item.productId,
        quantity: 1,
      });
      return response.data;
    },
    onSuccess: (_, item) => {
      addItem(item);
    },
    onError: () => {
      toast.error('Failed to add item to cart');
    },
  });
}

export function useUpdateCartQuantity() {
  const { updateQuantity } = useCartStore();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      await apiClient.patch(`/cart/items/${productId}`, { quantity });
    },
    onSuccess: (_, { productId, quantity }) => {
      updateQuantity(productId, quantity);
    },
    onError: () => {
      toast.error('Failed to update quantity');
    },
  });
}

export function useClearCart() {
  const { clearCart } = useCartStore();

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete('/cart');
    },
    onSuccess: () => {
      clearCart();
    },
    onError: () => {
      toast.error('Failed to clear cart');
    },
  });
}
