import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
    Heart,
    CheckCircle2,
    AlertCircle,
    Clock,
    Phone,
    Mail,
    User,
    TrendingUp,
    Coins,
    RefreshCcw,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface Donation {
    id: string;
    amount: number;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    status: 'pending' | 'success' | 'error';
    reference: string | null;
    transactionId: string | null;
    description: string | null;
    createdAt: string;
}

const statusConfig = {
    success: {
        label: 'Succès',
        icon: CheckCircle2,
        className: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    pending: {
        label: 'En attente',
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    error: {
        label: 'Échoué',
        icon: AlertCircle,
        className: 'bg-red-500/10 text-red-500 border-red-500/20',
    },
};

const PAGE_SIZE = 15;

const DonationsManager = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'error'>('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSuccessAmount, setTotalSuccessAmount] = useState(0);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const params: any = { page, pageSize: PAGE_SIZE };
            if (statusFilter !== 'all') params.status = statusFilter;
            const res = await api.get('/payments', { params });
            setDonations(res.data.items ?? []);
            setTotal(res.data.total ?? 0);
            setTotalPages(res.data.totalPages ?? 1);
            setTotalSuccessAmount(res.data.totalSuccessAmount ?? 0);
        } catch (err) {
            console.error('Erreur chargement dons', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [page, statusFilter]);

    const successCount = donations.filter(d => d.status === 'success').length;
    const pendingCount = donations.filter(d => d.status === 'pending').length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-background p-8 rounded-[30px] border border-border shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-all">
                    <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                        <Coins size={26} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Total collecté</p>
                        <p className="text-3xl font-black text-green-500 leading-none mt-1">
                            {totalSuccessAmount.toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                        </p>
                    </div>
                </div>
                <div className="bg-background p-8 rounded-[30px] border border-border shadow-sm flex items-center gap-6 group hover:border-primary/30 transition-all">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <TrendingUp size={26} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Total dons</p>
                        <p className="text-3xl font-black text-foreground leading-none mt-1">{total}</p>
                    </div>
                </div>
                <div className="bg-background p-8 rounded-[30px] border border-border shadow-sm flex items-center gap-6 group hover:border-amber-500/30 transition-all">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                        <Heart size={26} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Donateurs actifs</p>
                        <p className="text-3xl font-black text-foreground leading-none mt-1">{successCount}</p>
                        {pendingCount > 0 && (
                            <p className="text-[10px] text-amber-500 font-bold mt-1">{pendingCount} en attente</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-background rounded-[40px] border border-border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-foreground tracking-tight">Historique des Dons</h2>
                        <p className="text-sm text-foreground-muted font-medium mt-1">{total} don{total > 1 ? 's' : ''} enregistré{total > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Status Filter */}
                        <div className="flex items-center gap-2 bg-background-alt p-1 rounded-2xl border border-border">
                            {(['all', 'success', 'pending', 'error'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setStatusFilter(s); setPage(1); }}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        statusFilter === s
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'text-foreground-muted hover:text-foreground'
                                    }`}
                                >
                                    {s === 'all' ? 'Tous' : s === 'success' ? '✅ Succès' : s === 'pending' ? '⏳ Attente' : '❌ Échec'}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={fetchDonations}
                            className="w-10 h-10 rounded-xl bg-background-alt border border-border flex items-center justify-center text-foreground-muted hover:text-primary hover:border-primary transition-all"
                            title="Actualiser"
                        >
                            <RefreshCcw size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-24 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : donations.length === 0 ? (
                    <div className="py-24 text-center space-y-4">
                        <div className="w-20 h-20 bg-background-alt rounded-[30px] flex items-center justify-center text-foreground-muted mx-auto border-2 border-dashed border-border">
                            <Heart size={32} />
                        </div>
                        <p className="font-black text-foreground">Aucun don trouvé</p>
                        <p className="text-sm text-foreground-muted">Les dons apparaîtront ici dès qu'un paiement sera initié.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-background-alt text-[10px] text-foreground-muted font-black uppercase tracking-[0.2em] border-b border-border">
                                    <tr>
                                        <th className="px-8 py-5">Donateur</th>
                                        <th className="px-6 py-5">Contact</th>
                                        <th className="px-6 py-5">Montant</th>
                                        <th className="px-6 py-5">Statut</th>
                                        <th className="px-6 py-5">Référence</th>
                                        <th className="px-6 py-5">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {donations.map(d => {
                                        const cfg = statusConfig[d.status] || statusConfig.pending;
                                        const Icon = cfg.icon;
                                        return (
                                            <tr key={d.id} className="group hover:bg-background-alt transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-sm font-black shrink-0">
                                                            {d.customerName ? d.customerName.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-foreground text-sm">{d.customerName || <span className="italic text-foreground-muted">Anonyme</span>}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="space-y-1">
                                                        {d.customerPhone && (
                                                            <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted font-bold">
                                                                <Phone size={11} className="text-primary" />{d.customerPhone}
                                                            </div>
                                                        )}
                                                        {d.customerEmail && (
                                                            <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted font-bold">
                                                                <Mail size={11} className="text-primary" />{d.customerEmail}
                                                            </div>
                                                        )}
                                                        {!d.customerPhone && !d.customerEmail && (
                                                            <span className="text-[11px] text-foreground-muted italic">—</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="font-black text-foreground text-lg">{d.amount.toLocaleString('fr-FR')}</span>
                                                    <span className="text-foreground-muted font-bold text-xs ml-1">FCFA</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.className}`}>
                                                        <Icon size={10} />{cfg.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className="text-[10px] font-mono text-foreground-muted">
                                                        {d.reference || d.transactionId || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-sm text-foreground-muted font-medium">
                                                    {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-border">
                            {donations.map(d => {
                                const cfg = statusConfig[d.status] || statusConfig.pending;
                                const Icon = cfg.icon;
                                return (
                                    <div key={d.id} className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-sm">
                                                    {d.customerName ? d.customerName.charAt(0).toUpperCase() : <User size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-foreground text-sm">{d.customerName || 'Anonyme'}</p>
                                                    <p className="text-[10px] text-foreground-muted">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${cfg.className}`}>
                                                <Icon size={10} />{cfg.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-border">
                                            <div className="space-y-1">
                                                {d.customerPhone && <p className="text-[11px] text-foreground-muted flex items-center gap-1"><Phone size={11} />{d.customerPhone}</p>}
                                                {d.customerEmail && <p className="text-[11px] text-foreground-muted flex items-center gap-1"><Mail size={11} />{d.customerEmail}</p>}
                                            </div>
                                            <p className="text-xl font-black text-foreground">{d.amount.toLocaleString('fr-FR')} <span className="text-xs text-foreground-muted font-bold">FCFA</span></p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 p-6 border-t border-border">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(p => p - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-border bg-background text-foreground-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-black text-foreground">
                            Page {page} / {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-border bg-background text-foreground-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationsManager;
