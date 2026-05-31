"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/src/componets/AuthLayout';
import Link from 'next/link';
import { createClient } from '@/src/app/api/clientes';
import { Modal } from '@/src/componets/Modal';
import { Loader } from '@/src/componets/Loader';

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info' as any });
  const [isLoading, setIsLoading] = useState(false);

  const showModal = (title: string, message: string, type: 'success'|'error'|'info' = 'info') => {
    setModalConfig({ title, message, type });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalConfig.type === 'success') {
      router.push('/login');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createClient({
        nome,
        email,
        matricula,
        cpf,
        data_nascimento: dataNascimento,
      });
      setIsLoading(false);
      showModal("Sucesso", "Conta criada com sucesso! Você já pode fazer login.", "success");
    } catch (err: any) {
      setIsLoading(false);
      showModal("Ops...", "Erro ao criar conta: " + err.message, "error");
    }
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Modal isOpen={modalOpen} onClose={handleModalClose} title={modalConfig.title} message={modalConfig.message} type={modalConfig.type} />
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome completo"
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail"
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Matrícula"
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
          value={matricula}
          onChange={e => setMatricula(e.target.value)}
        />
        <input
          type="text"
          placeholder="CPF"
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
          value={cpf}
          onChange={e => setCpf(e.target.value)}
        />
        <div className="flex flex-col">
          <label className="text-zinc-500 text-xs mb-1 uppercase font-bold">Data de Nascimento</label>
          <input
            type="date"
            placeholder="Data de nascimento"
            className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none text-zinc-400"
            required
            value={dataNascimento}
            onChange={e => setDataNascimento(e.target.value)}
          />
        </div>
        <button className="bg-fox-red hover:bg-red-700 py-4 rounded font-bold uppercase mt-2 transition-colors">Registrar</button>
      </form>
      <p className="mt-8 text-center text-sm text-zinc-400">Já tem conta? <Link href="/login" className="text-fox-red hover:underline font-semibold">Voltar para login</Link></p>
    </AuthLayout>
  );
}