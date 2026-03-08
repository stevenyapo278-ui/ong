import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
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
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
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
  Columns2,
  Columns3,
  Maximize2,
  Minimize2,
  RefreshCw,
  Undo2,
  Redo2,
  Eraser,
  Highlighter,
  Table as TableIcon,
  Trash2,
  ArrowDownToLine,
  ArrowRightToLine,
  FolderOpen,
  Youtube as YoutubeIcon,
  Minus,
  Grid,
  Square,
  TableProperties,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import VideoNode from '../editor/VideoNode';
import FileNode from '../editor/FileNode';
import ColumnBlock from '../editor/ColumnBlock';
import Column from '../editor/Column';
import MediaManager from './MediaManager';
import PromptModal from './PromptModal';
import { ImageView } from '../editor/ImageView';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  postId?: string;
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
    className={`flex items-center justify-center w-8 h-8 rounded-lg text-foreground-muted hover:bg-border hover:text-foreground transition-colors
      ${active ? 'bg-primary/20 text-primary ring-1 ring-primary/30' : ''}
      ${className}`}
  >
    {children}
  </button>
);

// Extensions mémoisées en dehors du composant pour éviter les doublons et les re-rendus
const EDITOR_EXTENSIONS = [
  Table.configure({ resizable: true }).extend({
    addKeyboardShortcuts() {
      return {
        Tab: () => this.editor.can().goToNextCell() ? this.editor.commands.goToNextCell() : false,
        'Shift-Tab': () => this.editor.can().goToPreviousCell() ? this.editor.commands.goToPreviousCell() : false,
      };
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  StarterKit.configure({ heading: false, link: false }),
  Heading.configure({ levels: [2, 3] }),
  TextStyle,
  Color.configure({ types: ['textStyle'] }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Link.configure({
    openOnClick: true,
    HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
    validate: url => !!url,
  }).extend({
    parseHTML() {
      return [{ tag: 'a:not([data-type="file"]):not(.file-node-link)' }];
    },
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
    addNodeView() {
      return ReactNodeViewRenderer(ImageView);
    },
  }),
  Youtube.configure({ controls: true }),
  Highlight.configure({ multicolor: true }),
  CharacterCount.configure({ limit: null }),
  Underline,
  VideoNode,
  FileNode,
  Column,
  ColumnBlock,
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, postId }) => {

  const lastExternalValue = useRef<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectionCounter, setSelectionCounter] = useState(0);
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    placeholder: string;
    onConfirm: (val: string) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    onConfirm: () => {},
  });

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'rich-content max-w-none min-h-[400px] px-8 py-10 focus:outline-none bg-background text-foreground transition-colors',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      setSelectionCounter(c => c + 1);
    },
    onSelectionUpdate: () => {
      setSelectionCounter(c => c + 1);
    },
    onTransaction: () => {
      setSelectionCounter(c => c + 1);
    },
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
    setPromptConfig({
      isOpen: true,
      title: 'Ajouter un lien',
      message: 'Saisissez l\'adresse URL de votre lien',
      placeholder: 'https://...',
      onConfirm: (url) => {
        if (!url) return;
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
      }
    });
  };

  const handleMediaSelect = (url: string, type: string) => {
    console.log("Média sélectionné:", { url, type });
    setIsMediaManagerOpen(false);
    
    if (editor) {
      editor.commands.focus();
      
      try {
        if (type.startsWith('image/')) {
          editor.chain().focus().setImage({ src: url }).run();
        } else if (type.startsWith('video/')) {
          editor.chain().focus().insertVideo({ src: url }).run();
        } else {
          editor.chain().focus().insertFile({ src: url, name: url.split('/').pop() || 'Fichier' }).run();
        }
        console.log("Insertion réussie dans l'éditeur");
      } catch (err) {
        console.error("Erreur d'insertion dans l'éditeur:", err);
      }
    }
  };

  const addYoutube = () => {
    setPromptConfig({
      isOpen: true,
      title: 'Vidéo YouTube',
      message: 'Collez le lien de la vidéo YouTube',
      placeholder: 'https://youtube.com/watch?v=...',
      onConfirm: (url) => {
        if (!url) return;
        try {
          editor.chain().focus().setYoutubeVideo({ 
            src: url,
            width: 640,
            height: 480,
          }).run();
        } catch (err) {
          console.error("YouTube Error:", err);
        }
      }
    });
  };

  const updateVerticalAlign = (align: 'top' | 'middle' | 'bottom') => {
    if (!editor) return;
    
    const { state } = editor;
    const { selection } = state;
    const { $from } = selection;

    // On cherche le noeud 'column' parent dans la hiérarchie
    let columnPos = -1;
    let columnNode = null;
    
    for (let d = $from.depth; d > 0; d--) {
      if ($from.node(d).type.name === 'column') {
        columnPos = $from.before(d);
        columnNode = $from.node(d);
        break;
      }
    }

    if (columnPos !== -1 && columnNode) {
      // On utilise une commande personnalisée pour modifier précisément le noeud parent
      editor.chain().focus().command(({ tr, dispatch }) => {
        if (dispatch) {
          tr.setNodeMarkup(columnPos, undefined, {
            ...columnNode!.attrs,
            verticalAlign: align
          });
        }
        return true;
      }).run();
    }
  };

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-[250] bg-background flex flex-col shadow-2xl transition-colors' : 'border border-border rounded-[24px] overflow-hidden shadow-sm flex flex-col transition-colors bg-background'}>

      {/* ── Barre d'outils ── */}
      <div 
        className="bg-background-alt/50 backdrop-blur-md border-b border-border px-3 py-2 transition-colors sticky top-0 z-10"
        data-selection={selectionCounter}
      >

        {/* Ligne 1 : Historique + Format texte + Alignement + Listes */}
        <div className="flex flex-wrap items-center gap-1 mb-2">

          {/* Undo / Redo / Clear */}
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Annuler (Ctrl+Z)" className="disabled:opacity-50">
            <Undo2 size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Rétablir (Ctrl+Shift+Z)" className="disabled:opacity-50">
            <Redo2 size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Effacer le formatage">
            <Eraser size={18} />
          </ToolBtn>

          <Sep />

          {/* Styles de base */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras (Ctrl+B)">
            <Bold size={18} strokeWidth={2.5} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique (Ctrl+I)">
            <Italic size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné (Ctrl+U)">
            <UnderlineIcon size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Barré">
            <Strikethrough size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} active={editor.isActive('highlight')} title="Surligner">
            <Highlighter size={18} />
          </ToolBtn>

          <Sep />

          {/* Titres */}
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre H2">
            <Heading2 size={19} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre H3">
            <Heading3 size={19} />
          </ToolBtn>

          <Sep />

          {/* Alignement */}
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Aligner à gauche">
            <AlignLeft size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrer">
            <AlignCenter size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Aligner à droite">
            <AlignRight size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justifier">
            <AlignJustify size={18} />
          </ToolBtn>

          <Sep />

          {/* Listes */}
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">
            <List size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
            <ListOrdered size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
            <Quote size={18} />
          </ToolBtn>

          <Sep />

          {/* Liens */}
          <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Ajouter un lien">
            <LinkIcon size={18} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Supprimer le lien">
            <Unlink size={18} />
          </ToolBtn>

          {/* Plein écran (tout à droite) */}
          <div className="ml-auto">
            <ToolBtn onClick={() => setIsFullscreen(v => !v)} title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}>
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </ToolBtn>
          </div>
        </div>

        {/* Ligne 2 : Couleurs + Taille médias + Médias + Colonnes */}
        <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold">

          {/* Couleurs de texte */}
          <div className="flex items-center gap-1.5 px-2">
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
                className="w-4 h-4 rounded-full border border-border/50 ring-1 ring-border/20 hover:scale-125 transition-transform"
                style={{ backgroundColor: color }}
                title={`Couleur : ${label}`}
              />
            ))}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); }}
              className="flex items-center justify-center w-6 h-6 rounded-lg hover:bg-border text-foreground-muted"
              title="Couleur par défaut"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <Sep />

          {/* Taille médias */}
          <div className="flex items-center gap-1 px-1">
            <span className="text-[9px] text-foreground-muted uppercase tracking-tighter">Taille :</span>
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
                className="px-3 h-7 text-[10px] font-black rounded-lg bg-background border border-border hover:bg-primary/5 hover:text-primary transition-all transition-colors"
                title={`Taille média : ${label}`}
              >
                {label}
              </button>
            ))}
          </div>

          <Sep />

          {/* Médias */}
          <div className="flex items-center gap-1">
            <ToolBtn onClick={() => setIsMediaManagerOpen(true)} title="Ouvrir la Médiathèque" className="bg-primary/5 text-primary">
              <FolderOpen size={18} />
            </ToolBtn>
            <ToolBtn onClick={addYoutube} title="Intégrer une vidéo YouTube">
              <YoutubeIcon size={20} />
            </ToolBtn>
          </div>

          <Sep />

          {/* Colonnes */}
          <ToolBtn
            onClick={() => editor.chain().focus().setColumns(2).run()}
            active={editor.isActive('columnBlock', { cols: 2 })}
            title="2 colonnes"
          >
            <Columns2 size={20} />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().setColumns(3).run()}
            active={editor.isActive('columnBlock', { cols: 3 })}
            title="3 colonnes"
          >
            <Columns3 size={20} />
          </ToolBtn>
          <ToolBtn
            onClick={() => editor.chain().focus().unsetColumns().run()}
            title="Supprimer les colonnes"
          >
            <Eraser size={18} />
          </ToolBtn>

          <Sep />

          {/* Alignement Vertical (pour les colonnes) */}
          <div className="flex items-center gap-1 px-1">
            <span className="text-[9px] text-foreground-muted uppercase tracking-tighter">Vertical :</span>
            <ToolBtn
              onClick={() => updateVerticalAlign('top')}
              active={editor.isActive('column', { verticalAlign: 'top' })}
              title="Aligner en haut"
            >
              <AlignStartVertical size={18} />
            </ToolBtn>
            <ToolBtn
              onClick={() => updateVerticalAlign('middle')}
              active={editor.isActive('column', { verticalAlign: 'middle' })}
              title="Centrer en hauteur"
            >
              <AlignCenterVertical size={18} />
            </ToolBtn>
            <ToolBtn
              onClick={() => updateVerticalAlign('bottom')}
              active={editor.isActive('column', { verticalAlign: 'bottom' })}
              title="Aligner en bas"
            >
              <AlignEndVertical size={18} />
            </ToolBtn>
          </div>

          <Sep />

          {/* Tableaux */}
          <ToolBtn
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insérer un tableau"
          >
            <TableIcon size={20} />
          </ToolBtn>

          {editor.isActive('table') && (
            <div className="flex items-center gap-1 ml-1 pl-2 pr-1 py-0.5 border-l border-border bg-primary/5 rounded-lg transition-all animate-in fade-in slide-in-from-left-2">
              <ToolBtn onClick={() => editor.chain().focus().addRowAfter().run()} title="Ajouter ligne">
                <ArrowDownToLine size={16} />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().deleteRow().run()} title="Supprimer ligne" className="text-red-500 hover:bg-red-500/10">
                <Minus size={16} />
              </ToolBtn>
              <div className="w-px h-4 bg-border/50 mx-1" />
              <ToolBtn onClick={() => editor.chain().focus().addColumnAfter().run()} title="Ajouter colonne">
                <ArrowRightToLine size={16} />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().deleteColumn().run()} title="Supprimer colonne" className="text-red-500 hover:bg-red-500/10">
                <Minus size={16} className="rotate-90" />
              </ToolBtn>
              <div className="w-px h-4 bg-border/50 mx-1" />
              <ToolBtn 
                onClick={() => editor.chain().focus().mergeCells().run()} 
                title="Fusionner les cellules (Sélectionnez plusieurs cellules)"
                className={!editor.can().mergeCells() ? 'opacity-30 cursor-not-allowed' : ''}
              >
                <Grid size={16} />
              </ToolBtn>
              <ToolBtn 
                onClick={() => editor.chain().focus().splitCell().run()} 
                title="Diviser la cellule fusionnée"
                className={!editor.can().splitCell() ? 'opacity-30 cursor-not-allowed' : ''}
              >
                <Square size={16} />
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleHeaderCell().run()} title="En-tête">
                <TableProperties size={16} />
              </ToolBtn>
              <div className="w-px h-4 bg-border/50 mx-1" />
              <ToolBtn onClick={() => editor.chain().focus().deleteTable().run()} title="Supprimer tableau" className="text-red-500 hover:bg-red-500/10">
                <Trash2 size={16} />
              </ToolBtn>
            </div>
          )}

        </div>
      </div>

      {/* ── Zone de texte ── */}
      <div className={`${isFullscreen ? 'flex-1 overflow-y-auto' : 'h-[600px] overflow-y-auto'} bg-background transition-colors`}>
        <EditorContent editor={editor} />
      </div>

      {/* ── Barre de statut (Compteur) ── */}
      <div className="bg-background-alt border-t border-border px-5 py-2.5 flex items-center justify-between text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em] transition-colors">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {editor.storage.characterCount.words()} MOTS
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground-muted/30" />
            {editor.storage.characterCount.characters()} SIGNES
          </span>
        </div>
        <div>
          ONG IMPACT EDITOR v2.0
        </div>
      </div>

      {/* Media Manager Modal */}
      <MediaManager 
        isOpen={isMediaManagerOpen} 
        onClose={() => setIsMediaManagerOpen(false)} 
        onSelect={handleMediaSelect} 
        postId={postId}
      />

      {/* Custom Prompt Modal */}
      <PromptModal
        isOpen={promptConfig.isOpen}
        onClose={() => setPromptConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={promptConfig.onConfirm}
        title={promptConfig.title}
        message={promptConfig.message}
        placeholder={promptConfig.placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
