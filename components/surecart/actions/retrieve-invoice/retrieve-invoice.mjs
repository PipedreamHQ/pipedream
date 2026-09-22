import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-invoice",
  name: "Retrieve Invoice",
  description: "Retrieve an invoice by ID. [See the documentation](https://developer.surecart.com/api-reference/invoices/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    invoiceId: {
      propDefinition: [
        surecart,
        "invoiceId",
      ],
    },
    refreshStatus: {
      type: "boolean",
      label: "Refresh Status",
      description: "Set to `true` to check the payment processor for the latest status changes before returning.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getInvoice({
      $,
      invoiceId: this.invoiceId,
      refreshStatus: this.refreshStatus,
    });
    $.export("$summary", `Successfully retrieved invoice ${this.invoiceId}`);
    return response;
  },
};
