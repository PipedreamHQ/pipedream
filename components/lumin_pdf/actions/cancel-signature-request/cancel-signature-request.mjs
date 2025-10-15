import luminPdf from "../../lumin_pdf.app.mjs";

export default {
  key: "lumin_pdf-cancel-signature-request",
  name: "Cancel Signature Request",
  description: "Cancel a signature request. [See the documentation](https://developers.luminpdf.com/api/cancel-signature-request/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    luminPdf,
    alert: {
      type: "alert",
      alertType: "info",
      content: "This action only works for signature requests that were created via API.",
    },
    signatureRequestId: {
      propDefinition: [
        luminPdf,
        "signatureRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.luminPdf.cancelSignatureRequest({
      $,
      signatureRequestId: this.signatureRequestId,
    });

    $.export("$summary", `Successfully cancelled signature request with ID: ${this.signatureRequestId}`);
    return response;
  },
};
