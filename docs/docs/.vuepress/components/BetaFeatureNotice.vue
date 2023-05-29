<style lang="stylus"></style>

<template>
  <div class="custom-block tip">
    <p class="custom-block-title">BETA FEATURE</p>
    <p v-if="this.feature">
      This feature is in <strong>Beta</strong> and isn't available by default.
    </p>
    <p v-if="this.feature">
      To enable this feature, open your 
      <a href="https://pipedream.com/user/alpha" target="_blank">Experimental Features settings</a> and
      check the box next to
      <strong
        ><code>{{ this.feature }}</code></strong
      >
      .
    </p>
    <p v-else>
      This feature is <strong>experimental</strong> and is subject to change. 
    </p>
  </div>
</template>

<script>
export default {
  name: "BetaFeatureNotice",
  props: {
    feature: String,
  },
};
</script>
