import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-customer-invoices",
  name: "Get Customer Invoices",
  description: "Retrieves all customer invoices. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    modifiedSinceUtc: {
      type: "string",
      label: "Modified Since (UTC)",
      description: "Get the invoices which have been modified since this date. Format: yyyy-MM-ddTHH:mm:ss",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getCustomerInvoices({
      $,
      params: {
        modifiedSinceUtc: this.modifiedSinceUtc,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} customer invoices`);
    return response;
  },
};
