
import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameMode } from '../types';

interface QuizProps {
  questions: Question[];
  mode: GameMode;
  onFinish: (score: number, score2?: number, isGameOver?: boolean) => void;
  onBack: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, mode, onFinish, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | null>(null);
  const [isGoalFlash, setIsGoalFlash] = useState(false);
  
  const isVersus = mode === 'VERSUS';
  const isPlayer1Turn = !isVersus || currentIndex % 2 === 0;

  const playSound = useCallback((type: 'goal' | 'miss') => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTone = (freq: number, start: number, duration: number, vol: number, typeWave: OscillatorType = 'sine') => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = typeWave;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + start + duration);
    };

    if (type === 'goal') {
      // Som de apito seguido de harmonia
      playTone(1000, 0, 0.1, 0.05, 'square'); 
      playTone(523.25, 0.1, 0.4, 0.1);
      playTone(659.25, 0.15, 0.4, 0.1);
      playTone(783.99, 0.2, 0.4, 0.1);
    } else {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    }
  }, []);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (showFeedback || !currentQuestion) return;
    if (timeLeft <= 0) { handleAnswer(null); return; }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showFeedback, currentQuestion]);

  const handleAnswer = (option: string | null) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playSound('goal');
      setIsGoalFlash(true);
      setTimeout(() => setIsGoalFlash(false), 800);
      if (isPlayer1Turn) setScore(s => s + 1);
      else setScore2(s => s + 1);
    } else {
      playSound('miss');
      setTimeout(() => onFinish(score, isVersus ? score2 : undefined, true), 2500);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setFeedbackType(null);
      setTimeLeft(15);
    } else {
      onFinish(score, isVersus ? score2 : undefined, false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className={`w-full min-h-screen flex flex-col items-center justify-start py-8 px-4 transition-all duration-300 ${isGoalFlash ? 'goal-animation' : ''}`}>
      <div className="w-full max-w-3xl flex flex-col gap-6 animate-pop pb-12">
        {/* Header HUD */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow glass-card p-4 rounded-2xl border-white/5 flex items-center justify-between shadow-lg">
              <button onClick={onBack} className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all">
                  Desistir
              </button>
              <div className="flex items-center gap-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.1em] text-yellow-400 italic">
                      NÍVEL {currentIndex + 1} / 15
                  </div>
                  <div className={`px-3 py-1 rounded-xl border ${timeLeft < 5 ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-emerald-400'}`}>
                      <span className="font-mono font-black text-xs">{timeLeft}s</span>
                  </div>
              </div>
          </div>

          {isVersus && (
            <div className="flex gap-2">
               <div className={`flex-1 min-w-[100px] p-3 rounded-2xl border transition-all flex items-center justify-between px-5 ${isPlayer1Turn ? 'bg-yellow-400 border-yellow-500 text-black shadow-lg' : 'bg-white/5 border-white/5 text-white/20'}`}>
                  <span className="text-[8px] font-black uppercase">J1</span>
                  <span className="text-xl font-black italic">{score}</span>
               </div>
               <div className={`flex-1 min-w-[100px] p-3 rounded-2xl border transition-all flex items-center justify-between px-5 ${!isPlayer1Turn ? 'bg-red-600 border-red-700 text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/20'}`}>
                  <span className="text-[8px] font-black uppercase">J2</span>
                  <span className="text-xl font-black italic">{score2}</span>
               </div>
            </div>
          )}
        </div>

        {/* Question Card */}
        <div className={`relative bg-white text-black p-8 md:p-12 rounded-[2.5rem] transition-all duration-500 shadow-2xl ${feedbackType === 'correct' ? 'correct-hit shadow-green-500/20' : ''}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-4 bg-red-600 rounded-full"></div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40">Pergunta de Sobrevivência</p>
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black italic leading-[0.95] tracking-tighter mb-10">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => {
                let style = "bg-black/[0.03] hover:bg-black/[0.06] border-black/5 text-black";
                if (showFeedback) {
                  if (option === currentQuestion.correctAnswer) style = "bg-green-500 border-green-600 text-white shadow-lg scale-[1.02]";
                  else if (option === selectedOption) style = "bg-red-600 border-red-700 text-white";
                  else style = "bg-black/[0.01] border-transparent text-black/10";
                }

                return (
                  <button
                    key={idx}
                    disabled={showFeedback}
                    onClick={() => handleAnswer(option)}
                    className={`${style} border-b-2 p-5 rounded-xl font-black text-base transition-all active:scale-95 text-left flex justify-between items-center`}
                  >
                    <span className="leading-tight">{option}</span>
                    <span className="text-[9px] opacity-10">{idx + 1}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback Area */}
        {showFeedback && (
          <div className="animate-pop flex flex-col gap-4">
              <div className={`p-6 rounded-3xl border shadow-xl ${feedbackType === 'correct' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-600/10 border-red-600/20 text-red-500'}`}>
                  <div className="flex items-center gap-4 mb-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${feedbackType === 'correct' ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'}`}>
                          <i className={`fas ${feedbackType === 'correct' ? 'fa-check' : 'fa-times'}`}></i>
                      </div>
                      <div>
                        <p className="text-lg font-black uppercase italic leading-none tracking-tighter">
                            {feedbackType === 'correct' ? 'GOOOOLOOOO!' : 'FOSTE DE VELA!'}
                        </p>
                      </div>
                  </div>
                  <p className="font-bold text-white/60 leading-relaxed italic text-sm">
                      {feedbackType === 'correct' ? currentQuestion.explanation : 'Fim de linha. O Girabola exige mais concentração!'}
                  </p>
              </div>
              
              {feedbackType === 'correct' && (
                <button
                    onClick={nextQuestion}
                    className="btn-primary py-6 rounded-2xl font-black text-2xl uppercase tracking-tighter italic shadow-xl active:translate-y-1 transition-all flex items-center justify-center gap-4"
                >
                    <span>Próxima Jogada</span>
                    <i className="fas fa-chevron-right text-base"></i>
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
