import pdf4me from "../../pdf4me.app.mjs";
import utils from "../../common/utils.mjs";
import fs from "fs";

export default {
  key: "pdf4me-convert-to-pdf",
  name: "Convert to PDF",
  description: "Convert a document (e.g., DOCX, XLSX, PPTX) to PDF. [See the documentation](https://dev.pdf4me.com/apiv2/documentation/actions/convert-to-pdf/)",
  version: "0.0.1",
  type: "action",
  props: {
    pdf4me,
    filePath: {
      propDefinition: [
        pdf4me,
        "filePath",
      ],
      description: "The path to a DOCX, XLSX, or PPTX file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    filename: {
      propDefinition: [
        pdf4me,
        "filename",
      ],
    },
  },
  async run({ $ }) {
    const filePath = utils.normalizeFilePath(this.filePath);
    const fileContent = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const response = await this.pdf4me.convertToPdf({
      $,
      data: {
        docContent: fileContent,
        docName: this.filename,
      },
      responseType: "arraybuffer",
    });

    const filedata = utils.downloadToTmp(response, this.filename);

    $.export("$summary", "Successfully converted file to PDF");
    return filedata;
  },
};
