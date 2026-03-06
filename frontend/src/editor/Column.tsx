import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ColumnView } from './ColumnView';

const Column = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  isolating: true,
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      width: {
        default: '50%',
        parseHTML: element => element.style.width || '50%',
        renderHTML: attributes => ({
          style: `width: ${attributes.width}`,
          'data-width': attributes.width,
        }),
      },
      verticalAlign: {
        default: 'top',
        parseHTML: element => element.getAttribute('data-vertical-align') || 'top',
        renderHTML: attributes => ({
          'data-vertical-align': attributes.verticalAlign,
          style: `width: ${attributes.width}; display: flex; flex-direction: column; justify-content: ${
            attributes.verticalAlign === 'middle' ? 'center' : 
            attributes.verticalAlign === 'bottom' ? 'flex-end' : 
            'flex-start'
          };`
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView);
  },
});

export default Column;
