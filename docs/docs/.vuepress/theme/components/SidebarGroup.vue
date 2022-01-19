<template>
  <section
    class="sidebar-group"
    :class="[
      {
        collapsable,
        'is-sub-group': depth !== 0
      },
      `depth-${depth}`
    ]"
  >
    <RouterLink
      v-if="item.path"
      class="sidebar-heading clickable"
      :class="{
        open,
        'active': item.active
      }"
      :to="item.path"
      @click.native.self="toggleItem(item)"
    >
      <span>{{ item.title }}</span>
      <SidebarArrow
        v-if="collapsable"
        :class="open ? 'down' : 'right'"
        @toggle="$emit('toggle')"
      />
    </RouterLink>

    <p
      v-else
      class="sidebar-heading"
      :class="{ open }"
      @click.self="toggleItem(item)"
    >
      <span>{{ item.title }}</span>
      <SidebarArrow
        v-if="collapsable"
        :class="open ? 'down' : 'right'"
        @toggle="$emit('toggle')"
      />
    </p>

    <DropdownTransition>
      <SidebarLinks
        v-if="open || !collapsable"
        class="sidebar-group-items"
        :items="item.children"
        :sidebar-depth="item.sidebarDepth"
        :depth="depth + 1"
      />
    </DropdownTransition>
  </section>
</template>

<script>
import DropdownTransition from '@theme/components/DropdownTransition.vue'
import SidebarArrow from '@theme/components/SidebarArrow.vue'

export default {
  name: 'SidebarGroup',

  components: {
    DropdownTransition,
    SidebarArrow
  },

  props: [
    'item',
    'open',
    'collapsable',
    'depth'
  ],

  // ref: https://vuejs.org/v2/guide/components-edge-cases.html#Circular-References-Between-Components
  beforeCreate () {
    this.$options.components.SidebarLinks = require('@theme/components/SidebarLinks.vue').default
  },

  methods: {
    toggleItem (item) {
      if (item.type === 'group' && item.path) {
        this.$emit('open')
        return
      }

      this.$emit('toggle')
    }
  }
}
</script>

<style lang="stylus">
.sidebar-group
  .sidebar-group
    padding-left 0.5em
  &:not(.collapsable)
    .sidebar-heading:not(.clickable)
      cursor auto
      color inherit
  // refine styles of nested sidebar groups
  &.is-sub-group
    padding-left 0
    & > .sidebar-heading
      font-size 1em
      line-height 1.4
      font-weight normal
      padding 0.35rem 1rem 0.35rem 2rem
      margin 0
      & > .sidebar-arrow
        top 0.5rem
        width 0.8rem
        height 0.8rem
    & > .sidebar-group-items
      padding-left 1rem
      & > li > .sidebar-link
        font-size: 0.95em;
        border-left none
  &.depth-0
    & > .sidebar-links
      .active
        border-left-color transparent
  &.depth-1
    &.is-sub-group
      & > .sidebar-heading
        border-left-color transparent
  &.depth-2
    & > .sidebar-heading
      border-left-color transparent
    &.is-sub-group
      & > .sidebar-heading
        border-left 0

.sidebar-heading
  color $textColor
  transition color .15s ease
  cursor pointer
  font-size 1.1em
  font-weight bold
  // text-transform uppercase
  padding 0 1.5rem 0 1.25rem
  width 100%
  box-sizing border-box
  margin 0 0 0.5rem 0
  border-left 0.25rem solid transparent
  position relative
  &.clickable
    &.active
      font-weight 600
      color $accentColor
      border-left-color $accentColor
    &:hover
      color $accentColor
  .sidebar-arrow
    top 0.4rem

.sidebar-group-items
  transition height .1s ease-out
  font-size 0.95em
  overflow hidden
</style>
