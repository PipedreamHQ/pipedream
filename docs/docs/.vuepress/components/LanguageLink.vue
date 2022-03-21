<template>
  <div class="flex justify-center items-center">
    <a :href="link">
      <img :alt="name" :src="icon" width="100" />
    </a>
  </div>
</template>
<script>
export default {
  props: {
    icon: String,
    name: String,
    link: String,
  },
  name: "LanguageLink",
};
</script>
