"use client"
import { useState } from 'react';
import { AuthLayout } from '@/src/componets/AuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/src/app/api/auth';
import { Loader } from '@/src/componets/Loader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('user_id', String((data as any).id_pessoa || 1));
      
      if (email.includes('instrutor') || (data as any).tipo_pessoa === 'instrutor' || (data as any).tipo_pessoa === 2) {
        router.push('/dashboard/instrutor');
      } else {
        router.push('/dashboard/aluno');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setIsLoading(false);
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
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-mail"
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none transition"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha (Sua Matrícula)"
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none transition"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-fox-red hover:bg-red-700 py-4 rounded font-bold uppercase transition-colors">Entrar</button>
        {errorMsg && (
          <p className="mt-2 text-sm text-red-400 font-medium">{errorMsg}</p>
        )}
      </form>
      <div className="mt-6 flex flex-col gap-2 text-center text-sm">
        <Link href="#" className="text-zinc-500 hover:text-white">Esqueci minha senha</Link>
        <p className="text-zinc-400">Não tem conta? <Link href="/cadastro" className="text-fox-red hover:underline font-semibold">Criar conta</Link></p>
      </div>
    </AuthLayout>
  );
}