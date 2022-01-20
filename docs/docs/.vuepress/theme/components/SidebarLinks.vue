<template>
  <ul
    class="sidebar-links"
    v-if="items.length"
  >
    <li v-for="(item, i) in items" :key="i">
      <SidebarGroup
        v-if="item.type === 'group'"
        :item="item"
        :open="openGroups[i]"
        :collapsable="item.collapsable || item.collapsible"
        :depth="depth"
        @toggle="toggleGroup(i)"
        @open="openGroup(i)"
      />
      <SidebarLink
        v-else
        :sidebarDepth="sidebarDepth"
        :item="item"
      />
    </li>
  </ul>
</template>

<script>
import SidebarGroup from './SidebarGroup.vue'
import SidebarLink from './SidebarLink.vue'

export default {
  name: 'SidebarLinks',

  components: { SidebarGroup, SidebarLink },

  props: [
    'items',
    'depth',  // depth of current sidebar links
    'sidebarDepth' // depth of headers to be extracted
  ],

  data () {
    return {
      openGroups: []
    }
  },

  created () {
    this.refreshIndex()
  },

  methods: {
    refreshIndex () {
      this.openGroups = resolveOpenGroups(this.items)
    },

    toggleGroup (index) {
      this.$set(this.openGroups, index, !this.openGroups[index])
    },

    openGroup (index) {
      this.$set(this.openGroups, index, true)
    }
  }
}

function resolveOpenGroups (items) {
  const openGroups = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    openGroups[i] = item.active
  }
  return openGroups
}
</script>
