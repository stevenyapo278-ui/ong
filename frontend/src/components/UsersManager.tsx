import { useState, useEffect } from 'react';
import { UserPlus, Trash2, Mail, Check, X, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useOverlay } from '../context/OverlayContext';

const UsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showNotification, confirm } = useOverlay();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CONTRIBUTOR'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/users', formData);
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'CONTRIBUTOR' });
      fetchUsers();
      showNotification('Utilisateur créé avec succès', 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Une erreur est survenue', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Révoquer l'accès ?",
      message: "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et lui retirera l'accès au tableau de bord.",
      confirmText: "Révoquer",
      type: "danger"
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      showNotification('Utilisateur supprimé', 'delete');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center transition-colors">
        <h2 className="text-xl font-black text-foreground tracking-tight transition-colors">Gestion des Contributeurs</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`inline-flex items-center px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${showAddForm ? 'bg-background-alt text-foreground-muted' : 'bg-primary text-white shadow-lg shadow-primary/20'
            }`}
        >
          {showAddForm ? <X size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
          {showAddForm ? 'Annuler' : 'Ajouter un rédacteur'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddUser} className="bg-background p-8 rounded-[30px] border-2 border-border shadow-sm animate-in zoom-in-95 duration-300 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Nom Complet</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3 bg-background-alt border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all font-medium"
                placeholder="ex: Jean Dupont"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Adresse Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3 bg-background-alt border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all font-medium"
                placeholder="ex: jean@ong.org"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Mot de Passe Provisoire</label>
              <input
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-5 py-3 bg-background-alt border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-foreground-muted uppercase tracking-widest pl-1 transition-colors">Rôle / Permissions</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-5 py-4 bg-background-alt border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all font-bold appearance-none cursor-pointer"
              >
                <option value="CONTRIBUTOR" className="bg-background text-foreground">Contributeur (Écrits uniquement)</option>
                <option value="ADMIN" className="bg-background text-foreground">Administrateur (Gestion totale)</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              disabled={submitting}
              className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 inline-flex items-center"
            >
              {submitting ? <Loader2 size={18} className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
              Créer l'utilisateur
            </button>
          </div>
        </form>
      )}

      <div className="bg-background rounded-[30px] border border-border shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 size={40} className="animate-spin text-indigo-600 mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background-alt text-[10px] text-foreground-muted font-black uppercase tracking-[0.2em] transition-colors border-b border-border">
                <tr>
                  <th className="px-8 py-5">Utilisateur</th>
                  <th className="px-8 py-5">Rôle</th>
                  <th className="px-8 py-5">Inscrit le</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border transition-colors">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-background-alt transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black transition-colors">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-foreground transition-colors">{u.name}</p>
                          <div className="flex items-center gap-1.5 text-foreground-muted text-xs font-medium transition-colors">
                            <Mail size={12} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-background-alt text-foreground-muted border-border'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-foreground-muted font-medium transition-colors">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-3 text-foreground-muted hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                        title="Révoquer l'accès"
                      >
                        <Trash2 size={20} />
                      </button>
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

export default UsersManager;
