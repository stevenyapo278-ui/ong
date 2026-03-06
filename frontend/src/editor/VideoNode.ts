import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VideoNodeView } from './VideoNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoNode: {
      insertVideo: (options: { src: string }) => ReturnType;
    };
  }
}

const VideoNode = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        renderHTML: attrs => ({ 'data-src': attrs.src, src: attrs.src }),
      },
      controls: {
        default: true,
      },
      size: {
        default: null,
        parseHTML: element => element.getAttribute('data-size'),
        renderHTML: attributes =>
          attributes.size ? { 'data-size': attributes.size } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-type': 'video', class: 'video-node-container' },
      ['video', mergeAttributes(HTMLAttributes, { controls: true })]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      insertVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src: options.src,
            },
          });
        },
    };
  },
});

export default VideoNode;

