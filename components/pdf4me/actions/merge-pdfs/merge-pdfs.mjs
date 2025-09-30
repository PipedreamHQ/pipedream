import pdf4me from "../../pdf4me.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "pdf4me-merge-pdfs",
  name: "Merge PDF Files",
  description: "Merge multiple PDF files into a single PDF. [See the documentation](https://dev.pdf4me.com/apiv2/documentation/actions/merge/)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pdf4me,
    filePaths: {
      type: "string[]",
      label: "File Paths or URLs",
      description: "The files to process. For each entry, provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
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
    const promises = await Promise.allSettled(this.filePaths.map((p) => utils.getBase64File(p)));
    const fileContents = promises.map((prom) => prom.value);

    const response = await this.pdf4me.mergePdfs({
      $,
      data: {
        docContent: fileContents,
        docName: filename,
      },
      responseType: "arraybuffer",
    });

    const filedata = utils.downloadToTmp(response, filename);

    $.export("$summary", "Successfully merged PDF files");
    return filedata;
  },
};
