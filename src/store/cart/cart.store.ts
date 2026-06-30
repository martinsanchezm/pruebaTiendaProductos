import { create } from 'zustand';

import type { CartStore } from './cart.types';
import type { Product } from '../products/products.types';

export const useCartStore = create<CartStore>((set) => ({
  // State
  items: [],

  // Actions
  addToCart: (product: Product) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  removeFromCart: (productId: string) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  increaseQuantity: (productId: string) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decreaseQuantity: (productId: string) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),
}));
