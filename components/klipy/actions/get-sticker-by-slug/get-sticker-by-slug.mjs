import common from "../common/base-get-by-slug.mjs";

export default {
  ...common,
  key: "klipy-get-sticker-by-slug",
  name: "Get Sticker By Slug",
  description: "Get a specific Sticker idendified by its slug. [See the documentation](https://docs.klipy.com/stickers-api/stickers-search-api).",
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
      description: "The slug of the sticker.",
    },
  },
  methods: {
    getModel() {
      return "stickers";
    },
  },
};
