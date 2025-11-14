import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-send-invoice",
  name: "Send Invoice",
  description: "Sends an invoice in the Fortnox API. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_Invoices/operation/eInvoice).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    fortnox,
    invoiceNumber: {
      propDefinition: [
        fortnox,
        "invoiceNumber",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of invoice to send",
      options: [
        "einvoice",
        "email",
        "eprint",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fortnox.sendInvoice({
      $,
      invoiceNumber: this.invoiceNumber,
      type: this.type,
    });
    $.export("$summary", `Successfully sent invoice with ID \`${response.Invoice.DocumentNumber}\``);
    return response;
  },
};
