import sevdesk from "../../sevdesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sevdesk-cancel-invoice",
  name: "Cancel Invoice",
  description: "Cancels an existing invoice in sevDesk. [See the documentation](https://api.sevdesk.de/)",
  version: "0.0.1",
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
    const response = await this.sevdesk.cancelInvoice({
      invoiceId: this.invoiceId,
    });
    $.export("$summary", `Successfully canceled invoice with ID ${this.invoiceId}`);
    return response;
  },
};
