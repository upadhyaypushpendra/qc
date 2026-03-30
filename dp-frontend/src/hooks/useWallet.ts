import { useQuery } from '@tanstack/react-query';
import { useWalletStore } from '../stores/walletStore';
import apiClient from '../lib/apiClient';

interface WalletResponse {
  balance: number;
  totalEarnings: number;
  pendingEarnings: number;
  totalWithdrawn: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    identifier: string;
    role: string;
  };
}

/**
 * Fetch wallet data
 */
export const useWallet = () => {
  const { setWalletData } = useWalletStore();

  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await apiClient.get<WalletResponse>('/wallet');
      return response.data;
    },
    onSuccess: (data) => {
      setWalletData({
        balance: parseFloat(data.balance.toString()),
        totalEarnings: parseFloat(data.totalEarnings.toString()),
        pendingEarnings: parseFloat(data.pendingEarnings.toString()),
        totalWithdrawn: parseFloat(data.totalWithdrawn.toString()),
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch wallet balance only
 */
export const useWalletBalance = () => {
  return useQuery({
    queryKey: ['wallet', 'balance'],
    queryFn: async () => {
      const response = await apiClient.get<{
        balance: number;
        totalEarnings: number;
        pendingEarnings: number;
      }>('/wallet/balance');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
