<style lang="stylus">
iframe {
  margin: auto;
}
</style>

<template>
  <iframe
    width="660"
    height="371"
    :src="embedUrl"
    :title="title"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    url: String,
    title: String,
    startAt: String,
  },
  computed: {
    embedUrl() {
      return `${this.url}${this.startAt ? `?start=${this.startAt}` : ""}`;
    },
  },
};
</script>
