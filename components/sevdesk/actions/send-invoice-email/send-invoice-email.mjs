import sevdesk from "../../sevdesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sevdesk-send-invoice-email",
  name: "Send Invoice Email",
  description: "Sends an invoice via email. [See the documentation](https://api.sevdesk.de/)",
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
    emailAddress: {
      propDefinition: [
        sevdesk,
        "emailAddress",
      ],
    },
    customMessage: {
      propDefinition: [
        sevdesk,
        "customMessage",
        (configuredProps) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sevdesk.sendInvoice({
      invoiceId: this.invoiceId,
      emailAddress: this.emailAddress,
      customMessage: this.customMessage,
    });

    $.export("$summary", `Successfully sent invoice ${this.invoiceId} via email to ${this.emailAddress}`);
    return response;
  },
};
