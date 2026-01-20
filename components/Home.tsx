
import React from 'react';
import { GameMode } from '../types';

interface HomeProps {
  onStart: (mode: GameMode) => void;
  onSuggest: () => void;
  onAdminAccess: () => void;
  isAdminLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ onStart, onSuggest, onAdminAccess, isAdminLoggedIn }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-pop max-w-2xl mx-auto relative w-full">
      {/* Admin Gear inside Home */}
      <button 
        onClick={onAdminAccess}
        className={`absolute -top-12 -right-4 md:-right-12 p-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all opacity-40 hover:opacity-100 ${isAdminLoggedIn ? 'text-yellow-400' : 'text-white'}`}
        title="Área do Mister"
      >
        <i className={`fas ${isAdminLoggedIn ? 'fa-user-cog' : 'fa-cog'} text-lg`}></i>
      </button>

      <div className="relative mb-10">
        <div className="absolute inset-0 bg-yellow-400/5 blur-[80px] rounded-full"></div>
        <div className="relative glass-card w-32 h-32 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
            <i className="fas fa-futbol text-5xl text-white/90"></i>
        </div>
      </div>

      <div className="mb-12">
        <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-none mb-3 text-white">
          BOM DE <span className="angola-gradient-text">BOLA</span>
        </h1>
        <div className="inline-block px-5 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.4em] text-white/40">
                O Teu Teste de Futebol
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
        <button
          onClick={() => onStart('SOLO')}
          className="btn-primary py-6 px-8 rounded-2xl font-black text-xl uppercase tracking-tighter italic flex flex-col items-center gap-1 group shadow-xl"
        >
          <div className="flex items-center gap-3">
            <span>Dá o Toque</span>
            <i className="fas fa-play text-xs group-hover:scale-110 transition-transform"></i>
          </div>
          <span className="text-[8px] font-black opacity-30 tracking-[0.2em] uppercase">Sobrevivência</span>
        </button>

        <button
          onClick={() => onStart('VERSUS')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 py-6 px-8 rounded-2xl font-black text-xl uppercase tracking-tighter italic flex flex-col items-center gap-1 transition-all active:scale-95 shadow-lg group"
        >
          <div className="flex items-center gap-3 text-white">
            <span>Duelo</span>
            <i className="fas fa-users text-base text-yellow-400 group-hover:rotate-6 transition-transform"></i>
          </div>
          <span className="text-[8px] font-black text-white/20 tracking-[0.2em] uppercase">1 VS 1</span>
        </button>
      </div>

      <button
        onClick={onSuggest}
        className="w-full max-w-sm py-4 border border-white/5 hover:border-white/20 rounded-xl flex items-center justify-center gap-3 transition-all text-white/40 hover:text-white"
      >
        <i className="fas fa-plus-circle text-xs"></i>
        <span className="text-[10px] font-black uppercase tracking-widest">Sugerir Pergunta</span>
      </button>

      <div className="mt-12 flex items-center gap-3 opacity-5">
        <div className="h-[1px] w-10 bg-white"></div>
        <i className="fas fa-shield-halved text-[8px]"></i>
        <div className="h-[1px] w-10 bg-white"></div>
      </div>
    </div>
  );
};

export default Home;
