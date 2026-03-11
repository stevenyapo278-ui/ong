import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, CheckCircle, Clock, Archive, Loader2, Building2 } from 'lucide-react';
import api from '../api/axios';
import { useOverlay } from '../context/OverlayContext';

const PartnerRequestsManager = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showNotification, confirm } = useOverlay();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/partner-requests');
            setRequests(response.data);
        } catch (err) {
            showNotification('Erreur chargement demandes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.put(`/partner-requests/${id}/status`, { status: newStatus });
            showNotification('Statut mis à jour', 'success');
            fetchRequests();
        } catch (err) {
            showNotification('Erreur mise à jour', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const isConfirmed = await confirm({
            title: 'Supprimer cette demande ?',
            message: 'Cette action est irréversible.',
            confirmText: 'Supprimer',
            type: 'danger'
        });

        if (isConfirmed) {
            try {
                await api.delete(`/partner-requests/${id}`);
                showNotification('Demande supprimée', 'success');
                fetchRequests();
            } catch (err) {
                showNotification('Erreur suppression', 'error');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-500/20"><Clock size={12} /> En attente</span>;
            case 'CONTACTED':
                return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-500/20"><CheckCircle size={12} /> Contacté</span>;
            case 'ARCHIVED':
                return <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-500/20"><Archive size={12} /> Archivé</span>;
            default:
                return status;
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="space-y-10">
            <div className="bg-background rounded-[40px] border border-border shadow-sm overflow-hidden">
                <div className="p-10 border-b border-border flex justify-between items-center bg-background-alt/30">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Demandes de Partenariat</h2>
                        <p className="text-sm font-medium text-foreground-muted">Gérez les prises de contact des organisations.</p>
                    </div>
                    <div className="px-6 py-2 bg-primary/10 rounded-2xl text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                        {requests.length} DEMANDES
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {requests.length === 0 ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-background-alt rounded-full flex items-center justify-center mx-auto text-foreground-muted opacity-30">
                                <Building2 size={40} />
                            </div>
                            <p className="font-bold text-foreground-muted uppercase tracking-widest text-xs">Aucune demande reçue</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="p-10 hover:bg-background-alt/20 transition-all group">
                                <div className="flex flex-col lg:flex-row gap-10 items-start">
                                    <div className="flex-grow space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <h3 className="text-xl font-black text-foreground italic">{req.organization}</h3>
                                            {getStatusBadge(req.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors">
                                                    <div className="w-8 h-8 rounded-lg bg-background-alt flex items-center justify-center text-foreground-muted"><Building2 size={16} /></div>
                                                    {req.contactName}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-bold text-primary hover:underline cursor-pointer">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Mail size={16} /></div>
                                                    {req.email}
                                                </div>
                                                {req.phone && (
                                                    <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                                                        <div className="w-8 h-8 rounded-lg bg-background-alt flex items-center justify-center text-foreground-muted"><Phone size={16} /></div>
                                                        {req.phone}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 text-xs font-black text-foreground-muted uppercase tracking-widest">
                                                    <Calendar size={14} /> Reçu le {new Date(req.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="p-6 bg-background rounded-2xl border border-border text-sm font-medium leading-relaxed italic text-foreground-muted">
                                                    "{req.message || 'Aucun message particulier'}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex flex-col gap-3">
                                        {req.status === 'PENDING' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(req.id, 'CONTACTED')}
                                                className="w-full px-6 py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-[1.05] transition-all"
                                            >
                                                Marquer contacté
                                            </button>
                                        )}
                                        {req.status !== 'ARCHIVED' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(req.id, 'ARCHIVED')}
                                                className="w-full px-6 py-3 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                                            >
                                                Archiver
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(req.id)}
                                            className="w-full px-6 py-3 text-red-500 bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        >
                                            Suprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerRequestsManager;
