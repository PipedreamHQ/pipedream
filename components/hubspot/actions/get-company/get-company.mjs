import common from "../common-get.mjs";

export default {
  ...common,
  key: "hubspot-get-company",
  name: "Get Company",
  description: "Gets a company",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    objectId: {
      ...common.props.objectId,
      label: "Company ID",
      description: "Hubspot's internal ID for the company",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return "companies";
    },
  },
};
