import common from "../common/base-new-created-resources.mjs";

export default {
  ...common,
  key: "corporate_merch-new-private-link-created",
  name: "New Private Link Created",
  description: "Emit new event when a new private link is created. [See the documentation](https://corporatemerch.readme.io/reference/retrieve-a-list-of-private-links)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    redeemPageId: {
      type: "string",
      label: "Redeem Page ID",
      description: "The ID of the redeem page to list private links for (e.g., `rp_12345`). Use the **List Redeem Pages** action to find available redeem page IDs.",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.corporateMerch.listPrivateLinks;
    },
    getArgs() {
      return {
        redeemPageId: this.redeemPageId,
      };
    },
    getSummary(privateLink) {
      return `New Private Link with ID: ${privateLink.id}`;
    },
  },
};
