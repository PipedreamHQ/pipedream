import pdf4me from "../../pdf4me.app.mjs";
import utils from "../../common/utils.mjs";
import fs from "fs";

export default {
  key: "pdf4me-merge-pdfs",
  name: "Merge PDF Files",
  description: "Merge multiple PDF files into a single PDF. [See the documentation](https://dev.pdf4me.com/apiv2/documentation/actions/merge/)",
  version: "0.0.1",
  type: "action",
  props: {
    pdf4me,
    filePaths: {
      type: "string[]",
      label: "File Paths",
      description: "An array of paths to a PDF files in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
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
    const filePaths = this.filePaths.map((path) => utils.normalizeFilePath(path));
    const fileContents = filePaths.map((path) => fs.readFileSync(path, {
      encoding: "base64",
    }));

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
