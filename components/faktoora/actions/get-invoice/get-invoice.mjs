import faktoora from "../../faktoora.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "faktoora-get-invoice",
  name: "Get Invoice",
  description: "Fetches an invoice using the unique invoice ID. [See the documentation](https://api.faktoora.com/api/v1/api-docs/static/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    faktoora,
    invoiceId: {
      propDefinition: [
        faktoora,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.faktoora.fetchInvoice({
      invoiceId: this.invoiceId,
    });
    $.export("$summary", `Successfully fetched invoice with ID ${this.invoiceId}`);
    return response;
  },
};
