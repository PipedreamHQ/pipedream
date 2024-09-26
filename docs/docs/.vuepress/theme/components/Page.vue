<template>
  <main class="page flex flex-col h-screen justify-between">
    <slot name="top" />

    <Content
      class="theme-default-content"
      :class="$frontmatter.content_class"
    />

    <section>
      <PageNav v-bind="{ sidebarItems }" />

      <PageEdit />
    </section>

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";

export default {
  components: { PageEdit, PageNav },
  props: ["sidebarItems"],
};
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page {
  padding-bottom: 2rem;
  // display: block;
}
</style>
