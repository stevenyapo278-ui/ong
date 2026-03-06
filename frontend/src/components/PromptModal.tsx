import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, HelpCircle } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  type?: 'input' | 'confirm' | 'alert';
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  defaultValue = '',
  placeholder = '',
  type = 'input'
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) setValue(defaultValue);
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(value);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-background border border-border rounded-[32px] shadow-2xl overflow-hidden p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                type === 'confirm' ? 'bg-amber-500/10 text-amber-500' : 
                type === 'alert' ? 'bg-red-500/10 text-red-500' :
                'bg-primary/10 text-primary'
              }`}>
                {type === 'confirm' ? <HelpCircle size={24} /> : 
                 type === 'alert' ? <AlertCircle size={24} /> :
                 <Check size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground uppercase tracking-tight">{title}</h3>
                <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest">{message}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {type === 'input' && (
                <input
                  autoFocus
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-5 py-4 bg-background-alt border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl bg-background-alt text-foreground font-black text-[10px] uppercase tracking-widest hover:bg-border transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                    type === 'alert' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {type === 'confirm' ? 'Confirmer' : type === 'alert' ? 'Supprimer' : 'Valider'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromptModal;
