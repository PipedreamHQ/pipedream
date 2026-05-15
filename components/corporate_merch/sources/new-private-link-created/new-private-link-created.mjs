import common from "../common/base-new-created-resources.mjs";

export default {
  ...common,
  key: "corporate_merch-new-private-link-created",
  name: "New Private Link Created",
  description: "Emit new event when a new private link is created. [See the documentation](https://corporatemerch.readme.io/reference/retrieve-a-list-of-private-links)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.corporateMerch.listPrivateLinks;
    },
    getSummary(privateLink) {
      return `New Private Link with ID: ${privateLink.id}`;
    },
  },
};
