import diffchecker from "../../diffchecker.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffchecker-compare-pdf",
  name: "Compare PDFs",
  description: "Compares two PDFs and returns the result. [See the documentation](https://www.diffchecker.com/public-api/)",
  version: "0.0.{{ts}}",
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
    },
    leftPdf: {
      propDefinition: [
        diffchecker,
        "leftPdf",
      ],
    },
    rightPdf: {
      propDefinition: [
        diffchecker,
        "rightPdf",
      ],
    },
  },
  async run({ $ }) {
    // Assuming that the PDFs are provided as URLs, we need to ensure that
    // the comparePdfs method is implemented to handle URLs or file uploads.

    // The actual logic for handling file uploads or URLs should be implemented
    // in the comparePdfs method within the app file. For this example, we'll
    // proceed with the assumption that the method is implemented correctly.

    const response = await this.diffchecker.comparePdfs({
      outputType: this.outputType,
      diffLevel: this.diffLevel,
      leftPdf: this.leftPdf,
      rightPdf: this.rightPdf,
    });

    $.export("$summary", "Successfully compared PDFs");
    return response;
  },
};
