import common from "../common/base-search.mjs";

export default {
  ...common,
  key: "klipy-search-clips",
  name: "Search Clips",
  description: "Search and retrieve clips from Klipy's database. [See the documentation](https://docs.klipy.com/clips-api/clips-search-api)",
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
    },
    customer_id: {
      propDefinition: [
        common.props.klipy,
        "customerId",
      ],
    },
  },
  methods: {
    getModel() {
      return "clips";
    },
  },
};
