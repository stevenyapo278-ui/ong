import { useState, useEffect } from 'react';
import { Edit2, Trash2, Loader2, Image as ImageIcon, X, Upload } from 'lucide-react';
import api, { UPLOAD_URL } from '../api/axios';
import { useOverlay } from '../context/OverlayContext';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    quote: '',
    detailTitle: '',
    detailContent: '',
    image: '',
    ctaText: 'JE FAIS UN DON',
    ctaLink: '/espace-donateur',
    active: true,
    order: 0
  });

  const { showNotification, confirm } = useOverlay();

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      showNotification('Erreur lors du chargement des témoignages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      setUploading(true);
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const media = response.data[0] || response.data?.[0];
      if (media?.url) {
        const url = media.url.startsWith('http')
          ? media.url
          : `${UPLOAD_URL}${media.url}`;
        setFormData(prev => ({ ...prev, image: url }));
        showNotification('Image téléchargée avec succès', 'success');
      }
    } catch (err) {
      console.error("Erreur upload", err);
      showNotification('Erreur lors du téléchargement de l\'image', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/testimonials/${isEditing}`, formData);
        showNotification('Témoignage mis à jour', 'success');
      } else {
        await api.post('/testimonials', formData);
        showNotification('Témoignage créé', 'success');
      }
      setIsEditing(null);
      setFormData({
        title: '', quote: '', detailTitle: '', detailContent: '',
        image: '', ctaText: 'JE FAIS UN DON', ctaLink: '/espace-donateur',
        active: true, order: testimonials.length
      });
      fetchTestimonials();
    } catch (err) {
      showNotification('Erreur lors de l\'enregistrement', 'error');
    }
  };

  const handleEdit = (t: any) => {
    setIsEditing(t.id);
    setFormData({
      title: t.title,
      quote: t.quote,
      detailTitle: t.detailTitle || '',
      detailContent: t.detailContent || '',
      image: t.image || '',
      ctaText: t.ctaText || 'JE FAIS UN DON',
      ctaLink: t.ctaLink || '/espace-donateur',
      active: t.active,
      order: t.order
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Supprimer ce témoignage ?',
      message: 'Cette action est irréversible.',
      confirmText: 'Supprimer',
      type: 'danger'
    });

    if (isConfirmed) {
      try {
        await api.delete(`/testimonials/${id}`);
        showNotification('Témoignage supprimé', 'success');
        fetchTestimonials();
      } catch (err) {
        showNotification('Erreur lors de la suppression', 'error');
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-background p-10 rounded-[40px] border border-border shadow-sm">
        <h2 className="text-2xl font-black text-foreground mb-8">
          {isEditing ? 'Modifier le témoignage' : 'Ajouter un nouveau témoignage'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">Titre de l'histoire</label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Jupiter a mis fin à la pénurie d'eau..."
                className="w-full px-6 py-4 bg-background-alt border-2 border-border rounded-2xl focus:border-primary outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">Image de l'impact</label>
              <div className="flex flex-col gap-4">
                <div 
                  className="relative aspect-video rounded-3xl bg-background-alt border-2 border-dashed border-border overflow-hidden group cursor-pointer hover:border-primary transition-all flex items-center justify-center"
                  onClick={() => document.getElementById('testimony-image-upload')?.click()}
                >
                  {formData.image ? (
                    <>
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Changer l'image</span>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData({...formData, image: ''});
                        }}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-foreground-muted">
                      {uploading ? (
                        <Loader2 size={32} className="animate-spin text-primary" />
                      ) : (
                        <>
                          <div className="p-4 bg-background rounded-2xl">
                            <Upload size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Cliquez pour uploader</span>
                        </>
                      )}
                    </div>
                  )}
                  <input 
                    id="testimony-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                
                {/* Secondary manual URL input */}
                <div className="relative">
                  <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                  <input 
                    type="text"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    placeholder="Ou collez une URL ici..."
                    className="w-full pl-14 pr-6 py-4 bg-background-alt border border-border rounded-2xl focus:border-primary outline-none font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">La Citation (italique)</label>
            <textarea 
              required
              rows={4}
              value={formData.quote}
              onChange={e => setFormData({...formData, quote: e.target.value})}
              placeholder="Le témoignage de la personne..."
              className="w-full px-6 py-4 bg-background-alt border-2 border-border rounded-2xl focus:border-primary outline-none font-medium text-lg italic"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">Titre du bloc détail</label>
              <input 
                type="text"
                value={formData.detailTitle}
                onChange={e => setFormData({...formData, detailTitle: e.target.value})}
                placeholder="Ex: Faites la différence !"
                className="w-full px-6 py-4 bg-background-alt border-2 border-border rounded-2xl focus:border-primary outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">Contenu du détail</label>
              <textarea 
                rows={3}
                value={formData.detailContent}
                onChange={e => setFormData({...formData, detailContent: e.target.value})}
                placeholder="Texte explicatif sur l'impact du don..."
                className="w-full px-6 py-4 bg-background-alt border-2 border-border rounded-2xl focus:border-primary outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">Texte du bouton (CTA)</label>
              <input 
                type="text"
                value={formData.ctaText}
                onChange={e => setFormData({...formData, ctaText: e.target.value})}
                placeholder="JE FAIS UN DON"
                className="w-full px-6 py-4 bg-background-alt border-2 border-border rounded-2xl focus:border-primary outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">Lien du bouton (URL)</label>
              <input 
                type="text"
                value={formData.ctaLink}
                onChange={e => setFormData({...formData, ctaLink: e.target.value})}
                placeholder="/espace-donateur"
                className="w-full px-6 py-4 bg-background-alt border-2 border-border rounded-2xl focus:border-primary outline-none font-bold"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
            <button 
              type="submit"
              className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isEditing ? 'Mettre à jour' : 'Créer le témoignage'}
            </button>
            {isEditing && (
              <button 
                type="button"
                onClick={() => {
                  setIsEditing(null);
                  setFormData({
                    title: '', quote: '', detailTitle: '', detailContent: '',
                    image: '', ctaText: 'JE FAIS UN DON', ctaLink: '/espace-donateur',
                    active: true, order: testimonials.length
                  });
                }}
                className="px-10 py-5 bg-background-alt text-foreground-muted rounded-2xl font-black uppercase text-xs tracking-widest border border-border"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-background rounded-[40px] border border-border shadow-sm overflow-hidden">
        <div className="p-10 border-b border-border">
          <h3 className="text-xl font-black text-foreground">Témoignages existants</h3>
        </div>
        
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin text-primary mx-auto" size={32} />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {testimonials.map((t, idx) => (
              <div key={t.id} className="p-8 flex items-center gap-8 group hover:bg-background-alt transition-all">
                <div className="text-foreground-muted font-black text-xl opacity-20">#{idx + 1}</div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-background-alt shrink-0 border border-border">
                  {t.image ? <img src={t.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-6 text-foreground-muted opacity-20" />}
                </div>
                <div className="flex-grow">
                  <h4 className="font-black text-foreground italic">{t.title}</h4>
                  <p className="text-sm text-foreground-muted line-clamp-1">{t.quote}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(t)}
                    className="p-3 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;
