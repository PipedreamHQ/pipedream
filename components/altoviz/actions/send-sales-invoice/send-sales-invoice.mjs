import altoviz from "../../altoviz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "altoviz-send-sales-invoice",
  name: "Send Sales Invoice",
  description: "Sends a sales invoice via email. Requires 'invoiceId' prop to specify the invoice that needs to be sent and 'email' prop to define where to send the invoice.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    altoviz,
    invoiceId: {
      propDefinition: [
        altoviz,
        "invoiceId",
      ],
    },
    email: {
      propDefinition: [
        altoviz,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.altoviz.sendInvoice(this.invoiceId, this.email);
    $.export("$summary", `Invoice ${this.invoiceId} sent to ${this.email}`);
    return response;
  },
};
