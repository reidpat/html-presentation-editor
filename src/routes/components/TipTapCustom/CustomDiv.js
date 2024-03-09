import { Node, mergeAttributes } from '@tiptap/core'

const CustomDiv = Node.create({
  name: 'customDiv',
  content: 'block+', // Allow block content inside
  group: 'block',
  selectable: false, // Make the node itself not selectable

  parseHTML() {
    return [
      {
        tag: 'div.custom-div', // Target your specific div class
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, class: 'custom-div' }, 0]
  },

  
})

export default CustomDiv;