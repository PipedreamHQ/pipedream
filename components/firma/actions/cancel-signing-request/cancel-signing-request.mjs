import firma from "../../firma.app.mjs";

export default {
  key: "firma-cancel-signing-request",
  name: "Cancel Signing Request",
  description: "Cancels a signing request that has been sent but not yet completed. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/cancel-signing-request)",
  version: "0.0.1",
  type: "action",
  props: {
    firma,
    signingRequestId: {
      propDefinition: [
        firma,
        "signingRequestId",
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Optional cancellation reason",
      optional: true,
    },
    notifySigners: {
      type: "boolean",
      label: "Notify Signers",
      description: "Whether to notify signers of the cancellation",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.reason) data.reason = this.reason;
    if (this.notifySigners !== undefined) data.notify_signers = this.notifySigners;
    const response = await this.firma.cancelSigningRequest({
      $,
      signingRequestId: this.signingRequestId,
      data,
    });
    $.export("$summary", `Successfully cancelled signing request "${this.signingRequestId}"`);
    return response;
  },
};
