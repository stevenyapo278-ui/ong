import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ColumnBlockView } from './ColumnBlockView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnBlock: {
      setColumns: (n: 2 | 3) => ReturnType;
      unsetColumns: () => ReturnType;
    };
  }
}

const ColumnBlock = Node.create({
  name: 'columnBlock',
  group: 'block',
  content: 'column+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: el => Number(el.getAttribute('data-cols')) || 2,
        renderHTML: attrs => ({ 'data-cols': attrs.cols }),
      },
      // Nouveau : le template de grille pour un contrôle centralisé
      template: {
        default: '1fr 1fr',
        parseHTML: el => el.getAttribute('data-template') || '1fr 1fr',
        renderHTML: attrs => ({ 
          'data-template': attrs.template,
          style: `--grid-template: ${attrs.template}` 
        }),
      },
      resizeMode: {
        default: 'linked',
        parseHTML: el => el.getAttribute('data-resize-mode') || 'linked',
        renderHTML: attrs => ({ 'data-resize-mode': attrs.resizeMode }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnBlockView);
  },

  addKeyboardShortcuts() {
    return {
      // Tabulation pour passer à la colonne suivante
      Tab: () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        // Si on est dans un tableau, on laisse l'extension de tableau gérer la tabulation
        if (this.editor.isActive('table')) {
          return false;
        }

        // On cherche si on est dans une colonne
        let columnNode = null;
        let columnPos = -1;
        
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'column') {
            columnNode = $from.node(d);
            columnPos = $from.before(d);
            break;
          }
        }

        if (columnPos !== -1) {
          const nextPos = columnPos + columnNode!.nodeSize;
          const nextNode = state.doc.nodeAt(nextPos);
          
          if (nextNode && nextNode.type.name === 'column') {
            // Focus la colonne suivante
            return this.editor.commands.focus(nextPos + 2);
          } else {
            // Si c'est la dernière colonne, on peut sortir du bloc ou rester dedans
            // Ici on va boucler au début du bloc pour un comportement fluide
            let blockPos = -1;
            for (let d = $from.depth; d > 0; d--) {
              if ($from.node(d).type.name === 'columnBlock') {
                blockPos = $from.before(d);
                break;
              }
            }
            if (blockPos !== -1) {
              return this.editor.commands.focus(blockPos + 2);
            }
          }
        }
        return false;
      },

      // Shift-Tab pour revenir en arrière
      'Shift-Tab': () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        if (this.editor.isActive('table')) {
          return false;
        }

        let columnPos = -1;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'column') {
            columnPos = $from.before(d);
            break;
          }
        }

        if (columnPos !== -1) {
          const prevPos = columnPos - 1;
          const $prevPos = state.doc.resolve(prevPos);
          const prevNode = $prevPos.nodeBefore;
          
          if (prevNode && prevNode.type.name === 'column') {
            return this.editor.commands.focus(columnPos - prevNode.nodeSize + 1);
          }
        }
        return false;
      },

      // Comportement intelligent du Ctrl+A (ou Cmd+A)
      'Mod-a': () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        // On cherche si on est dans une colonne
        let columnNode = null;
        let columnStart = -1;
        let columnEnd = -1;
        
        for (let d = $from.depth; d > 0; d--) {
          const node = $from.node(d);
          if (node.type.name === 'column') {
            columnNode = node;
            columnStart = $from.before(d) + 1; // +1 pour entrer dans le contenu
            columnEnd = $from.after(d) - 1;  // -1 pour rester dans le contenu
            break;
          }
        }

        if (columnNode && columnStart !== -1) {
          // Si TOUT le contenu de la colonne est déjà sélectionné
          const isAtColumnStart = selection.from === columnStart;
          const isAtColumnEnd = selection.to === columnEnd;

          if (isAtColumnStart && isAtColumnEnd) {
            // Deuxième appui : On sélectionne tout le document
            return this.editor.commands.selectAll();
          }

          // Premier appui : On sélectionne juste la colonne
          return this.editor.commands.setTextSelection({
            from: columnStart,
            to: columnEnd
          });
        }

        // Si on n'est pas dans une colonne, comportement normal
        return false;
      },

      // Amélioration de la touche Entrée pour rester dans la colonne
      Enter: () => {
        const { state, commands } = this.editor;
        const { selection } = state;
        const { $from } = selection;

        // Si on est dans une colonne, on s'assure que Entrée crée un paragraphe
        // sans sortir de la colonne prématurément
        let inColumn = false;
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'column') {
            inColumn = true;
            break;
          }
        }

        if (inColumn) {
          // Force la création d'un nouveau paragraphe à l'intérieur
          return commands.splitBlock();
        }
        
        return false;
      },
    };
  },

  addCommands() {
    return {
      setColumns: (n) => ({ commands }) => {
        const template = Array(n).fill('1fr').join(' ');
        const columnContent = Array.from({ length: n }).map(() => ({
          type: 'column',
          attrs: { width: '100%' }, // La largeur est gérée par le grid parent
          content: [{ type: 'paragraph' }],
        }));
        return commands.insertContent({
          type: 'columnBlock',
          attrs: { cols: n, template },
          content: columnContent,
        });
      },
      unsetColumns: () => ({ state, tr, dispatch }) => {
        let found = false;
        state.doc.descendants((node, pos) => {
          if (node.type.name === 'columnBlock') {
            found = true;
            const content: any[] = [];
            node.forEach(col => col.forEach(child => content.push(child)));
            if (dispatch) tr.replaceWith(pos, pos + node.nodeSize, content);
          }
        });
        if (dispatch && found) dispatch(tr);
        return found;
      },
    };
  },
});

export default ColumnBlock;
