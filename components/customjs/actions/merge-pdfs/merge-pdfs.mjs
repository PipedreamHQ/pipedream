import customjs from "../../customjs.app.mjs";
import fs from "fs";
import { normalizeFilepath } from "../common/utils.mjs";

export default {
  key: "customjs-merge-pdfs",
  name: "Merge PDFs",
  description: "Merges multiple PDF documents into one. [See the documentation](https://www.customjs.space/api/docs#_2-merge-pdfs)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    customjs,
    pdfs: {
      type: "string[]",
      label: "PDFs",
      description: "The array of URLs to the PDF documents to merge",
    },
    filename: {
      propDefinition: [
        customjs,
        "filename",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const pdfs = typeof this.pdfs === "string"
      ? JSON.parse(this.pdfs)
      : this.pdfs;

    const fileContent = await this.customjs.mergePdfs({
      $,
      data: {
        input: pdfs,
        code: "const { PDF_MERGE } = require(\"./utils\"); const axios = require(\"axios\"); const pdfBuffers = await Promise.all(input.map(async file => { const res = await axios.get(file, { responseType: \"arraybuffer\" }); return Buffer.from(res.data).toString(\"base64\"); })); return PDF_MERGE(pdfBuffers);",
        returnBinary: "true",
      },
    });

    const filepath = normalizeFilepath(this.filename);
    fs.writeFileSync(filepath, Buffer.from(fileContent));

    $.export("$summary", "Successfully merged PDFs");
    return {
      filename: this.filename,
      filepath,
    };
  },
};
