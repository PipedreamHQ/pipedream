import app from "../../sage_intacct.app.mjs";

export default {
  key: "sage_intacct-delete-vendor",
  name: "Delete Vendor",
  description: "Deletes a vendor. You can only delete vendors that aren't tied to any transactions or payments. [See the documentation](https://developer.sage.com/intacct/apis/intacct/1/intacct-openapi/groups/accounts-payable/groups/vendors/tags/accounts_payable_vendors/paths/delete-accounts-payable-vendor-key)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    openWorldHint: true,
    destructiveHint: true,
  },
  props: {
    app,
    vendorKey: {
      propDefinition: [
        app,
        "vendorKey",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      vendorKey,
    } = this;

    await app.deleteVendor({
      $,
      vendorKey,
    });

    $.export("$summary", "Successfully deleted vendor");
    return {
      success: true,
    };
  },
};
