"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion } from "@/src/componets/Accordion";
import { Footer } from "@/src/componets/Footer";

// Mock de alunos para simular o banco de dados
const alunosMock = [
  { id: '1', nome: 'Pedro Lucas', matricula: '1232026', idade: 25 },
  { id: '2', nome: 'Yuri Filgueira', matricula: '1462025', idade: 28 },
];

export default function InstrutorDashboard() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);

  // Filtra os alunos conforme o instrutor digita
  const alunosFiltrados = alunosMock.filter(aluno => 
    aluno.nome.toLowerCase().includes(busca.toLowerCase()) || 
    aluno.matricula.includes(busca)
  );

  return (
    <div className="min-h-screen flex flex-col bg-fox-black text-white">
      <header className="flex justify-between items-center py-2 px-8 border-b border-zinc-900">
        <img src="/Logo_FoxFit.png" alt="Logo" className="h-20" />
        <button onClick={() => router.push('/login')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition cursor-pointer">
          Sair da Conta →
        </button>
      </header>

      <main className="flex-grow max-w-5xl mx-auto p-6 w-full space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 overflow-hidden relative">
                <img src="/Avatar-instrutor.png" alt="Perfil do Instrutor" className="object-cover w-full h-full" />
            </div>
            <div>
                <h2 className="font-bold text-xl tracking-tighter italic">Fulana de Medeiros</h2>
                <p className="text-zinc-500 text-sm">Matrícula: 3000300</p>
            </div>
            
            </div>

            <div className="md:col-span-2 space-y-4 text-sm text-zinc-300">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <h3 className="font-bold text-white uppercase tracking-wider">Perfil Profissional</h3>
                <button className="text-zinc-500 hover:text-white cursor-pointer transition">✎</button>
            </div>
            <p><strong>Especialidade:</strong> Musculação e Calistenia | <strong>Turno:</strong> Matutino</p>
            <p>
                <strong className="text-white">Resumo:</strong> Especialista em treinamento de alta intensidade e acessibilidade aplicada ao fitness. 
                Responsável pela gestão técnica da unidade Natal.
            </p>
            
            </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-3xl font-bold uppercase italic tracking-tighter mb-8 text-zinc-100">
            Pesquisar Alunos
          </h2>
          
          {/* Barra de Busca conforme o Figma */}
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text"
              placeholder="Digite o nome ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-full pl-12 focus:border-white outline-none transition"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
            
            {/* Resultados da Busca (Dropdown) */}
            {busca && !alunoSelecionado && (
              <div className="absolute w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-10 shadow-2xl">
                {alunosFiltrados.map(aluno => (
                  <button 
                    key={aluno.id}
                    onClick={() => { setAlunoSelecionado(aluno); setBusca(''); }}
                    className="w-full p-4 text-left hover:bg-zinc-800 flex justify-between items-center border-b border-zinc-800 last:border-0"
                  >
                    <span>{aluno.nome}</span>
                    <span className="text-zinc-500 text-xs italic">Matrícula: {aluno.matricula}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Exibição do Aluno Selecionado */}
        {alunoSelecionado && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-full border border-white" /> {/* Espaço da imagem do aluno */}
                <div>
                  <h3 className="font-bold text-xl">{alunoSelecionado.nome}</h3>
                  <p className="text-zinc-500 text-sm">Matrícula: {alunoSelecionado.matricula}</p>
                </div>
                <button onClick={() => setAlunoSelecionado(null)} className="ml-auto text-zinc-600 hover:text-white">✕</button>
              </div>
            </div>

            <h4 className="text-xl font-bold uppercase mb-6 text-center italic">Treinos do Aluno</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {['A', 'B', 'C', 'D'].map(letra => (
                <Accordion key={letra} title={`Treino ${letra}`}>
                  <p className="text-zinc-500 italic text-sm mb-4">Clique no ícone de editar para alterar este treino.</p>
                  <button className="text-white font-bold text-xs uppercase flex items-center gap-2 hover:underline">
                    ✎ Editar Treino {letra}
                  </button>
                </Accordion>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}