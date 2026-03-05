import { useEffect, useState } from 'react';
import { Loader2, Mail, Download } from 'lucide-react';
import api from '../api/axios';

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/subscribers');
        setSubscribers(response.data);
      } catch {
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const handleExportCsv = async () => {
    try {
      const { data } = await api.get('/subscribers?format=csv', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([data], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'abonnes-newsletter.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      console.error('Export CSV failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 transition-colors">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background rounded-[40px] shadow-sm border border-border overflow-hidden transition-colors">
      <div className="p-10 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <h2 className="text-2xl font-black text-foreground tracking-tight transition-colors">Abonnés newsletter</h2>
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className="p-10">
        <p className="text-foreground-muted font-medium mb-6 transition-colors">
          <span className="font-black text-foreground transition-colors">{subscribers.length}</span> abonné(s)
        </p>
        {subscribers.length === 0 ? (
          <div className="text-center py-16 bg-background-alt rounded-2xl border-2 border-dashed border-border transition-colors">
            <Mail className="mx-auto text-foreground-muted mb-4 transition-colors" size={48} />
            <p className="text-foreground font-bold transition-colors">Aucun abonné pour l'instant</p>
            <p className="text-foreground-muted text-sm mt-1 transition-colors">Les inscriptions apparaîtront ici.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-foreground-muted font-black uppercase tracking-widest border-b border-border transition-colors">
                <tr>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border transition-colors">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-background-alt transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground transition-colors">{s.email}</td>
                    <td className="py-4 px-4 text-foreground-muted text-sm transition-colors">
                      {new Date(s.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterManager;
