import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, Heart, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);

      // Redirect to password change if required
      if (response.data.mustChangePassword) {
        navigate('/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects ou problème serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden bg-background transition-colors">
      {/* Abstract background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] transition-colors"></div>

      <div className="max-w-md w-full space-y-10 bg-background p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-border relative z-10 animate-in fade-in zoom-in-95 duration-700 transition-colors">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-primary/20 animate-bounce-slow">
            <Heart size={32} className="fill-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground tracking-tight transition-colors">Espace Impact</h2>
            <p className="text-foreground-muted font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">Accès réservé aux rédacteurs</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 transition-colors">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-xs text-red-500 font-black uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Identifiant Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold placeholder-foreground-muted/30 focus:outline-none focus:border-primary focus:bg-background transition-all shadow-sm"
                  placeholder="votre@ong.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Mot de Passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold placeholder-foreground-muted/30 focus:outline-none focus:border-primary focus:bg-background transition-all shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-5 px-8 bg-primary text-white font-black rounded-[20px] shadow-2xl shadow-primary/20 hover:bg-foreground hover:text-background transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 text-sm uppercase tracking-widest"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <span className="flex items-center">
                Accéder au Dashboard <ArrowRight size={18} className="ml-3 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </button>
        </form>

        <div className="pt-6 text-center space-y-2">
          <Link to="/forgot-password" className="block text-primary text-sm font-bold hover:underline transition-colors">
            Mot de passe oublié ?
          </Link>
          <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-loose transition-colors">
            Problème de connexion ? Contactez l'administrateur pour réinitialiser vos accès.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
