import { Node, mergeAttributes } from '@tiptap/core';

const CustomDiv = Node.create({
  name: 'customDiv',
  content: 'block+', // Allow block content inside
  group: 'block',
  selectable: false, // Make the node itself not selectable

  parseHTML() {
    return [
      {
        tag: 'div.custom-div',
      },
    ];
  },

  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'custom-div' }), 0];
  },
});

export default CustomDiv;
