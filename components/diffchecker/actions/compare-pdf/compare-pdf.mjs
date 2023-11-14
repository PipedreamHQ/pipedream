import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import diffchecker from "../../diffchecker.app.mjs";

export default {
  key: "diffchecker-compare-pdf",
  name: "Compare PDFs",
  description: "Compares two PDFs and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "0.0.1",
  type: "action",
  props: {
    diffchecker,
    outputType: {
      propDefinition: [
        diffchecker,
        "outputType",
      ],
    },
    diffLevel: {
      propDefinition: [
        diffchecker,
        "diffLevel",
      ],
      optional: true,
    },
    leftPdf: {
      type: "string",
      label: "Left PDF",
      description: "Left PDF file you want to compare. Provide the file path `/tmp/file.pdf`. [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    rightPdf: {
      type: "string",
      label: "Right PDF",
      description: "Right PDF file you want to compare. Provide the file path `/tmp/file.pdf`. [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
  },
  async run({ $ }) {
    let data = new FormData();
    const leftFilepath = checkTmp(this.leftPdf);
    const rightFilepath = checkTmp(this.rightPdf);

    data.append("left_pdf", fs.createReadStream(leftFilepath));
    data.append("right_pdf", fs.createReadStream(rightFilepath));

    const response = await this.diffchecker.comparePdfs({
      data,
      outputType: this.outputType,
      diffLevel: this.diffLevel,
      headers: data.getHeaders(),
    });

    $.export("$summary", "Successfully compared PDFs");
    return response;
  },
};
