<style lang="stylus">
iframe {
  margin: auto;
}
</style>

<template>
  <iframe
    width="660"
    height="371"
    :src="url"
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
  },
};
</script>
