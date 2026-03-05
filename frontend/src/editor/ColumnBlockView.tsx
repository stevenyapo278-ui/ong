import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Trash2, Plus, Layout, Link as LinkIcon, Link2Off, GripVertical } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export const ColumnBlockView = ({ node, editor, getPos, updateAttributes, deleteNode }: NodeViewProps) => {
  const [visible, setVisible] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const template = node.attrs.template || '1fr 1fr';
  const resizeMode = node.attrs.resizeMode || 'linked';

  // Synchronisation automatique de la grille CSS et des attributs après ajout/suppression
  useEffect(() => {
    const currentCols = node.childCount;
    const templateParts = template.trim().split(' ').filter(Boolean);

    if (currentCols > 0 && currentCols !== templateParts.length) {
      // Re-calculer un modèle équitable si le nombre de colonnes réelles 
      // diffère du modèle CSS (ex: l'utilisateur a supprimé une colonne)
      const newTemplate = Array(currentCols).fill('1fr').join(' ');

      setTimeout(() => {
        updateAttributes({ template: newTemplate, cols: currentCols });
      }, 0);
    }
  }, [node.childCount, template, updateAttributes]);

  const show = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(true);
  };

  const hide = () => {
    if (isResizing) return;
    hideTimer.current = setTimeout(() => setVisible(false), 800);
  };

  const getWidths = () => {
    const parts = template.split(' ');
    let widths: number[] = [];
    if (template.includes('fr')) {
      const frs = parts.map((p: string) => parseFloat(p));
      const total = frs.reduce((a: number, b: number) => a + b, 0);
      widths = frs.map((f: number) => (f / total) * 100);
    } else {
      widths = parts.map((p: string) => parseFloat(p));
    }
    return widths;
  };

  const handleResizeStart = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    const startX = e.clientX;
    const widths = getWidths();
    const containerWidth = containerRef.current?.querySelector('.column-block-grid')?.getBoundingClientRect().width || 0;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;cursor:col-resize;';
    document.body.appendChild(overlay);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidths = [...widths];

      if (resizeMode === 'linked') {
        const minWidth = 5;
        const available = widths[index] + widths[index + 1];
        newWidths[index] = Math.max(minWidth, Math.min(available - minWidth, widths[index] + deltaPercent));
        newWidths[index + 1] = available - newWidths[index];
      } else {
        newWidths[index] = Math.max(5, Math.min(95, widths[index] + deltaPercent));
      }

      const newTemplate = newWidths.map(w => `${Math.round(w * 10) / 10}%`).join(' ');
      if (containerRef.current) {
        const contentDiv = containerRef.current.querySelector('.column-block-grid') as HTMLElement;
        if (contentDiv) {
          contentDiv.style.transition = 'none';
          contentDiv.style.setProperty('--grid-template', newTemplate);
        }
      }
    };

    const onMouseUp = (mouseUpEvent: MouseEvent) => {
      const deltaX = mouseUpEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidths = [...widths];

      if (resizeMode === 'linked') {
        const minWidth = 5;
        const available = widths[index] + widths[index + 1];
        newWidths[index] = Math.max(minWidth, Math.min(available - minWidth, widths[index] + deltaPercent));
        newWidths[index + 1] = available - newWidths[index];
      } else {
        newWidths[index] = Math.max(5, Math.min(95, widths[index] + deltaPercent));
      }

      const finalTemplate = newWidths.map(w => `${Math.round(w * 10) / 10}%`).join(' ');

      setTimeout(() => {
        updateAttributes({ template: finalTemplate });
      }, 0);

      setIsResizing(false);
      document.body.removeChild(overlay);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const addColumn = () => {
    const pos = getPos();
    if (typeof pos !== 'number') return;
    const nextCount = node.childCount + 1;
    const newTemplate = Array(nextCount).fill('1fr').join(' ');

    setTimeout(() => {
      const nodeSize = node.nodeSize;
      editor.chain()
        .insertContentAt(pos + nodeSize - 1, { type: 'column', content: [{ type: 'paragraph' }] })
        .updateAttributes('columnBlock', { template: newTemplate, cols: nextCount })
        .focus(pos + nodeSize + 1)
        .run();
    }, 0);
  };

  const removeColumn = () => {
    if (node.childCount <= 1) {
      deleteNode();
      return;
    }
    const pos = getPos();
    if (typeof pos !== 'number') return;

    let lastChildOffset = 0;
    node.forEach((_, offset) => { lastChildOffset = offset; });

    const nextCount = node.childCount - 1;
    const newTemplate = Array(nextCount).fill('1fr').join(' ');
    const targetPos = pos + 1 + lastChildOffset;

    setTimeout(() => {
      editor.chain().focus()
        .deleteRange({ from: targetPos, to: targetPos + node.lastChild!.nodeSize })
        .updateAttributes('columnBlock', {
          template: newTemplate,
          cols: nextCount
        })
        .run();
    }, 0);
  };

  // Calcul des positions des handles pour l'affichage absolu
  const widths = getWidths();
  const handlePositions: number[] = [];
  let currentSum = 0;
  for (let i = 0; i < widths.length - 1; i++) {
    currentSum += widths[i];
    handlePositions.push(currentSum);
  }

  return (
    <NodeViewWrapper
      onMouseEnter={show}
      onMouseLeave={hide}
      ref={containerRef}
      className={`column-block-wrapper ${visible ? 'is-visible' : ''} ${isResizing ? 'is-resizing' : ''}`}
      style={{
        position: 'relative',
        margin: '4rem 0',
        width: '100%',
        userSelect: isResizing ? 'none' : 'auto',
        WebkitUserSelect: isResizing ? 'none' : 'auto'
      }}
    >
      {/* Barre d'outils style "Pill" */}
      <div
        contentEditable={false}
        style={{
          position: 'absolute', top: '-54px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1000,
          opacity: visible ? 1 : 0, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'var(--background)', backdropFilter: 'blur(8px)',
          padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          pointerEvents: visible ? 'auto' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px', borderRight: '1px solid var(--border)', marginRight: '4px' }}>
          <Layout size={14} className="text-secondary" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>STRUCTURE GLOBLALE</span>
        </div>

        <button onClick={addColumn} className="hover:bg-primary/10 text-primary transition-colors" style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
          <Plus size={14} /> Ajouter une colonne
        </button>

        <button
          onClick={() => {
            setTimeout(() => {
              updateAttributes({ resizeMode: resizeMode === 'linked' ? 'independent' : 'linked' });
            }, 0);
          }}
          className={`transition-colors ${resizeMode === 'linked' ? 'bg-primary/10 text-primary' : 'text-foreground-muted hover:bg-background-alt'}`}
          style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}
        >
          {resizeMode === 'linked' ? <LinkIcon size={14} /> : <Link2Off size={14} />}
          {resizeMode === 'linked' ? 'Largeurs liées' : 'Largeurs libres'}
        </button>

        <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />

        <button onClick={deleteNode} className="hover:bg-red-500/10 text-red-500 transition-colors" style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer' }} title="Supprimer tout le bloc">
          <Trash2 size={14} />
        </button>
      </div>

      <div
        style={{
          position: 'relative',
          padding: '24px',
          borderRadius: '12px',
          background: 'var(--background-alt)',
          border: '1px solid var(--border)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
          // @ts-ignore
          '--grid-template': template
        }}
      >
        <NodeViewContent className="column-block-grid" />

        {/* Resizer Handles (Positionnés en pourcentage) */}
        {visible && !isResizing && node.childCount > 1 && (
          <div style={{
            position: 'absolute', top: 0, left: '24px', right: '24px', height: '100%',
            pointerEvents: 'none', zIndex: 100
          }}>
            {handlePositions.map((pos, i) => (
              <div
                key={i}
                onMouseDown={(e) => handleResizeStart(e, i)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `calc(${pos}% + ${i * 24}px)`, // On compense les gaps de 24px
                  width: '24px',
                  height: '100%',
                  marginLeft: '-12px',
                  cursor: 'col-resize',
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  background: 'var(--primary)',
                  borderRadius: '6px',
                  padding: '6px',
                  color: 'white',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease',
                  transform: 'scale(1)'
                }} className="resize-handle">
                  <GripVertical size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};
