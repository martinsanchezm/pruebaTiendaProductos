export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
}

export interface ProductsActions {
  setProducts: (products: Product[]) => void;
  selectProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export type ProductsStore = ProductsState & ProductsActions;
