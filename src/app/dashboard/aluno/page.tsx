"use client"
import { useState } from 'react';

export default function AlunoDashboard() {
  return (
    <div className="min-h-screen bg-fox-black text-white pb-10">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b border-zinc-800">
        <img src="/img/Fox_System_logo.jpeg" alt="Logo" className="h-10" />
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
          Sair da Conta <span>→</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Card de Perfil (Informações Pessoais) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full border-2 border-fox-red overflow-hidden relative">
              <img src="/img/avatar-placeholder.jpg" alt="Perfil" className="object-cover w-full h-full" />
              <button className="absolute bottom-0 right-0 bg-zinc-800 p-1 rounded-full border border-zinc-700">✎</button>
            </div>
            <div>
              <h2 className="font-bold text-xl">Fulano da Silva</h2>
              <p className="text-zinc-500 text-sm">Idade: 25</p>
              <p className="text-zinc-500 text-sm">Matrícula: 1232026</p>
            </div>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-900">
              Status: Ativo
            </span>
          </div>

          <div className="md:col-span-2 space-y-4 text-sm text-zinc-300">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="font-bold text-white uppercase tracking-wider">Informações Pessoais</h3>
              <button className="text-zinc-500 hover:text-white">✎</button>
            </div>
            <p><strong>Altura:</strong> 170cm | <strong>Peso:</strong> 70kg | <strong>Gênero:</strong> Masculino</p>
            <p><strong className="text-white">Observação Médica:</strong> Não fazer exercícios que exijam muito dos braços e ombros.</p>
            <p><strong className="text-white">Objetivo:</strong> Fortalecer pernas e abdômen.</p>
          </div>
        </section>

        {/* Seção de Treinos */}
        <section>
          <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-tighter">Meus Treinos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['A', 'B', 'C', 'D'].map((letra) => (
              <div key={letra} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex justify-between items-center cursor-pointer hover:border-fox-red transition group">
                <span className="font-bold">Treino {letra}</span>
                <span className="text-zinc-600 group-hover:text-fox-red transition">▼</span>
              </div>
            ))}
          </div>
        </section>

        {/* Atividades Disponíveis */}
        <section className="pt-10 border-t border-zinc-900">
          <h3 className="text-2xl font-bold text-center mb-8 uppercase">Atividades Disponíveis</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             {/* Aqui você pode mapear as atividades como Musculação, Muay-Thai etc. */}
             <ActivityCard title="Musculação" img="/img/musculacao.jpg" />
             <ActivityCard title="Muay-Thai" img="/img/muay-thai.jpg" />
             <ActivityCard title="Pilates" img="/img/pilates.jpg" />
             <ActivityCard title="Dança Mix" img="/img/danca.jpg" />
             <ActivityCard title="Jump" img="/img/jump.jpg" />
          </div>
        </section>

      </main>
    </div>
  );
}

function ActivityCard({ title, img }: { title: string; img: string }) {
  return (
    <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
      <img src={img} alt={title} className="w-full h-full object-cover transition transform group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-fox-red/90 to-transparent flex items-end p-3">
        <span className="font-bold text-sm uppercase">{title}</span>
      </div>
    </div>
  );
}