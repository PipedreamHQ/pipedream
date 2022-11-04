<style lang="stylus"></style>

<template>
  <div class="custom-block tip">
    <p class="custom-block-title">ALPHA FEATURE</p>
    <p>
      This feature is in <strong>alpha</strong> and is subject to change.
    </p>
  </div>
</template>

<script>
export default {
  name: "AlphaFeatureNotice",
  props: {
    feature: String,
  },
};
</script>
