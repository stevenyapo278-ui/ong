import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { X } from 'lucide-react';

export const VideoNodeView = ({ node, deleteNode }: NodeViewProps) => {
  const { src, size } = node.attrs;

  return (
    <NodeViewWrapper className="video-node-wrapper group relative my-8">
      <div className="relative flex justify-center">
        <video 
          src={src} 
          controls 
          className={`rounded-[32px] border border-border shadow-lg bg-black aspect-video transition-all group-hover:border-primary/50 ${
            size === 'small' ? 'max-w-[400px]' : 
            size === 'large' ? 'max-w-full' : 
            'max-w-[800px]'
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
          className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-red-500/40 z-20 cursor-pointer"
          title="Supprimer cette vidéo"
        >
          <X size={24} />
        </button>
      </div>
    </NodeViewWrapper>
  );
};
