<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
      @toggle-content-sidebar="toggleContentSidebar"
    />

    <div
      class="sidebar-mask"
      @click="toggleSidebar(false)"
    ></div>

    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
    >
      <slot
        name="sidebar-top"
        slot="top"
      />
      <slot
        name="sidebar-bottom"
        slot="bottom"
      />
    </Sidebar>

    <Home v-if="$page.frontmatter.home"/>

    <Page
      v-else
      :sidebar-items="sidebarItems"
    >
      <slot
        name="page-top"
        slot="top"
      />
      <slot
        name="page-bottom"
        slot="bottom"
      />
    </Page>

    <ContentSidebar v-if="$page.frontmatter.contentSidebar"/>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
import Vue from 'vue'

import ContentSidebar from '@theme/components/ContentSidebar.vue'
import Home from '@theme/components/Home.vue'
import Page from '@theme/components/Page.vue'
import Navbar from '@theme/components/Navbar.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import { resolveSidebarItems, calculateCurrentAnchor } from '../util'

export default {
  components: { ContentSidebar, Home, Page, Sidebar, Navbar },

  data () {
    return {
      isSidebarOpen: false,
      isContentSidebarOpen: false
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false ||
        themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath,
        this.$versions
      )
    },

    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    }
  },

  watch: {
    '$page': function () {
      this.$sidebarLinks = null
      this.$contentLinks = null
      this.anchors = {}
      Vue.$vuepress.$emit('sidebarAnchorChanged', null)
      Vue.$vuepress.$emit('contentAnchorChanged', null)
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)

    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })

    this.anchors = {}
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
    },

    toggleContentSidebar (to) {
      this.isContentSidebarOpen = typeof to === 'boolean' ? to : !this.isContentSidebarOpen
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },

    onScroll: throttle(function () {
      if (!this.$sidebarLinks) {
        this.$sidebarLinks = [].slice.call(document.querySelectorAll('.sidebar-link'))
      }
      if (!this.$contentLinks) {
        this.$contentLinks = [].slice.call(document.querySelectorAll('.content-sidebar-link'))
      }

      this.checkForChangedAnchor('sidebar')
      this.checkForChangedAnchor('content')
    }, 300),

    checkForChangedAnchor (type) {
      const currentAnchor = calculateCurrentAnchor(this[`$${type}Links`])
      if (!currentAnchor) {
        return
      }
      const lastAnchor = this.anchors[type]
      if (!lastAnchor || lastAnchor.hash !== currentAnchor.hash) {
        const anchor = {
          hash: currentAnchor.hash,
          path: this.$route.path
        }
        this.anchors[type] = anchor
        Vue.$vuepress.$emit(`${type}AnchorChanged`, anchor)
      }
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../styles/theme.styl" lang="stylus"></style>
