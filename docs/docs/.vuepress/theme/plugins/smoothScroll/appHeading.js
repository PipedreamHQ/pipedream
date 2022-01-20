module.exports = function appHeading (md, options) {
  md.core.ruler.push('app-heading', state => {
    const slugs = {}
    const tokens = state.tokens
    tokens
      .filter(token => token.type === 'heading_open' || token.type === 'heading_close')
      .forEach(token => {
        token.tag = 'app-heading'
        if (token.type === 'heading_open') {
          const title = tokens[tokens.indexOf(token) + 1]
            .children
            .filter(token => token.type === 'text' || token.type === 'code_inline')
            .reduce((acc, t) => acc + t.content, '')
          let slug = token.attrGet('id')
          if (slug == null) {
            slug = uniqueSlug(slugify(title), slugs, false)
          } else {
            slug = uniqueSlug(slug, slugs, true)
          }
          token.attrSet('id', slug)
          token.attrSet('level', token.markup.split('').length)
          token.attrSet('href', `#${slug}`)
        }
      })
  })
}

const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
const hasProp = Object.prototype.hasOwnProperty
const uniqueSlug = (slug, slugs, failOnNonUnique) => {
  let uniq = slug
  let i = 1
  if (failOnNonUnique && hasProp.call(slugs, uniq)) {
    throw Error(`User defined id attribute '${slug}' is NOT unique. Please fix it in your markdown to continue.`)
  } else {
    while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`
  }
  slugs[uniq] = true
  return uniq
}
