import firma from "../../firma.app.mjs";

export default {
  key: "firma-download-signing-request",
  name: "Download Signing Request Document",
  description: "Retrieves a download URL for a signing request's signed document. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/download-signing-request-document)",
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
  },
  async run({ $ }) {
    const response = await this.firma.downloadSigningRequest({
      $,
      signingRequestId: this.signingRequestId,
    });
    $.export("$summary", `Successfully retrieved download URL for signing request "${this.signingRequestId}"`);
    return response;
  },
};
