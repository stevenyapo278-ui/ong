import { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon, Video, FileText, Upload, Check, Loader2, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import PromptModal from './PromptModal';

interface Media {
  id: string;
  url: string;
  type: string;
  createdAt: string;
}

interface MediaManagerProps {
  onSelect: (url: string, type: string) => void;
  onClose: () => void;
  isOpen: boolean;
  postId?: string;
}

const MediaManager = ({ onSelect, onClose, isOpen, postId }: MediaManagerProps) => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'file'>('all');
  const [scope, setScope] = useState<'all' | 'post'>(postId ? 'post' : 'all');
  const [uploading, setUploading] = useState(false);
  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'input' | 'confirm' | 'alert';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: () => {},
  });

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await api.get('/upload', {
        params: scope === 'post' && postId ? { postId } : {}
      });
      setMediaList(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des médias", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, scope]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    if (postId) {
      formData.append('postId', postId);
    }

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Upload réussi:", response.data);
      fetchMedia();
    } catch (err: any) {
      console.error("Erreur upload détaillée:", err.response?.data || err.message);
      setPromptConfig({
        isOpen: true,
        title: 'Erreur d\'importation',
        message: err.response?.data?.message || 'Le serveur ne répond pas',
        type: 'confirm', // Using confirm as a generic notification for now
        onConfirm: () => {},
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPromptConfig({
      isOpen: true,
      title: 'Suppression',
      message: 'Voulez-vous vraiment supprimer ce média ?',
      type: 'alert',
      onConfirm: async () => {
        try {
          await api.delete(`/upload/${id}`);
          fetchMedia();
        } catch (err) {
          console.error("Erreur lors de la suppression du média", err);
        }
      }
    });
  };

  const filteredMedia = mediaList.filter(m => {
    const matchesSearch = m.url.toLowerCase().includes(search.toLowerCase());
    
    let matchesFilter = false;
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'image') {
      matchesFilter = m.type.startsWith('image/');
    } else if (filter === 'video') {
      matchesFilter = m.type.startsWith('video/');
    } else if (filter === 'file') {
      // Pour les fichiers, on prend tout ce qui n'est ni image ni vidéo
      matchesFilter = !m.type.startsWith('image/') && !m.type.startsWith('video/');
    }
    
    return matchesSearch && matchesFilter;
  });

  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`;
  };

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={20} />;
    if (type.startsWith('video/')) return <Video size={20} />;
    return <FileText size={20} />;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl h-[85vh] bg-background border border-border rounded-[32px] shadow-2xl overflow-hidden flex flex-col transition-colors"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-background transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight transition-colors">Médiathèque</h2>
                <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest transition-colors">Gérez vos visuels et documents</p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-background-alt text-foreground-muted hover:text-foreground transition-all flex items-center justify-center"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filters & Actions */}
          <div className="p-6 border-b border-border bg-background-alt/30 flex flex-wrap items-center justify-between gap-6 transition-colors">
            <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un fichier..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm transition-colors"
                />
              </div>
              
              <div className="flex items-center bg-background border border-border rounded-xl p-1 transition-colors">
                {postId && (
                  <>
                    <button
                      onClick={() => setScope('post')}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${scope === 'post' ? 'bg-primary text-white' : 'text-foreground-muted hover:text-foreground'}`}
                    >
                      Ce Récit
                    </button>
                    <button
                      onClick={() => setScope('all')}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${scope === 'all' ? 'bg-primary text-white' : 'text-foreground-muted hover:text-foreground'}`}
                    >
                      Tout
                    </button>
                    <div className="w-px h-4 bg-border mx-2" />
                  </>
                )}
                {(['all', 'image', 'video', 'file'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${filter === t ? 'bg-primary text-white' : 'text-foreground-muted hover:text-foreground'}`}
                  >
                    {t === 'all' ? 'Objets' : t === 'image' ? 'Images' : t === 'video' ? 'Vidéos' : 'Fichiers'}
                  </button>
                ))}
              </div>
            </div>

            <label className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl ${uploading ? 'bg-foreground-muted' : 'bg-primary'} text-white font-black text-xs uppercase tracking-widest cursor-pointer hover:scale-105 transition-all shadow-lg active:scale-95`}>
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? 'Envoi...' : 'Importer'}
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleUpload} 
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" 
              />
            </label>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-8 bg-background transition-colors">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-foreground-muted gap-4">
                <Loader2 size={48} className="animate-spin text-primary" />
                <p className="text-sm font-black uppercase tracking-widest">Chargement de la bibliothèque...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-foreground-muted gap-4 border-2 border-dashed border-border rounded-[40px] transition-colors">
                <div className="w-20 h-20 rounded-full bg-background-alt flex items-center justify-center">
                  <Search size={32} className="opacity-20" />
                </div>
                <p className="text-sm font-black uppercase tracking-widest opacity-40">Aucun média trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredMedia.map((media) => (
                  <motion.div
                    layout
                    key={media.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => onSelect(getFullUrl(media.url), media.type)}
                    className="group relative aspect-square rounded-3xl bg-background-alt border border-border overflow-hidden cursor-pointer hover:border-primary transition-all shadow-sm hover:shadow-xl transition-colors"
                  >
                    {media.type.startsWith('image/') ? (
                      <img src={getFullUrl(media.url)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-foreground-muted gap-2 transition-colors">
                        {getIcon(media.type)}
                        <span className="text-[10px] font-bold uppercase truncate max-w-full px-4">{media.url.split('/').pop()}</span>
                      </div>
                    )}
                                     {/* Overlay */}
                    <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
                        <Check size={20} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">Sélectionner</span>
                    </div>

                    {/* Bouton Supprimer */}
                    <button
                      onClick={(e) => handleDelete(e, media.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg z-20"
                      title="Supprimer ce média"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
        
      <PromptModal
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => promptConfig.onConfirm()}
        title={promptConfig.title}
        message={promptConfig.message}
        type={promptConfig.type}
      />
    </>
  );
};

export default MediaManager;
