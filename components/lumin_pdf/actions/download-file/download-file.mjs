import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import luminPdf from "../../lumin_pdf.app.mjs";

export default {
  name: "Download File",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "lumin_pdf-download-file",
  description: "Download a file directly. [See the documentation](https://developers.luminpdf.com/api/download-file/)",
  type: "action",
  props: {
    luminPdf,
    signatureRequestId: {
      propDefinition: [
        luminPdf,
        "signatureRequestId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file you'd like to download eg. `/tmp/file.pdf`",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.luminPdf.downloadFile({
      $,
      signatureRequestId: this.signatureRequestId,
      responseType: "stream",
    });

    const pipeline = promisify(stream.pipeline);
    await pipeline(response, fs.createWriteStream(this.filePath));

    $.export("$summary", `Successfully downloaded file for signature request with ID: ${this.signatureRequestId}`);
    return {
      filePath: this.filePath,
    };
  },
};
