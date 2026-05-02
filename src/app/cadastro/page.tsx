"use client"
import { AuthLayout } from '@/src/componets/AuthLayout';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthLayout>
      <form className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Nome completo" 
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
        />
        <input 
          type="email" 
          placeholder="E-mail do aluno" 
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
        />
        <input 
          type="text" 
          placeholder="Matrícula" 
          className="p-4 bg-zinc-900 border border-zinc-800 rounded focus:ring-2 focus:ring-fox-red outline-none"
          required
        />
        <button className="bg-fox-red hover:bg-red-700 py-4 rounded font-bold uppercase mt-2 transition-colors">
          Registrar
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Já tem conta? <Link href="/login" className="text-fox-red hover:underline font-semibold">Voltar para login</Link>
      </p>
    </AuthLayout>
  );
}