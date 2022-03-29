import common from "../common-create.mjs";

export default {
  ...common,
  key: "hubspot-create-call",
  name: "Create Call",
  description: "Create a call in Hubspot",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "calls";
    },
  },
};
