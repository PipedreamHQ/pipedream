import expedy from "../../expedy.app.mjs";

export default {
  key: "expedy-create-print-job",
  name: "Create Print Job",
  description: "Sends a print job to the designated thermal printer using its unique identifier (uid). [See the documentation](https://expedy.stoplight.io/docs/api-v2/01132c3490c8b-create-a-print-job)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    expedy,
    printerUid: {
      propDefinition: [
        expedy,
        "printerUid",
      ],
    },
    printerMsg: {
      type: "string",
      label: "Printer Message",
      description: "The content to be printed",
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "Your defined origin tag.. a uri, a name ..",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.expedy.createPrintJob({
      $,
      printerUid: this.printerUid,
      data: {
        printer_msg: this.printerMsg,
        origin: this.origin,
      },
    });
    $.export("$summary", `Successfully sent print job to printer with UID: ${this.printerUid}`);
    return response;
  },
};
