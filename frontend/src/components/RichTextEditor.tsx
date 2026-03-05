import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Highlight } from '@tiptap/extension-highlight';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Video,
  FileText,
  Youtube as YoutubeIcon,
  Columns2,
  Columns3,
  Maximize2,
  Minimize2,
  Minus,
  RefreshCw,
  Undo2,
  Redo2,
  Eraser,
  Highlighter,
  Table as TableIcon,
  Trash2,
} from 'lucide-react';
import api from '../api/axios';
import { useEffect, useRef, useState } from 'react';
import VideoNode from '../editor/VideoNode';
import FileNode from '../editor/FileNode';
import ColumnBlock from '../editor/ColumnBlock';
import Column from '../editor/Column';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

// Séparateur vertical de la barre d'outils
const Sep = () => <span className="w-px bg-border self-stretch mx-0.5" />;

// Bouton d'outil réutilisable
const ToolBtn = ({
  onClick,
  active,
  title,
  children,
  className = '',
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className={`flex items-center justify-center w-7 h-7 rounded text-foreground-muted hover:bg-border hover:text-foreground transition-colors
      ${active ? 'bg-primary/10 text-primary ring-1 ring-primary/20' : ''}
      ${className}`}
  >
    {children}
  </button>
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const lastExternalValue = useRef<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, link: false }),
      Heading.configure({ levels: [2, 3] }),
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            size: {
              default: null,
              parseHTML: el => el.getAttribute('data-size'),
              renderHTML: attrs => attrs.size ? { 'data-size': attrs.size } : {},
            },
          };
        },
      }),
      Youtube.configure({ controls: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({ multicolor: true }),
      VideoNode,
      FileNode,
      Column,
      ColumnBlock,
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'rich-content max-w-none min-h-[240px] px-5 py-4 focus:outline-none bg-background text-foreground transition-colors',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  useEffect(() => {
    const next = value || '<p></p>';
    if (lastExternalValue.current === next) return;
    const current = editor.getHTML();
    if (current === next) {
      lastExternalValue.current = next;
      return;
    }

    // On décalle la mise à jour pour éviter le crash flushSync de React
    const timeout = setTimeout(() => {
      // On re-vérifie si l'éditeur n'a pas déjà bougé entre temps
      if (editor.getHTML() !== next) {
        editor.commands.setContent(next, { emitUpdate: false });
      }
      lastExternalValue.current = next;
    }, 0);

    return () => clearTimeout(timeout);
  }, [value, editor]);

  const setLink = () => {
    const url = window.prompt('URL du lien');
    if (!url) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImageFromUrl = () => {
    const url = window.prompt("URL de l'image");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const uploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('files', file);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const media = response.data[0] || response.data?.[0];
      if (media?.url) {
        const src = media.url.startsWith('http')
          ? media.url
          : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${media.url}`;
        if (file.type.startsWith('image/')) {
          editor.chain().focus().setImage({ src }).run();
        } else if (file.type.startsWith('video/')) {
          editor.chain().focus().insertVideo({ src }).run();
        } else {
          editor.chain().focus().insertFile({ src, name: file.name, size: `${(file.size / 1024).toFixed(1)} Ko` }).run();
        }
      }
    } catch (err) {
      console.error("Erreur upload", err);
    } finally {
      e.target.value = '';
    }
  };

  const addYoutube = () => {
    const url = window.prompt('URL YouTube');
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-background flex flex-col shadow-2xl' : 'border border-border rounded-xl overflow-hidden shadow-sm'}>

      {/* ── Barre d'outils ── */}
      <div className="bg-background-alt border-b border-border px-2 py-1.5 transition-colors">

        {/* Ligne 1 : Historique + Format texte + Alignement + Listes */}
        <div className="flex flex-wrap items-center gap-0.5 mb-1">

          {/* Undo / Redo / Clear */}
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Annuler (Ctrl+Z)" className="disabled:opacity-50">
            <Undo2 size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Rétablir (Ctrl+Shift+Z)" className="disabled:opacity-50">
            <Redo2 size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Effacer le formatage">
            <Eraser size={14} />
          </ToolBtn>

          <Sep />

          {/* Styles de base */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras (Ctrl+B)">
            <Bold size={14} strokeWidth={2.5} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique (Ctrl+I)">
            <Italic size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné (Ctrl+U)">
            <UnderlineIcon size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Barré">
            <Strikethrough size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} active={editor.isActive('highlight')} title="Surligner">
            <Highlighter size={14} />
          </ToolBtn>

          <Sep />

          {/* Titres */}
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre H2">
            <Heading2 size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre H3">
            <Heading3 size={14} />
          </ToolBtn>

          <Sep />

          {/* Alignement */}
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Aligner à gauche">
            <AlignLeft size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrer">
            <AlignCenter size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Aligner à droite">
            <AlignRight size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justifier">
            <AlignJustify size={14} />
          </ToolBtn>

          <Sep />

          {/* Listes */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">
            <List size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
            <ListOrdered size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
            <Quote size={14} />
          </ToolBtn>

          <Sep />

          {/* Liens */}
          <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Ajouter un lien">
            <LinkIcon size={14} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Supprimer le lien">
            <Unlink size={14} />
          </ToolBtn>

          {/* Plein écran (tout à droite) */}
          <div className="ml-auto">
            <ToolBtn onClick={() => setIsFullscreen(v => !v)} title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}>
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </ToolBtn>
          </div>
        </div>

        {/* Ligne 2 : Couleurs + Taille médias + Médias + Colonnes */}
        <div className="flex flex-wrap items-center gap-0.5">

          {/* Couleurs de texte */}
          {[
            { color: '#111827', label: 'Noir' },
            { color: '#1d4ed8', label: 'Bleu' },
            { color: '#b91c1c', label: 'Rouge' },
            { color: '#047857', label: 'Vert' },
            { color: '#7c3aed', label: 'Violet' },
            { color: '#f59e0b', label: 'Orange' },
          ].map(({ color, label }) => (
            <button
              key={color}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(color).run(); }}
              className="w-4 h-4 rounded-full border border-border ring-1 ring-border hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={`Couleur : ${label}`}
            />
          ))}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-border text-foreground-muted"
            title="Couleur par défaut"
          >
            <RefreshCw size={10} />
          </button>

          <Sep />

          {/* Taille médias */}
          <span className="text-[10px] text-gray-400 mr-0.5">Taille :</span>
          {[
            { key: 'small', label: '25%' },
            { key: 'medium', label: '50%' },
            { key: 'large', label: '100%' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus()
                  .updateAttributes('image', { size: key })
                  .updateAttributes('video', { size: key })
                  .run();
              }}
              className="px-1.5 h-6 text-[10px] rounded border border-border bg-background hover:bg-background-alt text-foreground hover:text-primary transition-colors"
              title={`Taille méida : ${label}`}
            >
              {label}
            </button>
          ))}

          <Sep />

          {/* Médias */}
          <ToolBtn onClick={addImageFromUrl} title="Image via URL">
            <ImageIcon size={14} />
          </ToolBtn>
          <label className="flex items-center justify-center w-7 h-7 rounded text-foreground-muted hover:bg-border cursor-pointer transition-colors" title="Importer image ou vidéo depuis l'ordinateur">
            <Video size={14} />
            <input type="file" accept="image/*,video/*" className="hidden" onChange={uploadMedia} />
          </label>
          <ToolBtn onClick={addYoutube} title="Intégrer une vidéo YouTube">
            <YoutubeIcon size={14} />
          </ToolBtn>
          <label className="flex items-center justify-center w-7 h-7 rounded text-foreground-muted hover:bg-border cursor-pointer transition-colors" title="Importer un document (PDF, Word…)">
            <FileText size={14} />
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="hidden" onChange={uploadMedia} />
          </label>

          <Sep />

          {/* Colonnes */}
          <ToolBtn
            onClick={() => editor.chain().focus().setColumns(2).run()}
            active={editor.isActive('columnBlock', { cols: 2 })}
            title="2 colonnes côte à côte"
          >
            <Columns2 size={14} />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().setColumns(3).run()}
            active={editor.isActive('columnBlock', { cols: 3 })}
            title="3 colonnes côte à côte"
          >
            <Columns3 size={14} />
          </ToolBtn>

          <Sep />

          {/* Séparateur horizontal */}
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ligne de séparation">
            <Minus size={14} />
          </ToolBtn>

          <Sep />

          {/* Tableaux */}
          <ToolBtn
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insérer un tableau"
          >
            <TableIcon size={14} />
          </ToolBtn>
          {editor.isActive('table') && (
            <ToolBtn
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Supprimer le tableau"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
            </ToolBtn>
          )}

        </div>
      </div>

      {/* ── Zone de texte ── */}
      <div className={isFullscreen ? 'flex-1 overflow-y-auto' : 'max-h-[70vh] overflow-y-auto'}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
