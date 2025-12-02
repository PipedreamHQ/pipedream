import app from "../../sage_intacct.app.mjs";

export default {
  key: "sage_intacct-list-vendors",
  name: "List Vendors",
  description: "Returns a collection with a key, ID, and link for each vendor. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/vendors/tags/accounts_payable_vendors/paths/list-accounts-payable-vendor)",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.listVendors({
      $,
    });

    $.export("$summary", "Successfully listed vendors");
    return response;
  },
};
