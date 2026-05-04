"use client"
import { useState } from 'react';
import { AuthLayout } from '@/src/componets/AuthLayout';
import { Input } from '@/src/componets/Input';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/components/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log("Login:", { email, password });
    if (email.includes('instrutor')){
        router.push('/dashboard/instrutor');
    } else {
        router.push('/dashboard/aluno');
    }
  };

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
        <button className="bg-fox-red hover:bg-red-700 py-4 rounded font-bold uppercase transition-colors">
          Entrar
        </button>
      </form>
      
      <div className="mt-6 flex flex-col gap-2 text-center text-sm">
        <Link href="#" className="text-zinc-500 hover:text-white">Esqueci minha senha</Link>
        <p className="text-zinc-400">
          Não tem conta? <Link href="/cadastro" className="text-fox-red hover:underline font-semibold">Criar conta</Link>
        </p>
      </div>
    </AuthLayout>
  );
}