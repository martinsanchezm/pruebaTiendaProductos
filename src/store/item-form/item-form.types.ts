export type OfferType = 'money' | 'percentage';

export interface MediaAsset {
  uri: string;
  type: 'image' | 'video';
  fileName: string;
  mimeType: string;
}

export interface ItemFormData {
  name: string;
  description: string;
  price: string;
  offerType: OfferType | '';
  discountValue: string;
  media: MediaAsset[];
  startDate: Date | null;
  endDate: Date | null;
}

export interface ItemFormErrors {
  name?: string;
  description?: string;
  price?: string;
  offerType?: string;
  discountValue?: string;
  media?: string;
  startDate?: string;
  endDate?: string;
}

export interface ItemFormState {
  form: ItemFormData;
  errors: ItemFormErrors;
  isSubmitting: boolean;
  submitSuccess: boolean;
}

export interface ItemFormActions {
  setField: <K extends keyof ItemFormData>(key: K, value: ItemFormData[K]) => void;
  addMedia: (asset: MediaAsset) => void;
  removeMedia: (uri: string) => void;
  validate: () => boolean;
  reset: () => void;
  setSubmitting: (value: boolean) => void;
  setSubmitSuccess: (value: boolean) => void;
}

export type ItemFormStore = ItemFormState & ItemFormActions;
