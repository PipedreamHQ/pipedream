import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-get-invoice",
  name: "Get Invoice",
  description: "Fetches detailed information about a specific invoice. [See the documentation](http://www.api.docs.paigo.tech/#tag/Invoices/operation/Get%20an%20Invoice%20by%20ID)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    paigo,
    customerId: {
      propDefinition: [
        paigo,
        "customerId",
      ],
      optional: true,
    },
    invoiceId: {
      propDefinition: [
        paigo,
        "invoiceId",
        (c) => ({
          customerId: c.customerId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.paigo.getInvoice({
      $,
      invoiceId: this.invoiceId,
    });
    $.export("$summary", `Successfully fetched details for invoice with ID: ${this.invoiceId}`);
    return response;
  },
};
