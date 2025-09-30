import luminPdf from "../../lumin_pdf.app.mjs";

export default {
  name: "Download File as File URL",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "lumin_pdf-download-file-as-file-url",
  description: "Get a download URL for a file. [See the documentation](https://developers.luminpdf.com/api/download-file-as-file-url/)",
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
    const response = await this.luminPdf.downloadFileAsFileUrl({
      $,
      signatureRequestId: this.signatureRequestId,
    });

    $.export("$summary", `Successfully retrieved download URL for signature request with ID: ${this.signatureRequestId}`);
    return response;
  },
};
