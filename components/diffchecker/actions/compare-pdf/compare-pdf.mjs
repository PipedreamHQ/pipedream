import diffchecker from "../../diffchecker.app.mjs"

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
        "outputType"
      ]
    },
    diffLevel: {
      propDefinition: [
        diffchecker,
        "diffLevel"
      ]
    },
    leftPdf: {
      propDefinition: [
        diffchecker,
        "leftPdf"
      ]
    },
    rightPdf: {
      propDefinition: [
        diffchecker,
        "rightPdf"
      ]
    },
  },
  async run($) {
    const responses = [];
    for (let i = 0; i < this.leftPdf.length; i++) {
      const response = await this.diffchecker.comparePdfs({
        outputType: this.outputType,
        diffLevel: this.diffLevel,
        leftPdf: this.leftPdf[i],
        rightPdf: this.rightPdf[i],
      });
      responses.push(response);
    }
    $.export("$summary", "Successfully compared PDFs")
    return responses;
  },
};