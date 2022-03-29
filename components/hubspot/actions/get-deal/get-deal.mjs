import common from "../common-get.mjs";

export default {
  ...common,
  key: "hubspot-get-deal",
  name: "Get Deal",
  description: "Gets a deal",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    objectId: {
      ...common.props.objectId,
      label: "Deal ID",
      description: "Hubspot's internal ID for the deal",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return "deals";
    },
  },
};
