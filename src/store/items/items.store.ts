import { create } from 'zustand';

import type { ItemsStore } from './items.types';

export const useItemsStore = create<ItemsStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),
  setLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  prependItem: (item) => set((state) => ({ items: [item, ...state.items] })),
}));
