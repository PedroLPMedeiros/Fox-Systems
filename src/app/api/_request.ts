export const API_BASE = 'http://127.0.0.1:8000/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method: HttpMethod;
  body?: any;
}

/**
 * Generic wrapper around fetch that returns JSON data or throws an Error.
 * All API modules import this helper to keep the request logic in one place.
 */
export async function request<T>(path: string, opts: RequestOptions = { method: 'GET' }): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const fetchOpts: RequestInit = {
    method: opts.method,
    headers,
  };

  if (opts.body) {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  const resp = await fetch(`${API_BASE}${path}`, fetchOpts);
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.error ?? 'Erro inesperado na API');
  }
  return data as T;
}
