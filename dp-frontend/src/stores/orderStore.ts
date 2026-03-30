import { create } from 'zustand';

export interface OrderRequest {
  id: string;
  orderId: string;
  deliveryFee: number;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  expiresAt: Date;
  createdAt: Date;
}

interface OrderStore {
  pendingOrders: OrderRequest[];
  acceptedOrders: OrderRequest[];
  currentOrder: OrderRequest | null;

  addPendingOrder: (order: OrderRequest) => void;
  removePendingOrder: (orderId: string) => void;
  acceptOrder: (orderId: string) => void;
  setPendingOrders: (orders: OrderRequest[]) => void;
  setCurrentOrder: (order: OrderRequest | null) => void;
  clear: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  pendingOrders: [],
  acceptedOrders: [],
  currentOrder: null,

  addPendingOrder: (order) =>
    set((state) => ({
      pendingOrders: [order, ...state.pendingOrders],
    })),

  removePendingOrder: (orderId) =>
    set((state) => ({
      pendingOrders: state.pendingOrders.filter((o) => o.id !== orderId),
    })),

  acceptOrder: (orderId) =>
    set((state) => {
      const order = state.pendingOrders.find((o) => o.id === orderId);
      return {
        pendingOrders: state.pendingOrders.filter((o) => o.id !== orderId),
        acceptedOrders: order ? [...state.acceptedOrders, order] : state.acceptedOrders,
      };
    }),

  setPendingOrders: (orders) => set({ pendingOrders: orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),

  clear: () => set({
    pendingOrders: [],
    acceptedOrders: [],
    currentOrder: null,
  }),
}));
