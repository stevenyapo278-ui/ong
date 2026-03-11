import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import api, { UPLOAD_URL } from '../api/axios';
import RichTextEditor from '../components/RichTextEditor';
import { getCategories, Category } from '../api/categoriesApi';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

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
          : `${UPLOAD_URL}${media.url}`;
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSaveStatus('saving');

    try {
      const payload: any = {
        title,
        content,
        excerpt: excerpt || undefined,
        featuredImage: featuredImage || undefined,
        categories: selectedCategoryIds.length ? selectedCategoryIds : undefined,
      };

      if (user?.role === 'ADMIN' || user?.role === 'EDITOR') {
        payload.status = 'PUBLISHED';
      }

      await api.post('/posts', payload);
      setSaveStatus('saved');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--background-canvas)] z-[200] flex flex-col font-sans overflow-hidden transition-colors">

      {/* ── Header Ultra-Moderne ── */}
      <header className="h-24 bg-background/80 backdrop-blur-xl border-b border-border px-8 flex items-center justify-between shrink-0 z-30 transition-colors">
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-2xl bg-background-alt text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center group"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="h-10 w-px bg-border hidden md:block" />

          <div className="flex flex-col">
            <span className="text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em] leading-none mb-1.5 transition-colors">Nouveau récit d'impact</span>
            <span className="text-lg font-black text-foreground truncate max-w-[200px] md:max-w-md transition-colors">{title || 'Sans titre'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className="hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl bg-background-alt border border-border transition-colors">
            {saveStatus === 'saving' && <Loader2 size={14} className="animate-spin text-primary" />}
            {saveStatus === 'saved' && <CheckCircle size={14} className="text-green-500" />}
            {saveStatus === 'error' && <AlertCircle size={14} className="text-red-500" />}
            <span className="text-[11px] font-black text-foreground-muted uppercase tracking-widest transition-colors">
              {saveStatus === 'saving' ? 'Enregistrement...' : saveStatus === 'saved' ? 'Publié' : 'Brouillon prêt'}
            </span>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-3 px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl ${showSettings ? 'bg-primary text-white shadow-primary/20' : 'bg-foreground text-background hover:opacity-90 shadow-foreground/10'}`}
          >
            {showSettings ? <X size={20} /> : <Sparkles size={20} />}
            {showSettings ? 'Fermer' : 'Réglages'}
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={loading || !title}
            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-primary text-white shadow-2xl shadow-primary/20 font-black text-xs uppercase tracking-[0.15em] hover:bg-primary/90 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 transition-all"
          >
            <Save size={20} /> Créer le récit
          </button>
        </div>
      </header>

      {/* ── Zone d'écriture principale ── */}
      <div className="flex-1 overflow-hidden flex relative">

        {/* Editor Main Canvas */}
        <div className={`flex-1 overflow-y-auto transition-all duration-700 ease-in-out ${showSettings ? 'mr-[450px]' : 'mr-0'}`}>
          <div className="max-w-[95%] mx-auto py-24 px-10 space-y-16">

            {/* Titre Géant */}
            <div className="space-y-6">
              <input
                type="text"
                autoFocus
                placeholder="Commencez par un titre fort..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-6xl md:text-7xl font-black text-foreground focus:outline-none bg-transparent leading-[1.05] border-none p-0 tracking-tight transition-colors"
              />
              <div className="h-2 w-32 bg-primary rounded-full" />
            </div>

            {/* Editor Area */}
            <div className="relative min-h-[600px] bg-background text-foreground rounded-[40px] shadow-2xl shadow-foreground/5 border border-border p-2 overflow-hidden transition-colors">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* ── Panneau de Réglages Latéral ── */}
        <aside className={`absolute top-0 right-0 bottom-0 w-[450px] bg-background border-l border-border shadow-[0_0_80px_rgba(0,0,0,0.05)] z-20 transition-transform duration-700 ease-in-out flex flex-col ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-10 border-b border-border flex items-center justify-between transition-colors">
            <h3 className="text-base font-black text-foreground uppercase tracking-[0.25em] transition-colors">Configuration</h3>
            <button onClick={() => setShowSettings(false)} className="text-foreground-muted hover:text-foreground transition-colors bg-background-alt p-2 rounded-xl"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12">

            {/* Featured Image Section */}
            <div className="space-y-5">
              <label className="flex items-center gap-3 text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em] transition-colors">
                <ImageIcon size={16} /> Image de Mise en Avant
              </label>
              <div
                className="relative aspect-[16/10] rounded-[32px] bg-background-alt border-2 border-dashed border-border overflow-hidden group cursor-pointer hover:border-primary transition-all duration-500"
                onClick={() => document.getElementById('sidebar-image-create')?.click()}
              >
                {featuredImage ? (
                  <img src={featuredImage} alt="Couverture" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-foreground-muted gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center shadow-sm">
                      <Plus size={32} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground-muted/60">Importer un visuel</span>
                  </div>
                )}
                <input id="sidebar-image-create" type="file" className="hidden" accept="image/*" onChange={handleFeaturedImageUpload} />
                {featuredImage && (
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <span className="px-6 py-3 bg-background text-foreground rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Changer l'image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Catégories */}
            {categories.length > 0 && (
              <div className="space-y-5">
                <label className="flex items-center gap-3 text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em] transition-colors">
                  Catégories
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background-alt border-2 border-border cursor-pointer hover:border-primary transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategoryIds((ids) => [...ids, cat.id]);
                          else setSelectedCategoryIds((ids) => ids.filter((id) => id !== cat.id));
                        }}
                        className="rounded border-border text-primary focus:ring-primary bg-background transition-colors"
                      />
                      <span className="text-sm font-bold text-foreground transition-colors">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt Section */}
            <div className="space-y-5">
              <label className="flex items-center gap-3 text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em] transition-colors">
                <AlignLeft size={16} /> Résumé de l'article
              </label>
              <textarea
                rows={6}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full p-6 bg-background-alt border-2 border-border rounded-3xl focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-medium leading-relaxed text-foreground shadow-sm"
                placeholder="Écrivez une introduction accrocheuse pour vos lecteurs..."
              />
            </div>

            {/* Extra Info */}
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-primary uppercase tracking-wider">Conseil Pro</p>
                  <p className="text-[11px] text-primary/70 font-medium leading-relaxed">
                    Un résumé court et une belle image augmentent le taux de lecture de 40%. Optez pour l'impact.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="p-10 bg-background border-t border-border transition-colors">
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !title}
              className="w-full py-5 bg-foreground text-background rounded-[24px] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl shadow-foreground/5"
            >
              Publier maintenant
            </button>
          </div>
        </aside>

      </div>

      {/* ── Footer / Status Bar ── */}
      <footer className="h-12 bg-background border-t border-border px-8 flex items-center justify-between shrink-0 text-[10px] font-black text-foreground-muted uppercase tracking-[0.3em] z-30 transition-colors">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            ÉDITEUR EN LIGNE
          </span>
          <div className="h-4 w-px bg-border" />
          <span>ONG BIEN VIVRE ICI WORKSTATION</span>
        </div>
        <div className="flex items-center gap-10">
          <span>MODÈLE : RÉCIT STANDARD</span>
          <span>ACCÉSSIBILITÉ : PUBLIQUE</span>
        </div>
      </footer>

    </div>
  );
};

export default CreatePost;
