import printAutopilot from "../../print-autopilot.app.mjs";

export default {
  key: "print-autopilot-add-pdf-to-queue",
  name: "Add PDF to Print Autopilot Queue",
  description: "Uploads a PDF document to the print-autopilot queue. [See the documentation](https://docs.printautopilot.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    printAutopilot,
    pdfFilePath: {
      propDefinition: [
        printAutopilot,
        "pdfFilePath",
      ],
    },
    priority: {
      propDefinition: [
        printAutopilot,
        "priority",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printAutopilot.uploadPdf({
      pdfFilePath: this.pdfFilePath,
      priority: this.priority,
    });
    $.export("$summary", `Successfully uploaded PDF with path ${this.pdfFilePath} to the queue`);
    return response;
  },
};
