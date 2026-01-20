
import React, { useState, useEffect } from 'react';
import { Category, Suggestion, Question } from '../types';
import { subscribeToSuggestions, rejectSuggestion, approveSuggestion, addOfficialQuestion, logoutAdmin, isPlaceholder } from '../services/firebase';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'add'>('suggestions');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState({
    category: Category.ANGOLAN_FOOTBALL,
    question: '',
    correctAnswer: '',
    options: ['', '', '', ''],
    explanation: ''
  });

  useEffect(() => {
    const unsubscribe = subscribeToSuggestions((data) => {
      setSuggestions(data);
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (action: () => Promise<any>, successMsg: string) => {
    try {
      setLoading(true);
      await action();
      alert(successMsg);
    } catch (err) {
      alert("Erro no VAR! Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.options.some(opt => !opt)) return alert("Preenche todas as opções!");
    
    handleAction(
      () => addOfficialQuestion(newQuestion),
      "Mambo registado no banco de dados com sucesso!"
    );
    
    setNewQuestion({
        category: Category.ANGOLAN_FOOTBALL,
        question: '',
        correctAnswer: '',
        options: ['', '', '', ''],
        explanation: ''
    });
  };

  const handleLogout = async () => {
    await logoutAdmin();
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto animate-pop px-6 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Painel do <span className="text-yellow-400">Mister</span></h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Controle de Mambos</p>
            {isPlaceholder && (
              <span className="bg-orange-500/20 text-orange-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-orange-500/20">
                MODO OFFLINE
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
            <button onClick={onBack} className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">
                Sair
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
                Deslogar
            </button>
        </div>
      </div>

      {isPlaceholder && (
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-10 flex items-center gap-4">
          <i className="fas fa-exclamation-triangle text-orange-500 text-xl"></i>
          <div>
            <p className="text-white text-xs font-bold leading-tight uppercase">Base de Dados Desconectada</p>
            <p className="text-white/40 text-[9px] uppercase font-black">As sugestões estão a ser guardadas apenas neste navegador (Modo Simulação).</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-10 p-1.5 bg-white/5 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setActiveTab('suggestions')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'suggestions' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/30 hover:text-white'}`}
        >
          Sugestões ({suggestions.length})
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/30 hover:text-white'}`}
        >
          Novo Mambo
        </button>
      </div>

      {activeTab === 'suggestions' ? (
        <div className="grid grid-cols-1 gap-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border-dashed border-white/10">
              <i className="fas fa-database text-4xl text-white/10 mb-4"></i>
              <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.3em]">Nenhuma sugestão nova</p>
            </div>
          ) : (
            suggestions.map(s => (
              <div key={s.id} className="glass-card p-8 rounded-3xl border-white/10 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center animate-pop">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-red-600 text-[8px] font-black uppercase px-2 py-1 rounded text-white">{s.category}</span>
                    <span className="text-white/20 text-[8px] font-bold">{new Date(s.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xl font-black text-white italic mb-2">"{s.question}"</h4>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">RESPOSTA: {s.answer}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(() => approveSuggestion(s), "Mambo aprovado e adicionado à base local!")}
                    className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Aprovar
                  </button>
                  <button 
                    disabled={loading}
                    onClick={() => handleAction(() => rejectSuggestion(s.id), "Sugestão eliminada.")}
                    className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                  >
                    Chutar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl max-w-2xl">
          <form className="flex flex-col gap-6" onSubmit={handleAddQuestion}>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 block">Categoria Oficial</label>
              <select 
                value={newQuestion.category}
                onChange={e => setNewQuestion({...newQuestion, category: e.target.value as Category})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none appearance-none"
              >
                {Object.values(Category).map(c => <option key={c} value={c} className="bg-[#050505]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 block">Pergunta Técnica</label>
              <textarea 
                required
                value={newQuestion.question}
                onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm min-h-[80px] outline-none" 
                placeholder="Qual o mambo?" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                {newQuestion.options.map((opt, i) => (
                    <div key={i}>
                        <label className="text-[8px] font-black uppercase tracking-widest text-white/10 mb-2 block">Opção {i + 1}</label>
                        <input 
                            required
                            type="text"
                            value={opt}
                            onChange={e => {
                                const newOpts = [...newQuestion.options];
                                newOpts[i] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOpts});
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs outline-none"
                        />
                    </div>
                ))}
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3 block">Resposta Correta</label>
              <input 
                required
                type="text"
                value={newQuestion.correctAnswer}
                onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none" 
                placeholder="Ex: Petro de Luanda" 
              />
            </div>
            <button 
                type="submit"
                disabled={loading}
                className="btn-primary py-5 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? <i className="fas fa-spinner animate-spin"></i> : <span>Registar Mambo</span>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
