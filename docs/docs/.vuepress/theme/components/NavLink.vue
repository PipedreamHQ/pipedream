<template>
  <RouterLink
    v-if="isInternal"
    class="nav-link font-medium leading-6"
    :class="item.variant"
    :to="link"
    :exact="exact"
    @focusout.native="focusoutAction"
  >
    {{ item.text }}
    <span v-if="item.badge" class="badge" :class="item.badgeVariation">{{
      item.badge
    }}</span>
  </RouterLink>
  <a
    v-else
    :href="link"
    class="nav-link font-medium external leading-6"
    :class="item.variant"
    :target="target"
    :rel="rel"
    @focusout="focusoutAction"
  >
    {{ item.text }}
    <span v-if="item.badge" class="badge" :class="item.badgeVariation">{{
      item.badge
    }}</span>
    <OutboundLink v-if="isBlankTarget && !item.internal" />
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from "../util";

export default {
  name: "NavLink",

  props: {
    item: {
      required: true,
    },
  },

  computed: {
    link() {
      return ensureExt(this.item.link);
    },

    exact() {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(
          (rootLink) => rootLink === this.link
        );
      }
      return this.link === "/";
    },

    isNonHttpURI() {
      return isMailto(this.link) || isTel(this.link);
    },

    isBlankTarget() {
      return this.target === "_blank";
    },

    isInternal() {
      return !isExternal(this.link) && !this.isBlankTarget;
    },

    target() {
      if (this.isNonHttpURI) {
        return null;
      }
      if (this.item.target) {
        return this.item.target;
      }
      return isExternal(this.link) ? "_blank" : "";
    },

    rel() {
      if (this.isNonHttpURI) {
        return null;
      }
      if (this.item.rel === false) {
        return null;
      }
      if (this.item.rel) {
        return this.item.rel;
      }
      return this.isBlankTarget ? "noopener noreferrer" : null;
    },
  },

  methods: {
    focusoutAction() {
      this.$emit("focusout");
    },
  },
};
</script>
