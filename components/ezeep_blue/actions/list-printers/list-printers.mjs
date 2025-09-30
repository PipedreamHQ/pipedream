import ezeep from "../../ezeep_blue.app.mjs";

export default {
  key: "ezeep_blue-list-printers",
  name: "List Printers",
  description: "Retrieve a list of all available printers in the network. [See the documentation](https://apidocs.ezeep.com/ezeepblue/api/rest_api/printers/README.html#list-printers)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ezeep,
  },
  async run({ $ }) {
    const responseArray = this.ezeep.paginate({
      fn: this.ezeep.listPrinters,
    });

    const printers = [];
    for await (const printer of responseArray) {
      printers.push(printer);
    }
    $.export("$summary", `Retrieved ${printers.length} printers`);
    return printers;
  },
};
