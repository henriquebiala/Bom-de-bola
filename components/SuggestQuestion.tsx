
import React, { useState } from 'react';
import { Category } from '../types';
import { addSuggestion } from '../services/firebase';

interface SuggestQuestionProps {
  onBack: () => void;
}

const SuggestQuestion: React.FC<SuggestQuestionProps> = ({ onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: Category.ANGOLAN_FOOTBALL,
    question: '',
    answer: '',
    wrong1: '',
    wrong2: '',
    wrong3: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { question, answer, wrong1, wrong2, wrong3 } = formData;
    if (!question || !answer || !wrong1 || !wrong2 || !wrong3) {
      alert("Precisas de preencher todas as opções para o VAR validar!");
      return;
    }
    
    setLoading(true);
    try {
      // Montamos o objeto de sugestão incluindo as opções erradas
      await addSuggestion({
        category: formData.category,
        question: formData.question,
        answer: formData.answer,
        // Passamos as opções erradas para o serviço processar
        options: [formData.answer, formData.wrong1, formData.wrong2, formData.wrong3]
      } as any);
      
      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao sugerir:", err);
      setSubmitted(true); 
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center animate-pop py-20">
        <div className="inline-block p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] mb-8">
          <i className="fas fa-check-circle text-6xl text-emerald-500"></i>
        </div>
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Mambo Registado!</h2>
        <p className="text-white/40 font-bold text-sm uppercase mb-10 leading-relaxed px-10">
          A tua pergunta foi enviada para o VAR. Obrigado por ajudares o Bom de Bola a crescer!
        </p>
        <button
          onClick={onBack}
          className="btn-primary py-5 px-10 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg"
        >
          Voltar pro Bairro
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-pop px-6 pb-20">
      <div className="flex items-center justify-between mb-10">
        <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">
          <i className="fas fa-chevron-left mr-2"></i> Voltar
        </button>
        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Sugerir Mambo</h2>
      </div>

      <div className="glass-card p-10 rounded-[2.5rem] border-white/5 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 block">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-yellow-400/50 outline-none transition-all appearance-none"
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat} className="bg-[#050505]">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 block">Pergunta</label>
            <textarea
              required
              placeholder="Ex: Qual clube angolano venceu a Taça das Taças em 1988?"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-yellow-400/50 outline-none transition-all min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-3 block">Resposta Correta</label>
              <input
                required
                type="text"
                placeholder="A resposta certa..."
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-white text-sm focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/50 mb-3 block">Opção Errada 1</label>
              <input
                required
                type="text"
                placeholder="Errada 1"
                value={formData.wrong1}
                onChange={(e) => setFormData({...formData, wrong1: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-red-500/30 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/50 mb-3 block">Opção Errada 2</label>
              <input
                required
                type="text"
                placeholder="Errada 2"
                value={formData.wrong2}
                onChange={(e) => setFormData({...formData, wrong2: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-red-500/30 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/50 mb-3 block">Opção Errada 3</label>
              <input
                required
                type="text"
                placeholder="Errada 3"
                value={formData.wrong3}
                onChange={(e) => setFormData({...formData, wrong3: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-red-500/30 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary mt-4 py-6 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : <span>Lançar no Gramado</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuggestQuestion;
