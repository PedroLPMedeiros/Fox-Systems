"use client"
import { Accordion } from '@/src/componets/Accordion';
import { Footer } from '@/src/componets/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getClient, getTreino, updateClient } from '@/src/app/api';
import { Modal } from '@/src/componets/Modal';
import { Loader } from '@/src/componets/Loader';

export default function AlunoDashboard() {
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [treino, setTreino] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [altura, setAltura] = useState('');
  const [pesoInicial, setPesoInicial] = useState('');
  const [observacao, setObservacao] = useState('');
  const [objetivo, setObjetivo] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info' as any });

  const showModal = (title: string, message: string, type: 'success'|'error'|'info' = 'info') => {
    setModalConfig({ title, message, type });
    setModalOpen(true);
  };

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }

    async function loadData() {
      try {
        const cliData = await getClient(userId as string);
        setCliente(cliData);
        
        if (cliData.treino?.id_treino) {
          const trData = await getTreino(cliData.treino.id_treino);
          setTreino(trData);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    router.push('/login');
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Str = reader.result as string;
        try {
          const userId = localStorage.getItem('user_id');
          const atualizado = await updateClient(userId!, { foto_perfil: base64Str });
          setCliente(atualizado);
          showModal("Sucesso", "Foto atualizada com sucesso", "success");
        } catch (err) {
          showModal("Erro", "Erro ao salvar a foto.", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fox-black text-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-fox-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{errorMsg}</p>
        <button onClick={handleLogout} className="bg-fox-red px-4 py-2 rounded">Voltar pro Login</button>
      </div>
    );
  }

  const exercicios = treino ? treino.descricao.split('\n').filter((t:string) => t.trim() !== '') : [];

  const abrirEdicao = () => {
    setAltura(cliente?.altura || '');
    setPesoInicial(cliente?.peso || '');
    setObservacao(cliente?.observacao_medica || '');
    setObjetivo(cliente?.objetivo || '');
    setEditandoPerfil(true);
  };

  const salvarPerfil = async () => {
    try {
      const atualizado = await updateClient(cliente.id_pessoa, {
        altura: altura ? parseFloat(altura) : null,
        peso: pesoInicial ? parseFloat(pesoInicial) : null,
        observacao_medica: observacao,
        objetivo: objetivo
      });
      setCliente(atualizado);
      setEditandoPerfil(false);
      showModal("Sucesso!", "Perfil atualizado com sucesso!", "success");
    } catch (err: any) {
      showModal("Erro", "Erro ao atualizar perfil: " + err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-fox-black text-white ">
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalConfig.title} message={modalConfig.message} type={modalConfig.type} />
      <header className="flex justify-between items-center py-2 px-8 border-b border-zinc-900">
        <img src="/Logo_FoxFit.png" alt="Logo" className="h-20" />
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition cursor-pointer" onClick={handleLogout}>
          Sair da Conta <span>→</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8 ">
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 overflow-hidden relative group">
              <img src={cliente?.foto_perfil || "/avatar.png"} alt="Perfil" className="object-cover w-full h-full" />
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <span className="text-white text-xs font-bold uppercase text-center">Trocar<br/>Foto</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <div>
              <h2 className="font-bold text-xl">{cliente?.nome}</h2>
              <p className="text-zinc-500 text-sm">Matrícula: {cliente?.matricula}</p>
            </div>
            <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-900">
              Status: Ativo
            </span>
          </div>

          <div className="md:col-span-2 space-y-4 text-sm text-zinc-300">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <h3 className="font-bold text-white uppercase tracking-wider">Informações Pessoais</h3>
              {!editandoPerfil && (
                <button onClick={abrirEdicao} className="text-zinc-500 hover:text-white cursor-pointer">✎</button>
              )}
            </div>

            {!editandoPerfil ? (
              <>
                <p><strong>Altura:</strong> {cliente?.altura ?? 'Não inf.'} | <strong>Peso Inicial:</strong> {cliente?.peso ?? 'Não inf.'}</p>
                <p><strong className="text-white">Observação Médica:</strong> {cliente?.observacao_medica || 'Nenhuma'}</p>
                <p><strong className="text-white">Objetivo:</strong> {cliente?.objetivo || 'Não informado'}</p>
              </>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs mb-1 text-zinc-500">Altura (ex: 1.75)</label>
                    <input type="number" step="0.01" value={altura} onChange={e => setAltura(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white outline-none focus:border-fox-red" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs mb-1 text-zinc-500">Peso Inicial (kg)</label>
                    <input type="number" step="0.1" value={pesoInicial} onChange={e => setPesoInicial(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white outline-none focus:border-fox-red" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-zinc-500">Observação Médica</label>
                  <textarea value={observacao} onChange={e => setObservacao(e.target.value)} rows={2} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white outline-none focus:border-fox-red" />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-zinc-500">Objetivo</label>
                  <textarea value={objetivo} onChange={e => setObjetivo(e.target.value)} rows={2} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white outline-none focus:border-fox-red" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditandoPerfil(false)} className="text-zinc-500 hover:text-white font-bold text-xs uppercase px-2">Cancelar</button>
                  <button onClick={salvarPerfil} className="bg-fox-red px-4 py-2 rounded text-white font-bold text-xs uppercase hover:bg-red-700">Salvar Alterações</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-tighter">Meus Treinos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start cursor-pointer">
            {treino && treino.descricao ? (
              treino.descricao.split('|').filter((t:string) => t.trim() !== '').map((blocoTreino: string, index: number) => {
                let titulo = `Treino ${['A', 'B', 'C', 'D', 'E', 'F'][index] || (index + 1)}`;
                let exerciciosString = blocoTreino;
                
                if (blocoTreino.includes(':')) {
                  const parts = blocoTreino.split(':');
                  titulo = parts[0].trim();
                  exerciciosString = parts.slice(1).join(':').trim();
                }

                const linhas = exerciciosString.split(/,|\n/).filter((l:string) => l.trim() !== '');

                return (
                  <Accordion key={index} title={titulo}>
                    <ul className="space-y-2">
                      {linhas.length > 0 ? linhas.map((linha, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-zinc-300">
                          <span className="w-1.5 h-1.5 bg-fox-red rounded-full flex-shrink-0" />
                          <span>{linha.trim()}</span>
                        </li>
                      )) : (
                        <li className="text-zinc-500">Sem exercícios descritos.</li>
                      )}
                    </ul>
                  </Accordion>
                );
              })
            ) : (
              <p className="text-zinc-500 col-span-full text-center">Nenhum treino vinculado ao seu perfil ainda.</p>
            )}
          </div>
        </section>

        <section className="mt-16 pt-10 border-t border-zinc-900">
          <h3 className="text-2xl font-bold text-center mb-10 uppercase">Atividades Disponíveis</h3>
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 gap-6 md:grid md:grid-cols-3 lg:grid-cols-4 xl:gap-8 no-scrollbar">
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