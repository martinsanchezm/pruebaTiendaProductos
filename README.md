# prueba — App móvil con Expo

App React Native construida con Expo SDK 57 y Expo Router.

## Requisitos previos

- Node.js 18+
- Xcode 15+ (para iOS)
- Android Studio con un emulador configurado (para Android)
- El backend corriendo en tu máquina local

---

## 1. Instalar dependencias

```bash
npm install
```

---

## 2. Configurar la IP del backend

La app se conecta al backend mediante la IP local de tu PC. `localhost` no funciona en dispositivos físicos ni en emuladores porque no apuntan a tu máquina.

Abre el archivo `src/services/items.service.ts` y cambia la IP por la de tu PC:

```ts
const API_BASE_URL = 'http://TU_IP_LOCAL:3000/api';
```

**¿Cómo saber tu IP local?**

- **Mac / Linux:** Ejecuta `ifconfig | grep "inet "` en la terminal. Busca la IP de tu red Wi-Fi, suele empezar por `192.168.x.x`.
- **Windows:** Ejecuta `ipconfig` en cmd. Busca "Dirección IPv4".

> El dispositivo/emulador y tu PC deben estar conectados a la **misma red Wi-Fi**.

---

## 3. Correr en iOS

### Simulador (sin dispositivo físico)

```bash
npx expo run:ios
```

Esto compila la app y la abre en el simulador de iOS de Xcode.

### Dispositivo físico

1. Conecta el iPhone por USB.
2. Asegúrate de que Xcode reconoce el dispositivo y tiene un perfil de firma configurado.
3. Ejecuta:

```bash
npx expo run:ios --device
```

---

## 4. Correr en Android

### Emulador

1. Abre Android Studio y lanza un emulador (AVD Manager).
2. Ejecuta:

```bash
npx expo run:android
```

### Dispositivo físico

1. Activa **Opciones de desarrollador** y **Depuración USB** en el teléfono.
2. Conecta el teléfono por USB.
3. Ejecuta:

```bash
npx expo run:android --device
```

> En emulador Android, puedes usar `10.0.2.2` como IP para apuntar a `localhost` de tu PC en vez de tu IP local.

---

## 5. Modo desarrollo rápido (sin compilar)

Si no necesitas módulos nativos nuevos, puedes usar:

```bash
npx expo start
```

Y escanear el QR con la app **Expo Go** desde tu dispositivo. Ten en cuenta que algunos módulos nativos no están disponibles en Expo Go.
