import common from "../common/base-get-by-slug.mjs";

export default {
  ...common,
  key: "klipy-get-stickers-by-slug",
  name: "Get Stickers By Slug",
  description: "Identifies user-viewed content and recommends tailored content. [See the documentation](https://docs.klipy.com/stickers-api/stickers-search-api).",
  version: "0.0.1",
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
