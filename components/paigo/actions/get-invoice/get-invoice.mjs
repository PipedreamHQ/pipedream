import paigo from "../../paigo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "paigo-get-invoice",
  name: "Get Invoice",
  description: "Fetches detailed information about a specific invoice. [See the documentation](http://www.api.docs.paigo.tech/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paigo,
    invoiceId: {
      propDefinition: [
        paigo,
        "invoiceId",
      ],
      description: "The unique identifier for the invoice whose details you want to fetch.",
    },
  },
  async run({ $ }) {
    const response = await this.paigo.getInvoiceDetails(this.invoiceId);
    $.export("$summary", `Successfully fetched details for invoice with ID: ${this.invoiceId}`);
    return response;
  },
};
