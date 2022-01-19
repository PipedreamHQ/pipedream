<template>
  <component
    :is="`h${level}`"
  >
    <a
      v-if="href"
      :href="href"
      class="header-anchor"
      @click="onClick"
    >
      #
    </a>

    <slot />
  </component>
</template>

<script>
export default {
  props: {
    href: String,
    level: String
  },

  methods: {
    onClick (e) {
      e.preventDefault()

      const hash = this.href

      if (this.hash === hash) return

      this.$router.push({ hash })
    }
  }
}
</script>

<style lang="stylus">
h1, h2, h3, h4, h5, h6
  > .header-anchor
    font-size 0.85em
    float left
    margin-left -0.87em
    padding-right 0.23em
    margin-top 0.125em
    opacity 0

    &:hover
      text-decoration none

    &:not(:hover):not(:focus)
      opacity: 0

  .content:not(.custom) > &
    &:hover .header-anchor
      opacity: 1
</style>
