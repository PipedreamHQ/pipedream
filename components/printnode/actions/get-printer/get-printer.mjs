import printnode from "../../printnode.app.mjs";

export default {
  key: "printnode-get-printer",
  name: "Get Printer",
  description: "Retrieves data about a specific printer. [See the documentation](https://www.printnode.com/en/docs/api/curl#printers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const printerData = await this.printnode.getPrinter({
      $,
      printerId: this.printerId,
    });
    $.export("$summary", `Retrieved data for printer (ID: ${this.printerId})`);
    return printerData;
  },
};
