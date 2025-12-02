import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-get-supplier-invoice",
  name: "Get Supplier Invoice",
  description: "Retrieve a supplier invoice. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_SupplierInvoices/operation/get_39)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    supplierInvoiceNumber: {
      propDefinition: [
        app,
        "supplierInvoiceNumber",
      ],
    },
  },
  async run({ $ }) {
    const { SupplierInvoice } = await this.app.getSupplierInvoice({
      $,
      supplierInvoiceNumber: this.supplierInvoiceNumber,
    });

    $.export("$summary", `Successfully retrieved supplier invoice with number ${this.supplierInvoiceNumber}`);
    return SupplierInvoice;
  },
};
