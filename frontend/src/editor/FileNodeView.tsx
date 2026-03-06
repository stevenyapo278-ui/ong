import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { X, FileText } from 'lucide-react';

export const FileNodeView = ({ node, deleteNode }: NodeViewProps) => {
  const { src, name, size } = node.attrs;
  const fileName = name || 'Fichier';
  const fileSize = size ? ` (${size})` : '';

  return (
    <NodeViewWrapper className="file-node-wrapper group relative my-6">
      <div className="file-node-container transition-all group-hover:border-primary/50">
        <a 
          href={src} 
          target="_blank" 
          rel="noopener noreferrer"
          className="file-node-link flex items-center gap-4 p-4 rounded-2xl bg-background-alt border border-border transition-colors hover:bg-background"
        >
          <div className="file-icon w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <FileText size={24} />
          </div>
          <div className="file-info overflow-hidden">
            <p className="file-name text-sm font-black text-foreground truncate uppercase">{fileName}</p>
            <p className="file-meta text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              Document{fileSize} · Cliquez pour ouvrir
            </p>
          </div>
        </a>
      </div>

      {/* Bouton de suppression rouge */}
      <button
        type="button"
        contentEditable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteNode();
        }}
        className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-red-500/20 z-20 cursor-pointer"
        title="Supprimer ce fichier"
      >
        <X size={16} />
      </button>
    </NodeViewWrapper>
  );
};
