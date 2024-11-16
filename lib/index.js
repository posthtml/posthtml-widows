export default (options = {}) => tree => {
  // Accept options and set defaults
  options.attributes = options.attributes || ['prevent-widows', 'no-widows']

  const process = (node, shouldReplace = false) => {
    // If node is a string and the parent has the attribute, replace the last space with a non-breaking space
    if (typeof node === 'string') {
      return shouldReplace ? node.replace(/ ([^ ]+)$/, '&nbsp;$1') : node
    }

    // If node is a tag, check if it has one of the predefined attributes
    if (node.tag && node.attrs) {
      for (const attr of options.attributes) {
        if (attr in node.attrs) {
          // Delete the attribute from node.attrs
          delete node.attrs[attr]

          shouldReplace = true

          break
        }
      }
    }

    // If `content` is an array, recursively process each item
    if (Array.isArray(node.content)) {
      node.content = node.content.map(child => process(child, shouldReplace))
    }

    // Return the node
    return node
  }

  return tree.walk(process)
}
