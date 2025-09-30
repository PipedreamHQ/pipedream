import common from "../common/base-get-by-slug.mjs";

export default {
  ...common,
  key: "klipy-get-gif-by-slug",
  name: "Get GIF by Slug",
  description: "Get a specific GIF idendified by its slug. [See the documentation](https://docs.klipy.com/gifs-api/gifs-search-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
