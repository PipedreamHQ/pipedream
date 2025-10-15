import { ConfigurationError } from "@pipedream/platform";
import sevdesk from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-cancel-invoice",
  name: "Cancel Invoice",
  description: "Cancels an existing invoice in sevDesk. [See the documentation](https://api.sevdesk.de/#tag/Invoice/operation/cancelInvoice)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sevdesk,
    invoiceId: {
      propDefinition: [
        sevdesk,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.sevdesk.cancelInvoice({
        $,
        invoiceId: this.invoiceId,
      });
      $.export("$summary", `Successfully canceled invoice with ID ${this.invoiceId}`);
      return response;
    } catch ({ message }) {
      throw new ConfigurationError(JSON.parse(message).error.message);
    }
  },
};
