<style lang="stylus">
.guide-container.native {
  border-top: solid #34d28b 1em;
}

.guide-container.nodejs {
  border-top: solid #4DA925 1em;
}

.guide-container.python {
  border-top: solid #F5BC00 1em;
}

.guide-container.bash {
  border-top: solid #000 1em;
}

.guide-container.go {
  border-top: solid #00ACD7 1em;
  text-decoration: none;
}

.guide-container:hover {
  text-decoration: none !important;
}

.guide-container.native h3 {
  color: #34d28b;
}

.guide-container.go h3 {
  color: #00ACD7;
}

.guide-container.bash h3 {
  color: #000;
}

.guide-container.python h3 {
  color: #F5BC00;
}

.guide-container.nodejs {
  color: #4DA925;
}
</style>

<template>
  <div>
    <a
      v-for="guide in guides"
      :key="guide.key"
      class="
        guide-container
        px-5
        py-3
        my-4
        rounded-md
        shadow-md
        hover:shadow-lg
        relative
        block
      "
      :class="guide.language"
      :href="guide.modifiedPath"
    >
      <div class="flex items-center">
        <img :src="guide.frontmatter.thumbnail" width="75" />
        <div class="flex flex-col mx-3">
          <h3 class="text-xl">
            {{ guide.title }}
          </h3>
          <span class="font-light text-gray-700">
            {{ guide.frontmatter.short_description }}
          </span>
        </div>
      </div>
      <span class="absolute bottom-0 right-0 mb-3 mr-1">
        <img :src="guide.language_thumbnail" width="50" />
      </span>
    </a>
  </div>
</template>

<script>
import orderBy from "lodash/orderBy";

export default {
  name: "GuideLink",
  data() {
    return { guides: [] };
  },
  mounted() {
    const notApplicablePages = [
      "/code/",
      "/code/nodejs/",
      "/code/python/",
      "/code/go/",
      "/code/bash/",
      "/guides/",
    ];

    const guides = this.$site.pages
      .filter((page) => {
        return (
          (page.regularPath.startsWith("/code/") ||
            page.regularPath.startsWith("/guides/")) &&
          !notApplicablePages.includes(page.regularPath)
        );
      })
      .map((guide) => {
        if (guide.regularPath.startsWith("/code/")) {
          guide.language = guide.path.match(/\/code\/(\w+)\/.*/)?.[1];
        } else {
          guide.language = "native";
        }

        guide.language_thumbnail =
          this.$site.themeConfig.icons[guide.language].only_icon;
        guide.modifiedPath = `/docs${guide.regularPath}`;
        return guide;
      });

    this.guides = orderBy(guides, ["language"], "desc");
  },
};
</script>

