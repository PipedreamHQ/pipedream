import appdrag from "../../appdrag.app.mjs";

export default {
  key: "appdrag-list-table-options",
  name: "List Table Name Options",
  description: "Retrieves available options for the Table Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    appdrag,
  },
  async run({ $ }) {
    const options = await appdrag.propDefinitions.table.options.call(this.appdrag);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
