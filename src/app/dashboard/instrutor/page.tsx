"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Accordion } from "@/src/componets/Accordion";
import { Footer } from "@/src/componets/Footer";
import { listClients, getTreino, updateTreino, getFuncionario, updateFuncionario, vincularAluno, criarTreinoCliente, listTreinos } from '@/src/app/api';
import { Modal } from '@/src/componets/Modal';
import { Loader } from '@/src/componets/Loader';

export default function InstrutorDashboard() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [alunos, setAlunos] = useState<any[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<any>(null);
  const [alunoParaVincular, setAlunoParaVincular] = useState<number | null>(null);
  const [treinoAluno, setTreinoAluno] = useState<any>(null);
  const [editandoTreino, setEditandoTreino] = useState(false);
  const [descricaoTreino, setDescricaoTreino] = useState('');
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [treinosDisponiveis, setTreinosDisponiveis] = useState<any[]>([]);

  const [instrutor, setInstrutor] = useState<any>(null);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [formData, setFormData] = useState({ especialidade: '', turno: '', foto_perfil: '', cref: '', sexo: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', type: 'info' as any });

  const showModal = (title: string, message: string, type: 'success'|'error'|'info' = 'info') => {
    setModalConfig({ title, message, type });
    setModalOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          router.push('/login');
          return;
        }
        
        const instrutorData = await getFuncionario(userId);
        setInstrutor(instrutorData);
        setFormData({
          especialidade: instrutorData.especialidade || '',
          turno: instrutorData.turno || '',
          foto_perfil: instrutorData.foto_perfil || '',
          cref: instrutorData.cref || '',
          sexo: instrutorData.sexo || ''
        });

        const dados = await listClients();
        setAlunos(dados);

        const treinosData = await listTreinos();
        setTreinosDisponiveis(treinosData);
      } catch (err) {
        console.error("Erro ao carregar dados", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const selecionarAluno = async (aluno: any) => {
    setAlunoSelecionado(aluno);
    setBusca('');
    setEditandoTreino(false);
    setTreinoAluno(null);
    setOpenAccordionIndex(0);

    const treinoId = aluno.id_treino_id || aluno.id_treino;
    if (treinoId) {
      try {
        const tr = await getTreino(treinoId);
        setTreinoAluno(tr);
        setDescricaoTreino(tr.descricao || '');
      } catch (err) {
        console.error("Erro ao carregar treino", err);
      }
    }
  };

  const salvarTreino = async () => {
    if (!treinoAluno) return;
    try {
      const atualizado = await updateTreino(treinoAluno.id_treino, descricaoTreino);
      setTreinoAluno(atualizado);
      setEditandoTreino(false);
      showModal("Sucesso!", "Treino atualizado com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao atualizar", err);
      showModal("Erro", "Erro ao atualizar treino.", "error");
    }
  };

  const salvarPerfil = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const atualizado = await updateFuncionario(userId!, formData);
      setInstrutor(atualizado);
      setEditandoPerfil(false);
      showModal("Sucesso", "Perfil atualizado com sucesso", "success");
    } catch (e) {
      showModal("Erro", "Erro ao atualizar perfil", "error");
    }
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Str = reader.result as string;
        setFormData(prev => ({ ...prev, foto_perfil: base64Str }));
        
        try {
          const userId = localStorage.getItem('user_id');
          const atualizado = await updateFuncionario(userId!, { foto_perfil: base64Str });
          setInstrutor(atualizado);
          showModal("Sucesso", "Foto atualizada com sucesso", "success");
        } catch (err) {
          showModal("Erro", "Erro ao salvar a foto.", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmarVinculo = async (alunoId: number) => {
    try {
      const userId = localStorage.getItem('user_id');
      await vincularAluno(alunoId, userId!);
      showModal("Sucesso!", "Aluno vinculado ao seu perfil com sucesso!", "success");
      setAlunos(alunos.map(a => a.id_pessoa === alunoId ? { ...a, id_instrutor_id: Number(userId) } : a));
    } catch (err) {
      showModal("Erro", "Erro ao vincular aluno.", "error");
    } finally {
      setAlunoParaVincular(null);
    }
  };

  const handleCriarTreino = async (alunoId: number) => {
    try {
      const novoTreino = await criarTreinoCliente(alunoId);
      setAlunos(alunos.map(a => a.id_pessoa === alunoId ? { ...a, id_treino_id: novoTreino.id_treino } : a));
      if (alunoSelecionado && alunoSelecionado.id_pessoa === alunoId) {
        setAlunoSelecionado({ ...alunoSelecionado, id_treino_id: novoTreino.id_treino });
        setTreinoAluno(novoTreino);
        setDescricaoTreino(novoTreino.descricao || '');
        setEditandoTreino(true);
      }
      showModal("Sucesso", "Ficha de treino criada com sucesso!", "success");
    } catch (err) {
      showModal("Erro", "Erro ao criar ficha.", "error");
    }
  };

  const userIdNumber = Number(typeof window !== 'undefined' ? localStorage.getItem('user_id') : 0);
  const meusAlunos = alunos.filter(a => a.id_instrutor_id === userIdNumber);
  
  const alunosFiltrados = alunos.filter(aluno => 
    aluno.id_instrutor_id !== userIdNumber &&
    (aluno.nome.toLowerCase().includes(busca.toLowerCase()) || 
    String(aluno.matricula).includes(busca))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-fox-black text-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-fox-black text-white">
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalConfig.title} message={modalConfig.message} type={modalConfig.type} />
      <header className="flex justify-between items-center py-2 px-8 border-b border-zinc-900">
        <img src="/Logo_FoxFit.png" alt="Logo" className="h-20" />
        <button onClick={() => { localStorage.removeItem('user_id'); router.push('/login'); }} className="flex items-center gap-2 text-zinc-400 hover:text-white transition cursor-pointer">
          Sair da Conta →
        </button>
      </header>

      <main className="flex-grow max-w-5xl mx-auto p-6 w-full space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
            <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-zinc-800 text-4xl font-bold uppercase text-zinc-500 overflow-hidden relative group cursor-pointer">
                {instrutor?.foto_perfil ? (
                  <img src={instrutor.foto_perfil} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span>{instrutor?.nome?.substring(0, 2) || "IN"}</span>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-xs text-white">Trocar</span>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" title="Trocar foto" />
            </div>
            <div>
                <h2 className="font-bold text-xl tracking-tighter italic">{instrutor?.nome || 'Carregando...'}</h2>
            </div>
            </div>

            <div className="md:col-span-2 space-y-4 text-sm text-zinc-300">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <h3 className="font-bold text-white uppercase tracking-wider">Perfil Profissional</h3>
                {!editandoPerfil && (
                   <button onClick={() => setEditandoPerfil(true)} className="text-zinc-500 hover:text-white cursor-pointer transition">✎</button>
                )}
            </div>
            {editandoPerfil ? (
              <div className="space-y-4">
                <div>
                   <label className="block text-xs uppercase text-zinc-500 mb-1">Especialidade</label>
                   <input value={formData.especialidade} onChange={e => setFormData({...formData, especialidade: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-fox-red" placeholder="Ex: Musculação, Crossfit" />
                </div>
                <div>
                   <label className="block text-xs uppercase text-zinc-500 mb-1">Turno</label>
                   <input value={formData.turno} onChange={e => setFormData({...formData, turno: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-fox-red" placeholder="Ex: Manhã, Tarde, Noite" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">CREF</label>
                    <input value={formData.cref} onChange={e => setFormData({...formData, cref: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-fox-red" placeholder="Opcional" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-zinc-500 mb-1">Sexo</label>
                    <select value={formData.sexo} onChange={e => setFormData({...formData, sexo: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-fox-red">
                      <option value="">Prefiro não preencher</option>
                      <option value="M">Homem</option>
                      <option value="F">Mulher</option>
                      <option value="N">Não Binário</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                   <button onClick={() => setEditandoPerfil(false)} className="text-zinc-500 hover:text-white font-bold text-xs uppercase">Cancelar</button>
                   <button onClick={salvarPerfil} className="bg-fox-red px-4 py-2 rounded text-white font-bold text-xs uppercase hover:bg-red-700">Salvar</button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p><strong>Especialidade:</strong> {instrutor?.especialidade || 'Não informada'} | <strong>Turno:</strong> {instrutor?.turno || 'Não informado'}</p>
                <p><strong>CREF:</strong> {instrutor?.cref || 'Não informado'} | <strong>Sexo:</strong> {instrutor?.sexo === 'M' ? 'Homem' : instrutor?.sexo === 'F' ? 'Mulher' : instrutor?.sexo === 'N' ? 'Não Binário' : 'Não informado'}</p>
              </div>
            )}
            </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-2xl font-bold uppercase italic tracking-tighter mb-6 text-zinc-300">
            Pesquisar Alunos
          </h2>
          
          <div className="relative max-w-2xl mx-auto mb-16">
            <input 
              type="text"
              placeholder={loading ? "Carregando alunos..." : "Digite o nome ou matrícula do aluno..."}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              disabled={loading}
              className="w-full p-5 bg-zinc-900 border border-zinc-800 rounded-full focus:border-white outline-none transition text-center"
            />
            
            {busca && !alunoSelecionado && (
              <div className="w-full mt-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-10 shadow-2xl">
                {alunosFiltrados.length > 0 ? alunosFiltrados.map(aluno => (
                  <div 
                    key={aluno.id_pessoa}
                    className="w-full p-4 text-left hover:bg-zinc-800 flex justify-between items-center border-b border-zinc-800 last:border-0 transition"
                  >
                    <div>
                      <span className="block text-white">{aluno.nome}</span>
                      <span className="block text-zinc-500 text-xs italic">Matrícula: {aluno.matricula}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => selecionarAluno(aluno)} 
                        className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition px-3 py-1 text-xs uppercase font-bold rounded text-white whitespace-nowrap"
                      >
                        Ver Treino
                      </button>
                      {String(aluno.id_instrutor_id) !== String(instrutor?.id_pessoa) && (
                        <button 
                          onClick={() => setAlunoParaVincular(aluno.id_pessoa)} 
                          className="bg-zinc-700 hover:bg-fox-red transition px-3 py-1 text-xs uppercase font-bold rounded text-white whitespace-nowrap"
                        >
                          Vincular Aluno
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="w-full p-4 text-left text-zinc-500 border-b border-zinc-800">Nenhum aluno encontrado ou todos já são seus alunos.</div>
                )}
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold uppercase italic tracking-tighter mb-8 text-zinc-100">
            Meus Alunos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {meusAlunos.length > 0 ? meusAlunos.map(aluno => (
              <div 
                key={aluno.id_pessoa}
                className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-xl hover:border-fox-red cursor-pointer transition text-left flex justify-between items-center"
                onClick={() => selecionarAluno(aluno)}
              >
                <div>
                  <div className="font-bold text-lg text-white mb-1">{aluno.nome}</div>
                  <div className="text-sm text-zinc-500 mb-4">Matrícula: {aluno.matricula}</div>
                  <div className="text-xs uppercase font-bold text-fox-red">Editar Treino →</div>
                </div>
                {aluno.foto_perfil ? (
                  <img src={aluno.foto_perfil} alt={aluno.nome} className="w-16 h-16 rounded-full object-cover border border-zinc-800 shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 font-bold uppercase shrink-0">
                    {aluno.nome.substring(0, 2)}
                  </div>
                )}
              </div>
            )) : (
              <div className="col-span-full text-zinc-500 py-8">Nenhum aluno vinculado a você ainda. Pesquise acima para assumir alunos.</div>
            )}
          </div>
        </section>

        {alunoParaVincular && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-200">
               <div className="w-16 h-16 rounded-full bg-fox-red/10 flex items-center justify-center text-fox-red mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
               </div>
               <h3 className="text-xl font-bold mb-6 uppercase italic text-white">Deseja mesmo vincular esse aluno?</h3>
               <div className="flex gap-4 justify-center">
                 <button onClick={() => setAlunoParaVincular(null)} className="px-6 py-3 text-zinc-400 hover:text-white font-bold text-sm uppercase transition">Cancelar</button>
                 <button onClick={() => confirmarVinculo(alunoParaVincular)} className="px-6 py-3 bg-fox-red text-white font-bold rounded text-sm uppercase hover:bg-red-700 transition">Confirmar</button>
               </div>
            </div>
          </div>
        )}

        {alunoSelecionado && (() => {
          const podeEditar = String(alunoSelecionado.id_instrutor_id) === String(instrutor?.id_pessoa) || !alunoSelecionado.id_instrutor_id;
          
          return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-24 pb-10">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-8 max-w-3xl w-full m-auto animate-in zoom-in-95 duration-200 relative">
              <button onClick={() => setAlunoSelecionado(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-zinc-900 text-zinc-500 rounded-full hover:bg-fox-red hover:text-white transition">✕</button>
              
              <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mb-8 mt-2">
              <div className="flex items-center gap-4">
                {alunoSelecionado.foto_perfil ? (
                  <img src={alunoSelecionado.foto_perfil} alt={alunoSelecionado.nome} className="w-16 h-16 rounded-full object-cover border border-zinc-700 shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-zinc-800 rounded-full border border-white flex items-center justify-center text-zinc-500 font-bold uppercase text-2xl shrink-0">
                    {alunoSelecionado.nome.substring(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl">{alunoSelecionado.nome}</h3>
                  <p className="text-zinc-500 text-sm">Matrícula: {alunoSelecionado.matricula}</p>
                </div>
                <button onClick={() => setAlunoSelecionado(null)} className="ml-auto text-zinc-600 hover:text-white">✕</button>
              </div>
            </div>

            <h4 className="text-xl font-bold uppercase mb-6 text-center italic">Treinos do Aluno</h4>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-start max-w-2xl mx-auto">
              {treinoAluno ? (
                <div className="space-y-6">
                  {!editandoTreino ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {treinoAluno.descricao.split('|').filter((t:string) => t.trim() !== '').map((blocoTreino: string, index: number) => {
                          let titulo = `Treino ${['A', 'B', 'C', 'D', 'E', 'F'][index] || (index + 1)}`;
                          let exerciciosString = blocoTreino;
                          
                          if (blocoTreino.includes(':')) {
                            const parts = blocoTreino.split(':');
                            titulo = parts[0].trim();
                            exerciciosString = parts.slice(1).join(':').trim();
                          }

                          const linhas = exerciciosString.split(/,|\n/).filter((l:string) => l.trim() !== '');

                          return (
                            <Accordion 
                              key={index} 
                              title={titulo}
                              isOpen={openAccordionIndex === index}
                              onToggle={() => setOpenAccordionIndex(openAccordionIndex === index ? null : index)}
                            >
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
                        })}
                      </div>
                      <div className="flex justify-center mt-4">
                        {podeEditar && (
                          <button onClick={() => setEditandoTreino(true)} className="text-white font-bold text-xs uppercase flex items-center gap-2 hover:underline">
                            ✎ Editar Ficha de Treino
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                      {treinosDisponiveis.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-xs uppercase text-zinc-500 mb-1">Importar Treino Existente</label>
                          <select 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white outline-none focus:border-fox-red"
                            onChange={(e) => {
                              if (e.target.value) {
                                setDescricaoTreino(e.target.value);
                              }
                            }}
                          >
                            <option value="">Selecione um treino para importar...</option>
                            {treinosDisponiveis.map((t) => (
                              <option key={t.id_treino} value={t.descricao}>
                                {t.descricao.substring(0, 80)}...
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <p className="text-zinc-500 text-sm mb-2 italic">
                        Dica: Separe as abas de treino por <strong>barra reta (|)</strong> e os exercícios por <strong>vírgula (,)</strong>.<br />
                        Exemplo: <em>Treino A: Supino 3x10, Voador 3x12 | Treino B: Leg Press 4x10, Agachamento 4x12</em>
                      </p>
                      <textarea
                        value={descricaoTreino}
                        onChange={e => setDescricaoTreino(e.target.value)}
                        className="w-full p-4 bg-zinc-900 text-white rounded border border-zinc-800 outline-none focus:border-fox-red"
                        rows={8}
                        placeholder="Treino A: Supino 3x10, Crucifixo 4x12 | Treino B: Agachamento 4x10, Leg Press 3x12"
                      />
                      <div className="flex gap-2 justify-end mt-4">
                        <button onClick={() => setEditandoTreino(false)} className="text-zinc-500 hover:text-white font-bold text-xs uppercase">Cancelar</button>
                        <button onClick={salvarTreino} className="bg-fox-red px-6 py-2 rounded text-white font-bold text-xs uppercase hover:bg-red-700">Salvar Alterações</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 border border-zinc-800 rounded-xl bg-zinc-900/50 flex flex-col items-center justify-center gap-4">
                  <p className="text-zinc-400">O aluno selecionado não possui uma ficha de treino vinculada.</p>
                  {podeEditar && (
                    <button 
                      onClick={() => handleCriarTreino(alunoSelecionado.id_pessoa)}
                      className="bg-fox-red px-6 py-3 rounded text-white font-bold text-sm uppercase hover:bg-red-700 transition"
                    >
                      Criar Ficha de Treino
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
          );
        })()}
      </main>

      <Footer />
    </div>
  );
}