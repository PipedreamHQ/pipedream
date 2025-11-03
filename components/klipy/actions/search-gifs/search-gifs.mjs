import common from "../common/base-search.mjs";

export default {
  ...common,
  key: "klipy-search-gifs",
  name: "Search GIFs",
  description: "Search and retrieve GIFs from Klipy's database. [See the documentation](https://docs.klipy.com/gifs-api/gifs-search-api)",
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
      description: "The search keyword for finding relevant GIFs.",
    },
    customer_id: {
      propDefinition: [
        common.props.klipy,
        "customerId",
      ],
      description: "A unique user identifier in your system for GIFs.",
    },
  },
  methods: {
    getModel() {
      return "gifs";
    },
  },
};
