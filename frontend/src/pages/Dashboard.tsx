import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, FileEdit, Trash2, Clock, CheckCircle, AlertCircle, Hourglass, Eye, LayoutGrid, Users, Settings, ChevronRight, Loader2, Tag, Mail } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatPostType } from '../utils/post';
import UsersManager from '../components/UsersManager';
import CategoriesManager from '../components/CategoriesManager';
import NewsletterManager from '../components/NewsletterManager';
import { useOverlay } from '../context/OverlayContext';

const Dashboard = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'categories' | 'newsletter' | 'settings'>('posts');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'DRAFT' | 'PENDING' | 'PUBLISHED'>('all');
  const { user } = useAuth();
  const { showNotification, confirm } = useOverlay();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts?status=all');
      const allPosts = response.data?.items ?? response.data ?? [];
      const data = user?.role === 'ADMIN'
        ? allPosts
        : allPosts.filter((p: any) => p.authorId === user?.id);
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm transition-colors"><CheckCircle size={10} className="mr-1.5" /> Publié</span>;
      case 'DRAFT':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm transition-colors"><Clock size={10} className="mr-1.5" /> Brouillon</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 shadow-sm transition-colors"><Hourglass size={10} className="mr-1.5" /> Attente</span>;
      default:
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-background-alt text-foreground-muted border border-border transition-colors">{status}</span>;
    }
  };

  const handleAction = async (task: () => Promise<any>, identifier: string, successMsg?: string, type: 'success' | 'error' | 'delete' | 'submit' = 'success') => {
    try {
      setActionLoadingId(identifier);
      await task();
      await fetchPosts();
      if (successMsg) showNotification(successMsg, type);
    } catch (err) {
      showNotification("Une erreur est survenue", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const isConfirmed = await confirm({
      title: "Supprimer la publication ?",
      message: "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer définitivement ce récit ?",
      confirmText: "Supprimer",
      type: "danger"
    });

    if (isConfirmed) {
      handleAction(() => api.delete(`/posts/${postId}`), postId, "Publication supprimée avec succès", "delete");
    }
  };

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto px-4 md:px-0">

      {/* ── Dashboard Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-10 transition-colors">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight transition-colors">Tableau de Bord</h1>
          <p className="text-foreground-muted font-medium transition-colors">Bon retour, <span className="text-primary font-bold">{user?.name}</span>. Gérez votre impact humanitaire.</p>
        </div>

        {/* Navigation Tabs Header */}
        <div className="w-full overflow-x-auto no-scrollbar pb-2">
          <div className="flex bg-background-alt p-1.5 rounded-2xl border border-border shadow-sm transition-colors whitespace-nowrap min-w-max">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'bg-background text-primary shadow-xl shadow-foreground/5' : 'text-foreground-muted hover:text-foreground'}`}
            >
              <LayoutGrid size={16} /> Publications
            </button>
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-background text-primary shadow-xl shadow-foreground/5' : 'text-foreground-muted hover:text-foreground'}`}
              >
                <Users size={16} /> Utilisateurs
              </button>
            )}
            {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-background text-primary shadow-xl shadow-foreground/5' : 'text-foreground-muted hover:text-foreground'}`}
              >
                <Tag size={16} /> Catégories
              </button>
            )}
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'newsletter' ? 'bg-background text-primary shadow-xl shadow-foreground/5' : 'text-foreground-muted hover:text-foreground'}`}
              >
                <Mail size={16} /> Newsletter
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-background text-primary shadow-xl shadow-foreground/5' : 'text-foreground-muted hover:text-foreground'}`}
            >
              <Settings size={16} /> Paramètres
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'posts' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
          {/* ── Stats Panels ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-8 rounded-[30px] shadow-sm border border-border group hover:border-primary/30 transition-all cursor-default">
              <p className="text-xs font-black text-foreground-muted uppercase tracking-widest transition-colors">Total Récits</p>
              <div className="flex items-end justify-between mt-4">
                <p className="text-4xl font-black text-foreground leading-none transition-colors">{posts.length}</p>
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Plus size={20} /></div>
              </div>
            </div>
            <div className="bg-background p-8 rounded-[30px] shadow-sm border border-border transition-colors">
              <p className="text-xs font-black text-foreground-muted uppercase tracking-widest transition-colors">En Brouillon</p>
              <p className="text-4xl font-black text-amber-500 mt-4 leading-none transition-colors">{posts.filter(p => p.status === 'DRAFT').length}</p>
            </div>
            <div className="bg-background p-8 rounded-[30px] shadow-sm border border-border transition-colors">
              <p className="text-xs font-black text-foreground-muted uppercase tracking-widest transition-colors">Attente de validation</p>
              <p className="text-4xl font-black text-primary mt-4 leading-none transition-colors">{posts.filter(p => p.status === 'PENDING').length}</p>
            </div>
            <div className="bg-background p-8 rounded-[30px] shadow-sm border border-border transition-colors">
              <p className="text-xs font-black text-foreground-muted uppercase tracking-widest transition-colors">Publiés / Publics</p>
              <p className="text-4xl font-black text-green-500 mt-4 leading-none transition-colors">{posts.filter(p => p.status === 'PUBLISHED').length}</p>
            </div>
          </div>

          {/* ── Posts Main Table ── */}
          <div className="bg-background rounded-[40px] shadow-sm border border-border overflow-hidden transition-colors">
            <div className="p-10 border-b border-border flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <h2 className="text-2xl font-black text-foreground tracking-tight transition-colors">Liste de vos publications</h2>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Filtrer vos articles..."
                    className="w-full pl-12 pr-4 py-3 bg-background-alt border-2 border-border rounded-2xl text-sm font-bold placeholder-foreground-muted/40 focus:outline-none focus:border-primary focus:bg-background text-foreground transition-all"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full sm:w-auto pl-5 pr-10 py-3 bg-primary/10 border-2 border-primary/10 rounded-2xl text-xs font-black uppercase tracking-widest text-primary focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="all">Tous les Statuts</option>
                  <option value="DRAFT">Brouillons</option>
                  <option value="PENDING">En attente</option>
                  <option value="PUBLISHED">Publiés</option>
                </select>

                <Link
                  to="/create-post"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-foreground hover:text-background transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95"
                >
                  <Plus size={18} className="mr-2" /> Créer
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <Loader2 size={40} className="animate-spin text-primary mx-auto" />
                <p className="mt-4 text-foreground-muted font-bold text-sm tracking-widest uppercase transition-colors">Synchronisation...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="w-full">
                {/* Desktop View Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-background-alt text-[10px] text-foreground-muted font-black uppercase tracking-[0.2em] border-b border-border transition-colors">
                      <tr>
                        <th className="px-10 py-6">Mission / Récit</th>
                        <th className="px-6 py-6">Catégorie</th>
                        <th className="px-6 py-6">État</th>
                        <th className="px-6 py-6">Date</th>
                        <th className="px-10 py-6 text-right">Contrôles</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border transition-colors">
                      {posts
                        .filter((post) => statusFilter === 'all' || post.status === statusFilter)
                        .map((post) => (
                          <tr key={post.id} className="group hover:bg-background-alt transition-colors">
                            <td className="px-10 py-8">
                              <div className="space-y-1">
                                <div className="font-black text-foreground group-hover:text-primary transition-colors truncate max-w-xs">{post.title}</div>
                                <div className="text-[10px] text-foreground-muted font-black uppercase tracking-wider transition-all">
                                  {post.slug || 'slug-automatique'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-8">
                              <span className="px-4 py-1.5 bg-background-alt text-foreground-muted border border-border rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
                                {formatPostType(post.type)}
                              </span>
                            </td>
                            <td className="px-6 py-8">
                              {getStatusBadge(post.status)}
                            </td>
                            <td className="px-6 py-8 text-sm text-foreground-muted font-medium transition-colors">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-10 py-8 text-right space-x-2">
                              <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-30 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="p-3 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-2xl transition-all" title="Modifier"><FileEdit size={20} /></button>
                                <button onClick={() => window.open(`/actualites/${post.slug || post.id}`, '_blank')} className="p-3 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-2xl transition-all" title="Voir"><Eye size={20} /></button>
                                <button onClick={() => handleDeletePost(post.id)} className="p-3 text-foreground-muted hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all" title="Supprimer">{actionLoadingId === post.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="lg:hidden divide-y divide-border transition-colors">
                  {posts
                    .filter((post) => statusFilter === 'all' || post.status === statusFilter)
                    .map((post) => (
                      <div key={post.id} className="p-6 space-y-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="font-black text-foreground leading-tight">{post.title}</div>
                            <div className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">{formatPostType(post.type)}</div>
                          </div>
                          {getStatusBadge(post.status)}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border transition-colors">
                          <span className="text-xs text-foreground-muted font-bold transition-colors">{new Date(post.createdAt).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="p-2.5 bg-background-alt text-foreground-muted rounded-xl border border-border transition-all"><FileEdit size={18} /></button>
                            <button onClick={() => window.open(`/actualites/${post.slug || post.id}`, '_blank')} className="p-2.5 bg-background-alt text-foreground-muted rounded-xl border border-border transition-all"><Eye size={18} /></button>
                            <button onClick={() => handleDeletePost(post.id)} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 transition-all"><Trash2 size={18} /></button>
                          </div>
                        </div>
                        {post.status === 'DRAFT' && post.authorId === user?.id && (
                          <button onClick={() => handleAction(() => api.put(`/posts/${post.id}/submit`), post.id, "Soumis", "submit")} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Soumettre pour validation</button>
                        )}
                        {user?.role === 'ADMIN' && post.status === 'PENDING' && (
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleAction(() => api.put(`/posts/${post.id}/validate`, { status: 'PUBLISHED' }), post.id, "Publié", "success")} className="py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20">Valider</button>
                            <button onClick={() => handleAction(() => api.put(`/posts/${post.id}/validate`, { status: 'DRAFT' }), post.id, "Refusé", "error")} className="py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20">Refuser</button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center space-y-4">
                <div className="w-24 h-24 bg-background-alt rounded-[40px] flex items-center justify-center text-foreground-muted mx-auto border-2 border-dashed border-border transition-colors">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight transition-colors">Aucun récit pour l'instant.</h3>
                <p className="text-foreground-muted font-medium max-w-xs mx-auto transition-colors">Votre tableau de bord centralise toutes vos actualités humanitaires.</p>
                <Link to="/create-post" className="inline-block mt-4 px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all">Lancer une publication</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && user?.role === 'ADMIN' && (
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          <UsersManager />
        </div>
      )}

      {activeTab === 'categories' && (user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          <CategoriesManager />
        </div>
      )}

      {activeTab === 'newsletter' && user?.role === 'ADMIN' && (
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          <NewsletterManager />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-background p-16 rounded-[40px] border border-border shadow-sm text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-500 transition-colors">
          <div className="w-24 h-24 bg-primary/5 rounded-[40px] flex items-center justify-center text-primary mx-auto transition-colors">
            <Settings size={48} className="animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight transition-colors">Paramètres de Compte</h2>
          <p className="text-foreground-muted font-medium max-w-sm mx-auto leading-relaxed transition-colors">Cette section est en cours de développement. Vous pourrez prochainement personnaliser votre profil et vos préférences de notification.</p>
          <button onClick={() => setActiveTab('posts')} className="inline-flex items-center gap-2 text-primary font-black tracking-widest uppercase text-xs hover:translate-x-1 transition-transform">
            RETOUR AU TABLEAU DE BORD <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

