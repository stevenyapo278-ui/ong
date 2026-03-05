import { Node, mergeAttributes } from '@tiptap/core';

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
      },
      name: {
        default: 'Fichier',
      },
      size: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'a[data-type="file"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const name = HTMLAttributes.name || 'Fichier';
    const size = HTMLAttributes.size ? ` (${HTMLAttributes.size})` : '';

    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'file',
        class: 'flex items-center gap-3 p-4 bg-background-alt border border-border rounded-xl hover:bg-background transition-colors no-underline text-foreground group',
        target: '_blank',
        href: HTMLAttributes.src,
      }),
      [
        'div',
        { class: 'w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors' },
        ['svg', { xmlns: 'http://www.w3.org/2000/svg', width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
          ['path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' }],
          ['polyline', { points: '14 2 14 8 20 8' }]
        ]
      ],
      [
        'div',
        { class: 'flex-1 overflow-hidden' },
        ['p', { class: 'text-sm font-semibold truncate text-foreground' }, name],
        ['p', { class: 'text-xs text-foreground-muted' }, `Document${size} · Cliquez pour ouvrir`]
      ]
    ];
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
