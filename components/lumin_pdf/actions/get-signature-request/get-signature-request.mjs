import luminPdf from "../../lumin_pdf.app.mjs";

export default {
  key: "lumin_pdf-get-signature-request",
  name: "Get Signature Request",
  description: "Get details of a specific signature request. [See the documentation](https://developers.luminpdf.com/api/get-signature-request/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    luminPdf,
    signatureRequestId: {
      propDefinition: [
        luminPdf,
        "signatureRequestId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.luminPdf.getSignatureRequest({
      $,
      signatureRequestId: this.signatureRequestId,
    });

    $.export("$summary", `Successfully retrieved signature request with ID: ${this.signatureRequestId}`);
    return response;
  },
};
