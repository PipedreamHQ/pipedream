<template>
  <main class="page">
    <slot name="top" />

    <div class="deprecated-banner">
      ⚠️ This version of the docs is deprecated. Looking for the latest features and updates?
      Explore our <a href="https://pipedream.com/docs">latest documentation</a>.
    </div>

    <Content class="theme-default-content" />
    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>

</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

.deprecated-banner
  background-color: #ffee58;  /* Bright yellow background */
  color: #333;  /* Dark text color for contrast */
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #eaecef;
  font-weight: bold; /* Make text bold for emphasis */
  margin-top: 4rem;

.deprecated-banner a
  color: #0066cc;  /* A blue color for the link */
  text-decoration: underline;  /* Underline for clarity */

</style>
