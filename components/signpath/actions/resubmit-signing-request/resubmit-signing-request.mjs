import signpath from "../../signpath.app.mjs";

export default {
  key: "signpath-resubmit-signing-request",
  name: "Resubmit Signing Request",
  description: "Resubmit a signing request. [See the documentation](https://docs.signpath.io/build-system-integration#resubmit-a-signing-request)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    signpath,
    originalSigningRequestId: {
      type: "string",
      label: "Signing Request ID",
      description: "ID of the signing request which you want to resubmit",
    },
    signingPolicySlug: {
      propDefinition: [
        signpath,
        "signingPolicySlug",
      ],
    },
    description: {
      propDefinition: [
        signpath,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.signpath.resubmitSigningRequest({
      $,
      data: {
        originalSigningRequestId: this.originalSigningRequestId,
        signingPolicySlug: this.signingPolicySlug,
        description: this.description,
      },
    });
    $.export("$summary", `Resubmitted signing request for ID: ${this.originalSigningRequestId}`);
    return response;
  },
};
