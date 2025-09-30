import printAutopilot from "../../printautopilot.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "printautopilot-add-pdf-to-queue",
  name: "Add PDF to Print Autopilot Queue",
  description: "Uploads a PDF document to the print-autopilot queue. [See the documentation](https://documenter.getpostman.com/view/1334461/TW6wJonb#53f82327-4f23-416d-b2f0-ce17b8037933)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    printAutopilot,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.pdf`)",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const stream = await getFileStream(this.filePath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const fileContent = Buffer.concat(chunks).toString("base64");

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
