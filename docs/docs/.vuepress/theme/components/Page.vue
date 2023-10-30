<template>
  <main class="page">
    <div class="page">
      <div class="deprecated-banner">
        ⚠️ This version of the docs is deprecated. Looking for the latest features and updates?
        <a href="https://pipedream.com/docs">Explore our latest documentation.</a>.
      </div>
      <Content/>
    </div>

    <slot name="top" />

    <Content class="theme-default-content" />
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>

</template>

<script>
import { Page } from '@theme/components/Page'
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav, Content: Page.components.Content },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

.deprecated-banner {
  background-color: #ffee58;  /* Bright yellow background */
  color: #333;  /* Dark text color for contrast */
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #eaecef;
  font-weight: bold; /* Make text bold for emphasis */
}

.deprecated-banner a {
  color: #0066cc;  /* A blue color for the link */
  text-decoration: underline;  /* Underline for clarity */
}

</style>
