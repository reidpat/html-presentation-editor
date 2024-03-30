import { Node } from '@tiptap/core';

const ReadOnlyOuterElement = Node.create({
  name: 'readOnlyOuterElement',
  content: 'block+',
  atom: true, // Treats the node as a single unit

  parseHTML() {
    return [
      { tag: 'div.read-only' },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, class: 'read-only' }, 0];
  },

  // Make it non-editable
  addAttributes() {
    return {
      contenteditable: {
        default: 'false',
      },
    };
  },
});

export default ReadOnlyOuterElement;
