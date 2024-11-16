export default (options = {}) => tree => {
  options.attributes = options.attributes || ['prevent-widows', 'no-widows']
  options.minWords = options.minWords || 4
  options.ignore = options.ignore || [
    { start: '{{', end: '}}' },  // Handlebars, Liquid, Nunjucks, Twig, Jinja2, Mustache
    { start: '{%', end: '%}' },  // Liquid, Nunjucks, Twig, Jinja2
    { start: '<%=', end: '%>' }, // EJS, ERB
    { start: '<%', end: '%>' },  // EJS, ERB
    { start: '{$', end: '}' },   // Smarty
    { start: '<\\?', end: '\\?>' }, // PHP
    { start: '#{', end: '}' }    // Pug
  ]

  const process = (node, shouldReplace = false) => {
    let replace = shouldReplace

    // If node is a string and the parent has the attribute, replace the last space with a non-breaking space
    if (typeof node === 'string') {
      const words = node.trim().split(/\s+/)

      // Split the string into parts based on the ignore patterns
      let parts = [node]
      for (const pattern of options.ignore) {
        const regex = new RegExp(`(${pattern.start}.*?${pattern.end})`, 'g')
        parts = parts.flatMap(part => part.split(regex))
      }

      // Process each part separately
      const processedParts = parts.map(part => {
        for (const pattern of options.ignore) {
          const ignorePattern = new RegExp(`^${pattern.start}.*?${pattern.end}$`)
          if (ignorePattern.test(part)) {
            return part
          }
        }
        const partWords = part.trim().split(/\s+/)
        return replace && partWords.length >= options.minWords
          ? part.replace(/ ([^ ]+)$/, '&nbsp;$1')
          : part
      })

      return processedParts.join('')
    }

    // If node is a tag, check if it has one of the predefined attributes
    if (node.tag && node.attrs) {
      for (const attr of options.attributes) {
        if (attr in node.attrs) {
          // Delete the attribute from the tag
          delete node.attrs[attr]

          // Set the flag to replace the last space with a non-breaking space
          replace = true

          break
        }
      }
    }

    // If `content` is an array, recursively process each item
    if (Array.isArray(node.content)) {
      node.content = node.content.map(child => process(child, replace))
    }

    // Return the node
    return node
  }

  return tree.walk(process)
}
