export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  console.log('[apiFetch] URL ->', url);

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '');
    const details = isJson
      ? (Array.isArray(body?.message) ? body.message.join('; ') : (body?.message || JSON.stringify(body)))
      : (body || `HTTP ${res.status}`);
    throw new Error(`Błąd serwera (${res.status}). ${details}`);
  }

  if (!isJson) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Oczekiwano JSON, otrzymano: ${ct || 'unknown'}.\n${txt.slice(0, 120)}…`);
  }

  return res.json();
}
