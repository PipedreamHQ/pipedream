import common from "../common/base-search.mjs";

export default {
  ...common,
  key: "klipy-search-stickers",
  name: "Search Stickers",
  description: "Search and retrieve stickers from Klipy's database. [See the documentation](https://docs.klipy.com/stickers-api/stickers-search-api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    q: {
      propDefinition: [
        common.props.klipy,
        "q",
      ],
      description: "The search keyword for finding relevant stickers.",
    },
    customer_id: {
      propDefinition: [
        common.props.klipy,
        "customerId",
      ],
      description: "A unique user identifier in your system for stickers.",
    },
  },
  methods: {
    getModel() {
      return "stickers";
    },
  },
};
