import common from "../common/base-get-by-slug.mjs";

export default {
  ...common,
  key: "klipy-get-clip-by-slug",
  name: "Get Clip by Slug",
  description: "Get a specific Clip idendified by its slug. [See the documentation](https://docs.klipy.com/clips-api/clips-search-api)",
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
    },
  },
  methods: {
    getModel() {
      return "clips";
    },
  },
};
