import caspio from "../../caspio.app.mjs";

export default {
  key: "caspio-list-table-options",
  name: "List Table Options",
  description: "Retrieves available options for the Table field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    caspio,
  },
  async run({ $ }) {
    const options = await caspio.propDefinitions.table.options.call(this.caspio);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
