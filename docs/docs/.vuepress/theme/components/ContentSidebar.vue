<template>
  <div class="content-sidebar-wrapper">
    <div ref="sidebar" class="content-sidebar">
      <p class="content-sidebar-title">{{ title }}</p>
      <ul class="content-sidebar-links" v-if="items.length">
        <li v-for="(item, i) in items" :key="i">
          <ContentSidebarLink :item="item"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import ContentSidebarLink from '@theme/components/ContentSidebarLink.vue'
import { groupHeaders } from '@theme/util'

export default {
  components: { ContentSidebarLink },

  data: function () {
    return {
      currentAnchor: null
    }
  },

  mounted () {
    Vue.$vuepress.$on('contentAnchorChanged', this.onAnchorChanged)
  },

  beforeDestroy () {
    Vue.$vuepress.store.$off('contentAnchorChanged', this.onAnchorChanged)
  },

  computed: {
    title () {
      return this.$themeConfig.contentSidebarTitle || 'Contents'
    },

    items () {
      const headers = groupHeaders(this.$page.headers || [])
      return headers.map(header => {
        const currentAnchor = this.currentAnchor || { hash: this.$route.hash !== '' ? this.$route.hash : '#' + this.$page.headers[0].slug, path: this.$route.path }
        const selfActive = currentAnchor.hash === '#' + header.slug
        const active = selfActive || (header.children && header.children.some(c => currentAnchor.hash === '#' + c.slug))
        return {
          type: 'auto',
          title: header.title,
          basePath: this.$page.path,
          path: this.$page.path + '#' + header.slug,
          active: active,
          children: (header.children || []).map(child => {
            child.active = currentAnchor.hash === '#' + child.slug
            return child
          })
        }
      })
    }
  },

  methods: {
    onAnchorChanged (newAnchor) {
      this.currentAnchor = newAnchor
    }
  }
}
</script>

<style lang="stylus">
.content-sidebar
  font-size 0.82rem
  height "calc(100vh - %s)" % ($navbarHeight + 4rem)
  overflow-y auto

  ul
    padding 0
    margin 0
    list-style-type none
  >ul
    border-left 1px solid $borderColor

  .content-sidebar-title
    text-transform uppercase
    letter-spacing 1px
    font-size 0.6rem
    font-weight 800
    color $gray-dk
    padding-left 0.7rem
    margin 0.7rem 0 0 0
    border-left 1px solid $borderColor

  .content-sidebar-links
    padding 1rem 0

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
  .content-sidebar-wrapper
    padding 0
    .content-sidebar
      font-size 1rem
      height "calc(100vh - %s)" % $navbarHeight
</style>
