import { request } from './_request';

export const listTreinos = () =>
  request<any[]>(`/treinos/`);

export const getTreino = (id: number | string) =>
  request<any>(`/treinos/${id}/`);

export const updateTreino = (id: number | string, descricao: string) =>
  request<any>(`/treinos/${id}/`, {
    method: 'PATCH',
    body: { descricao },
  });
