
import React from 'react';
import { Category } from '../types';
import { CATEGORY_CONFIG } from '../constants';

interface CategorySelectProps {
  onSelect: (category: Category) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-12 animate-pop">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3 uppercase italic tracking-tighter">
            Escolhe o teu <span className="text-yellow-400">Terreno</span>
          </h2>
          <div className="h-0.5 w-12 bg-red-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onSelect(key as Category)}
            className={`group glass-card hover:bg-white/5 border-white/5 hover:border-yellow-400/20 p-8 rounded-2xl text-left transition-all duration-300 active:scale-95 flex flex-col gap-5 relative overflow-hidden`}
          >
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-xl group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300 shadow-lg">
              {config.icon}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2 group-hover:text-yellow-400 transition-colors italic leading-none">
                {key}
              </h3>
              <p className="text-white/20 text-[10px] font-bold leading-relaxed uppercase tracking-widest">
                {config.description}
              </p>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-all">
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Entrar</span>
                <i className="fas fa-chevron-right text-[8px]"></i>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelect;
