
   
<template>
  <component :is="layout" />
</template>

<script>
import Vue from "vue";
import { setGlobalInfo } from "@app/util";
export default {
  name: "GlobalLayout",
  computed: {
    layout() {
      const layout = this.getLayout();
      setGlobalInfo("layout", layout);
      return Vue.component(layout);
    },
  },

  beforeMount() {
    // Add/update the canonical URL on initial load
    this.updateCanonicalUrl();
  },

  mounted() {
    // Update the canonical URL after navigation
    this.$router.afterEach((to, from) => {
      this.updateCanonicalUrl();
    });
  },

  methods: {
    getLayout() {
      if (this.$page.path) {
        const layout = this.$page.frontmatter.layout;
        if (
          layout &&
          (this.$vuepress.getLayoutAsyncComponent(layout) ||
            this.$vuepress.getVueComponent(layout))
        ) {
          return layout;
        }
        return "Layout";
      }
      return "NotFound";
    },
    updateCanonicalUrl() {
      let canonicalUrl = document.getElementById("canonicalUrlLink");
      // If the element already exists, update the value
      if (canonicalUrl) {
        canonicalUrl.href = this.$page.canonicalUrl;
      }
      // Otherwise, create the element and set the value
      else {
        canonicalUrl = document.createElement("link");
        canonicalUrl.id = "canonicalUrlLink"; // Ensure no other elements on your site use this ID. Customize as needed.
        canonicalUrl.rel = "canonical";
        canonicalUrl.href = this.$page.canonicalUrl;
        document.head.appendChild(canonicalUrl);
      }
    },
  },
};
</script>
