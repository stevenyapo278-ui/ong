import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FileNodeView } from './FileNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fileNode: {
      insertFile: (options: { src: string; name: string; size?: string }) => ReturnType;
    };
  }
}

const FileNode = Node.create({
  name: 'file',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: el => el.getAttribute('data-src') || el.getAttribute('href') || el.getAttribute('src'),
        renderHTML: attrs => ({ 'data-src': attrs.src, href: attrs.src }),
      },
      name: {
        default: 'Fichier',
        parseHTML: el => el.getAttribute('data-name') || el.getAttribute('name'),
        renderHTML: attrs => ({ 'data-name': attrs.name }),
      },
      size: {
        default: '',
        parseHTML: el => el.getAttribute('data-size') || el.getAttribute('size'),
        renderHTML: attrs => ({ 'data-size': attrs.size }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="file"]',
        priority: 100,
      },
      // Fallback pour les anciens formats ou les copier/coller
      {
        tag: 'a[data-type="file"]',
        priority: 100,
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const src = HTMLAttributes['data-src'] || '#';
    const name = HTMLAttributes['data-name'] || 'Fichier';
    const size = HTMLAttributes['data-size'] ? ` (${HTMLAttributes['data-size']})` : '';

    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'file', class: 'file-node-container' }),
      [
        'a',
        { 
          href: src, 
          target: '_blank', 
          rel: 'noopener noreferrer', 
          class: 'file-node-link' 
        },
        [
          'div', 
          { class: 'file-icon' }, 
          ['svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
            ['path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }],
            ['polyline', { points: '14 2 14 8 20 8' }]
          ]
        ],
        [
          'div',
          { class: 'file-info' },
          ['p', { class: 'file-name' }, name],
          ['p', { class: 'file-meta' }, `Document${size} · Cliquez pour ouvrir`]
        ]
      ]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileNodeView);
  },

  addCommands() {
    return {
      insertFile:
        (options) =>
          ({ commands }) => {
            return commands.insertContent({
              type: this.name,
              attrs: {
                src: options.src,
                name: options.name,
                size: options.size,
              },
            });
          },
    };
  },
});

export default FileNode;
