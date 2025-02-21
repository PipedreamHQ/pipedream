import common from "../common/base-get-by-slug.mjs";

export default {
  ...common,
  key: "klipy-get-gifs-by-slug",
  name: "Get GIFs by Slug",
  description: "Identify user-viewed content and recommend tailored content to the same user. [See the documentation](https://docs.klipy.com/gifs-api/gifs-search-api)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    slug: {
      propDefinition: [
        common.props.klipy,
        "slug",
      ],
      description: "The slug of the GIF.",
    },
  },
  methods: {
    getModel() {
      return "gifs";
    },
  },
};
