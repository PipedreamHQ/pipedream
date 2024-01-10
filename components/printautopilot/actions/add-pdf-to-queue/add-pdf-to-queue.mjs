import printAutopilot from "../../printautopilot.app.mjs";
import fs from "fs";

export default {
  key: "printautopilot-add-pdf-to-queue",
  name: "Add PDF to Print Autopilot Queue",
  description: "Uploads a PDF document to the print-autopilot queue. [See the documentation](https://documenter.getpostman.com/view/1334461/TW6wJonb#53f82327-4f23-416d-b2f0-ce17b8037933)",
  version: "0.0.1",
  type: "action",
  props: {
    printAutopilot,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the [`/tmp` directory](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory) (e.g. `/tmp/myFile.pdf`).",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the new file",
    },
    token: {
      type: "string",
      label: "Print Queue Token",
      description: "An API Token associated with the intended print queue",
      secret: true,
    },
  },
  async run({ $ }) {
    const filePath = this.filePath.includes("/tmp")
      ? this.filePath
      : `/tmp/${this.filePath}`;
    const fileContent = Buffer.from(fs.readFileSync(filePath)).toString("base64");
    const response = await this.printAutopilot.addDocumentToQueue({
      token: this.token,
      data: {
        fileName: this.fileName,
        base64: fileContent,
      },
      $,
    });
    $.export("$summary", `Successfully uploaded PDF with path \`${this.filePath}\` to the queue.`);
    return response;
  },
};
