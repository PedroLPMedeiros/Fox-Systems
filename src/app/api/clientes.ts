import { request } from './_request';

export const listClients = () => request<any[]>(`/clientes/`);

export const createClient = (payload: {
  nome: string;
  email: string;
  matricula: string;
  cpf: string;
  data_nascimento: string;
}) => request<any>(`/clientes/`, {
  method: 'POST',
  body: payload,
});

export const getClient = (id: number | string) => request<any>(`/clientes/${id}/`);

export const updateClient = (id: number | string, payload: Partial<any>) =>
  request<any>(`/clientes/${id}/`, {
    method: 'PATCH',
    body: payload,
  });

export const deleteClient = (id: number | string) =>
  request<void>(`/clientes/${id}/`, { method: 'DELETE' });

export const getFuncionario = (id: number | string) => request<any>(`/funcionarios/${id}/`);

export const updateFuncionario = (id: number | string, payload: Partial<any>) =>
  request<any>(`/funcionarios/${id}/`, {
    method: 'PATCH',
    body: payload,
  });

export const vincularAluno = (id_aluno: number | string, id_instrutor: number | string) =>
  request<any>(`/instrutores/vincular/`, {
    method: 'POST',
    body: { id_aluno, id_instrutor },
  });

export const criarTreinoCliente = (id_cliente: number | string) =>
  request<any>(`/clientes/${id_cliente}/treinos/`, {
    method: 'POST',
  });
