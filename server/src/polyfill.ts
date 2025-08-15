// server/src/polyfill.ts
// Ustaw 'globalThis.crypto' tylko jeśli środowisko go nie ma (np. starszy Node).
(() => {
  const hasCrypto =
    typeof globalThis.crypto !== 'undefined' &&
    // w razie dziwnych shimów sprawdzamy typową metodę Web Crypto
    typeof (globalThis.crypto as any).getRandomValues === 'function';

  if (!hasCrypto) {
    // W Node >=15 dostępne jest crypto.webcrypto
    const { webcrypto } = require('crypto');
    (globalThis as any).crypto = webcrypto;
  }
})();
export {};
