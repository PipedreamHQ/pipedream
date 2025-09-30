import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-send-invoice",
  name: "Send Invoice",
  description: "Sends an invoice by email. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#send-an-invoice)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    invoiceId: {
      propDefinition: [
        quickbooks,
        "invoiceId",
      ],
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "Email address to send the invoice to",
    },
  },
  async run({ $ }) {
    const params = {};

    if (this.email) {
      params.sendTo = this.email;
    }

    const response = await this.quickbooks.sendInvoice({
      $,
      invoiceId: this.invoiceId,
      params,
    });

    if (response) {
      $.export("$summary", `Successfully sent invoice with ID ${this.invoiceId}`);
    }

    return response;
  },
};
