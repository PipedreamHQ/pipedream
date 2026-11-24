import firma from "../../firma.app.mjs";

export default {
  key: "firma-resend-signing-request",
  name: "Resend Signing Request",
  description: "Sends the signing email of an in-progress signing request again to the chosen recipients, optionally with a custom message. Use **List Signing Requests** to find the request and its recipient IDs. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/resend-signing-request-to-specific-recipients)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    firma,
    signingRequestId: {
      propDefinition: [
        firma,
        "signingRequestId",
      ],
    },
    recipientIds: {
      propDefinition: [
        firma,
        "recipientIds",
        (c) => ({
          signingRequestId: c.signingRequestId,
        }),
      ],
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "A message added to the email, up to 1000 characters, for example `Friendly reminder to sign the contract`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const recipientIds = typeof this.recipientIds === "string"
      ? JSON.parse(this.recipientIds)
      : this.recipientIds;
    const response = await this.firma.resendSigningRequest({
      $,
      signingRequestId: this.signingRequestId,
      data: {
        recipient_ids: recipientIds,
        custom_message: this.customMessage,
      },
    });
    $.export("$summary", `Resent signing request ${this.signingRequestId} to ${response.recipients_notified ?? recipientIds.length} recipient(s)`);
    return response;
  },
};
