import common from "../common/base-get-by-slug.mjs";

export default {
  ...common,
  key: "klipy-get-clips-by-slug",
  name: "Get Clips by Slug",
  description: "Get a specific GIF idendified by its slug. [See the documentation](https://docs.klipy.com/clips-api/clips-search-api)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    slug: {
      propDefinition: [
        common.props.klipy,
        "slug",
      ],
    },
  },
  methods: {
    getModel() {
      return "clips";
    },
  },
};
