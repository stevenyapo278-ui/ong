import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2, ShieldCheck, KeyRound, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ForceChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Le nouveau mot de passe doit être différent du mot de passe actuel');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      // Update user data in context (mustChangePassword is now false)
      updateUser(response.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden bg-background transition-colors">
      {/* Abstract background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] transition-colors"></div>

      <div className="max-w-md w-full space-y-8 bg-background p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-border relative z-10 animate-in fade-in zoom-in-95 duration-700 transition-colors">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-primary rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-all transition-colors">
            <KeyRound size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground tracking-tight transition-colors">Changement de mot de passe</h2>
            <p className="text-foreground-muted text-sm font-medium leading-relaxed transition-colors">
              Pour des raisons de sécurité, vous devez changer votre mot de passe provisoire avant de continuer.
            </p>
          </div>
        </div>

        {/* Security notice */}
        <div className="bg-primary/10 border-2 border-primary/20 p-4 rounded-2xl flex items-start gap-3 transition-colors">
          <ShieldCheck className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-primary font-bold leading-relaxed transition-colors">
            Choisissez un mot de passe fort avec au moins 6 caractères, incluant des lettres, des chiffres et des caractères spéciaux.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 transition-colors">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-xs text-red-500 font-black uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">
              Mot de passe provisoire
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                required
                className="w-full pl-14 pr-14 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:border-primary focus:bg-background transition-all shadow-sm"
                placeholder="Votre mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-foreground-muted hover:text-foreground transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">
              Nouveau mot de passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                required
                className="w-full pl-14 pr-14 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:border-primary focus:bg-background transition-all shadow-sm"
                placeholder="Votre nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-foreground-muted hover:text-foreground transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-[10px] text-red-500 font-bold pl-1 transition-colors">Minimum 6 caractères</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">
              Confirmer le mot de passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-foreground-muted group-focus-within:text-primary transition-colors">
                <Lock size={20} />
              </div>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                required
                className="w-full pl-14 pr-14 py-4 bg-background-alt border-2 border-border rounded-2xl text-foreground font-bold focus:outline-none focus:border-primary focus:bg-background transition-all shadow-sm"
                placeholder="Confirmez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-foreground-muted hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-[10px] text-red-500 font-bold pl-1 transition-colors transition-all">Les mots de passe ne correspondent pas</p>
            )}
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
                <ShieldCheck size={18} className="mr-3" />
                Valider le nouveau mot de passe
              </span>
            )}
          </button>
        </form>

        <div className="pt-4 text-center transition-colors">
          <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-loose transition-colors">
            Cette étape est obligatoire pour accéder à votre espace de travail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForceChangePassword;
