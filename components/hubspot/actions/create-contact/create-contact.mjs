import common from "../common-create.mjs";

export default {
  ...common,
  key: "hubspot-create-contact",
  name: "Create Contact",
  description: "Create a contact in Hubspot",
  version: "0.0.1",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "contacts";
    },
  },
};
