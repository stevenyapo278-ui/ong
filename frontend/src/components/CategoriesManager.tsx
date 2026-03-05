import { useEffect, useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, Category } from '../api/categoriesApi';
import { useOverlay } from '../context/OverlayContext';

const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { showNotification, confirm } = useOverlay();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      showNotification('Erreur chargement des catégories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setActionLoading(true);
    try {
      await createCategory(newName.trim());
      setNewName('');
      setShowAdd(false);
      await fetchCategories();
      showNotification('Catégorie créée', 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Erreur création', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setActionLoading(true);
    try {
      await updateCategory(id, editName.trim());
      setEditingId(null);
      setEditName('');
      await fetchCategories();
      showNotification('Catégorie mise à jour', 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Erreur mise à jour', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Supprimer la catégorie ?",
      message: "Les articles liés ne seront pas supprimés, mais cette action annulera l'association.",
      confirmText: "Supprimer",
      type: "danger"
    });

    if (!isConfirmed) return;

    setActionLoading(true);
    try {
      await deleteCategory(id);
      await fetchCategories();
      showNotification('Catégorie supprimée', 'success');
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Erreur suppression', 'error');
    } finally {
      setActionLoading(false);
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
        <h2 className="text-2xl font-black text-foreground tracking-tight transition-colors">Catégories</h2>
        <button
          onClick={() => { setShowAdd(true); setNewName(''); }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>
      <div className="p-10">
        {showAdd && (
          <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-background-alt rounded-2xl transition-colors border border-border">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom de la catégorie"
              className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none font-medium text-foreground transition-all"
              autoFocus
            />
            <button type="submit" disabled={actionLoading} className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all">
              {actionLoading ? <Loader2 size={20} className="animate-spin" /> : 'Créer'}
            </button>
            <button type="button" onClick={() => { setShowAdd(false); setNewName(''); }} className="px-4 py-3 text-foreground-muted font-bold hover:text-foreground transition-colors">
              Annuler
            </button>
          </form>
        )}
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between gap-4 py-4 px-4 rounded-2xl hover:bg-background-alt transition-colors group">
              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-primary/50 focus:border-primary bg-background focus:outline-none font-medium text-foreground transition-all"
                    autoFocus
                  />
                  <button onClick={() => handleUpdate(cat.id)} disabled={actionLoading} className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl transition-colors">
                    {actionLoading ? <Loader2 size={18} className="animate-spin" /> : 'OK'}
                  </button>
                  <button onClick={() => { setEditingId(null); setEditName(''); }} className="p-2 text-foreground-muted hover:bg-background-alt rounded-xl transition-colors">Annuler</button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary transition-colors">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="font-black text-foreground transition-colors">{cat.name}</p>
                      {cat._count != null && (
                        <p className="text-xs text-foreground-muted font-bold transition-colors">{cat._count.posts} article(s)</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); }} className="p-2 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Modifier">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} disabled={actionLoading} className="p-2 text-foreground-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" title="Supprimer">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        {categories.length === 0 && !showAdd && (
          <p className="text-foreground-muted text-center py-12 font-medium transition-colors">Aucune catégorie. Ajoutez-en une pour organiser vos articles.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesManager;
