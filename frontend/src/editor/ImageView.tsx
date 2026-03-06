import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { X } from 'lucide-react';

export const ImageView = ({ node, deleteNode }: NodeViewProps) => {
  const { src, alt, title, size } = node.attrs;

  return (
    <NodeViewWrapper className="image-node-wrapper group relative my-8 inline-block w-full">
      <div className={`relative flex justify-center`}>
         <img 
            src={src} 
            alt={alt} 
            title={title}
            className={`rounded-3xl border border-border shadow-sm transition-all group-hover:border-primary/50 ${
                size === 'small' ? 'max-w-[300px]' : 
                size === 'large' ? 'max-w-full' : 
                'max-w-[600px]'
            }`}
        />
        
        {/* Bouton de suppression rouge */}
        <button
            type="button"
            contentEditable={false}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteNode();
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-red-500/30 z-20 cursor-pointer"
            title="Supprimer cette image"
        >
            <X size={20} />
        </button>
      </div>
    </NodeViewWrapper>
  );
};
