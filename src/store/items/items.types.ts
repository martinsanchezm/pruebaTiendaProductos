export interface ItemMedia {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  offerType: 'money' | 'percentage';
  discount: number;
  startDate: string;
  endDate: string;
  media: ItemMedia[];
  createdAt: string;
}

export interface ItemsState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
}

export interface ItemsActions {
  setItems: (items: Item[]) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  prependItem: (item: Item) => void;
}

export type ItemsStore = ItemsState & ItemsActions;
