
import React, { useState, useCallback, useEffect } from 'react';
import { View, Category, Question, GameMode } from './types';
import Home from './components/Home';
import CategorySelect from './components/CategorySelect';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Loading from './components/Loading';
import SuggestQuestion from './components/SuggestQuestion';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { fetchQuestionsByCategory } from './services/geminiService';
import { fetchApprovedQuestions, onAuthChange, isPlaceholder } from './services/firebase';
import { QUESTION_DATABASE } from './data/database';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [score2, setScore2] = useState<number | undefined>(undefined);
  const [isGameOver, setIsGameOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('SOLO');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [manualAdmin, setManualAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleStart = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentView('CATEGORY_SELECT');
  };

  const handleSuggest = () => {
    setCurrentView('SUGGEST');
  };

  const handleAdminAccess = () => {
    if (user || manualAdmin) setCurrentView('ADMIN_DASHBOARD');
    else setCurrentView('ADMIN_LOGIN');
  };

  const handleCategorySelect = async (category: Category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setError(null);
    setIsGameOver(false);
    
    // 1. CARREGAMENTO INSTANTÂNEO (Dados Locais)
    const localQuestions = category === Category.MIXED 
      ? [...QUESTION_DATABASE]
      : QUESTION_DATABASE.filter(q => q.category === category);
    
    let pool: Question[] = [...localQuestions].sort(() => 0.5 - Math.random());
    
    try {
      const countNeeded = 15;
      
      // 2. TENTATIVA DE ENRIQUECIMENTO
      const geminiPromise = fetchQuestionsByCategory(category, 8).catch(() => []);
      const firebasePromise = fetchApprovedQuestions(category).catch(() => []);
      
      const apiTimeout = new Promise<Question[]>((resolve) => setTimeout(() => resolve([]), 2500));

      const [geminiQuestions, firebaseQuestions] = await Promise.all([
        Promise.race([geminiPromise, apiTimeout]),
        Promise.race([firebasePromise, apiTimeout])
      ]);

      const combined = [...geminiQuestions, ...firebaseQuestions, ...pool];
      const uniquePool = Array.from(new Map(combined.map(q => [q.question, q])).values());
      
      if (uniquePool.length < 5) {
          setQuestions(QUESTION_DATABASE.slice(0, 15));
      } else {
          setQuestions(uniquePool.sort(() => 0.5 - Math.random()).slice(0, countNeeded));
      }
      
      setCurrentView('QUIZ');
    } catch (err) {
      console.warn("VAR offline, seguindo com banco local:", err);
      setQuestions(pool.slice(0, 15));
      setCurrentView('QUIZ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizFinish = (finalScore: number, finalScore2?: number, wasEliminated?: boolean) => {
    setScore(finalScore);
    setScore2(finalScore2);
    setIsGameOver(!!wasEliminated);
    setCurrentView('RESULTS');
  };

  const handleRestart = useCallback(() => {
    if (selectedCategory) {
      handleCategorySelect(selectedCategory);
    } else {
      setCurrentView('CATEGORY_SELECT');
    }
  }, [selectedCategory, gameMode]);

  const goToHome = () => {
    setCurrentView('HOME');
    setQuestions([]);
    setScore(0);
    setScore2(undefined);
    setIsGameOver(false);
    setSelectedCategory(null);
  };

  const onAdminLoginSuccess = () => {
    if (isPlaceholder) {
      setManualAdmin(true);
    }
    setCurrentView('ADMIN_DASHBOARD');
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#050505]">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-yellow-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-600/5 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {currentView === 'HOME' && (
                <Home 
                    onStart={handleStart} 
                    onSuggest={handleSuggest} 
                    onAdminAccess={handleAdminAccess}
                    isAdminLoggedIn={!!user || manualAdmin}
                />
              )}
              {currentView === 'CATEGORY_SELECT' && <CategorySelect onSelect={handleCategorySelect} />}
              {currentView === 'QUIZ' && (
                <Quiz 
                  questions={questions} 
                  mode={gameMode}
                  onFinish={handleQuizFinish} 
                  onBack={goToHome}
                />
              )}
              {currentView === 'RESULTS' && (
                <Results 
                  score={score} 
                  total={questions.length} 
                  score2={score2}
                  isGameOver={isGameOver}
                  onRestart={handleRestart}
                  onHome={goToHome}
                />
              )}
              {currentView === 'SUGGEST' && (
                <SuggestQuestion onBack={goToHome} />
              )}
              {currentView === 'ADMIN_LOGIN' && (
                <AdminLogin onSuccess={onAdminLoginSuccess} onBack={goToHome} />
              )}
              {currentView === 'ADMIN_DASHBOARD' && (
                <AdminDashboard onBack={goToHome} />
              )}
            </>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-white/5 bg-black/40 backdrop-blur-xl">
        <p className="text-white/10 text-[8px] font-black tracking-[0.4em] uppercase mb-1">
          BOM DE BOLA &bull; ANGOLA 2026
        </p>
        <p className="text-white/30 text-[10px] font-bold tracking-[0.1em] uppercase">
          Backend via <span className="text-orange-400">Firebase Cloud</span> &bull; Biala
        </p>
      </footer>
    </div>
  );
};

export default App;
