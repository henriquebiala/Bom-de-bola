
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pop text-center">
      <div className="relative mb-12">
        <div className="w-36 h-36 border-[12px] border-white/5 border-t-yellow-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-futbol text-4xl text-white/10 animate-pulse"></i>
        </div>
        <div className="absolute inset-0 bg-yellow-400/10 blur-[80px] rounded-full scale-150 -z-10 animate-pulse"></div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter angola-gradient-text">
          PREPARANDO O MAMBO...
        </h2>
        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">
          O VAR está a validar as tácticas
        </p>
      </div>
    </div>
  );
};

export default Loading;
