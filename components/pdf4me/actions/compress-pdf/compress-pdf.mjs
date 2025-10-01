import pdf4me from "../../pdf4me.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pdf4me-compress-pdf",
  name: "Compress PDF",
  description: "Compress a PDF file to reduce its size. [See the documentation](https://dev.pdf4me.com/apiv2/documentation/actions/compress-pdf/)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    syncDir: {
      type: "dir",
      accessMode: "read-write",
      sync: true,
    },
  },
  async run({ $ }) {
    const filename = utils.checkForExtension(this.filename, "pdf");
    const fileContent = await utils.getBase64File(this.filePath);

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
