import { create } from 'zustand';

import type { ItemFormData, ItemFormErrors, ItemFormStore } from './item-form.types';

const INITIAL_FORM: ItemFormData = {
  name: '',
  description: '',
  price: '',
  offerType: '',
  discountValue: '',
  media: [],
  startDate: null,
  endDate: null,
};

function validateForm(form: ItemFormData): ItemFormErrors {
  const errors: ItemFormErrors = {};

  if (!form.name.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }

  if (!form.description.trim()) {
    errors.description = 'La descripción es obligatoria.';
  }

  const price = parseFloat(form.price);
  if (!form.price.trim()) {
    errors.price = 'El precio es obligatorio.';
  } else if (isNaN(price) || price <= 0) {
    errors.price = 'El precio debe ser un número mayor a 0.';
  }

  if (!form.offerType) {
    errors.offerType = 'Selecciona un tipo de oferta.';
  }

  const discount = parseFloat(form.discountValue);
  if (!form.discountValue.trim()) {
    errors.discountValue = 'El valor de descuento es obligatorio.';
  } else if (isNaN(discount) || discount <= 0) {
    errors.discountValue = 'El descuento debe ser mayor a 0.';
  } else if (form.offerType === 'percentage' && discount > 100) {
    errors.discountValue = 'El porcentaje no puede ser mayor a 100.';
  }

  if (form.media.length === 0) {
    errors.media = 'Debes subir al menos un archivo multimedia.';
  }

  if (!form.startDate) {
    errors.startDate = 'La fecha de inicio es obligatoria.';
  }

  if (!form.endDate) {
    errors.endDate = 'La fecha de fin es obligatoria.';
  } else if (form.startDate && form.endDate <= form.startDate) {
    errors.endDate = 'La fecha de fin debe ser posterior a la de inicio.';
  }

  return errors;
}

export const useItemFormStore = create<ItemFormStore>((set, get) => ({
  // State
  form: INITIAL_FORM,
  errors: {},
  isSubmitting: false,
  submitSuccess: false,

  // Actions
  setField: (key, value) =>
    set((state) => ({
      form: { ...state.form, [key]: value },
      // Clear the error for the field being edited
      errors: { ...state.errors, [key]: undefined },
    })),

  addMedia: (asset) =>
    set((state) => ({
      form: { ...state.form, media: [...state.form.media, asset] },
      errors: { ...state.errors, media: undefined },
    })),

  removeMedia: (uri) =>
    set((state) => ({
      form: {
        ...state.form,
        media: state.form.media.filter((m) => m.uri !== uri),
      },
    })),

  validate: () => {
    const errors = validateForm(get().form);
    set({ errors });
    return Object.keys(errors).length === 0;
  },

  reset: () => set({ form: INITIAL_FORM, errors: {}, isSubmitting: false, submitSuccess: false }),

  setSubmitting: (value) => set({ isSubmitting: value }),

  setSubmitSuccess: (value) => set({ submitSuccess: value }),
}));
