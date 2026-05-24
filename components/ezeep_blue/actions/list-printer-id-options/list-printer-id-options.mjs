import ezeep_blue from "../../ezeep_blue.app.mjs";

export default {
  key: "ezeep_blue-list-printer-id-options",
  name: "List Printer ID Options",
  description: "Retrieves available options for the Printer ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ezeep_blue,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ezeep_blue.propDefinitions.printerId.options.call(this.ezeep_blue, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
