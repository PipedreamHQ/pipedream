import app from "../../sage_intacct.app.mjs";

export default {
  key: "sage_intacct-list-bills",
  name: "List Bills",
  description: "Returns up to 100 object references from the collection with a key, ID, and link for each bill. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/bills/tags/accounts_payable_bills/paths/list-accounts-payable-bill)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
    destructiveHint: false,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.listBills({
      $,
    });

    $.export("$summary", "Successfully listed bills");
    return response;
  },
};
