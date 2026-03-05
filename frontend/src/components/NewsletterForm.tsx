import { useState } from 'react';
import api from '../api/axios';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    try {
      await api.post('/subscribers', { email });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-center max-w-xl mx-auto">
      <div className="relative w-full">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="w-full px-6 py-4 bg-background-alt border border-border rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-all transition-colors"
        />
        {status !== 'idle' && (
          <div className="absolute -bottom-6 left-0 right-0 text-center sm:text-left">
            {status === 'success' && <p className="text-[10px] font-black text-green-500 uppercase tracking-widest transition-colors">Inscription enregistrée !</p>}
            {status === 'error' && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest transition-colors">Erreur lors de l'enregistrement.</p>}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
      >
        M'abonner
      </button>
    </form>
  );
};

export default NewsletterForm;

