import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-send-sales-invoice",
  name: "Send Sales Invoice",
  description: "Sends a sales invoice via email. [See the documentation](https://developer.altoviz.com/api#tag/SaleInvoices/operation/POST_SaleInvoices_Send)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    altoviz,
    invoiceId: {
      propDefinition: [
        altoviz,
        "invoiceId",
      ],
    },
    emails: {
      type: "string[]",
      label: "Email(s)",
      description: "Array of email addresses to send the invoice to",
    },
  },
  async run({ $ }) {
    const response = await this.altoviz.sendInvoice({
      $,
      invoiceId: this.invoiceId,
      data: this.emails,
    });
    $.export("$summary", `Invoice ${this.invoiceId} successfully sent`);
    return response;
  },
};
