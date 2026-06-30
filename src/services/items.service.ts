import type { Item, ItemFormData } from '@/store';

// Change this to your local IP when testing on a physical device
const API_BASE_URL = 'http://192.168.1.72:3000/api';

export interface SubmitItemSuccess {
  ok: true;
  data: {
    success: boolean;
    item: import('@/store').Item;
  };
}

export interface SubmitItemError {
  ok: false;
  errors: { field: string; message: string }[];
}

export type SubmitItemResult = SubmitItemSuccess | SubmitItemError;

export async function fetchItems(): Promise<Item[]> {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const json = await response.json();
  return json.items as Item[];
}

export async function submitItem(form: ItemFormData): Promise<SubmitItemResult> {
  const body = new FormData();

  body.append('name', form.name.trim());
  body.append('description', form.description.trim());
  body.append('price', form.price);
  body.append('offerType', form.offerType);
  body.append('discount', form.discountValue);
  body.append('startDate', form.startDate!.toISOString());
  body.append('endDate', form.endDate!.toISOString());

  console.log('[submitItem] Enviando:', {
    name: form.name,
    price: form.price,
    offerType: form.offerType,
    discountValue: form.discountValue,
    startDate: form.startDate?.toISOString(),
    endDate: form.endDate?.toISOString(),
    mediaCount: form.media.length,
  });

  for (const asset of form.media) {
    body.append('media', {
      uri: asset.uri,
      name: asset.fileName,
      type: asset.mimeType,
    } as unknown as Blob);
  }

  // fetch doesn't support { uri, name, type } FormData parts in RN 0.86+
  // XMLHttpRequest handles multipart file uploads correctly
  return new Promise<SubmitItemResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/items`);

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ ok: true, data: json });
        } else if (xhr.status === 400 || xhr.status === 422) {
          resolve({ ok: false, errors: json.errors ?? [{ field: 'general', message: JSON.stringify(json) }] });
        } else {
          resolve({
            ok: false,
            errors: [{ field: 'general', message: `Error ${xhr.status}: ${xhr.responseText}` }],
          });
        }
      } catch {
        reject(new Error(`Respuesta inválida del servidor (status ${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error('No se pudo conectar. Verifica IP y que el servidor esté activo.'));
    xhr.ontimeout = () => reject(new Error('Tiempo de espera agotado.'));
    xhr.timeout = 15000;

    xhr.send(body);
  });
}
