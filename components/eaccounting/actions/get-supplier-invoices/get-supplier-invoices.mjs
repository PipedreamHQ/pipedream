import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-supplier-invoices",
  name: "Get Supplier Invoices",
  description: "Retrieves all supplier invoices. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getSupplierInvoices({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} supplier invoices`);
    return response;
  },
};
