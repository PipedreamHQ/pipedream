import pdf4me from "../../pdf4me.app.mjs";
import utils from "../../common/utils.mjs";
import fs from "fs";

export default {
  key: "pdf4me-compress-pdf",
  name: "Compress PDF",
  description: "Compress a PDF file to reduce its size. [See the documentation](https://dev.pdf4me.com/apiv2/documentation/actions/compress-pdf/)",
  version: "0.0.1",
  type: "action",
  props: {
    pdf4me,
    filePath: {
      propDefinition: [
        pdf4me,
        "filePath",
      ],
    },
    optimizeProfile: {
      type: "string",
      label: "Optimize Profile",
      description: "The type of compression",
      options: [
        "Max",
        "Web",
        "Print",
        "Default",
        "WebMax",
        "PrintMax",
        "PrintGray",
        "Compress",
        "CompressMax",
      ],
    },
    filename: {
      propDefinition: [
        pdf4me,
        "filename",
      ],
    },
  },
  async run({ $ }) {
    const filename = utils.checkForExtension(this.filename, "pdf");
    const filePath = utils.normalizeFilePath(this.filePath);
    const fileContent = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const response = await this.pdf4me.compressPdf({
      $,
      data: {
        docContent: fileContent,
        docName: filename,
        optimizeProfile: this.optimizeProfile,
      },
      responseType: "arraybuffer",
    });

    const filedata = utils.downloadToTmp(response, filename);

    $.export("$summary", "Successfully compressed PDF file");
    return filedata;
  },
};
