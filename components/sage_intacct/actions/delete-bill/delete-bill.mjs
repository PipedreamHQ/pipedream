import app from "../../sage_intacct.app.mjs";

export default {
  key: "sage_intacct-delete-bill",
  name: "Delete Bill",
  description: "Deletes a bill. You can only delete unpaid bills that are in a Posted, Draft, or Declined state. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/bills/tags/accounts_payable_bills/paths/delete-accounts-payable-bill-key)",
  version: "0.0.1",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  type: "action",
  props: {
    app,
    billKey: {
      propDefinition: [
        app,
        "billKey",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      billKey,
    } = this;

    await app.deleteBill({
      $,
      billKey,
    });

    $.export("$summary", "Successfully deleted bill");
    return {
      success: true,
    };
  },
};
