import fileforge from "../../fileforge.app.mjs";
import { axios } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";

const pipeline = promisify(stream.pipeline);

export default {
  key: "fileforge-generate-pdf",
  name: "Generate PDF",
  description: "Generate a PDF from provided HTML. [See the documentation](https://docs.fileforge.com/api-reference/api-reference/pdf/generate)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fileforge,
    files: {
      propDefinition: [
        fileforge,
        "files",
      ],
    },
    test: {
      propDefinition: [
        fileforge,
        "test",
      ],
    },
    host: {
      propDefinition: [
        fileforge,
        "host",
      ],
    },
    expiresat: {
      propDefinition: [
        fileforge,
        "expiresat",
      ],
    },
    filename: {
      propDefinition: [
        fileforge,
        "filename",
      ],
    },
    allowviewing: {
      propDefinition: [
        fileforge,
        "allowviewing",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fileforge.generatePDF({
      files: this.files,
      test: this.test,
      host: this.host,
      expiresat: this.expiresat,
      filename: this.filename,
      allowviewing: this.allowviewing,
    });

    const pdfPath = "/tmp/generated.pdf";
    const pdfStream = await axios($, {
      method: "GET",
      url: response.url,
      responseType: "stream",
    });

    await pipeline(pdfStream, fs.createWriteStream(pdfPath));

    $.export("$summary", `Successfully generated PDF at ${pdfPath}`);
    return {
      pdfPath,
    };
  },
};
