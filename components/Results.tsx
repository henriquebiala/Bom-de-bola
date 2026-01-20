
import React from 'react';

interface ResultsProps {
  score: number;
  total: number;
  score2?: number;
  isGameOver?: boolean;
  onRestart: () => void;
  onHome: () => void;
}

const Results: React.FC<ResultsProps> = ({ score, total, score2, isGameOver, onRestart, onHome }) => {
  const isVersus = score2 !== undefined;
  
  const getMessage = () => {
    if (isGameOver) {
      if (isVersus) {
        if (score > score2!) return "J1 é o Mágico!";
        if (score < score2!) return "J2 é o Kota!";
        return "Empate no Muceque!";
      }
      return "Ficaste Fora de Jogo!";
    }
    return "CAMPEÃO DO GIRABOLA!";
  };

  const getSubMessage = () => {
    if (isGameOver) return "Bateu na trave. No mata-mata não se brinca!";
    return "Acertaste todas as perguntas consecutivas! Mestre da táctica.";
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center animate-pop py-4">
      <div className="w-full glass-card rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 mb-8">
          <div className="inline-block p-6 rounded-3xl bg-white/5 border border-white/10 mb-6">
            <i className={`fas ${!isGameOver ? 'fa-trophy text-yellow-400 animate-bounce' : 'fa-skull-crossbones text-red-600'} text-7xl`}></i>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-none tracking-tighter text-white mb-4">
            {getMessage()}
          </h2>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
            {getSubMessage()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <p className="text-[8px] text-white/20 uppercase font-black mb-1 tracking-widest">
                    {isVersus ? 'PONTOS J1' : 'ETAPAS VENCIDAS'}
                </p>
                <p className={`text-5xl font-black italic tracking-tighter ${!isGameOver ? 'text-yellow-400' : 'text-white'}`}>{score}</p>
            </div>
            {isVersus ? (
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                  <p className="text-[8px] text-white/20 uppercase font-black mb-1 tracking-widest">PONTOS J2</p>
                  <p className={`text-5xl font-black italic tracking-tighter ${!isGameOver ? 'text-red-500' : 'text-white'}`}>{score2}</p>
              </div>
            ) : (
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center">
                  <p className="text-[8px] text-white/20 uppercase font-black mb-2 tracking-widest">STATUS</p>
                  <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isGameOver ? 'bg-red-600 text-white' : 'bg-emerald-500 text-black'}`}>
                      {isGameOver ? 'Eliminado' : 'Mítico'}
                  </div>
              </div>
            )}
        </div>

        <div className="flex flex-col gap-3 relative z-10 max-w-sm mx-auto">
            <button
                onClick={onRestart}
                className="btn-primary py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl"
            >
                Dá mais uns toques
            </button>
            <button
                onClick={onHome}
                className="bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] border border-white/5 transition-all"
            >
                Voltar pro Bairro
            </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
