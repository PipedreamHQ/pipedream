import pdf4me from "../../pdf4me.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pdf4me-convert-to-pdf",
  name: "Convert to PDF",
  description: "Convert a document (e.g., DOCX, XLSX, PPTX) to PDF. [See the documentation](https://dev.pdf4me.com/apiv2/documentation/actions/convert-to-pdf/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pdf4me,
    filePath: {
      propDefinition: [
        pdf4me,
        "filePath",
      ],
    },
    filename: {
      propDefinition: [
        pdf4me,
        "filename",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read-write",
      sync: true,
    },
  },
  async run({ $ }) {
    const filename = utils.checkForExtension(this.filename, "pdf");
    const fileContent = await utils.getBase64File(this.filePath);

    const response = await this.pdf4me.convertToPdf({
      $,
      data: {
        docContent: fileContent,
        docName: filename,
      },
      responseType: "arraybuffer",
    });

    const filedata = utils.downloadToTmp(response, this.filename);

    $.export("$summary", "Successfully converted file to PDF");
    return filedata;
  },
};
