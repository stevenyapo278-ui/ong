import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    layout: {
      insertTripleColumn: () => ReturnType;
      insertLeftMedia: () => ReturnType;
      insertRightMedia: () => ReturnType;
    };
  }
}

/**
 * Node for individual columns within a layout
 */
export const LayoutColumn = Node.create({
  name: 'layoutColumn',
  group: 'block',
  content: 'block+',
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      class: {
        default: 'column-text',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const className = element.getAttribute('class') || '';
          if (className.includes('column-')) {
            return { class: className };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },
});

/**
 * Container node for the column layout
 */
const LayoutNode = Node.create({
  name: 'layout',
  group: 'block',
  content: 'layoutColumn+',
  defining: true,

  addAttributes() {
    return {
      class: {
        default: 'media-layout-3',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (element) => {
          if (typeof element === 'string') return false;
          const className = element.getAttribute('class') || '';
          if (className.includes('media-layout-')) {
            return { class: className };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      insertTripleColumn:
        () =>
        ({ commands }) => {
          return commands.insertContent(`
            <div class="media-layout-3" data-name="Triple : Texte | Média | Texte">
              <div class="column-text"><p>📝 [Texte à gauche]</p></div>
              <div class="column-media"><p>🖼️ [Ajoutez votre Média ici]</p></div>
              <div class="column-text"><p>📝 [Texte à droite]</p></div>
            </div>
            <p></p>
          `);
        },
      insertLeftMedia:
        () =>
        ({ commands }) => {
          return commands.insertContent(`
            <div class="media-layout-2-left" data-name="2 Colonnes : Texte | Média">
              <div class="column-text"><p>📝 [Texte à gauche]</p></div>
              <div class="column-media"><p>🖼️ [Média à droite]</p></div>
            </div>
            <p></p>
          `);
        },
      insertRightMedia:
        () =>
        ({ commands }) => {
          return commands.insertContent(`
            <div class="media-layout-2-right" data-name="2 Colonnes : Média | Texte">
              <div class="column-media"><p>🖼️ [Média à gauche]</p></div>
              <div class="column-text"><p>📝 [Texte à droite]</p></div>
            </div>
            <p></p>
          `);
        },
    };
  },
});

export default LayoutNode;
