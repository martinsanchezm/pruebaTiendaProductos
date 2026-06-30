import { create } from 'zustand';

import type { ProductsStore } from './products.types';

const INITIAL_PRODUCTS = [
  { id: '1', name: 'Producto A', price: 10.99, description: 'Descripción del producto A' },
  { id: '2', name: 'Producto B', price: 24.99, description: 'Descripción del producto B' },
  { id: '3', name: 'Producto C', price: 5.49, description: 'Descripción del producto C' },
];

export const useProductsStore = create<ProductsStore>((set) => ({
  // State
  products: INITIAL_PRODUCTS,
  selectedProduct: null,

  // Actions
  setProducts: (products) => set({ products }),

  selectProduct: (product) => set({ selectedProduct: product }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  removeProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
}));
