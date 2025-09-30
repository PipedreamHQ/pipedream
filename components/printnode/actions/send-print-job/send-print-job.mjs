import printnode from "../../printnode.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "printnode-send-print-job",
  name: "Send Print Job",
  description: "Sends a print job to a specified printer. [See the documentation](https://www.printnode.com/en/docs/api/curl#creating-print-jobs)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    printnode,
    printerId: {
      propDefinition: [
        printnode,
        "printerId",
      ],
    },
    contentType: {
      propDefinition: [
        printnode,
        "contentType",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    title: {
      type: "string",
      label: "Title",
      description: "A title to give the print job. This is the name which will appear in the operating system's print queue.",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "A text description of how the print job was created or where the print job originated.",
      optional: true,
    },
    options: {
      type: "object",
      label: "Options",
      description: "An object describing various options which can be set for this print job. [See the documentation for more information](https://www.printnode.com/en/docs/api/curl#printjob-options).",
      optional: true,
    },
    expireAfter: {
      type: "integer",
      label: "Expire After",
      description: "The maximum number of seconds PrintNode should retain this print job in the event that the print job cannot be printed immediately.",
      optional: true,
    },
    qty: {
      type: "integer",
      label: "Quantity",
      description: "A positive integer specifying the number of times this print job should be delivered to the print queue.",
      optional: true,
      default: 1,
    },
    authentication: {
      type: "object",
      label: "Authentication",
      description: "If access to the file URL requires HTTP Basic or Digest Authentication, specify the username and password information here. [See the documentation for more information](https://www.printnode.com/en/docs/api/curl#printjob-creating).",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      printnode, contentType, filePath, ...props
    } = this;

    const stream = await getFileStream(filePath);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks).toString("base64");

    const response = await printnode.createPrintJob({
      $,
      data: {
        contentType,
        content,
        ...props,
      },
    });

    $.export("$summary", `Successfully sent print job to printer with ID ${this.printerId}`);
    return response;
  },
};
