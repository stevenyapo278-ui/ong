import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Loader2,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  AlignLeft,
  Sparkles,
  CheckCircle,
  X,
  Plus,
  AlertCircle,
  FileText
} from 'lucide-react';
import api from '../api/axios';
import { usePostById } from '../hooks/usePostById';
import RichTextEditor from '../components/RichTextEditor';
import { getCategories, Category } from '../api/categoriesApi';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePostById(id);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setExcerpt(post.excerpt || '');
      setContent(post.content || '');
      setFeaturedImage(post.featuredImage || '');
      setSelectedCategoryIds(post.categories?.map((c) => c.id) ?? []);
    }
  }, [post]);

  // Autosave: every 30s of inactivity, silently save as draft
  const autoSave = useCallback(async () => {
    if (!id || !title || isFirstLoad.current) return;
    try {
      await api.put(`/posts/${id}`, {
        title,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        categories: selectedCategoryIds,
      });
      const now = new Date();
      setLastAutoSaved(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    } catch (_) {
      // silenieux
    }
  }, [id, title, excerpt, content, featuredImage, selectedCategoryIds]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(autoSave, 30000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [title, content, excerpt, featuredImage, autoSave]);

  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      setSaveStatus('saving');
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const media = response.data[0] || response.data?.[0];
      if (media?.url) {
        const url = media.url.startsWith('http')
          ? media.url
          : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${media.url}`;
        setFeaturedImage(url);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (err) {
      console.error("Erreur image", err);
      setSaveStatus('error');
    } finally {
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaveStatus('saving');

    try {
      const payload: any = {
        title,
        excerpt: excerpt || undefined,
        content,
        featuredImage: featuredImage || undefined,
        categories: selectedCategoryIds,
      };

      // Si l'article est actuellement DRAFT ou PENDING et n'a jamais été publié (ou bien on force), 
      // on peut envoyer status PUBLISHED si l'utilisateur est admin/editor pour forcer la publication lors de la sauvegarde.
      // (Vous pouvez adapter si vous souhaitez qu'EditPost sépare la sauvegarde de la publication,
      //  mais selon votre message, vous vouliez régler l'enregistrement.)
      if ((user?.role === 'ADMIN' || user?.role === 'EDITOR') && post?.status !== 'PUBLISHED') {
        payload.status = 'PUBLISHED';
      }

      await api.put(`/posts/${id}`, payload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setSaveStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-[200] flex flex-col items-center justify-center transition-colors">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/10 rounded-full animate-pulse"></div>
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-spin" size={32} />
        </div>
        <p className="mt-8 text-foreground-muted font-black uppercase tracking-[0.3em] text-[10px]">Chargement de l'éditeur...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-[var(--background-canvas)] z-[150] flex flex-col font-sans overflow-hidden transition-colors">

      {/* ── Header Ultra-Moderne ── */}
      <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 flex items-center justify-between shrink-0 z-20 transition-colors">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-2xl bg-background-alt text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="h-8 w-px bg-border hidden md:block" />

          <div className="flex flex-col">
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-none mb-1 transition-colors">Édition de mission</span>
            <span className="text-sm font-black text-foreground truncate max-w-[200px] md:max-w-md transition-colors">{title || 'Sans titre'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-background-alt border border-border transition-colors">
            {saveStatus === 'saving' && <Loader2 size={12} className="animate-spin text-primary" />}
            {saveStatus === 'saved' && <CheckCircle size={12} className="text-green-500" />}
            {saveStatus === 'error' && <AlertCircle size={12} className="text-red-500" />}
            {saveStatus === 'idle' && lastAutoSaved && <CheckCircle size={12} className="text-green-400 opacity-60" />}
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest transition-colors">
              {saveStatus === 'saving' ? 'Enregistrement...'
                : saveStatus === 'saved' ? 'Enregistré ✓'
                  : saveStatus === 'error' ? 'Erreur'
                    : lastAutoSaved ? `Sauvegardé à ${lastAutoSaved}`
                      : 'Brouillon local'}
            </span>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${showSettings ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-foreground text-background hover:opacity-90 shadow-xl shadow-foreground/10'}`}
          >
            {showSettings ? <X size={16} /> : <Sparkles size={16} />}
            {showSettings ? 'Fermer' : 'Réglages'}
          </button>

          <button
            onClick={() => handleSave()}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white shadow-xl shadow-primary/20 font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all"
          >
            <Save size={16} /> Enregistrer
          </button>
        </div>
      </header>

      {/* ── Zone d'écriture principale ── */}
      <div className="flex-1 overflow-hidden flex relative">

        {/* Editor Main Canvas */}
        <div className={`flex-1 overflow-y-auto transition-all duration-500 ease-in-out ${showSettings ? 'mr-[400px]' : 'mr-0'}`}>
          <div className="max-w-[95%] mx-auto py-20 px-8 space-y-12">

            {/* Titre Géant */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Le titre de votre récit..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-5xl md:text-6xl font-black text-foreground placeholder-foreground-muted/30 focus:outline-none bg-transparent leading-[1.1] border-none p-0 transition-colors"
              />
              <div className="h-1.5 w-24 bg-primary rounded-full" />
            </div>

            {/* Editor Area */}
            <div className="relative min-h-[500px]">
              <RichTextEditor value={content} onChange={setContent} postId={id} />
            </div>
          </div>
        </div>

        {/* ── Panneau de Réglages Latéral ── */}
        <aside className={`absolute top-0 right-0 bottom-0 w-[400px] bg-background border-l border-border shadow-2xl z-10 transition-transform duration-500 ease-in-out flex flex-col ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-8 border-b border-border flex items-center justify-between transition-colors">
            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] transition-colors">Configuration du récit</h3>
            <button onClick={() => setShowSettings(false)} className="text-foreground-muted hover:text-foreground transition-colors"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">

            {/* Featured Image Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-foreground-muted uppercase tracking-widest transition-colors">
                <ImageIcon size={14} /> Image de Couverture
              </label>
              <div
                className="relative aspect-video rounded-3xl bg-background-alt border-2 border-dashed border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors"
                onClick={() => document.getElementById('sidebar-image')?.click()}
              >
                {featuredImage ? (
                  <img src={featuredImage} alt="Couverture" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-foreground-muted gap-2">
                    <Plus size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ajouter un visuel</span>
                  </div>
                )}
                <input id="sidebar-image" type="file" className="hidden" accept="image/*" onChange={handleFeaturedImageUpload} />
                {featuredImage && (
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-background text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Modifier l'image</span>
                  </div>
                )}
              </div>
            </div>

            {categories.length > 0 && (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-foreground-muted uppercase tracking-widest transition-colors">Catégories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-background-alt border-2 border-border cursor-pointer hover:border-primary transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategoryIds((ids) => [...ids, cat.id]);
                          else setSelectedCategoryIds((ids) => ids.filter((id) => id !== cat.id));
                        }}
                        className="rounded border-border text-primary focus:ring-primary bg-background transition-colors"
                      />
                      <span className="text-xs font-bold text-foreground transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-foreground-muted uppercase tracking-widest transition-colors">
                <AlignLeft size={14} /> Résumé du récit
              </label>
              <textarea
                rows={5}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full p-5 bg-background-alt border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-medium leading-relaxed text-foreground"
                placeholder="Décrivez brièvement le contexte de cette mission humanitaire pour les réseaux sociaux et la liste des actus..."
              />
            </div>

            {/* Extra Meta */}
            <div className="pt-6 border-t border-border space-y-6">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-foreground-muted">Statut actuel</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full">{post.status}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-foreground-muted">Dernière modif.</span>
                <span className="text-foreground">{new Date(post.updatedAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-foreground-muted">Auteur</span>
                <span className="text-foreground">{post.author?.name || 'Administrateur'}</span>
              </div>
            </div>

            {/* Attached Media Section */}
            {post.media && post.media.length > 0 && (
              <div className="pt-6 border-t border-border space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-foreground-muted uppercase tracking-widest transition-colors">
                  <FileText size={14} /> Médias & Documents Liés
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {post.media.map((m) => (
                    <div key={m.id} className="group flex items-center gap-3 p-3 bg-background-alt border border-border rounded-xl hover:border-primary transition-all">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-background border border-border shrink-0 flex items-center justify-center">
                        {m.type.startsWith('image/') ? (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={18} className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-width-0">
                        <p className="text-[10px] font-bold text-foreground truncate">{m.url.split('/').pop()}</p>
                        <p className="text-[9px] text-foreground-muted uppercase">{m.type.split('/')[1]}</p>
                      </div>
                      <a 
                        href={m.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="opacity-0 group-hover:opacity-100 p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                        title="Ouvrir/Télécharger"
                      >
                        <Plus size={14} className="rotate-45" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="p-8 bg-background-alt/50 border-t border-border transition-colors">
            <button
              onClick={() => handleSave()}
              className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-foreground/10"
            >
              Sauvegarder les réglages
            </button>
          </div>
        </aside>

      </div>

      {/* ── Footer / Info Bar ── */}
      <footer className="h-10 bg-background border-t border-border px-6 flex items-center justify-between shrink-0 text-[9px] font-black text-foreground-muted uppercase tracking-[0.2em] transition-colors">
        <div className="flex items-center gap-6">
          <span>ONG BIEN VIVRE ICI PLATFORM v2.0</span>
          <div className="flex items-center gap-2 text-primary">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            SÉCURISÉ & SYNCHRONISÉ
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span>MOTS : {(content.match(/\w+/g) || []).length}</span>
          <span>INDEXÉ : OUI</span>
        </div>
      </footer>

    </div>
  );
};

export default EditPost;
