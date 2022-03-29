import common from "../common-create.mjs";

export default {
  ...common,
  key: "hubspot-create-company",
  name: "Create Company",
  description: "Create a company in Hubspot",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "companies";
    },
  },
};
