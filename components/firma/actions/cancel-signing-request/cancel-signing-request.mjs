import firma from "../../firma.app.mjs";

export default {
  key: "firma-cancel-signing-request",
  name: "Cancel Signing Request",
  description: "Cancels a sent signing request that is not finished, so its recipients can no longer sign. This cannot be undone. Firma answers 409 when the request is already cancelled, finished, declined or not sent. Use **List Signing Requests** with status `in_progress` to find requests that can be cancelled. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/cancel-a-signing-request)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
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
    reason: {
      type: "string",
      label: "Reason",
      description: "The cancellation reason, up to 500 characters, for example `Contract terms changed`.",
      optional: true,
    },
    notifySigners: {
      type: "boolean",
      label: "Notify Signers",
      description: "Whether Firma emails the recipients about the cancellation.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.firma.cancelSigningRequest({
      $,
      signingRequestId: this.signingRequestId,
      data: {
        reason: this.reason,
        notify_signers: this.notifySigners,
      },
    });
    $.export("$summary", `Cancelled signing request ${this.signingRequestId}`);
    return response;
  },
};
