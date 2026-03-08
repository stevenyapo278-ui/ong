import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { X } from 'lucide-react';

export const ColumnView = ({ node, deleteNode }: NodeViewProps) => {
  const verticalAlign = node.attrs.verticalAlign || 'top';
  
  return (
    <NodeViewWrapper
      className="column-node-view"
      style={{
        position: 'relative',
        height: '100%',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: verticalAlign === 'middle' ? 'center' : verticalAlign === 'bottom' ? 'flex-end' : 'flex-start'
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
          position: 'absolute', top: '-15px', right: '-15px', width: '30px', height: '30px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px',
          background: '#ef4444', color: 'white', border: '3px solid white',
          cursor: 'pointer', zIndex: 100, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 16px rgba(239, 68, 68, 0.4)'
        }}
        className="column-delete-btn hover:scale-110 hover:bg-red-600 active:scale-90"
        title="Supprimer cette colonne"
      >
        <X size={16} strokeWidth={3} />
      </button>

      <NodeViewContent
        style={{
          padding: '8px 12px',
          outline: 'none',
          width: '100%'
        }}
      />
    </NodeViewWrapper>
  );
};
