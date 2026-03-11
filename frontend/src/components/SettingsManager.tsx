import { useState, useEffect } from 'react';
import { Save, FileText, Upload, Loader2, Globe, FileDown } from 'lucide-react';
import api, { UPLOAD_URL } from '../api/axios';
import { useOverlay } from '../context/OverlayContext';

const SettingsManager = () => {
    const [settings, setSettings] = useState({ brochureUrl: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { showNotification } = useOverlay();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings');
            setSettings(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);

        try {
            setUploading(true);
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const media = response.data[0];
            const url = media.url.startsWith('http') ? media.url : `${UPLOAD_URL}${media.url}`;
            setSettings(prev => ({ ...prev, brochureUrl: url }));
            showNotification('Fichier téléchargé', 'success');
        } catch (err) {
            showNotification('Erreur upload', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put('/settings', settings);
            showNotification('Paramètres enregistrés', 'success');
        } catch (err) {
            showNotification('Erreur enregistrement', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <div className="bg-background p-10 rounded-[40px] border border-border shadow-sm space-y-12">
                <div className="flex items-center gap-4 border-b border-border pb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Globe size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Configuration Générale</h2>
                        <p className="text-sm font-medium text-foreground-muted">Gérez les ressources globales du site.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 text-[11px] font-black text-foreground-muted uppercase tracking-[0.2em] transition-colors">
                            <FileText size={16} /> Brochure Partenaires (PDF / DOC)
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div 
                                className="aspect-[16/6] rounded-3xl bg-background-alt border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary transition-all overflow-hidden relative"
                                onClick={() => document.getElementById('brochure-upload')?.click()}
                            >
                                {uploading ? (
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                ) : settings.brochureUrl ? (
                                    <>
                                        <div className="flex flex-col items-center gap-2 text-green-500">
                                            <FileDown size={32} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Fichier prêt</span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest">Changer le fichier</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center text-foreground-muted shadow-sm">
                                            <Upload size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Importer la brochure</span>
                                    </>
                                )}
                                <input id="brochure-upload" type="file" className="hidden" onChange={handleFileUpload} />
                            </div>

                            <div className="flex flex-col justify-end space-y-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest pl-1">URL Manuelle</span>
                                    <input 
                                        type="text" 
                                        value={settings.brochureUrl}
                                        onChange={e => setSettings({...settings, brochureUrl: e.target.value})}
                                        placeholder="https://..."
                                        className="w-full px-6 py-4 bg-background-alt border border-border rounded-2xl text-xs font-bold focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-border flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Enregistrer les modifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
