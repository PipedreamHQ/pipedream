<script>
import { hashRE, groupHeaders } from '../util'

export default {
  functional: true,

  props: ['item'],

  render (h, { parent: { $page, $site, $route }, props: { item }}) {
    const active = item.active
    const link = renderLink(h, item.path, item.title || item.path, active)
    const maxDepth = 2
    if (item.type === 'auto') {
      return [link, renderChildren(h, item.children, item.basePath, $route, maxDepth)]
    } else if (active && item.headers && !hashRE.test(item.path)) {
      const children = groupHeaders(item.headers)
      return [link, renderChildren(h, children, item.path, $route, maxDepth)]
    } else {
      return link
    }
  }
}

function renderLink (h, to, text, active) {
  return h('router-link', {
    props: {
      to,
      activeClass: '',
      exactActiveClass: ''
    },
    class: {
      active,
      'content-sidebar-link': true
    }
  }, text)
}

function renderChildren (h, children, path, route, maxDepth, depth = 1) {
  if (!children || depth > maxDepth) return null
  return h('ul', { class: 'content-sidebar-sub-headers' }, children.map(c => {
    return h('li', { class: 'content-sidebar-sub-header' }, [
      renderLink(h, path + '#' + c.slug, c.title, c.active),
      renderChildren(h, c.children, path, route, maxDepth, depth + 1)
    ])
  }))
}
</script>

<style lang="stylus">
.content-sidebar
  .content-sidebar-sub-headers
    padding-left 0.7rem
    font-size 0.95em

a.content-sidebar-link
  font-weight 400
  color $textColor
  padding 0.35rem 1rem 0.35rem 0.7rem
  line-height 1.4
  width: 100%
  box-sizing: border-box
  display block
  overflow hidden
  text-overflow ellipsis
  user-select none
  &:hover
    color $accentColor
  &.active
    font-weight 600
    color $accentColor
  .content-sidebar-sub-headers &
    font-size 0.95em
    padding-top 0.25rem
    padding-bottom 0.25rem
    padding-left 0.7rem
    font-size 0.95em
    &.active
      font-weight 500

@media (max-width: $MQMobile)
  a.content-sidebar-link
    padding-left 2rem
  .content-sidebar
    .content-sidebar-sub-headers
      padding-left 1rem
      font-size 0.95em
      .content-sidebar-link
        padding-left 2rem
</style>
