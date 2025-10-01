import signaturit from "../../signaturit.app.mjs";

export default {
  key: "signaturit-send-signature-request-reminder",
  name: "Send Signature Request Reminder",
  description: "Sends a reminder for a pending signature request. [See the documentation](https://docs.signaturit.com/api/latest#signatures_send_reminder)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    signaturit,
    signatureRequestId: {
      propDefinition: [
        signaturit,
        "signatureRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.signaturit.sendReminder({
      $,
      signatureRequestId: this.signatureRequestId,
    });
    $.export("$summary", `Sent reminder for signature request ${this.signatureRequestId}`);
    return response;
  },
};
