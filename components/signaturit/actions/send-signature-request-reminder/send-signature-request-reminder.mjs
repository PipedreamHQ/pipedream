import signaturit from "../../signaturit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "signaturit-send-signature-request-reminder",
  name: "Send Signature Request Reminder",
  description: "Sends a reminder for a pending signature request. [See the documentation](https://docs.signaturit.com/api/latest)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    signaturit: {
      type: "app",
      app: "signaturit",
    },
    signatureRequestId: {
      propDefinition: [
        signaturit,
        "signatureRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.signaturit.sendReminder();
    $.export("$summary", `Sent reminder for signature request ${this.signatureRequestId}`);
    return response;
  },
};
