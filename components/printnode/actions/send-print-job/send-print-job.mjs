import printnode from "../../printnode.app.mjs";

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
    documentContent: {
      propDefinition: [
        printnode,
        "documentContent",
      ],
    },
    contentType: {
      propDefinition: [
        printnode,
        "contentType",
      ],
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
      description: "An object describing various options which can be set for this print job.",
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
      description: "If access to the location requires HTTP Basic or Digest Authentication, specify the username and password information here.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.printnode.createPrintJob({
      printerId: this.printerId,
      title: this.title,
      contentType: this.contentType,
      content: this.documentContent,
      source: this.source,
      options: this.options,
      expireAfter: this.expireAfter,
      qty: this.qty,
      authentication: this.authentication,
    });

    $.export("$summary", `Successfully sent print job to printer with ID ${this.printerId}`);
    return response;
  },
};
