import firma from "../../firma.app.mjs";

export default {
  key: "firma-download-signing-request",
  name: "Download Signed Document",
  description: "Gets a temporary download URL for the document of a sent signing request. The result is JSON with `download_url` (a pre-signed URL valid until `expires_at`), `status` and `is_partial`; it is not the PDF itself. A finished request returns the signed PDF with its completion certificate; any other sent request returns a snapshot of the signatures so far (`is_partial: true`). Right after a request finishes Firma may answer 409 while the certificate is generated, or 503 while a snapshot is generated: retry after a short wait. Use **Get Signing Request** to check the status first. [See the documentation](https://docs.firma.dev/api-reference/signing-requests/download-signing-request)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    $.export("$summary", `Retrieved the ${response.is_partial
      ? "partial"
      : "signed"} document URL for signing request ${this.signingRequestId}`);
    return response;
  },
};
