import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { X } from 'lucide-react';

export const ColumnView = ({ deleteNode }: NodeViewProps) => {
  return (
    <NodeViewWrapper
      className="column-node-view"
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Bouton de suppression individuelle (discret) */}
      <button
        type="button"
        contentEditable={false}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteNode();
        }}
        style={{
          position: 'absolute', top: '-10px', right: '-10px', width: '22px', height: '22px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
          background: 'var(--background)', color: '#ef4444', border: '1px solid var(--border)',
          cursor: 'pointer', zIndex: 10, transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        className="column-delete-btn hover:bg-red-500 hover:text-white"
        title="Supprimer cette colonne"
      >
        <X size={12} />
      </button>

      <NodeViewContent
        style={{
          flex: 1,
          padding: '8px 12px', // Réduit pour laisser plus de place au texte
          outline: 'none',
          height: '100%',
          minHeight: '100px',
          width: '100%'
        }}
      />
    </NodeViewWrapper>
  );
};
