import _0codekit from "../../_0codekit.app.mjs";

export default {
  key: "_0codekit-compress-pdf",
  name: "Compress PDF",
  description: "Compresses a PDF using the specified URL. [See the documentation](https://documenter.getpostman.com/view/18297710/UVkntwBv#fdcb09dc-c316-4b80-b523-5a1f3afac1e6)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    _0codekit,
    pdfUrl: {
      type: "string",
      label: "PDF URL",
      description: "The URL of the PDF to be compressed",
    },
    fileName: {
      type: "string",
      label: "Filename",
      description: "File name of the compressed file",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this._0codekit.compressPdf({
      $,
      data: {
        url: this.pdfUrl,
        fileName: this.fileName,
        getAsUrl: true,
      },
    });
    $.export("$summary", `Successfully compressed PDF from URL ${this.pdfUrl}`);
    return response;
  },
};
