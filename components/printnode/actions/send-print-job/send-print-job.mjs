import printnode from "../../printnode.app.mjs";
import fs from "fs";

export default {
  key: "printnode-send-print-job",
  name: "Send Print Job",
  description: "Sends a print job to a specified printer. [See the documentation](https://www.printnode.com/en/docs/api/curl#creating-print-jobs)",
  version: "0.0.1",
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
      label: "File Path",
      description: "The path to a document file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL to a document file.",
      optional: true,
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
  },
  async run({ $ }) {
    const {
      printnode, contentType, filePath, fileUrl, ...props
    } = this;
    const content = contentType.endsWith("base64")
      ? fs.readFileSync(filePath.includes("tmp/")
        ? filePath
        : `/tmp/${filePath}`, {
        encoding: "base64",
      })
      : fileUrl;
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
