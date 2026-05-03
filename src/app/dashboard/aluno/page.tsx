"use client"
import { Accordion } from '@/src/componets/Accordion';
import { Footer } from '@/src/componets/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AlunoDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };


  return (
    <div className="min-h-screen bg-fox-black text-white ">
      {/* Header */}
      <header className="flex justify-between items-center py-2 px-8 border-b border-zinc-900">
        <img src="/Logo_FoxFit.png" alt="Logo" className="h-20" />
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition cursor-pointer" onClick={handleLogout}>
          Sair da Conta <span>→</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8 ">
        
        {/* Card de Perfil (Informações Pessoais) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 overflow-hidden relative">
              <img src="/avatar.png" alt="Perfil" className="object-cover w-full h-full" />
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
              <button className="text-zinc-500 hover:text-white cursor-pointer">✎</button>
            </div>
            <p><strong>Altura:</strong> 170cm | <strong>Peso:</strong> 70kg | <strong>Gênero:</strong> Masculino</p>
            <p><strong className="text-white">Observação Médica:</strong> Não fazer exercícios que exijam muito dos braços e ombros.</p>
            <p><strong className="text-white">Objetivo:</strong> Fortalecer pernas e abdômen.</p>
          </div>
        </section>

        {/* Seção de Treinos */}
        <section>
          <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-tighter">Meus Treinos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start cursor-pointer">
            {treinosMock.map((treino) => (
            <Accordion key={treino.id} title={treino.nome}>
              <ul className="space-y-2">
                {treino.exercicios.map((ex, index) => (
                  <li key={index} className="flex items-center gap-3 text-zinc-300">
                    <span className="w-1.5 h-1.5 bg-fox-red rounded-full" />
                    {ex}
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
          </div>
        </section>

        {/* Atividades Disponíveis */}
        <section className="mt-16 pt-10 border-t border-zinc-900">
          <h3 className="text-2xl font-bold text-center mb-10 uppercase">Atividades Disponíveis</h3>
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 gap-6 md:grid md:grid-cols-3 lg:grid-cols-4 xl:gap-8 no-scrollbar">
             {/* Aqui você pode mapear as atividades como Musculação, Muay-Thai etc. */}
             <ActivityCard title="Musculação" img="/musculacao.png" />
             <ActivityCard title="Muay-Thai" img="/muay-thai.png" />
             <ActivityCard title="Pilates" img="/pilates.png" />
             <ActivityCard title="Dança Mix" img="/danca-mix.png" />
             <ActivityCard title="Jump" img="/jump.png" />
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 md:hidden">
            <p className="text-xs text-zinc-500 italic">Deslize para ver mais</p>
            <span className="text-fox-red animate-pulse">→</span>
          </div>
        </section>

      </main>
      <Footer></Footer>
    </div>
  );
}

const treinosMock = [
  { id: 'A', nome: 'Treino A', exercicios: ['Supino Reto - 3x12', 'Crucifixo - 3x15', 'Tríceps Corda - 4x10'] },
  { id: 'B', nome: 'Treino B', exercicios: ['Leg Press 45 - 3x12', 'Cadeira Extensora - 3x15', 'Agachamento - 4x10'] },
  { id: 'C', nome: 'Treino C', exercicios: ['Puxada Frente - 3x12', 'Remada Baixa - 3x15', 'Rosca Direta - 4x10'] },
  { id: 'D', nome: 'Treino D', exercicios: ['Desenvolvimento - 3x12', 'Elevação Lateral - 3x15', 'Abdominal - 4x20'] },
];

function ActivityCard({ title, img }: { title: string; img: string }) {
  return (
    <div 
    className="min-w-[280px] md:min-w-0 snap-center relative h-80 lg:h-70  rounded-xl overflow-hidden group cursor-pointer border border-zinc-800 transition-all duration-300 group-hover:border-fox-red">
      <img 
      src={img} 
      alt={title} 
      className="w-full h-full object-cover transition transform group-hover:scale-110" />
      <div 
      className="absolute bottom-0 left-0 right-0 bg-fox-red flex justify-center items-center py-3 px-4">
        <span className="font-bold text-sm uppercase text-white text-center">{title}</span>
      </div>
    </div>
  );
}