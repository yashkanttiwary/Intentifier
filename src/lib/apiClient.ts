export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Try to use headers if provided, setup cleanly.
  const headers = new Headers(options.headers || {});
  
  // We retrieve the key mostly natively bypassing hooks for raw fetches
  const authStorage = localStorage.getItem('intentifier-auth');
  let apiKey = '';
  if (authStorage) {
    try {
      const state = JSON.parse(authStorage).state;
      if (state && state.apiKey) apiKey = state.apiKey;
    } catch(e) {}
  }
  
  if (apiKey) {
    headers.set('Authorization', `Bearer ${apiKey}`);
  }
  headers.set('Content-Type', 'application/json');

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed with status ${res.status}`);
  }

  return res.json();
}
