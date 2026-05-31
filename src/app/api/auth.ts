import { request } from './_request';

export const login = (email: string, password: string) =>
  request<{ token: string; tipo_pessoa: string }>(`/auth/login/`, {
    method: 'POST',
    body: { email, password },
  });
