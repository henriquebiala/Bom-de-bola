
export enum Category {
  LEGENDS = 'Lendas do Futebol',
  WORLD_CUP = 'Copa do Mundo',
  EUROPEAN_LEAGUES = 'Ligas Europeias',
  ANGOLAN_FOOTBALL = 'Futebol Angolano',
  RECORDS_STATS = 'Recordes e Estatísticas',
  STADIUMS = 'Estádios e Clubes',
  MIXED = 'Estádio Misto'
}

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Suggestion {
  id: string;
  category: Category;
  question: string;
  answer: string;
  timestamp: number;
}

export type GameMode = 'SOLO' | 'VERSUS';

export type View = 'HOME' | 'CATEGORY_SELECT' | 'QUIZ' | 'RESULTS' | 'SUGGEST' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';
