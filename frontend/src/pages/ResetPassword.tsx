import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, CheckCircle, Heart } from 'lucide-react';
import api from '../api/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lien invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background transition-colors">
        <div className="max-w-md w-full space-y-8 bg-background p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-border text-center transition-colors">
          <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-[22px] flex items-center justify-center text-green-500 transition-colors">
            <CheckCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground transition-colors">Mot de passe mis à jour</h2>
            <p className="text-foreground-muted text-sm transition-colors transition-all">Vous pouvez vous connecter avec votre nouveau mot de passe.</p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-background transition-colors">
        <div className="max-w-md w-full space-y-8 bg-background p-12 rounded-[40px] shadow-2xl border border-border text-center transition-colors">
          <h2 className="text-xl font-black text-foreground transition-colors">Lien invalide</h2>
          <p className="text-foreground-muted text-sm transition-colors transition-all">Le lien de réinitialisation est manquant. Demandez un nouveau lien depuis la page « Mot de passe oublié ».</p>
          <Link to="/forgot-password" className="inline-flex items-center gap-2 text-primary font-bold transition-colors">
            Mot de passe oublié <ArrowLeft size={18} className="rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden bg-background transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] transition-colors" />
      <div className="max-w-md w-full space-y-10 bg-background p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-border relative z-10 transition-colors">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-all transition-colors">
            <Heart size={32} className="fill-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground tracking-tight transition-colors transition-all">Nouveau mot de passe</h2>
            <p className="text-foreground-muted font-bold text-[10px] uppercase tracking-[0.2em] transition-colors">Choisissez un mot de passe d'au moins 6 caractères</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/20 p-4 rounded-2xl text-red-500 text-sm font-black transition-colors">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Nouveau mot de passe</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                id="newPassword"
                type="password"
                required
                minLength={6}
                className="w-full pl-14 pr-6 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold placeholder-foreground-muted/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Confirmer le mot de passe</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                className="w-full pl-14 pr-6 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold placeholder-foreground-muted/30 focus:outline-none focus:border-primary focus:bg-background transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-5 px-8 bg-primary text-white font-black rounded-[20px] shadow-2xl shadow-primary/20 hover:bg-foreground hover:text-background transition-all disabled:opacity-70 text-sm uppercase tracking-widest"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Réinitialiser le mot de passe'}
          </button>
        </form>

        <p className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-foreground-muted text-sm font-bold hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
