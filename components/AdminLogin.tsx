
import React, { useState } from 'react';
import { loginAdmin, isPlaceholder } from '../services/firebase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Se estiver em modo de simulação, usa a senha padrão
    if (isPlaceholder) {
      if (password === 'admin123') {
        setTimeout(() => {
          onSuccess();
          setLoading(false);
        }, 800);
        return;
      } else {
        setError("Chave mestre incorreta (admin123).");
        setLoading(false);
        return;
      }
    }

    try {
      await loginAdmin(email, password);
      onSuccess();
    } catch (err: any) {
      setError("Acesso Negado: Verifique o email e senha no Console Firebase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-pop px-6 py-10">
      <div className="text-center mb-10">
        <div className="inline-block p-5 bg-white/5 rounded-3xl border border-white/10 mb-6">
          <i className="fas fa-user-shield text-4xl text-yellow-400"></i>
        </div>
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Login do Mister</h2>
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">
          {isPlaceholder ? 'Modo de Simulação (admin123)' : 'Autenticação Firebase Ativa'}
        </p>
      </div>

      <div className="glass-card p-8 rounded-[2rem] border-white/10 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isPlaceholder && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 block">Email do Administrador</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-yellow-400/50 outline-none transition-all"
                placeholder="exemplo@gmail.com"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 block">
                {isPlaceholder ? 'Senha do Mestre' : 'Senha'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-yellow-400/50 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-500 text-[10px] font-black uppercase text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary py-5 rounded-xl font-black text-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : <span>Entrar em Campo</span>}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="text-white/20 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all mt-2"
          >
            Voltar para a Bancada
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
