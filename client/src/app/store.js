// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

// --- helpers do localStorage (bezpieczne, żeby nie wywalić appki) ---
const LS_KEY = 'stylistka_cart_v1';

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return undefined;                 // brak preloadedState -> Redux zrobi initialState
    const parsed = JSON.parse(raw);

    // Minimalna walidacja: oczekujemy tablicy items z obiektami {id, qty, note?}
    if (!parsed || !Array.isArray(parsed.items)) return undefined;

    // Upewniamy się, że id/qty to liczby całkowite > 0
    const items = parsed.items
      .map((it) => ({
        id: Number(it.id),
        qty: Math.max(1, Number(it.qty) | 0),
        ...(typeof it.note === 'string' ? { note: it.note } : {}),
      }))
      .filter((it) => Number.isFinite(it.id) && it.id > 0);

    return { cart: { items } };
  } catch {
    return undefined;
  }
}

function saveCartToStorage(store) {
  try {
    const state = store.getState();
    const payload = { items: state.cart.items };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch {
    // ignorujemy błędy zapisu (np. brak miejsca/tryb prywatny)
  }
}

// --- tworzymy store z ewentualnym preloadedState ---
const preloadedState = loadCartFromStorage();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

// --- subskrypcja: po każdej zmianie stanu zapisz koszyk ---
store.subscribe(() => {
  saveCartToStorage(store);
});
