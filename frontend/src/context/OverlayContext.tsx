import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Trash2, ShieldCheck, X, HelpCircle } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'delete' | 'submit';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'primary';
}

interface OverlayContextType {
    showNotification: (message: string, type: NotificationType) => void;
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [confirmDialog, setConfirmDialog] = useState<{
        options: ConfirmOptions;
        resolve: (value: boolean) => void;
    } | null>(null);

    const showNotification = (message: string, type: NotificationType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 4000);
    };

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmDialog({ options, resolve });
        });
    };

    const handleConfirmClose = (result: boolean) => {
        if (confirmDialog) {
            confirmDialog.resolve(result);
            setConfirmDialog(null);
        }
    };

    return (
        <OverlayContext.Provider value={{ showNotification, confirm }}>
            {children}

            {/* ── Notifications (Toasts) ── */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-3 items-center pointer-events-none">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto flex items-center gap-4 px-6 py-4 bg-background border border-border rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-colors min-w-[320px] max-w-md"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-500' :
                                n.type === 'error' ? 'bg-red-500' :
                                    n.type === 'delete' ? 'bg-orange-500' :
                                        n.type === 'submit' ? 'bg-primary' : 'bg-blue-500'
                                }`}>
                                {n.type === 'success' && <CheckCircle size={20} className="text-white" />}
                                {n.type === 'error' && <AlertCircle size={20} className="text-white" />}
                                {n.type === 'delete' && <Trash2 size={20} className="text-white" />}
                                {n.type === 'submit' && <ShieldCheck size={20} className="text-white" />}
                                {n.type === 'info' && <CheckCircle size={20} className="text-white" />}
                            </div>
                            <div className="flex flex-col flex-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Notification</span>
                                <span className="text-sm font-bold tracking-tight text-foreground">{n.message}</span>
                            </div>
                            <button
                                onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
                                className="text-foreground-muted hover:text-foreground transition-colors p-1"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ── Confirmation Dialog (Modal) ── */}
            <AnimatePresence>
                {confirmDialog && (
                    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => handleConfirmClose(false)}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-background border border-border rounded-[40px] shadow-2xl p-10 space-y-8 transition-colors"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center ${confirmDialog.options.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                                    }`}>
                                    {confirmDialog.options.type === 'danger' ? <Trash2 size={36} /> : <HelpCircle size={36} />}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground tracking-tight transition-colors">
                                        {confirmDialog.options.title}
                                    </h3>
                                    <p className="text-foreground-muted font-medium transition-colors">
                                        {confirmDialog.options.message}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleConfirmClose(false)}
                                    className="flex-1 py-4 px-6 rounded-2xl bg-background-alt text-foreground font-black text-xs uppercase tracking-widest border border-border hover:bg-background transition-all"
                                >
                                    {confirmDialog.options.cancelText || 'Annuler'}
                                </button>
                                <button
                                    onClick={() => handleConfirmClose(true)}
                                    className={`flex-1 py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg ${confirmDialog.options.type === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                        : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                                        }`}
                                >
                                    {confirmDialog.options.confirmText || 'Confirmer'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </OverlayContext.Provider>
    );
};

export const useOverlay = () => {
    const context = useContext(OverlayContext);
    if (!context) throw new Error('useOverlay must be used within OverlayProvider');
    return context;
};
