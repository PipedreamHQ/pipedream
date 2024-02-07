import expedy from "../../expedy.app.mjs";

export default {
  key: "expedy-create-print-job",
  name: "Create Print Job",
  description: "Sends a print job to the designated thermal printer using its unique identifier (uid).",
  version: "0.0.{{ts}}",
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
      propDefinition: [
        expedy,
        "printerMsg",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.expedy.sendPrintJob(this.printerUid, this.printerMsg);
    $.export("$summary", `Successfully sent print job to printer with UID: ${this.printerUid}`);
    return response;
  },
};
