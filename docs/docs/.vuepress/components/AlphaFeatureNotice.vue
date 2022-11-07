<style lang="stylus"></style>

<template>
  <div class="custom-block tip">
    <p class="custom-block-title">ALPHA FEATURE</p>
    <p v-if="this.feature">
      This feature is in <strong>alpha</strong> and isn't available by default.
    </p>
    <p v-if="this.feature">
      To enable this feature, open your accounts
      <a href="https://pipedream.com/alpha">Alpha Features settings</a> and
      enable the
      <strong
        ><code>{{ this.feature }}</code></strong
      >
      setting.
    </p>
    <p v-else>
      This feature is <strong>experimental</strong> and is subject to change. 
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
