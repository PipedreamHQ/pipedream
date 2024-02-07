import common from "../common-polling.mjs";

export default {
  ...common,
  key: "postmark-new-domain",
  name: "New Domain",
  description: "Emit new event when a new domain is created.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getFunction() {
      return this.postmark.listDomains;
    },
    getFieldList() {
      return "Domains";
    },
    getSummary(item) {
      return `New domain whit ID ${item.ID} was successfully created!`;
    },
  },
};
