import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-send-invoice",
  name: "Send Invoice",
  description: "Sends an invoice by email. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#send-an-invoice)",
  version: "0.0.1",
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
      description: "Email address to send the invoice to (optional - if not provided, uses the customer's email address)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    
    if (this.email) {
      data.email = this.email;
    }

    const response = await this.quickbooks.sendInvoice({
      $,
      invoiceId: this.invoiceId,
      data,
    });

    if (response) {
      $.export("summary", `Successfully sent invoice with ID ${this.invoiceId}`);
    }

    return response;
  },
}; 