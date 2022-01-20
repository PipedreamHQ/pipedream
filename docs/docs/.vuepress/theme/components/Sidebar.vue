<template>
  <aside class="sidebar">
    <NavLinks/>

    <slot name="top"/>

    <SidebarLinks
      :depth="0"
      :items="preparedItems"
    />

    <slot name="bottom"/>
  </aside>
</template>

<script>
import Vue from 'vue'

import SidebarLinks from '@theme/components/SidebarLinks.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import { getHash, groupHeaders, hashRE, normalize } from '@theme/util'

export default {
  name: 'Sidebar',
  components: { SidebarLinks, NavLinks },
  data: function () {
    return {
      currentAnchor: null,
      sidebarItems: this.items
    }
  },
  props: ['items'],
  mounted () {
    Vue.$vuepress.$on('sidebarAnchorChanged', this.onAnchorChanged)
  },
  beforeDestroy () {
    Vue.$vuepress.store.$off('sidebarAnchorChanged', this.onAnchorChanged)
  },
  watch: {
    items (newItems) {
      this.sidebarItems = newItems
    }
  },
  computed: {
    preparedItems () {
      if (this.sidebarItems.length === 0) {
        return this.sidebarItems
      }

      let currentAnchor = this.currentAnchor
      if (!currentAnchor && this.$page.headers && this.$page.headers.length > 0) {
        currentAnchor = { hash: this.$route.hash !== '' ? this.$route.hash : '#' + this.$page.headers[0].slug, path: this.$route.path }
      } else if (!currentAnchor) {
        currentAnchor = { path: this.$route.path }
      }
      const preparedItems = this.sidebarItems.map(item => {
        markActiveItemRecursive(item, currentAnchor)
        return Object.assign({}, item)
      })

      return preparedItems
    }
  },
  methods: {
    onAnchorChanged (newAnchor) {
      this.currentAnchor = newAnchor
    }
  }
}

function markActiveItemRecursive (item, currentAnchor) {
  const selfActive = isActive(currentAnchor, item.path)
  let active = selfActive
  if (item.children) {
    let childActive = false
    for (const c of item.children) {
      if (!c.path && item.path) {
        c.path = item.path.replace(hashRE, '') + '#' + c.slug
      }
      if (markActiveItemRecursive(c, currentAnchor)) {
        childActive = true
      }
    }
    active = selfActive || childActive
  } else if (active && item.headers && !hashRE.test(item.path)) {
    let childActive = false
    const children = groupHeaders(item.headers)
    for (const c of children) {
      c.path = item.path + '#' + c.slug
      if (markActiveItemRecursive(c, currentAnchor)) {
        childActive = true
      }
    }
    Vue.set(item, 'children', children)
    active = selfActive || childActive
  }

  Vue.set(item, 'active', active)

  return active
}

function isActive (currentAnchor, path) {
  if (!path) {
    return false
  }
  const currentHash = currentAnchor.hash
  const linkHash = getHash(path)
  if (linkHash && currentHash !== linkHash) {
    return false
  }
  const currentPath = normalize(currentAnchor.path)
  const pagePath = normalize(path)
  return currentPath === pagePath
}
</script>

<style lang="stylus">
.sidebar
  ul
    padding 0
    margin 0
    list-style-type none
  a
    display inline-block
  .nav-links
    display none
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0
    a
      font-weight 600
    .nav-item, .repo-link
      display block
      line-height 1.25rem
      font-size 1.1em
      padding 0.5rem 0 0.5rem 1.5rem
  & > .sidebar-links
    padding 1.5rem 0
    & > li > a.sidebar-link
      font-size 1.1em
      line-height 1.7
      font-weight bold
    & > li:not(:first-child)
      margin-top .75rem

  &::-webkit-scrollbar
    width 6px

    &-track
      background $white

    &-thumb
      background $gray
      border-radius 3px

    &-thumb:hover
      background $gray-dk

@media (max-width: $MQMobile)
  .sidebar
    .nav-links
      display block
      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after
        top calc(1rem - 2px)
    & > .sidebar-links
      padding 1rem 0
</style>
