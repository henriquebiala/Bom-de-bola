
import React from 'react';
import { Category } from './types';

export const CATEGORY_CONFIG = {
  [Category.LEGENDS]: {
    icon: <i className="fas fa-crown text-yellow-400"></i>,
    description: 'Pelé, Messi e os maiores de sempre.'
  },
  [Category.WORLD_CUP]: {
    icon: <i className="fas fa-trophy text-yellow-500"></i>,
    description: 'História e curiosidades dos mundiais.'
  },
  [Category.EUROPEAN_LEAGUES]: {
    icon: <i className="fas fa-euro-sign text-blue-300"></i>,
    description: 'Champions League e as grandes ligas.'
  },
  [Category.ANGOLAN_FOOTBALL]: {
    icon: <i className="fas fa-flag text-red-500"></i>,
    description: 'Girabola, Palancas e orgulho nacional.'
  },
  [Category.RECORDS_STATS]: {
    icon: <i className="fas fa-chart-line text-green-400"></i>,
    description: 'Goleadores e recordes históricos.'
  },
  [Category.STADIUMS]: {
    icon: <i className="fas fa-landmark text-amber-200"></i>,
    description: 'Catedrais e templos do futebol.'
  },
  [Category.MIXED]: {
    icon: <i className="fas fa-random text-white"></i>,
    description: 'Todas as categorias numa só partida.'
  }
};
